import axios from '@src/config/axios.conf';

export const getOffers = (params = {}) => {
  return axios.get('/offers', {
    params,
  });
};

export const getOffersByOrder = (order, params = {}) => {
  params.order = order;
  return axios.get(`/offers`, {
    params,
  });
};

export const createOffer = (order) => {
  return axios.post('/offers', order);
};

export const getOfferByHash = (hash) => {
  return axios.get(`/offers/${hash}`);
};

export const getOffersByCreator = (creator) => {
  return axios.get(`/offers/creator/${creator}`);
};
