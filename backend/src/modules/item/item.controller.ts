import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item-dto';
import { ItemStatus } from './dto/item.enum';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Get()
  findAll(@Query() conditions: Record<string, string>) {
    return this.itemService.find(conditions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findById(id);
  }

  @Get('creator/:address')
  findByCreator(@Param('address') address: string) {
    return this.itemService.findByCreator(address);
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: ItemStatus) {
    return this.itemService.find({ status });
  }

  @Patch('purchase/:id')
  purchase(@Param('id') id: string) {
    return this.itemService.purchase(id);
  }

  @Patch('close/:id')
  close(@Param('id') id: string) {
    return this.itemService.close(id);
  }
}
