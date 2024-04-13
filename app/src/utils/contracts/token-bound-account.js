import { ethers } from 'ethers';
import {
  TOKEN_BOUND_ACCOUNT_REGISTRY_ADDRESS,
  TOKEN_BOUND_ACCOUNT_IMPLEMENTATION_ADDRESS,
  TOKEN_BOUND_ACCOUNT_NFT_ADDRESS,
  CHAIN_ID,
  SALT,
} from '@src/constants';
import { TOKEN_BOUND_ACCOUNT_REGISTRY_ABI } from '@src/abi';

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');

export const TokenBoundAccountRegistryContract = (
  contractAddress = TOKEN_BOUND_ACCOUNT_REGISTRY_ADDRESS,
  providerOrSigner = provider
) => {
  return new ethers.Contract(contractAddress, TOKEN_BOUND_ACCOUNT_REGISTRY_ABI, providerOrSigner);
};

export const getTokenBoundAccount = ({
  tokenId,
  registryAddress = TOKEN_BOUND_ACCOUNT_REGISTRY_ADDRESS,
  implementationAddress = TOKEN_BOUND_ACCOUNT_IMPLEMENTATION_ADDRESS,
  tokenAddress = TOKEN_BOUND_ACCOUNT_NFT_ADDRESS,
  salt = SALT,
}) => {
  const contract = TokenBoundAccountRegistryContract(registryAddress);
  return contract.account(implementationAddress, CHAIN_ID, tokenAddress, tokenId, salt);
};

export const createTokenBoundAccount = async (
  tokenId,
  implementationAddress = TOKEN_BOUND_ACCOUNT_IMPLEMENTATION_ADDRESS,
  tokenAddress = TOKEN_BOUND_ACCOUNT_NFT_ADDRESS,
  salt = SALT
) => {
  const signer = provider.getSigner();
  const contract = TokenBoundAccountRegistryContract(TOKEN_BOUND_ACCOUNT_REGISTRY_ADDRESS, signer);
  const tx = await contract.createAccount(implementationAddress, CHAIN_ID, tokenAddress, tokenId, salt);
  const receipt = await tx.wait();
  const args = receipt.events.find((ev) => ev.event === 'AccountCreated').args;
  const account = args[0];
  return {
    account,
    registryAddress: TOKEN_BOUND_ACCOUNT_REGISTRY_ADDRESS,
    implementationAddress: TOKEN_BOUND_ACCOUNT_IMPLEMENTATION_ADDRESS,
    tokenAddress: TOKEN_BOUND_ACCOUNT_NFT_ADDRESS,
    tokenId: tokenId,
    salt: SALT,
  };
};
