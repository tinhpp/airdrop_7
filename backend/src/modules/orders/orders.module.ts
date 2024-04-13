import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ConnectionsModule } from 'src/connections/connections.module';
import { ReposityModule } from './reposities/reposity.module';
import { NftsModule } from '../nfts/nfts.module';
import { TokenBoundAccountsModule } from '../token-bound-accounts/token-bound-accounts.module';
import { DacsModule } from '../dacs/dacs.module';
import { LendingPoolModule } from '../lending-pool/lending-pool.module';

@Module({
  imports: [
    ConnectionsModule,
    ReposityModule,
    NftsModule,
    DacsModule,
    LendingPoolModule,
    TokenBoundAccountsModule,
  ],
  exports: [OrdersService, ReposityModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
