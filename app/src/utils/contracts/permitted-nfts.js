import { PERMITTED_NFTS_ABI } from '@src/abi';
import { PERMITTED_NFTS_ADDRESS } from '@src/constants';
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
const signer = provider.getSigner();

export const PermittedNFTsContract = (signerOrProvider = provider) => {
  return new ethers.Contract(PERMITTED_NFTS_ADDRESS, PERMITTED_NFTS_ABI, signerOrProvider);
};

export const getNFTPermit = (address) => {
  const contract = PermittedNFTsContract();
  return contract.getNFTPermit(address);
};

export const setNFTPermit = (nftContract, isPermitted) => {
  const contract = PermittedNFTsContract(signer);
  return contract.setNFTPermit(nftContract, isPermitted);
};

export const setNFTPermits = (nftContract, isPermitted) => {
  const contract = PermittedNFTsContract(signer);
  return contract.setNFTPermits(nftContract, isPermitted);
};
