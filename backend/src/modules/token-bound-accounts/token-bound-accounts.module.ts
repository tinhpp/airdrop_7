import { Module } from '@nestjs/common';
import { TokenBoundAccountsService } from './token-bound-accounts.service';
import { TokenBoundAccountsController } from './token-bound-accounts.controller';
import { ConnectionsModule } from 'src/connections/connections.module';
import { PermittedNFTsModule } from '../permitted-nfts/permitted-nfts.module';
import { ReposityModule } from './reposities/reposity.module';

@Module({
  imports: [ConnectionsModule, ReposityModule, PermittedNFTsModule],
  exports: [ReposityModule, TokenBoundAccountsService],
  controllers: [TokenBoundAccountsController],
  providers: [TokenBoundAccountsService],
})
export class TokenBoundAccountsModule {}
