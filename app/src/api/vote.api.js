import axios from '@src/config/axios.conf';

export const submitVote = (data) => {
  return axios.post(`/votes`, data);
};

export const getVote = (params) => {
  return axios.get('/votes', {
    params,
  });
};
