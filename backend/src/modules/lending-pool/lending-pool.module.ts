import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LendingPoolService } from './lending-pool.service';
import { NftsController } from './lending-pool.controller';
import { ConnectionsModule } from 'src/connections/connections.module';

@Module({
  imports: [ScheduleModule.forRoot(), ConnectionsModule],
  exports: [LendingPoolService],
  controllers: [NftsController],
  providers: [LendingPoolService],
})
export class LendingPoolModule {}
