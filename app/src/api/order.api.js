import axios from '@src/config/axios.conf';

export const getOrders = (params = {}) => {
    return axios.get('/orders', {
        params
    });
}

export const createOrder = (order) => {
    return axios.post('/orders', order)
}

export const getOrderByHash = (hash) => {
    return axios.get(`/orders/${hash}`);
}

export const getOrderByCreator = (creator) => {
    return axios.get(`/orders/creator/${creator}`);
}