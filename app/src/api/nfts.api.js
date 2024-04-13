import axios from '@src/config/axios.conf';
import { NFT_CONTRACT_ADDRESS } from '@src/constants';

export const getNfts = ({ collectionAddress = NFT_CONTRACT_ADDRESS, ...params }) => {
  return axios.get(`/nfts`, {
    params: {
      collectionAddress,
      ...params,
    },
  });
};

export const importCollection = (params) => {
  return axios.post('/nfts/import', params);
};

export const createNft = ({ nft, tokenId, price, creator, metadata, itemId }) => {
  return axios.post(`/item`, {
    nft,
    tokenId,
    price,
    creator,
    metadata,
    itemId,
  });
};

export const getSales = (params) => {
  const { page, status } = params;
  return axios.get(`/item/?status=${status}&page=${page}`);
};

export const getSale = async (hash) => {
  const { data } = await axios.get(`/item/${hash}`);
  return data;
};

export const purchaseItem = async (hash) => {
  const { data } = await axios.patch(`/item/purchase/${hash}`);
  return data;
};

export const purchaseItems = async (hashes) => {
  const { data } = await axios.all(hashes.map((hash) => axios.patch(`/item/purchase/${hash}`)));
  return data;
};