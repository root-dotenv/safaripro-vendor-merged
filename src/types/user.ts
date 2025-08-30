// src/types/user.ts
/**
 * @description Represents the structure of the decoded JWT access token.
 */
export interface User {
  sub: string; // This is typically the username or email
  tenant_id: string;
  exp: number;
  full_name?: string; // --- MODIFIED: Added optional full_name property ---
}

/**
 * @description Defines the shape of the credentials object required for the login function.
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * @description Defines the complete state and actions for the authentication store.
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isFirstLogin: boolean | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  completeWalkthrough: () => void;
}
