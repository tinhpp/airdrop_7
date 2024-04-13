import { forwardRef, Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { ConnectionsModule } from 'src/connections/connections.module';
import { ReposityModule } from './reposities/reposity.module';
import { DacsModule } from '../dacs/dacs.module';
import { OrdersModule } from '../orders/orders.module';
import { OffersModule } from '../offers/offers.module';

@Module({
  imports: [
    ConnectionsModule,
    ReposityModule,
    DacsModule,
    forwardRef(() => OffersModule),
    OrdersModule,
  ],
  exports: [RequestsService, ReposityModule],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
