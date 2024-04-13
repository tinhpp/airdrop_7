import { LendingPoolModule } from './../lending-pool/lending-pool.module';
import { NftsModule } from './../nfts/nfts.module';
import { Module } from '@nestjs/common';
import { ConnectionsModule } from 'src/connections/connections.module';
import { ReposityModule } from './reposities/reposity.module';
import { OffersModule } from '../offers/offers.module';
import { TokenBoundAccountsModule } from '../token-bound-accounts/token-bound-accounts.module';
import { CrawlsSchedule } from './crawls.schedule';

@Module({
  imports: [
    ConnectionsModule,
    ReposityModule,
    OffersModule,
    NftsModule,
    LendingPoolModule,
    TokenBoundAccountsModule,
  ],
  controllers: [],
  providers: [CrawlsSchedule],
})
export class SchedulesModule {}
