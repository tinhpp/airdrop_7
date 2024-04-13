import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';

@Controller('offers')
export class OrdersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto);
  }

  @Get()
  findAll(@Query() conditions: Record<string, string>) {
    return this.offersService.findAll(conditions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findById(id);
  }

  @Get('creator/:address')
  findByCreator(@Param('address') address: string) {
    return this.offersService.findByCreator(address);
  }

  @Get('order/:order')
  findByOrder(@Param('order') order: string) {
    return this.offersService.findByOrder(order);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.offersService.update(+id, updateOrderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.offersService.remove(+id);
  // }
}
