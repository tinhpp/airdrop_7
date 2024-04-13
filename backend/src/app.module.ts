import { RequestsModule } from './modules/requests/requests.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConnectionsModule } from './connections/connections.module';
import { OrdersModule } from './modules/orders/orders.module';
import { OffersModule } from './modules/offers/offers.module';
import { NftsModule } from './modules/nfts/nfts.module';
import { VotesModule } from './modules/votes/votes.module';
import { DacsModule } from './modules/dacs/dacs.module';
import { LendingPoolModule } from './modules/lending-pool/lending-pool.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { TokenBoundAccountsModule } from './modules/token-bound-accounts/token-bound-accounts.module';
import { PermittedNFTsModule } from './modules/permitted-nfts/permitted-nfts.module';
import { ItemModule } from './modules/item/item.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ConnectionsModule,
    OrdersModule,
    OffersModule,
    NftsModule,
    VotesModule,
    DacsModule,
    LendingPoolModule,
    SchedulesModule,
    TokenBoundAccountsModule,
    PermittedNFTsModule,
    RequestsModule,
    ItemModule,
  ],
  providers: [ConnectionsModule],
})
export class AppModule {}
