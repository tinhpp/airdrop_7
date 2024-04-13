import config from '../../config';
import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.provider';

@Injectable()
export class VoteRedisService extends RedisService {
  constructor() {
    super({
      host: config.ENV.REDIS_VOTE_HOST,
      port: config.ENV.REDIS_VOTE_PORT,
      password: config.ENV.REDIS_VOTE_PASS,
      family: config.ENV.REDIS_VOTE_FAMILY,
      db: config.ENV.REDIS_VOTE_DB
    })
  }
}
