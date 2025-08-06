// - - - src/api/hotel-client.ts
// * Axios Client (Request and Response) Configuration
import axios from "axios";

const hotelClient = axios.create({
  baseURL: import.meta.env.VITE_HOTEL_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// * hotelClient (Request Interceptor)
hotelClient.interceptors.request.use(
  (config) => {
    console.log(`- - - Request Log: hotelClient`, config);
    return config;
  },
  (error) => {
    console.log(`An Error has occurred: ${error.message}`);
    return Promise.reject(error);
  }
);

// * hotelClient (Response Interceptor)
hotelClient.interceptors.response.use(
  (response) => {
    console.log(`- - - Response Log: hotelClient`, response);
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      console.log(`401 An Error has occured: hotelClient`, error.message);
      console.log("Unauthorized request. Redirecting to login...");
    }
    return Promise.reject(error);
  }
);

export default hotelClient;
