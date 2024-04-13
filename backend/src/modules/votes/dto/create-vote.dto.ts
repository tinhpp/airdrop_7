export class CreateVoteDto {
  voter: string;
  orderHash: string;
  isAccepted: boolean;
  signature: string;
}
