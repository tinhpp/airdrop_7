import { Controller, Get, Param } from '@nestjs/common';
import { DacsService } from './dacs.service';

@Controller('dacs')
export class DacsController {
  constructor(private readonly dacsService: DacsService) {}

  @Get(':cid')
  findOne(@Param('cid') cid: string) {
    return this.dacsService.findByCid(cid);
  }
}
