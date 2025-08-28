// src/store/auth.store.ts
import { create } from "zustand";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import authClient from "@/api/auth-client";
import type { AuthState, LoginCredentials, User } from "@/types/user";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("safaripro_access_token") || null,
  isAuthenticated: !!localStorage.getItem("safaripro_access_token"),
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      params.append("username", credentials.username);
      params.append("password", credentials.password);

      console.log("🔒 Sending Login Request via Vite Proxy...");

      // The path must now include the API version since the proxy target does not
      const response = await authClient.post("/v1/auth/login", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { access_token } = response.data;
      const user = jwtDecode(access_token) as User;
      localStorage.setItem("safaripro_access_token", access_token);

      set({
        user,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
      });

      toast.success("Login Successful!", {
        description: "Welcome back! Redirecting to your dashboard.",
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { detail?: string })?.detail ||
        "Login failed. Please check your credentials and try again.";

      toast.error("Authentication Failed", {
        description: errorMessage,
      });

      set({ error: errorMessage, isLoading: false, isAuthenticated: false });
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    localStorage.removeItem("safaripro_access_token");
    set({ user: null, token: null, isAuthenticated: false });
    window.location.replace("/login");
  },
}));
