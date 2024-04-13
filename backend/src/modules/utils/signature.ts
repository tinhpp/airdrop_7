import { ethers, parseEther } from 'ethers';
import { calculateRepayment } from './apr';

const ONE_DAY = 24 * 60 * 60;

const getSignerAddress = (msg: string, signature: string) => {
  try {
    const signerAddress = ethers.verifyMessage(msg, signature);
    return signerAddress;
  } catch (e) {
    return '';
  }
};

const verifySignature = (signer: string, msg: any, signature: string) => {
  try {
    const signerAddress = getSignerAddress(msg, signature);
    return signerAddress.toLocaleLowerCase() === signer.toLocaleLowerCase();
  } catch (e) {
    return false;
  }
};

export const generateOfferMessage = (
  offerData: any,
  signatureData: any,
  loanContract,
  chainId,
) => {
  const {
    offer,
    rate,
    nftTokenId,
    nftAddress,
    duration,
    adminFeeInBasisPoints,
    erc20Denomination,
  } = offerData;
  const repayment = calculateRepayment(offer, rate, duration);

  const encodedOffer = ethers.solidityPacked(
    ['address', 'uint256', 'uint256', 'address', 'uint256', 'uint32', 'uint16'],
    [
      erc20Denomination,
      ethers.parseUnits(offer, 18),
      ethers.parseUnits(`${repayment}`, 18),
      nftAddress,
      nftTokenId,
      duration * ONE_DAY,
      adminFeeInBasisPoints,
    ],
  );

  const { signer, nonce, expiry } = signatureData;

  const encodedSignature = ethers.solidityPacked(
    ['address', 'uint256', 'uint256'],
    [signer, nonce, expiry],
  );

  const payload = ethers.solidityPacked(
    ['bytes', 'bytes', 'address', 'uint256'],
    [encodedOffer, encodedSignature, loanContract, chainId],
  );
  return ethers.keccak256(payload);
};

export const generateRequestMessage = (
  requestData: any,
  signatureData: any,
  loanContract,
  chainId,
) => {
  const { offer, loanDuration, renegotiateFee } = requestData;
  const { signer, nonce, expiry } = signatureData;

  const encodedSignature = ethers.solidityPacked(
    ['address', 'uint256', 'uint256'],
    [signer, nonce, expiry],
  );

  const payload = ethers.solidityPacked(
    ['bytes32', 'uint32', 'uint256', 'bytes', 'address', 'uint256'],
    [
      offer,
      loanDuration * ONE_DAY,
      ethers.parseUnits(renegotiateFee, 18).toString(),
      encodedSignature,
      loanContract,
      chainId,
    ],
  );
  return ethers.keccak256(payload);
};

export const generateItemMessage = (
  itemData: any,
  marketplaceContract,
  chainId,
  createdAt,
) => {
  const { nft, tokenId, price, creator } = itemData;

  const itemHash = ethers.solidityPacked(
    ['address', 'uint256', 'uint256', 'address'],
    [nft, tokenId, parseEther(price.toString()), creator],
  );

  const payload = ethers.solidityPacked(
    ['bytes', 'address', 'uint256', 'uint256'],
    [itemHash, marketplaceContract, chainId, createdAt],
  );
  return ethers.keccak256(payload);
};

export { getSignerAddress, verifySignature };
