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
import { TokenBoundAccountsService } from './token-bound-accounts.service';
import { CreateTokenBoundAccountDto } from './dto/create-token-bound-account.dto';
import { UpdateTokenBoundAccountDto } from './dto/update-token-bound-account.dto';

@Controller('token-bound-accounts')
export class TokenBoundAccountsController {
  constructor(
    private readonly tokenBoundAccountsService: TokenBoundAccountsService,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateTokenBoundAccountDto) {
    return this.tokenBoundAccountsService.create(createOrderDto);
  }

  @Get()
  findAll(@Query() conditions: Record<string, any>) {
    return this.tokenBoundAccountsService.findAll(conditions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tokenBoundAccountsService.findById(id);
  }

  @Get('owner/:address')
  findByOwner(@Param('address') address: string) {
    return this.tokenBoundAccountsService.findByOwner(address);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTokenBoundAccountDto: UpdateTokenBoundAccountDto,
  ) {
    return this.tokenBoundAccountsService.update(
      id,
      updateTokenBoundAccountDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tokenBoundAccountsService.remove(+id);
  }
}
