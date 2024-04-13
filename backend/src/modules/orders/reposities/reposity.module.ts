import { Module } from '@nestjs/common';
import { ConnectionsModule } from 'src/connections/connections.module';
import { Order } from './order.reposity';

@Module({
  imports: [
    ConnectionsModule
  ],
  providers: [
    Order,
  ],
  exports: [
    Order,
  ]
})
export class ReposityModule { }
