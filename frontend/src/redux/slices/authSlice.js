// src/redux/slices/authSlice.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      loginStart: () => set({ isLoading: true }),
      loginSuccess: (user) =>
        set({
          user,
          token: user.token, // ✅ add this
          isAuthenticated: true,
          isLoading: false,
        }),
      
      loginFail: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),
    {
      name: "auth-storage",           // storage key
      getStorage: () => localStorage, // persist to localStorage
    }
  )
);
