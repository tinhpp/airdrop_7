import { Module } from '@nestjs/common';
import { ConnectionsModule } from 'src/connections/connections.module';
import { Vote } from './vote.reposity';

@Module({
  imports: [ConnectionsModule],
  providers: [Vote],
  exports: [Vote],
})
export class ReposityModule {}
