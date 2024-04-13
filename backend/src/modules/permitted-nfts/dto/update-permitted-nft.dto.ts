import { PartialType } from '@nestjs/mapped-types';
import { CreatePermittedNFTDto } from './create-permitted-nft.dto';

export class UpdatePermittedNFTDto extends PartialType(CreatePermittedNFTDto) {}
