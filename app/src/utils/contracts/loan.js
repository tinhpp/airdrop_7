import { LOAN_ABI } from '@src/abi';
import { LOAN_ADDRESS } from '@src/constants';
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
const signer = provider.getSigner();

export const loanContract = (signerOrProvider) => {
  return new ethers.Contract(LOAN_ADDRESS, LOAN_ABI, signerOrProvider);
};

export const acceptOffer = (loanId, offer, signature) => {
  const contract = loanContract(signer);
  return contract.acceptOffer(loanId, offer, signature);
};

export const payBackLoan = async (loanId) => {
  const contract = loanContract(signer);
  return contract.payBackLoan(loanId);
};

export const liquidateLoan = async (loanId) => {
  const contract = loanContract(signer);
  return contract.liquidateOverdueLoan(loanId);
};

// LOAN IN LENDING POOL
export const acceptOfferLendingPool = (loanId, offer, signatures) => {
  const contract = loanContract(signer);
  return contract.acceptOfferLendingPool(loanId, offer, signatures);
};

export const renegotiateLoan = async (loanId, loanDuration, renegotiateFee, lenderNonce, expiry, lenderSignature) => {
  const contract = loanContract(signer);
  return contract.renegotiateLoan(loanId, loanDuration, renegotiateFee, lenderNonce, expiry, lenderSignature);
};
