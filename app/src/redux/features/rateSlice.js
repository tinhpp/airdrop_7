import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  price: 0,
  rate: 0,
};

export const rateSlice = createSlice({
  name: 'rate',
  initialState,
  reducers: {
    setRate: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setRate } = rateSlice.actions;
export default rateSlice.reducer;
