import { Module } from '@nestjs/common';
import { ConnectionsModule } from 'src/connections/connections.module';
import { Crawl } from './crawl.reposity';
import { Item } from './item.reposity';

@Module({
  imports: [ConnectionsModule],
  providers: [Item, Crawl],
  exports: [Item, Crawl],
})
export class ReposityModule {}
