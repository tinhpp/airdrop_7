import { createSelector, createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  isError: false,
  items: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    removeFromCart: (state, action) => {
      const removeItem = state.items.filter((item) => item.hash !== action.payload);
      state.items = removeItem;
    },
    clearAllCart: (state) => {
      state.items = [];
    },
  },
});

export const selectIsItemInCart = createSelector(
  [(state) => state.cart.items, (state, item) => item],
  (items, search) => items.find((item) => item.hash === search.hash)
);

export const selectTotalPrice = createSelector(
  (state) => state.cart.items,
  (items) => items.reduce((acc, cur) => acc + +cur.price, 0)
);

export const { addToCart, removeFromCart, clearAllCart } = cartSlice.actions;
export default cartSlice.reducer;
