import { ethers } from 'ethers';
import { LOAN_ADDRESS, CHAIN_ID, WXCR_ADDRESS } from '@src/constants';

const RPC_URL = 'https://rpc-kura.cross.technology';
export const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

export const getNativeBalance = async (account) => {
  const balance = await provider.getBalance(account);
  return Number(ethers.utils.formatEther(balance)).toFixed(2);
};

export const generateSignature = async (data) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  const account = (await provider.listAccounts())[0];
  const signer = provider.getSigner(account);

  const bytes = new TextEncoder().encode(JSON.stringify(data));
  const orderHash = ethers.utils.sha256(bytes).slice(2);
  const signature = await signer.signMessage(orderHash);
  return signature;
};

export const generateOrderSignature = async (order) => {
  const encodedOrder = ethers.utils.solidityPack(
    ['address', 'address', 'uint256', 'string', 'string', 'string', 'string'],
    [order.creator, order.nftAddress, order.nftTokenId, order.offer, order.duration, order.rate, order.lender]
  );

  const orderHash = ethers.utils.keccak256(encodedOrder);

  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  const account = (await provider.listAccounts())[0];
  const signer = provider.getSigner(account);
  const signature = await signer.signMessage(orderHash);
  return signature;
};

export const generateOfferSignature = async (
  offerData,
  signatureData,
  loanContract = LOAN_ADDRESS,
  chainId = CHAIN_ID
) => {
  const {
    offer,
    repayment,
    nftTokenId,
    nftAddress,
    duration,
    adminFeeInBasisPoints = 25,
    erc20Denomination = WXCR_ADDRESS,
  } = offerData;
  const encodedOffer = ethers.utils.solidityPack(
    ['address', 'uint256', 'uint256', 'address', 'uint256', 'uint32', 'uint16'],
    [erc20Denomination, offer, repayment, nftAddress, nftTokenId, duration, adminFeeInBasisPoints]
  );

  const { signer: signerAddress, nonce, expiry } = signatureData;

  const encodedSignature = ethers.utils.solidityPack(['address', 'uint256', 'uint256'], [signerAddress, nonce, expiry]);

  const payload = ethers.utils.solidityPack(
    ['bytes', 'bytes', 'address', 'uint256'],
    [encodedOffer, encodedSignature, loanContract, chainId]
  );

  const message = ethers.utils.arrayify(ethers.utils.keccak256(payload));

  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  const account = (await provider.listAccounts())[0];
  const signer = provider.getSigner(account);
  const signature = await signer.signMessage(message);
  return signature;
};

export const getBlockNumber = async () => {
  return provider.getBlockNumber();
};

export const getTransactionByEvents = async (address, abi, eventName) => {
  try {
    const contract = new ethers.Contract(address, abi, provider);
    const toBlock = await getBlockNumber();
    // const toBlock = 99153;
    const events = await contract.queryFilter(eventName, toBlock - 10000, toBlock);
    return events;
  } catch (error) {
    return [];
  }
};

export const generateRequestSignature = async (
  requestData,
  signatureData,
  loanContract = LOAN_ADDRESS,
  chainId = CHAIN_ID
) => {
  const { loanId, loanDuration, renegotiateFee } = requestData;
  const { signer: signerAddress, nonce, expiry } = signatureData;

  const encodedSignature = ethers.utils.solidityPack(['address', 'uint256', 'uint256'], [signerAddress, nonce, expiry]);

  const payload = ethers.utils.solidityPack(
    ['bytes32', 'uint32', 'uint256', 'bytes', 'address', 'uint256'],
    [loanId, loanDuration, renegotiateFee, encodedSignature, loanContract, chainId]
  );

  const message = ethers.utils.arrayify(ethers.utils.keccak256(payload));

  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  const account = (await provider.listAccounts())[0];
  const signer = provider.getSigner(account);
  const signature = await signer.signMessage(message);
  return signature;
};
