import { Module } from '@nestjs/common';
import { ConnectionsModule } from 'src/connections/connections.module';
import { Offer } from './offer.reposity';

@Module({
  imports: [ConnectionsModule],
  providers: [Offer],
  exports: [Offer],
})
export class ReposityModule {}
