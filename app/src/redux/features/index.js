import { combineReducers } from '@reduxjs/toolkit';
import accountReducer from './accountSlice';
import rateReducer from './rateSlice';
import cartReducer from './cartSlice';

const rootReducer = combineReducers({
  account: accountReducer,
  cart: cartReducer,
  rate: rateReducer,
});

export default rootReducer;
