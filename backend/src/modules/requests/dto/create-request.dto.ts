export type RequestSignature = {
  signer: string;
  nonce: number;
  expiry: number;
  signature: string;
};

export class CreateRequestDto {
  creator: string;
  lender: string;
  loanId: string;
  offer: string;
  loanDuration: number;
  renegotiateFee: number;
  signature: RequestSignature;
  reason: string;
}
