import { PartialType } from '@nestjs/mapped-types';
import { CreateRequestDto, RequestSignature } from './create-request.dto';
import { RequestStatus } from './request.enum';

export class UpdateRequestDto extends PartialType(CreateRequestDto) {
  status: RequestStatus;
  lenderSignature: RequestSignature;
}
