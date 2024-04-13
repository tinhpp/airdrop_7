import { OfferStatus, OrderStatus } from '@src/constants/enum';
import { WXCR_ADDRESS } from '@src/constants';
import { ethers } from 'ethers';
import { ONE_DAY } from '@src/constants';
import { calculateRepayment } from './apr';
import { RequestStatus } from '../constants/enum';

export const sliceAddress = (address) => {
  return `${address.slice(0, 5)} ... ${address.slice(-4)}`;
};

export const sliceHeadTail = (input, amount) => {
  return `${input.slice(0, amount)} ... ${input.slice(-amount + 1)}`;
};

export const calculateRealPrice = (price, rate, denominator) => {
  return (price + (price * rate) / denominator).toFixed(7);
};

export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const getRandomInt = () => {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
};

export const getOfferStatusText = (status) => {
  return Object.fromEntries(Object.entries(OfferStatus).map((a) => a.reverse()))[status];
};

export const getOrderStatusText = (status) => {
  return Object.fromEntries(Object.entries(OrderStatus).map((a) => a.reverse()))[status];
};

export const getRequestStatusText = (status) => {
  return Object.fromEntries(Object.entries(RequestStatus).map((a) => a.reverse()))[status];
};

export const convertOfferDataToSign = (offer) => {
  const repayment = calculateRepayment(offer.offer, offer.rate, offer.duration);

  const offerData = {
    offer: ethers.utils.parseUnits(offer.offer, 18),
    repayment: ethers.utils.parseUnits(`${repayment}`, 18),
    nftTokenId: offer.nftTokenId,
    nftAddress: offer.nftAddress,
    duration: offer.duration * ONE_DAY,
    adminFeeInBasisPoints: 25,
    erc20Denomination: WXCR_ADDRESS,
  };

  const signatureData = {
    signer: offer.creator,
    nonce: getRandomInt(),
    expiry: Math.floor(new Date().getTime() / 1000) + 24 * 60 * 60 * offer.expiration,
  };

  return { offerData, signatureData };
};

export const convertRequestDataToSign = (request) => {
  const requestData = {
    loanId: request.offer,
    loanDuration: request.loanDuration * ONE_DAY,
    renegotiateFee: ethers.utils.parseUnits(request.renegotiateFee, 18).toString(),
  };

  const signatureData = {
    signer: request.lender,
    nonce: getRandomInt(),
    expiry: getTimestamp() + ONE_DAY * request.expiration,
  };

  return { requestData, signatureData };
};

export function mergeRefs(refs) {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
        // eslint-disable-next-line eqeqeq
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
}

export const replaceIPFS = (
  link,
  search = ['ipfs://ipfs/', 'ipfs://', 'https://ipfs.moralis.io:2053/ipfs/'],
  gateway = ''
) => {
  if (link) {
    for (const s of search) {
      if (link.includes(s)) {
        return link.replace(s, gateway);
      }
    }
    return link;
  }
  return '';
};

export const compareString = (str1 = '', str2 = '') =>
  typeof str1 === 'string' && typeof str2 === 'string' && str1.toLowerCase() === str2.toLowerCase();

export const getTimestamp = () => {
  return Math.floor(new Date().getTime() / 1000);
};
