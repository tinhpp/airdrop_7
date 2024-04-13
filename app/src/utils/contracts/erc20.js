import { ERC20_ABI } from '@src/abi';
import { WXCR_ADDRESS, LOAN_ADDRESS } from '@src/constants';
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');

export const ERC20Contract = (address, signerOrProvider = provider) => {
  return new ethers.Contract(address, ERC20_ABI, signerOrProvider);
};

export const getRawBalance = async (account, contractAddress = WXCR_ADDRESS) => {
  const contract = ERC20Contract(contractAddress, provider);
  return contract.balanceOf(account);
};

export const getBalance = async (account, contractAddress = WXCR_ADDRESS) => {
  const contract = ERC20Contract(contractAddress, provider);
  const balance = await contract.balanceOf(account);
  return Number(ethers.utils.formatEther(balance)).toFixed(2);
};

export const getContractSymbol = async (contractAddress = WXCR_ADDRESS) => {
  const contract = ERC20Contract(contractAddress, provider);
  return contract.symbol();
};

export const checkAllowance = async (owner, amount, spender = LOAN_ADDRESS, contractAddress = WXCR_ADDRESS) => {
  const contract = ERC20Contract(contractAddress, provider);
  const allowance = await contract.allowance(owner, spender);
  return allowance.gte(amount);
};

export const approveERC20 = async (
  amount = ethers.constants.MaxInt256,
  spender = LOAN_ADDRESS,
  contractAddress = WXCR_ADDRESS
) => {
  const signer = provider.getSigner();
  const contract = ERC20Contract(contractAddress, signer);
  return contract.approve(spender, amount);
};

export const mintERC20 = async (amount, contractAddress = WXCR_ADDRESS) => {
  const signer = provider.getSigner();
  const contract = ERC20Contract(contractAddress, signer);
  const decimals = await contract.decimals();
  return contract.mint({ value: ethers.utils.parseUnits(`${amount}`, decimals) });
};

export const burnERC20 = async (amount, contractAddress = WXCR_ADDRESS) => {
  const signer = provider.getSigner();
  const contract = ERC20Contract(contractAddress, signer);
  const decimals = await contract.decimals();
  return contract.burn(ethers.utils.parseUnits(`${amount}`, decimals));
};
