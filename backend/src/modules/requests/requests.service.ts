import { OffersService } from './../offers/offers.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  OnModuleInit,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Contract, JsonRpcProvider, ethers } from 'ethers';
import config from 'src/config';
import {
  verifySignature,
  generateOfferMessage,
  generateRequestMessage,
} from '../utils/signature';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestStatus } from './dto/request.enum';
import { Request } from './reposities/request.reposity';
import { Order } from '../orders/reposities/order.reposity';
import { DacsService } from '../dacs/dacs.service';
import { OfferStatus } from '../offers/dto/offer.enum';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from '../orders/dto/order.enum';
import { UpdateRequestDto } from './dto/update-request.dto';
// import * as FACTORY_ABI from './abi/LOAN.json';

@Injectable()
export class RequestsService implements OnModuleInit {
  private rpcProvider: JsonRpcProvider;
  private nftContract: Contract;

  constructor(
    private readonly request: Request,
    private readonly dacs: DacsService,
    @Inject(forwardRef(() => OffersService))
    private readonly offerService: OffersService,
    private readonly ordersService: OrdersService,
  ) {}

  onModuleInit() {
    this.rpcProvider = new JsonRpcProvider(config.ENV.NETWORK_RPC_URL);
    // this.nftContract = new Contract(
    //   config.ENV.COLLECTION_ADDRESS,
    //   FACTORY_ABI,
    //   this.rpcProvider,
    // );
  }

  async create(dto: CreateRequestDto) {
    const order = await this.ordersService.findById(dto.loanId);

    if (order.status !== OrderStatus.FILLED) {
      throw new BadRequestException('invalid_status');
    }

    const requestHash = generateRequestMessage(
      dto,
      dto.signature,
      config.ENV.LOAN_ADDRESS,
      config.ENV.CHAIN_ID,
    );
    if (
      !verifySignature(
        dto.creator,
        ethers.getBytes(requestHash),
        dto.signature.signature,
      )
    ) {
      throw new UnauthorizedException();
    }

    const offers = await this.offerService.findByOrder(dto.loanId);

    const offer = offers.find((o) => {
      return o.status === OfferStatus.FILLED;
    });

    const newRequest: Record<string, any> = {
      ...dto,
      // floorPrice: (createOfferDto.offer * 1.1).toFixed(2),
      lender: offer.creator,
      creator: dto.creator,
      hash: requestHash,
      status: RequestStatus.OPENING,
      createdAt: new Date().getTime(),
    };
    const dacs_cid = await this.dacs.upload(newRequest);
    newRequest.dacs_url = `${config.ENV.SERVER_HOST}:${config.ENV.SERVER_PORT}/dacs/${dacs_cid}`;
    await this.request.create(requestHash, newRequest);
  }

  async findAll(conditions: Record<string, any> = {}) {
    let requests = await this.request.find(conditions);

    for (let request of requests) {
      const order = await this.ordersService.findById(request.loanId);
      const offers = await this.offerService.findByOrder(order.hash);

      request.order = order;
      request.offers = offers;
    }

    return requests;
  }

  async findById(id: string) {
    const request = await this.request.getByKey(id);

    const order = await this.ordersService.findById(request.loanId);

    return { ...request, order };
  }

  async update(id: string, dto: UpdateRequestDto) {
    await this.request.update(id, { ...dto });
  }

  async remove(id: string) {
    await this.request.remove(id);
  }

  async repaid(order: string) {
    const requests = await this.findAll({ order });

    for (let request of requests) {
      await this.remove(request.hash);
    }
  }
}
