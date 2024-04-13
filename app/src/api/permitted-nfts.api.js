import axios from '@src/config/axios.conf';

export const getPermittedNFTs = (params = {}) => {
  return axios.get('/permitted-nfts', {
    params,
  });
};

export const updatePermittedNFTs = (params, data) => {
  return axios.patch('/permitted-nfts/update', data, {
    params,
  });
};
