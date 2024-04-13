import { Injectable, Logger } from '@nestjs/common';
import { VoteRedisService } from 'src/connections/redis/vote.redis.provider';

const DATABASE_NAME = 'Votes';

@Injectable()
export class Vote {
  public logger: Logger = new Logger(Vote.name);

  constructor(private readonly redisService: VoteRedisService) {}

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

    return orders.filter((item) => {
      for (const key in filters) {
        if (item[key] === undefined || !filters[key].includes(item[key]))
          return false;
      }
      return true;
    });
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
      await this.redisService.hset(DATABASE_NAME, id, JSON.stringify(data));
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
