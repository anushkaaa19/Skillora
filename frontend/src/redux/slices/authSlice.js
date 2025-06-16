// src/redux/slices/authSlice.js
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  loginStart: () => set({ isLoading: true }),
  loginSuccess: (user) =>
    set({
      user,
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
}));
