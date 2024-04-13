import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NftsService } from './nfts.service';
import { NftsController } from './nfts.controller';
import { ConnectionsModule } from 'src/connections/connections.module';
import { ReposityModule } from './reposities/reposity.module';
import { PermittedNFTsModule } from '../permitted-nfts/permitted-nfts.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConnectionsModule,
    ReposityModule,
    PermittedNFTsModule,
  ],
  exports: [ReposityModule, NftsService],
  controllers: [NftsController],
  providers: [NftsService],
})
export class NftsModule {}
