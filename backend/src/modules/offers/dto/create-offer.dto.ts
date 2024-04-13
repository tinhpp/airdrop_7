type OfferSignature = {
  signer: string;
  nonce: number;
  expiry: number;
  signature: string;
};

export class CreateOfferDto {
  creator: string;
  order: string;
  borrower: string;
  erc20Denomination: string;
  offer: number;
  duration: number;
  rate: number;
  expiration: number;
  createdAt: number;
  adminFeeInBasisPoints: number;
  signature: OfferSignature;
}
