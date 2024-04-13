import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { LendingPoolService } from './lending-pool.service';

@Controller('nfts')
export class NftsController {
  constructor(private readonly lendingPoolService: LendingPoolService) {}

  // @Get()
  // findAll(@Query() conditions: Record<string, string>) {
  //   return this.lendingPoolService.findAll(conditions);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.offersService.findById(id);
  // }

  // @Get('creator/:address')
  // findByCreator(@Param('address') address: string) {
  //   return this.offersService.findByCreator(address);
  // }
}
