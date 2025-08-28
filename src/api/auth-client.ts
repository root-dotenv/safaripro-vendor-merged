// // src/api/auth-client.ts
// import axios from "axios";
// import { useAuthStore } from "@/store/auth.store";

// // Conditionally set the baseURL
// // - In Development: Use the relative path for the Vite proxy.
// // - In Production: Use the absolute path from the environment variable.
// const baseURL = import.meta.env.DEV
//   ? "/sso-api"
//   : import.meta.env.VITE_SSO_BASE_URL;

// const authClient = axios.create({
//   baseURL: baseURL,
//   timeout: 15000,
// });

// // * - - - authClient (Request Interceptor)
// // This interceptor adds the Authorization token to every request
// authClient.interceptors.request.use(
//   (config) => {
//     const token = useAuthStore.getState().token;
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     console.error(`An Error has occurred with the request: ${error.message}`);
//     return Promise.reject(error);
//   }
// );

// // * - - - authClient (Response Interceptor)
// // This handles global 401 (Unauthorized) errors by logging the user out
// authClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       console.error("🚫 Unauthorized request [401]. Logging out.");
//       useAuthStore.getState().logout();
//     }
//     return Promise.reject(error);
//   }
// );

// export default authClient;

// src/api/auth-client.ts
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

// Conditionally set the baseURL
const baseURL = import.meta.env.DEV
  ? "/sso-api"
  : import.meta.env.VITE_SSO_BASE_URL;

const authClient = axios.create({
  baseURL: baseURL,
  timeout: 15000,
});

// Request interceptor remains the same
authClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error(`An Error has occurred with the request: ${error.message}`);
    return Promise.reject(error);
  }
);

// --- UPDATED RESPONSE INTERCEPTOR ---
authClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the error is a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // AND check that the error did NOT come from the login endpoint
      if (error.config.url !== "/v1/auth/login") {
        console.error(
          "🚫 Unauthorized request [401] on a protected route. Logging out."
        );
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);

export default authClient;
