import { Module } from '@nestjs/common';
import { ConnectionsModule } from 'src/connections/connections.module';
import { PermittedNFT } from './permitted-nft.reposity';

@Module({
  imports: [ConnectionsModule],
  providers: [PermittedNFT],
  exports: [PermittedNFT],
})
export class ReposityModule {}
