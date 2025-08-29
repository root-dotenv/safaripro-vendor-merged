import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./providers/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // <-- IMPORT THE NECESSARY PARTS
import "./index.css";

// --- NEW: Create a client instance ---
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* --- NEW: Wrap the entire app in the provider --- */}
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
