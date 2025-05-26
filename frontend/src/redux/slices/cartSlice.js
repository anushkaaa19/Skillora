import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (!existingItem) {
        state.items.push(action.payload);
        state.total += action.payload.price;
      }
    },
    removeFromCart: (state, action) => {
      const indexToRemove = state.items.findIndex(item => item.id === action.payload);
      if (indexToRemove !== -1) {
        state.total -= state.items[indexToRemove].price;
        state.items.splice(indexToRemove, 1);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
