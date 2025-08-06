import type { AuthState } from "@/types/user";
import { create } from "zustand";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      // This will be implemented in the login component
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  verifyOtp: async (otpData) => {
    set({ isLoading: true, error: null });
    try {
      // This will be implemented in the   component
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));
