import { Injectable, Logger } from '@nestjs/common';
import { VoteRedisService } from 'src/connections/redis/vote.redis.provider';
import { SyncNftDto } from 'src/modules/nfts/dto/sync-nft.dto';
import { ItemStatus } from '../dto/item.enum';

const DATABASE_NAME = 'Item';

@Injectable()
export class Item {
  public logger: Logger = new Logger(Item.name);

  constructor(private readonly redisService: VoteRedisService) {}

  async getAll(): Promise<any[]> {
    const items = await this.redisService.hgetall(DATABASE_NAME);
    if (!items) return [];

    const jsonItems = Object.values(items);
    return jsonItems.map((item) => JSON.parse(item));
  }

  async getByKey(key: string): Promise<any> {
    const item = await this.redisService.hget(DATABASE_NAME, key);
    if (!item) return;

    return JSON.parse(item.toString());
  }

  async find(filters: any): Promise<any> {
    const { page = 1, size = 10, ...restFilter } = filters;

    const items = await this.redisService.hgetall(DATABASE_NAME);

    if (!restFilter || !Object.keys(restFilter)) return Object.values(items);

    const itemsFiltered = Object.values(items)
      .map((item) => JSON.parse(item))
      .filter((item) => {
        for (const key in restFilter) {
          if (
            item[key] === undefined ||
            !restFilter[key].split(',').includes(item[key].toString())
          )
            return false;
        }
        return true;
      });
    const pagination = itemsFiltered
      .sort((x, y) => y.createdAt - x.createdAt)
      .slice((page - 1) * size, page * size);
    return { itemsFiltered: pagination, total: itemsFiltered.length };
  }

  async updateStatus(key: string, status: ItemStatus): Promise<any> {
    const queryData = await this.redisService.hget(DATABASE_NAME, key);
    if (!queryData) return;

    await this.redisService.hset(
      DATABASE_NAME,
      key,
      JSON.stringify({
        ...JSON.parse(queryData.toString()),
        status,
      }),
    );

    return true;
  }

  async create(itemHash: string, item: any): Promise<boolean> {
    try {
      await this.redisService.hset(
        DATABASE_NAME,
        itemHash,
        JSON.stringify(item),
      );
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async sync(data: SyncNftDto): Promise<boolean> {
    try {
      await this.redisService.hset(
        `${DATABASE_NAME}:${data.collectionAddress}`,
        data.tokenId.toString(),
        JSON.stringify(data),
      );
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
