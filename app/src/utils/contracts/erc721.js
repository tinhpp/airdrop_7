import axios from 'axios';
import { ethers } from 'ethers';
import { LOAN_ADDRESS, NFT_CONTRACT_ADDRESS, DEFAULT_ERC6551_BASE_URI } from '@src/constants';
import { ERC721_ABI } from '@src/abi';

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');

export const ERC721Contract = (
  contractAddress = NFT_CONTRACT_ADDRESS,
  providerOrSigner = provider,
  ABI = ERC721_ABI
) => {
  return new ethers.Contract(contractAddress, ABI, providerOrSigner);
};

export const getNFTs = async (address, contractAddress = NFT_CONTRACT_ADDRESS) => {
  const contract = ERC721Contract(contractAddress);
  const tokens = await contract.tokensOfOwner(address);
  const baseURI = await contract.baseURI();
  const ext = await contract.baseExtension();
  return Promise.all(tokens.slice(0, 10).map((token) => axios.get(`${baseURI}${token.toNumber()}${ext}`)));
};

export const checkApproved = async (tokenId, operator = LOAN_ADDRESS, contractAddress = NFT_CONTRACT_ADDRESS) => {
  const contract = ERC721Contract(contractAddress);
  const isApproved = await contract.getApproved(tokenId);
  return isApproved.toLowerCase() == operator.toLowerCase();
};

export const approveERC721 = async (tokenId, operator = LOAN_ADDRESS, contractAddress = NFT_CONTRACT_ADDRESS) => {
  const signer = provider.getSigner();
  const contract = ERC721Contract(contractAddress, signer);
  return contract.approve(operator, tokenId);
};

export const mintERC721 = async (address, uri = DEFAULT_ERC6551_BASE_URI, contractAddress = NFT_CONTRACT_ADDRESS) => {
  const signer = provider.getSigner();
  const contract = ERC721Contract(contractAddress, signer);
  return contract.mint(address, uri);
};
