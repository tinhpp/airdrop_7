import config from '../../config';
import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.provider';

@Injectable()
export class OrderRedisService extends RedisService {
  constructor() {
    super({
      host: config.ENV.REDIS_ORDER_HOST,
      port: config.ENV.REDIS_ORDER_PORT,
      password: config.ENV.REDIS_ORDER_PASS,
      family: config.ENV.REDIS_ORDER_FAMILY,
      db: config.ENV.REDIS_ORDER_DB
    })
  }
}
