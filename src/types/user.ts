/**
 * Defines the structure for a user object in the application.
 */
export interface User {
  id: number;
  username: string;
  phone_number: string;
  email: string;
  theme: "light" | "dark" | "system";
  password?: string;
  otp?: string;
}
