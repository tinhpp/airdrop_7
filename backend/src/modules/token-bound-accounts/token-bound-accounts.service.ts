import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Contract, JsonRpcProvider, ethers } from 'ethers';
import config from 'src/config';
import { CreateTokenBoundAccountDto } from './dto/create-token-bound-account.dto';
import { UpdateTokenBoundAccountDto } from './dto/update-token-bound-account.dto';
import { TokenBoundAccount } from './reposities/token-bound-account.reposity';
import { PermittedNFTsService } from '../permitted-nfts/permitted-nfts.service';
import * as ERC721_ABI from './abi/ERC721.json';

@Injectable()
export class TokenBoundAccountsService {
  private rpcProvider: JsonRpcProvider;

  constructor(
    private readonly tokenBoundAccount: TokenBoundAccount,
    private readonly permittedNFTService: PermittedNFTsService,
  ) {
    this.rpcProvider = new JsonRpcProvider(config.ENV.NETWORK_RPC_URL);
  }

  async create(createTokenBoundAccountDto: CreateTokenBoundAccountDto) {
    const {
      registryAddress,
      implementationAddress,
      tokenAddress,
      tokenId,
      salt,
    } = createTokenBoundAccountDto;

    const isExisted = await this.tokenBoundAccount.find({
      registryAddress,
      implementationAddress,
      tokenAddress,
      tokenId,
      salt,
    });

    if (isExisted.length > 0) {
      throw new ConflictException('Already imported');
    }

    const nftContract = new Contract(
      createTokenBoundAccountDto.tokenAddress,
      ERC721_ABI,
      this.rpcProvider,
    );

    const ownerOfTokenId = await nftContract.ownerOf(
      createTokenBoundAccountDto.tokenId,
    );

    if (
      ownerOfTokenId.toLowerCase() !==
      createTokenBoundAccountDto.owner.toLowerCase()
    ) {
      throw new UnauthorizedException('Caller is not owner of token Id');
    }

    const encodedTokenBoundAccount = ethers.solidityPacked(
      ['address', 'address', 'address', 'uint256', 'uint256'],
      [
        createTokenBoundAccountDto.registryAddress,
        createTokenBoundAccountDto.implementationAddress,
        createTokenBoundAccountDto.tokenAddress,
        createTokenBoundAccountDto.tokenId,
        createTokenBoundAccountDto.salt,
      ],
    );

    const tokenBoundAccountHash = ethers.keccak256(encodedTokenBoundAccount);
    this.tokenBoundAccount.create(tokenBoundAccountHash, {
      hash: tokenBoundAccountHash,
      ...createTokenBoundAccountDto,
      isAvailable: true,
    });

    const isPermittedNFT = await this.permittedNFTService.findById(
      createTokenBoundAccountDto.tokenAddress,
    );
    if (!isPermittedNFT) {
      this.permittedNFTService.create({
        collection: createTokenBoundAccountDto.tokenAddress,
        from: createTokenBoundAccountDto.owner,
        usage: 'ERC-6551',
      });
    }
  }

  async findAll(conditions: Record<string, any> = {}) {
    return await this.tokenBoundAccount.find(conditions);
  }

  async findById(id: string) {
    return await this.tokenBoundAccount.getByKey(id);
  }

  async findByOwner(owner: string) {
    return await this.tokenBoundAccount.find({ owner });
  }

  update(id: string, updateTokenBoundAccountDto: UpdateTokenBoundAccountDto) {
    return this.tokenBoundAccount.update(id, updateTokenBoundAccountDto);
  }

  remove(id: number) {
    return `This action updates a #${id} order`;
  }

  async handleEvents() {
    try {
      const erc6551List = await this.tokenBoundAccount.find({});
      for (let i = 0; i < erc6551List.length; i++) {
        const nftContract = new Contract(
          erc6551List[i].tokenAddress,
          ERC721_ABI,
          this.rpcProvider,
        );

        const owner = await nftContract.ownerOf(erc6551List[i].tokenId);
        if (owner.toLowerCase() !== erc6551List[i].owner.toLowerCase()) {
          this.tokenBoundAccount.update(erc6551List[i].hash, {
            owner: owner.toLowerCase(),
            isAvailable: true,
          });
        }
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
}
