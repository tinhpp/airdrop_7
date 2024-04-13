import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Contract, JsonRpcProvider, ethers } from 'ethers';
import axios from 'axios';
import config from 'src/config';
import * as MARKETPLACE_ABI from './abi/MARKETPLACE.json';
import { CreateItemDto } from './dto/create-item-dto';
import { generateItemMessage } from '../utils/signature';
import { ItemStatus } from './dto/item.enum';
import { Item } from './reposities/item.reposity';
import { DacsService } from '../dacs/dacs.service';
@Injectable()
export class ItemService implements OnModuleInit {
  private rpcProvider: JsonRpcProvider;
  private marketplaceContract: Contract;

  constructor(
    private readonly item: Item,
    private readonly dacs: DacsService,
  ) {}

  onModuleInit() {
    this.rpcProvider = new JsonRpcProvider(config.ENV.NETWORK_RPC_URL);
    this.marketplaceContract = new Contract(
      config.ENV.MARKETPLACE_ADDRESS,
      MARKETPLACE_ABI,
      this.rpcProvider,
    );
  }

  async create(createItemDto: CreateItemDto) {
    const createdAt = Date.now();

    const itemHash = generateItemMessage(
      createItemDto,
      config.ENV.MARKETPLACE_ADDRESS,
      config.ENV.CHAIN_ID,
      createdAt,
    );

    const newItem: Record<string, any> = {
      ...createItemDto,
      hash: itemHash,
      status: ItemStatus.OPENING,
      createdAt: createdAt,
    };

    const dacs_cid = await this.dacs.upload(newItem);
    newItem.dacs_url = `${config.ENV.SERVER_HOST}:${config.ENV.SERVER_PORT}/dacs/${dacs_cid}`;

    await this.item.create(itemHash, newItem);
  }

  async find(conditions: Record<string, any> = {}) {
    return await this.item.find(conditions);
  }

  async findById(id: string) {
    return await this.item.getByKey(id);
  }

  async findByCreator(address: string) {
    return await this.item.find({ creator: address });
  }

  async purchase(id: string) {
    return await this.item.updateStatus(id, ItemStatus.SOLD);
  }

  async close(id: string) {
    return await this.item.updateStatus(id, ItemStatus.CLOSED);
  }
}
