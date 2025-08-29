//  - - - src/store/auth.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import authClient from "@/api/auth-client"; // Make sure this client is correctly configured
import { type User, type LoginCredentials } from "@/types/user";

// Define the shape of the user profile from the /auth/me endpoint
interface UserProfile {
  last_login_at: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isFirstLogin: boolean | null;
  onboardingCompleted: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
}

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isFirstLogin: null,
  onboardingCompleted: false,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,

      // --- LOGIN FUNCTION (Restored & Integrated) ---
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const params = new URLSearchParams();
          params.append("username", credentials.username);
          params.append("password", credentials.password);

          const response = await authClient.post("/v1/auth/login", params, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          });

          const { access_token } = response.data;
          const user = jwtDecode<User>(access_token);

          // Set authenticated state immediately
          set({
            user,
            token: access_token,
            isAuthenticated: true,
            isLoading: false,
          });

          // After login, fetch profile to check if it's their first time
          // This determines if they need to go through the NEW onboarding wizard
          const profileResponse = await authClient.get<UserProfile>(
            "/v1/auth/me"
          );

          // If last_login_at is null, they have never logged in before.
          // This means their onboarding is NOT complete.
          const hasNeverLoggedIn = profileResponse.data.last_login_at === null;
          set({ onboardingCompleted: !hasNeverLoggedIn });

          toast.success("Login Successful!", {
            description: "Redirecting to your dashboard...",
          });
        } catch (error) {
          const axiosError = error as AxiosError;
          const errorMessage =
            (axiosError.response?.data as { detail?: string })?.detail ||
            "Login failed. Please check your credentials and try again.";

          toast.error("Authentication Failed", { description: errorMessage });
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          throw new Error(errorMessage);
        }
      },

      logout: () => {
        set(initialState);
        // Clear both storages on logout for a clean slate
        localStorage.removeItem("auth-storage");
        sessionStorage.removeItem("onboarding-storage");
        window.location.replace("/login");
      },

      completeOnboarding: () => set({ onboardingCompleted: true }),

      // setUser and setToken are implicitly handled by the login action now
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
