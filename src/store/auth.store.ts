// //  - - - src/store/auth.store.ts
// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";
// import { toast } from "sonner";
// import { AxiosError } from "axios";
// import { jwtDecode } from "jwt-decode";
// import authClient from "@/api/auth-client";
// import { type User, type LoginCredentials } from "@/types/user";

// interface UserProfile {
//   last_login_at: string | null;
// }

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   error: string | null;
//   onboardingCompleted: boolean;
//   hotelId: string | null; // <-- NEW: To store the active hotel ID

//   // Actions
//   login: (credentials: LoginCredentials) => Promise<void>;
//   logout: () => void;
//   completeOnboarding: (hotelId: string) => void; // <-- MODIFIED
// }

// const initialState = {
//   user: null,
//   token: null,
//   isAuthenticated: false,
//   isLoading: false,
//   error: null,
//   onboardingCompleted: false,
//   hotelId: null,
// };

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       ...initialState,

//       login: async (credentials: LoginCredentials) => {
//         set({ isLoading: true, error: null });
//         try {
//           const params = new URLSearchParams();
//           params.append("username", credentials.username);
//           params.append("password", credentials.password);

//           const response = await authClient.post("/v1/auth/login", params, {
//             headers: { "Content-Type": "application/x-www-form-urlencoded" },
//           });

//           const { access_token } = response.data;
//           const user = jwtDecode<User>(access_token);

//           set({
//             user,
//             token: access_token,
//             isAuthenticated: true,
//             isLoading: false,
//           });

//           const profileResponse = await authClient.get<UserProfile>(
//             "/v1/auth/me"
//           );

//           const hasNeverLoggedIn = profileResponse.data.last_login_at === null;
//           set({ onboardingCompleted: !hasNeverLoggedIn });

//           toast.success("Login Successful!", {
//             description: "Redirecting to your dashboard...",
//           });
//         } catch (error) {
//           const axiosError = error as AxiosError;
//           const errorMessage =
//             (axiosError.response?.data as { detail?: string })?.detail ||
//             "Login failed. Please check your credentials and try again.";

//           toast.error("Authentication Failed", { description: errorMessage });
//           set({
//             error: errorMessage,
//             isLoading: false,
//             isAuthenticated: false,
//             user: null,
//             token: null,
//           });
//           throw new Error(errorMessage);
//         }
//       },

//       logout: () => {
//         set(initialState);
//         localStorage.removeItem("auth-storage");
//         sessionStorage.removeItem("onboarding-storage");
//         window.location.replace("/login");
//       },

//       completeOnboarding: (hotelId: string) =>
//         set({ onboardingCompleted: true, hotelId: hotelId }),
//     }),
//     {
//       name: "auth-storage",
//       storage: createJSONStorage(() => localStorage),
//     }
//   )
// );

// src/store/auth.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import authClient from "@/api/auth-client";
import { type User, type LoginCredentials } from "@/types/user";

// --- NEW: Define a type for the full user profile from the /me endpoint ---
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  last_login_at: string | null;
  updated_at: string;
}

interface AuthState {
  user: User | null; // Decoded token data
  userProfile: UserProfile | null; // --- NEW: Full profile from /me endpoint ---
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  onboardingCompleted: boolean;
  hotelId: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  fetchUserProfile: () => Promise<void>; // --- NEW: Action to fetch profile ---
  completeOnboarding: (hotelId: string) => void;
}

const initialState = {
  user: null,
  userProfile: null, // --- NEW ---
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  onboardingCompleted: false,
  hotelId: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // --- MODIFIED: Pass 'get' to access other actions ---
      ...initialState,

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

          set({
            user,
            token: access_token,
            isAuthenticated: true,
            isLoading: false,
          });

          // --- NEW: Call the fetchUserProfile action after setting the token ---
          await get().fetchUserProfile();

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

      // --- NEW: Action implementation to fetch and store user profile ---
      fetchUserProfile: async () => {
        try {
          const response = await authClient.get<UserProfile>("/v1/auth/me");
          set({ userProfile: response.data });
          const hasNeverLoggedIn = response.data.last_login_at === null;
          set({ onboardingCompleted: !hasNeverLoggedIn });
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          // Optional: handle profile fetch error, maybe logout
          get().logout();
        }
      },

      logout: () => {
        set(initialState);
        localStorage.removeItem("auth-storage");
        sessionStorage.removeItem("onboarding-storage");
        window.location.replace("/login");
      },

      completeOnboarding: (hotelId: string) =>
        set({ onboardingCompleted: true, hotelId: hotelId }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
