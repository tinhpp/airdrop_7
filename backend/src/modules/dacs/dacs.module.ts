import { Module } from '@nestjs/common';
import { DacsController } from './dacs.controller';
import { DacsService } from './dacs.service';

@Module({
  imports: [],
  exports: [DacsService],
  controllers: [DacsController],
  providers: [DacsService],
})
export class DacsModule {}
