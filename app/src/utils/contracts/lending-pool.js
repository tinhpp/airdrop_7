import { ethers } from 'ethers';
import { LENDING_POOL_ABI } from '@src/abi';
import { LENDING_POOL_ADDRESS } from '@src/constants';
import { getRawBalance, getBalance } from './erc20';

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
const signer = provider.getSigner();

const lendingPoolContract = (signerOrProvider = provider) => {
  return new ethers.Contract(LENDING_POOL_ADDRESS, LENDING_POOL_ABI, signerOrProvider);
};

export const getStakedPerUser = async (address, options = {}) => {
  const contract = lendingPoolContract(provider);
  const balance = (await contract.poolStakers(address, { ...options })).amount;
  return Number(ethers.utils.formatEther(balance)).toFixed(2);
};

export const deposit = async (amount) => {
  const contract = lendingPoolContract(signer);
  const tx = await contract.deposit(amount);
  await tx.wait();
  return tx;
};

export const withdraw = async (amount) => {
  const contract = lendingPoolContract(signer);
  const tx = await contract.withdraw(amount);
  await tx.wait();
  return tx;
};

export const claimReward = async () => {
  const contract = lendingPoolContract(signer);
  const tx = await contract.claimReward();
  await tx.wait();
  return tx;
};

export const getStakedByUser = async (address) => {
  const contract = lendingPoolContract(provider);
  const userInfo = await contract.userInfo(address);
  return Number(ethers.utils.formatUnits(userInfo.amount)).toFixed(2);
};

export const getTotalStakedInPool = async () => {
  const contract = lendingPoolContract(provider);
  const poolInfo = await contract.poolInfo();
  return Number(ethers.utils.formatUnits(poolInfo.stakedSupply)).toFixed(2);
};

export const getTotalBonusInPool = async () => {
  const contract = lendingPoolContract(provider);
  const treasury = await contract.treasury();
  return getBalance(treasury);
};

export const getBonus = async (address) => {
  const contract = lendingPoolContract(provider);

  const rewardSupply = await contract.rewardSupply();
  if (rewardSupply.eq(0)) return 0;
  const pendingReward = await contract.pendingReward(address);
  const treasury = await contract.treasury();
  const treasuryBalance = await getRawBalance(treasury);

  const reward = pendingReward.mul(treasuryBalance).div(rewardSupply);
  return Number(ethers.utils.formatUnits(reward)).toFixed(2);
};

export const getTotalStakers = async () => {
  const contract = lendingPoolContract(provider);
  const list = await contract.addressLength();
  return list.toNumber();
};
