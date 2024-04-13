export class CreateTokenBoundAccountDto {
  owner: string;
  registryAddress: string;
  implementationAddress: string;
  tokenAddress: string;
  tokenId: number;
  salt: number;
  assets?: Record<string, any>;
}
