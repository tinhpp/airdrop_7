import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import config from 'src/config';
import { verifySignature } from '../utils/signature';
import { CreateVoteDto } from './dto/create-vote.dto';
import { Vote } from './reposities/vote.reposity';
import { Order } from './../orders/reposities/order.reposity';
import { DacsService } from '../dacs/dacs.service';
import { LendingPoolService } from '../lending-pool/lending-pool.service';
import { Nft } from './../nfts/reposities/nft.reposity';
import { OrderStatus } from '../orders/dto/order.enum';
const sha256 = require('simple-sha256');

@Injectable()
export class VotesService {
  constructor(
    private readonly vote: Vote,
    private readonly order: Order,
    private readonly nft: Nft,
    private readonly dacs: DacsService,
    private readonly lendingPool: LendingPoolService,
  ) {}

  async create(createVoteDto: CreateVoteDto) {
    const bytes = new TextEncoder().encode(
      JSON.stringify({
        voter: createVoteDto.voter,
        orderHash: createVoteDto.orderHash,
        isAccepted: createVoteDto.isAccepted,
      }),
    );

    const voteHash = await sha256(bytes);

    // if (
    //   !verifySignature(createVoteDto.voter, voteHash, createVoteDto.signature)
    // ) {
    //   throw new UnauthorizedException();
    // }

    const currentOrder = await this.order.getByKey(createVoteDto.orderHash);
    if (currentOrder.lender !== 'pool') {
      throw new BadRequestException();
    }

    const currentVote = currentOrder.vote;
    const stakedPerUser = await this.lendingPool.getStakedPerUser(
      createVoteDto.voter,
      {
        blockTag: currentOrder.vote.blockNumber,
      },
    );

    if (stakedPerUser === 0) {
      throw new UnauthorizedException();
    }

    if (createVoteDto.isAccepted) {
      currentVote.accepted = Number(currentVote.accepted) + stakedPerUser;
    } else {
      currentVote.rejected = Number(currentVote.rejected) + stakedPerUser;
    }

    const newVote: Record<string, any> = {
      ...createVoteDto,
      staked: stakedPerUser,
      hash: voteHash,
      createdAt: new Date().getTime(),
    };

    const dacs_cid = await this.dacs.upload(newVote);
    newVote.dacs_url = `${config.ENV.SERVER_HOST}:${config.ENV.SERVER_PORT}/dacs/${dacs_cid}`;

    const orderUpdatedData: Record<string, any> = {
      vote: currentVote,
    };

    if (
      currentVote.total > 0 &&
      currentVote.rejected / currentVote.total >= 0.25
    ) {
      orderUpdatedData.status = OrderStatus.REJECTED;
      this.nft.update(
        currentOrder.nftAddress,
        currentOrder.nftTokenId.toString(),
        { isAvailable: true },
      );
    }

    await Promise.all([
      this.vote.create(voteHash, newVote),
      this.order.update(createVoteDto.orderHash, orderUpdatedData),
    ]);
    return currentVote;
  }

  async findAll(conditions: Record<string, any> = {}) {
    return await this.vote.find(conditions);
  }

  async findById(id: string) {
    return await this.vote.getByKey(id);
  }

  async findByVoter(creator: string) {
    return await this.vote.find({ creator });
  }

  remove(id: number) {
    return `This action removes a #${id} vote`;
  }
}
