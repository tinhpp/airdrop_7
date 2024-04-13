import axios from '@src/config/axios.conf';

export const getTokenBoundAccounts = (params = {}) => {
    return axios.get('/token-bound-accounts', {
        params
    });
}

export const createTokenBoundAccount = (tokenBoundAccount) => {
    return axios.post('/token-bound-accounts', tokenBoundAccount)
}

export const getTokenBoundAccountByHash = (hash) => {
    return axios.get(`/token-bound-accounts/${hash}`);
}

export const getTokenBoundAccountByOwner = (owner) => {
    return axios.get(`/token-bound-accounts/owner/${owner}`);
}