// src/redux/slices/authSlice.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      loginStart: () => set({ isLoading: true }),
      
      loginSuccess: ({ user, token }) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      loginFail: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }),

      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
    }
  )
);
