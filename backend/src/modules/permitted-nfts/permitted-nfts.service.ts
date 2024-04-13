import { Injectable, ConflictException } from '@nestjs/common';
import config from 'src/config';
import { Contract, JsonRpcProvider, ethers } from 'ethers';
import { CreatePermittedNFTDto } from './dto/create-permitted-nft.dto';
import { UpdatePermittedNFTDto } from './dto/update-permitted-nft.dto';
import { PermittedNFT } from './reposities/permitted-nft.reposity';
import * as PermittedNFTs_ABI from './abi/PermittedNFTs.json';

@Injectable()
export class PermittedNFTsService {
  constructor(private readonly permittedNFT: PermittedNFT) {}

  async create(createPermittedNFTDto: CreatePermittedNFTDto) {
    const isExisted = await this.findById(createPermittedNFTDto.collection);
    if (isExisted) {
      throw new ConflictException('Already existed in list of permitted');
    }

    const rpcProvider = new JsonRpcProvider(config.ENV.NETWORK_RPC_URL);
    const permittedNFTsContract = new Contract(
      config.ENV.PERMITTED_NFTS_ADDRESS,
      PermittedNFTs_ABI,
      rpcProvider,
    );

    const isApproved = await permittedNFTsContract.getNFTPermit(
      createPermittedNFTDto.collection,
    );

    this.permittedNFT.create(createPermittedNFTDto.collection, {
      ...createPermittedNFTDto,
      isApproved,
    });
  }

  async findAll(conditions: Record<string, any> = {}) {
    return await this.permittedNFT.find(conditions);
  }

  async findById(id: string) {
    return await this.permittedNFT.getByKey(id);
  }

  update(id: string, updatePermittedNFTDto: UpdatePermittedNFTDto) {
    return this.permittedNFT.update(id, updatePermittedNFTDto);
  }

  updateMany(ids: string[], updatePermittedNFTDto: UpdatePermittedNFTDto) {
    return this.permittedNFT.updateMany(ids, updatePermittedNFTDto);
  }

  remove(id: number) {
    return `This action removes a #${id} permittedNFT`;
  }
}
