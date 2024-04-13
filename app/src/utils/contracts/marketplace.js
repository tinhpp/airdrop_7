import { MARKETPLACE_ABI } from '@src/abi/marketPlace';
import { MARKETPLACE_ADDRESS } from '@src/constants';
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');

export const marketPlaceContract = (signerOrProvider = provider) => {
    return new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signerOrProvider);
};