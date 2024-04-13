import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { NftsService } from './nfts.service';
import { ImportCollectionDto } from './dto/import-collection.dto';

@Controller('nfts')
export class NftsController {
  constructor(private readonly nftsService: NftsService) {}

  @Get()
  findAll(@Query() conditions: Record<string, string>) {
    return this.nftsService.findAll(conditions);
  }

  @Post('import')
  importCollection(@Body() importCollectionDto: ImportCollectionDto) {
    return this.nftsService.importCollection(importCollectionDto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.offersService.findById(id);
  // }

  // @Get('creator/:address')
  // findByCreator(@Param('address') address: string) {
  //   return this.offersService.findByCreator(address);
  // }
}
