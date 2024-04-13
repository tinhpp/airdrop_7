import { PartialType } from '@nestjs/mapped-types';
import { CreateOfferDto } from './create-offer.dto';

export class UpdateOrderDto extends PartialType(CreateOfferDto) {}
