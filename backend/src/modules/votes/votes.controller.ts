import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { VotesService } from './votes.service';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  create(@Body() createVoteDto: CreateVoteDto) {
    return this.votesService.create(createVoteDto);
  }

  @Get()
  findAll(@Query() conditions: Record<string, any>) {
    return this.votesService.findAll(conditions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.votesService.findById(id);
  }

  @Get('voter/:address')
  findByVoter(@Param('address') address: string) {
    return this.votesService.findByVoter(address);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.votesService.remove(+id);
  }
}
