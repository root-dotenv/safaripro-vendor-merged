// src/types/user.ts
/**
 * @description Represents the structure of the decoded JWT access token.
 * This contains the core information about the authenticated user's session.
 */
export interface User {
  sub: string; // The subject (user ID) of the token.
  tenant_id: string; // The ID of the tenant the user belongs to.
  exp: number; // The expiration timestamp of the token.
}

/**
 * @description Defines the shape of the credentials object required for the login function.
 */
export interface LoginCredentials {
  username: string;
  password: string; // Changed: Made the password required by removing the '?'.
}

/**
 * @description Defines the complete state and actions for the authentication store.
 * This is the primary interface for managing authentication throughout the application.
 */
export interface AuthState {
  user: User | null; // Holds the decoded user information, or null if not authenticated.
  token: string | null; // The raw JWT token.
  isAuthenticated: boolean; // A quick flag to check if the user is logged in.
  isLoading: boolean; // Tracks the loading state of authentication requests.
  error: string | null; // Stores any authentication-related error messages.
  login: (credentials: LoginCredentials) => Promise<void>; // The function to initiate login.
  logout: () => void; // The function to log the user out.
}
