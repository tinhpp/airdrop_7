import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrderRedisService } from './redis/order.redis.provider';
import { RequestRedisService } from './redis/request.redis.provider';
import { VoteRedisService } from './redis/vote.redis.provider';
import { ItemRedisService } from './redis/item.redis.provider';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [
    VoteRedisService,
    OrderRedisService,
    RequestRedisService,
    ItemRedisService,
  ],
  exports: [
    VoteRedisService,
    OrderRedisService,
    RequestRedisService,
    ItemRedisService,
    EventEmitterModule,
  ],
})
export class ConnectionsModule {}
