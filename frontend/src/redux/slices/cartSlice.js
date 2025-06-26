import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      addToCart: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),
      removeFromCart: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item._id !== id),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // 👈 Key in localStorage
      getStorage: () => localStorage, // optional, default
    }
  )
);
