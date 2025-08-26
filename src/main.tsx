// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import "./index.css";
// import { Toaster } from "@/components/ui/toaster";

// Render the RouterProvider at the root of your application
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* <Toaster /> */}
  </React.StrictMode>
);
