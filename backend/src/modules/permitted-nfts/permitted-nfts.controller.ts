import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PermittedNFTsService } from './permitted-nfts.service';
import { CreatePermittedNFTDto } from './dto/create-permitted-nft.dto';
import { UpdatePermittedNFTDto } from './dto/update-permitted-nft.dto';

@Controller('permitted-nfts')
export class PermittedNFTsController {
  constructor(private readonly permittedNFTsService: PermittedNFTsService) {}

  @Post()
  create(@Body() createPermittedNFTDto: CreatePermittedNFTDto) {
    return this.permittedNFTsService.create(createPermittedNFTDto);
  }

  @Get()
  findAll(@Query() conditions: Record<string, any>) {
    return this.permittedNFTsService.findAll(conditions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permittedNFTsService.findById(id);
  }

  @Patch('/update')
  updateMany(
    @Query() conditions: Record<string, any>,
    @Body() updatePermittedNFTDto: UpdatePermittedNFTDto,
  ) {
    return this.permittedNFTsService.updateMany(
      conditions.ids.split(','),
      updatePermittedNFTDto,
    );
  }

  update(
    @Param('id') id: string,
    @Body() updatePermittedNFTDto: UpdatePermittedNFTDto,
  ) {
    return this.permittedNFTsService.update(id, updatePermittedNFTDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permittedNFTsService.remove(+id);
  }
}
