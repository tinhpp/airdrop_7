import { Module } from '@nestjs/common';
import { PermittedNFTsService } from './permitted-nfts.service';
import { PermittedNFTsController } from './permitted-nfts.controller';
import { ConnectionsModule } from 'src/connections/connections.module';
import { ReposityModule } from './reposities/reposity.module';

@Module({
  imports: [ConnectionsModule, ReposityModule],
  exports: [ReposityModule, PermittedNFTsService],
  controllers: [PermittedNFTsController],
  providers: [PermittedNFTsService],
})
export class PermittedNFTsModule {}
