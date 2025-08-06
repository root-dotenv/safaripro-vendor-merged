// src/context/AuthContext.tsx
import { createContext, useState, useContext, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { User } from "@/types/user";
import authClient from "@/api/auth-client";

// --- Type Definitions for Context ---
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

interface TempAuthData {
  user: User;
  otp: string;
}

// --- Create Context ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Auth Provider Component ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [tempAuth, setTempAuth] = useState<TempAuthData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      // Fetch all users from the mock database
      const response = await authClient.get("/users");
      const users: User[] = response.data;

      // Find the user by email or phone number
      const foundUser = users.find(
        (u) =>
          (u.email === identifier || u.phone_number === identifier) &&
          u.password === password
      );

      if (foundUser && foundUser.otp) {
        toast.success(
          "Login details verified. Please check your email/phone for the OTP."
        );
        // Store user and OTP temporarily for verification step
        setTempAuth({ user: foundUser, otp: foundUser.otp });
        navigate("/verify-otp");
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (otp: string) => {
    setIsLoading(true);
    try {
      if (tempAuth && tempAuth.otp === otp) {
        // OTP is correct, finalize authentication
        const finalUser = tempAuth.user;
        delete finalUser.password; // Remove sensitive data from client state
        delete finalUser.otp;

        setUser(finalUser);
        setIsAuthenticated(true);
        setTempAuth(null); // Clear temporary data
        toast.success(`Welcome back, ${finalUser.username}!`);
        navigate("/"); // Redirect to the dashboard
      } else {
        toast.error("Invalid OTP. Please try again or go back to login.");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      toast.error("An error occurred during OTP verification.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
    toast.info("You have been logged out.");
  };

  const value = {
    user,
    isAuthenticated,
    login,
    verifyOtp,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- Custom Hook to use Auth Context ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
