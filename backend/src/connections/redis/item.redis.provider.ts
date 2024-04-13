import config from '../../config';
import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.provider';

@Injectable()
export class ItemRedisService extends RedisService {
  constructor() {
    super({
      host: config.ENV.REDIS_ITEM_HOST,
      port: config.ENV.REDIS_ITEM_PORT,
      password: config.ENV.REDIS_ITEM_PASS,
      family: config.ENV.REDIS_ITEM_FAMILY,
      db: config.ENV.REDIS_ITEM_DB
    });
  }
}
