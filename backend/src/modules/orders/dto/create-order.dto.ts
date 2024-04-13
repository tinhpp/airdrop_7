export class CreateOrderDto {
  creator: string;
  signature: string;
  nftAddress: string;
  lender: string;
  nftTokenId: number;
  offer: number;
  duration: number;
  rate: number;
  metadata: Record<string, any>;
}
