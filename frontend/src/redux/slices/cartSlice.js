// src/redux/slices/cartSlice.js
import { create } from "zustand";

export const useCartStore = create((set) => ({
  items: [],

  addToCart: (item) =>
    set((state) => {
      // Prevent duplicates
      if (state.items.find((i) => i.id === item.id)) return state;
      return { items: [...state.items, item] };
    }),

  removeFromCart: (itemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    })),

  clearCart: () => set({ items: [] }),
}));
