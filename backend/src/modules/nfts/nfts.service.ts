import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Contract, JsonRpcProvider, ZeroAddress } from 'ethers';
import axios from 'axios';
import { Nft } from './reposities/nft.reposity';
import config from 'src/config';
import { SyncNftDto } from './dto/sync-nft.dto';
import { ERC721, ERC721__factory } from './typechain';
import { ImportCollectionDto } from './dto/import-collection.dto';
import { PermittedNFTsService } from '../permitted-nfts/permitted-nfts.service';

@Injectable()
export class NftsService {
  private rpcProvider: JsonRpcProvider;

  constructor(
    private readonly nft: Nft,
    private readonly permittedNFTService: PermittedNFTsService,
  ) {
    this.rpcProvider = new JsonRpcProvider(config.ENV.NETWORK_RPC_URL);

    this.attachCollectionListeners();
  }

  private async attachCollectionListeners() {
    const collections = await this.nft.getAllCollections();
    if (!collections) return;

    await Promise.all(
      collections.map(async (collectionAddress) =>
        this.registerCollectionTransferEvent(collectionAddress),
      ),
    );

    console.log('All collections have been attached to listeners');
  }

  private async registerCollectionTransferEvent(collectionAddress: string) {
    const nftContract = ERC721__factory.connect(
      collectionAddress,
      this.rpcProvider,
    );

    await nftContract.on(
      nftContract.getEvent('Transfer'),
      async (from, to, currentTokenId) => {
        // When burn, remove from database
        if (to === ZeroAddress)
          return this.nft.delete(collectionAddress, currentTokenId.toString());

        await this.saveNft(to, Number(currentTokenId), collectionAddress);
      },
    );

    console.log(`Listening to ${collectionAddress} Transfer events`);
  }

  async getNfts(address: string) {
    try {
      return {};
    } catch (error) {
      throw new HttpException(error.response.data, error.response.status);
    }
  }

  async handleEvents(rpcProvider: JsonRpcProvider, from: number, to: number) {
    try {
      const nftContract = ERC721__factory.connect(
        config.ENV.COLLECTION_ADDRESS,
        rpcProvider,
      );
      // Fetch events data
      const events = await nftContract.queryFilter(
        nftContract.getEvent('Transfer'),
        from,
        to,
      );

      // Retrieve all event informations
      if (!events || events.length === 0) return;
      for (let i = 0; i < events.length; i++) {
        const event: any = events[i];
        if (!event) continue;
        if (Object.keys(event).length === 0) continue;

        const tokenId = Number(BigInt(event.args.tokenId).toString());

        const { data } = await axios.get(await nftContract.tokenURI(tokenId));

        const nftData = {
          owner: event.args.to.toLowerCase(),
          tokenId: tokenId,
          tokenURI: await nftContract.tokenURI(tokenId),
          collectionName: await nftContract.name(),
          collectionSymbol: await nftContract.symbol(),
          collectionAddress: event.address.toLowerCase(),
          metadata: data,
          isAvailable: true,
        };

        await this.syncNft(nftData);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data) {
        throw new HttpException(error.response.data, error.response.status);
      } else {
        throw new HttpException(error.body, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async syncNft(nftInfo: SyncNftDto) {
    try {
      await this.nft.sync(nftInfo);
    } catch (error) {
      throw new HttpException(error.response.data, error.response.status);
    }
  }

  async saveNft(owner: string, tokenId: number, collectionAddress: string) {
    const nftContract = ERC721__factory.connect(
      collectionAddress,
      this.rpcProvider,
    );

    const { data } = await axios.get(await nftContract.tokenURI(tokenId));

    const nftData = {
      owner: owner.toLowerCase(),
      tokenId: tokenId,
      tokenURI: await nftContract.tokenURI(tokenId),
      collectionName: await nftContract.name(),
      collectionSymbol: await nftContract.symbol(),
      collectionAddress: await nftContract.getAddress(),
      metadata: data,
      isAvailable: true,
    };

    await this.syncNft(nftData);
  }

  async findAll(conditions: Record<string, any> = {}) {
    return await this.nft.find(conditions);
  }

  async importCollection({
    collectionAddress,
    from = '',
  }: ImportCollectionDto) {
    const existedCollection = await this.nft.findCollection(collectionAddress);
    if (existedCollection)
      throw new HttpException(
        'Collection already imported',
        HttpStatus.BAD_REQUEST,
      );

    const isPermittedNFT = await this.permittedNFTService.findById(
      collectionAddress,
    );

    if (!isPermittedNFT) {
      this.permittedNFTService.create({
        collection: collectionAddress,
        from: from,
        usage: 'ERC-721',
      });
    }

    await this.registerCollectionTransferEvent(collectionAddress);

    this.nft.addCollection(collectionAddress);

    return { message: `Imported collection successfully` };
  }
}
