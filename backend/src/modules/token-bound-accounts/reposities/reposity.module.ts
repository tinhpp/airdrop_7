import { Module } from '@nestjs/common';
import { ConnectionsModule } from 'src/connections/connections.module';
import { TokenBoundAccount } from './token-bound-account.reposity';

@Module({
  imports: [ConnectionsModule],
  providers: [TokenBoundAccount],
  exports: [TokenBoundAccount],
})
export class ReposityModule {}
