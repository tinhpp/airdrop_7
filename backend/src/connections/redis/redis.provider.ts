import { Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

export class RedisService {
  private readonly logger: Logger = new Logger(RedisService.name);
  public readonly redis: Redis;

  constructor(config: any) {
    this.redis = new Redis(config);
  }

  async keys(pattern: string) {
    try {
      return await this.redis.keys(pattern);
    } catch (e) {
      this.logger.error(`ERROR GET KEYS ${pattern}: ${e.message}`);
    }

    return null;
  }

  async set(key: string, value: any, expiry: number = 3600) {
    try {
      if (expiry > 0) {
        await this.redis.set(key, JSON.stringify(value), 'EX', expiry);
      } else {
        await this.redis.set(key, JSON.stringify(value));
      }
    } catch (e) {
      this.logger.error(`ERROR SET KEY ${key}: ${e.message}`);
    }
  }

  async get<T>(key: string) {
    try {
      const value = await this.redis.get(key);
      return JSON.parse(value) as T;
    } catch (e) {
      this.logger.error(`ERROR GET KEY ${key}: ${e.message}`);
    }
    return null;
  }

  async del(key: string) {
    try {
      await this.redis.del(key);
    } catch (e) {
      this.logger.error(`ERROR DEL KEY ${key}: ${e.message}`);
    }
  }

  async publish(chanel: string, data: any) {
    await this.redis.publish(chanel, JSON.stringify(data));
  }

  async hset(hash: string, key: string, value: any) {
    try {
      await this.redis.hset(hash, key, value);
    } catch (e) {
      this.logger.error(`ERROR SET KEY ${key}: ${e.message}`);
    }
  }

  async hget(hash: string, key: string) {
    try {
      return await new Promise((resolve, reject) => {
        return this.redis.hget(hash, key, function (err, res) {
          resolve(res);
        });
      });
    } catch (e) {
      this.logger.error(`ERROR GET HASH KEY ${hash}:${key} : ${e.message}`);
    }
  }

  async hgetall(hashKey: string) {
    try {
      return await new Promise((resolve, reject) => {
        return this.redis.hgetall(hashKey, function (err, res) {
          resolve(res);
        });
      });
    } catch (e) {
      this.logger.error(`ERROR GET HASH All KEY ${hashKey}: ${e.message}`);
    }
  }

  async hdel(hash: string, key: string) {
    try {
      await this.redis.hdel(hash, key);
    } catch (e) {
      this.logger.error(`ERROR HDEL KEY ${hash}:${key}: ${e.message}`);
    }
  }

  async sadd(hash: string, value: any) {
    try {
      await this.redis.sadd(hash, value);
    } catch (e) {
      this.logger.error(`ERROR ADD HASH KEY ${hash}: ${e.message}`);
    }
  }

  async smembers(hash: string): Promise<any[]> {
    try {
      return await this.redis.smembers(hash);
    } catch (e) {
      this.logger.error(`ERROR GET MEMBERS HASH KEY ${hash}: ${e.message}`);
    }
  }
}
