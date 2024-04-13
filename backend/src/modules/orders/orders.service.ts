import { Injectable, UnauthorizedException } from '@nestjs/common';
import config from 'src/config';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './dto/order.enum';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './reposities/order.reposity';
import { Nft } from './../nfts/reposities/nft.reposity';
import { TokenBoundAccount } from './../token-bound-accounts/reposities/token-bound-account.reposity';
import { verifySignature } from '../utils/signature';
import { DacsService } from '../dacs/dacs.service';
import { LendingPoolService } from '../lending-pool/lending-pool.service';
import { ethers } from 'ethers';

@Injectable()
export class OrdersService {
  constructor(
    private readonly order: Order,
    private readonly nft: Nft,
    private readonly tokenBoundAccount: TokenBoundAccount,
    private readonly dacs: DacsService,
    private readonly lendingPool: LendingPoolService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const encodedOrder = ethers.solidityPacked(
      ['address', 'address', 'uint256', 'string', 'string', 'string', 'string'],
      [
        createOrderDto.creator,
        createOrderDto.nftAddress,
        createOrderDto.nftTokenId,
        createOrderDto.offer,
        createOrderDto.duration,
        createOrderDto.rate,
        createOrderDto.lender,
      ],
    );

    const orderHash = ethers.keccak256(encodedOrder);

    if (
      !verifySignature(
        createOrderDto.creator,
        orderHash,
        createOrderDto.signature,
      )
    ) {
      throw new UnauthorizedException();
    }

    const newOrder: Record<string, any> = {
      ...createOrderDto,
      floorPrice: (createOrderDto.offer * 1.1).toFixed(2),
      hash: orderHash,
      status: OrderStatus.OPENING,
      createdAt: new Date().getTime(),
    };

    if (createOrderDto.lender === 'pool') {
      const blockNumber = await this.lendingPool.getBlockNumber();
      newOrder.vote = {
        blockNumber,
        total: await this.lendingPool.getTotalStaked({ blockTag: blockNumber }),
        accepted: 0,
        rejected: 0,
      };
    }

    const dacs_cid = await this.dacs.upload(newOrder);
    newOrder.dacs_url = `${config.ENV.SERVER_HOST}:${config.ENV.SERVER_PORT}/dacs/${dacs_cid}`;

    await Promise.all([
      this.order.create(orderHash, newOrder),
      createOrderDto.metadata.hash
        ? this.tokenBoundAccount.update(createOrderDto.metadata.hash, {
            isAvailable: false,
          })
        : this.nft.update(
            createOrderDto.nftAddress,
            createOrderDto.nftTokenId.toString(),
            { isAvailable: false },
          ),
    ]);
  }

  async findAll(conditions: Record<string, any> = {}) {
    return await this.order.find(conditions);
  }

  async findById(id: string) {
    return await this.order.getByKey(id);
  }

  async findByCreator(creator: string) {
    return await this.order.find({ creator });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
