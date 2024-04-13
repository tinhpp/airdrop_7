import { Module } from '@nestjs/common';
import { ConnectionsModule } from 'src/connections/connections.module';
import { Request } from './request.reposity';

@Module({
  imports: [ConnectionsModule],
  providers: [Request],
  exports: [Request],
})
export class ReposityModule {}
