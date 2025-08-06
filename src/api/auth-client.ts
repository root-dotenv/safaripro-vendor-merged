// src/api/auth-client.ts
// * - - - Axios Client (Request and Response) Configuration
import axios from "axios";

const authClient = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// * - - - authClient (Request Interceptor)
authClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log(`An Error has occurred: ${error.message}`);
    return Promise.reject(error);
  }
);

// * - - - authClient (Response Interceptor)
authClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log(`401 An Error has occured: authClient`, error.message);
      console.log("Unauthorized request. Redirecting to login...");
    }
    return Promise.reject(error);
  }
);

export default authClient;
