// * src/main.tsx
// import React from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.tsx";
// import QueryProvider from "./providers/query-provider.tsx";
// import { HotelProvider } from "./providers/hotel-provider.tsx";
// import { ThemeProvider } from "./providers/theme-provider";

// createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <ThemeProvider defaultTheme="system" storageKey="hotel-management-theme">
//       <QueryProvider>
//         <HotelProvider>
//           <App />
//         </HotelProvider>
//       </QueryProvider>
//     </ThemeProvider>
//   </React.StrictMode>
// );

// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";

// Render the RouterProvider at the root of your application
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>
);
