import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { ConnectionsModule } from 'src/connections/connections.module';
import { ReposityModule } from './reposities/reposity.module';
import { DacsModule } from '../dacs/dacs.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConnectionsModule,
    ReposityModule,
    DacsModule,
  ],
  exports: [ReposityModule, ItemService],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
