// src/redux/slices/authSlice.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

let hasHydrated = false;

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      loginStart: () => set({ isLoading: true }),
      loginSuccess: (user) =>
        
        set({

          user,
          token: user.token,
          isAuthenticated: true,
          isLoading: false,
        }),
      
      loginFail: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
      onRehydrateStorage: () => () => {
        hasHydrated = true;
      },
    }
  )
);

// ✅ Expose hydration status to use in components
useAuthStore.persist = {
  hasHydrated: () => hasHydrated,
  onFinishHydration: (cb) => {
    const interval = setInterval(() => {
      if (hasHydrated) {
        clearInterval(interval);
        cb();
      }
    }, 50);
    return () => clearInterval(interval);
  },
};
