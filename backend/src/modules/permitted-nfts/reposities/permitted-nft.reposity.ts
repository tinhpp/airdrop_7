import { Injectable, Logger } from '@nestjs/common';
import { OrderRedisService } from 'src/connections/redis/order.redis.provider';

const DATABASE_NAME = 'PermittedNFTs';

@Injectable()
export class PermittedNFT {
  public logger: Logger = new Logger(PermittedNFT.name);

  constructor(private readonly redisService: OrderRedisService) {}

  async getAll(): Promise<any[]> {
    const queryData = await this.redisService.hgetall(DATABASE_NAME);
    if (!queryData) return [];

    const dataInJSON = Object.values(queryData);
    return dataInJSON.map((item) => JSON.parse(item));
  }

  async getByKey(key: string): Promise<any> {
    const queryData = await this.redisService.hget(DATABASE_NAME, key);
    if (!queryData) return;

    return JSON.parse(queryData.toString());
  }

  async find(filters: any): Promise<any[]> {
    const orders = await this.getAll();
    if (!filters || Object.keys(filters).length === 0) return orders;

    return orders
      .filter((item) => {
        for (let key in filters) {
          if (item[key] === undefined || !filters[key].includes(item[key]))
            return false;
        }
        return true;
      })
      .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 0));
  }

  async create(hash: string, data: any): Promise<boolean> {
    try {
      await this.redisService.hset(DATABASE_NAME, hash, JSON.stringify(data));
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async update(id: string, data: any): Promise<boolean> {
    try {
      const queryData = await this.redisService.hget(DATABASE_NAME, id);
      if (!queryData) return;

      await this.redisService.hset(
        DATABASE_NAME,
        id,
        JSON.stringify({ ...JSON.parse(queryData.toString()), ...data }),
      );
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async updateMany(ids: string[], data: any): Promise<boolean> {
    try {
      for (let i = 0; i < ids.length; i++) {
        const queryData = await this.redisService.hget(DATABASE_NAME, ids[i]);
        if (!queryData) return;

        if (data.isApproved !== undefined && !data.isApproved) {
          await this.redisService.hdel(DATABASE_NAME, ids[i]);
        } else {
          await this.redisService.hset(
            DATABASE_NAME,
            ids[i],
            JSON.stringify({ ...JSON.parse(queryData.toString()), ...data }),
          );
        }
      }
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
