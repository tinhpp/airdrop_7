import { PartialType } from '@nestjs/mapped-types';
import { CreateTokenBoundAccountDto } from './create-token-bound-account.dto';

export class UpdateTokenBoundAccountDto extends PartialType(
  CreateTokenBoundAccountDto,
) {}
