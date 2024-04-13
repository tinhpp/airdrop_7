import { Module } from '@nestjs/common';
import { ConnectionsModule } from 'src/connections/connections.module';
import { Crawl } from './crawl.reposity';
import { Nft } from './nft.reposity';

@Module({
  imports: [ConnectionsModule],
  providers: [Nft, Crawl],
  exports: [Nft, Crawl],
})
export class ReposityModule {}
