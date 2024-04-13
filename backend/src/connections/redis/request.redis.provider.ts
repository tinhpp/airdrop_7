import config from '../../config';
import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.provider';

@Injectable()
export class RequestRedisService extends RedisService {
  constructor() {
    super({
      host: config.ENV.REDIS_REQUEST_HOST,
      port: config.ENV.REDIS_REQUEST_PORT,
      password: config.ENV.REDIS_REQUEST_PASS,
      family: config.ENV.REDIS_REQUEST_FAMILY,
      db: config.ENV.REDIS_REQUEST_DB,
    });
  }
}
