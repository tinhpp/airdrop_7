import { Injectable, Logger } from '@nestjs/common';
import { VoteRedisService } from 'src/connections/redis/vote.redis.provider';
import { SyncNftDto } from '../dto/sync-nft.dto';
const sha256 = require('simple-sha256');

const DATABASE_NAME = 'Nfts';
const COLLECTION_SET_NAME = 'Collections';

@Injectable()
export class Nft {
  public logger: Logger = new Logger(Nft.name);

  constructor(private readonly redisService: VoteRedisService) {}

  async getAll(): Promise<any[]> {
    const queryData = await this.redisService.hgetall(DATABASE_NAME);
    if (!queryData) return [];

    const dataInJSON = Object.values(queryData);
    return dataInJSON.map((item) => JSON.parse(item));
  }

  async getAllCollections(): Promise<any[]> {
    return await this.redisService.smembers(COLLECTION_SET_NAME);
  }

  async getByKey(key: string): Promise<any> {
    const queryData = await this.redisService.hget(DATABASE_NAME, key);
    if (!queryData) return;

    return JSON.parse(queryData.toString());
  }

  async find(filters: any): Promise<any[]> {
    const { page = 1, size = 10, ...restFilter } = filters;

    const result = [];

    const collectionAddresses = restFilter.collectionAddress.split(',');
    for (let i = 0; i < collectionAddresses.length; i++) {
      const nfts = await this.redisService.hgetall(
        `${DATABASE_NAME}:${collectionAddresses[i]}`,
      );

      if (!restFilter || Object.keys(restFilter).length === 0)
        return Object.values(nfts);

      const collectionNfts = Object.values(nfts)
        .map((item) => JSON.parse(item))
        .filter((item) => {
          for (let key in restFilter) {
            if (
              item[key] === undefined ||
              !restFilter[key]
                .split(',')
                .map((k: string) => k.toLowerCase())
                .includes(item[key].toString())
            )
              return false;
          }
          return true;
        })
        .slice((page - 1) * size, page * size);

      if (collectionNfts.length > 0) result.push(...collectionNfts);
    }

    return result;
  }

  async findCollection(collectionAddress: string) {
    const collections = await this.redisService.smembers(COLLECTION_SET_NAME);
    return collections.find((item) => item === collectionAddress);
  }

  async update(
    collectionAddress: string,
    id: string,
    data: Record<string, any>,
  ): Promise<any> {
    const queryData = await this.redisService.hget(
      `${DATABASE_NAME}:${collectionAddress}`,
      id,
    );
    if (!queryData) return;

    await this.redisService.hset(
      `${DATABASE_NAME}:${collectionAddress}`,
      id,
      JSON.stringify({ ...JSON.parse(queryData.toString()), ...data }),
    );
    return true;
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

  async addCollection(collectionAddress: string): Promise<boolean> {
    try {
      await this.redisService.sadd(COLLECTION_SET_NAME, collectionAddress);
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async delete(collectionAddress: string, id: string): Promise<boolean> {
    try {
      await this.redisService.hdel(
        `${DATABASE_NAME}:${collectionAddress}`,
        id.toString(),
      );
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
