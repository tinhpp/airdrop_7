import { Module } from '@nestjs/common';
import { ConnectionsModule } from 'src/connections/connections.module';
import { ReposityModule } from './reposities/reposity.module';
import { OrdersModule } from '../orders/orders.module';
import { DacsModule } from '../dacs/dacs.module';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { LendingPoolModule } from '../lending-pool/lending-pool.module';
import { NftsModule } from '../nfts/nfts.module';

@Module({
  imports: [
    ConnectionsModule,
    ReposityModule,
    OrdersModule,
    DacsModule,
    LendingPoolModule,
    NftsModule
  ],
  controllers: [VotesController],
  providers: [VotesService],
})
export class VotesModule {}
