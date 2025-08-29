// // src/providers/hotel-provider.tsx
// import { createContext, useContext, type ReactNode } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { type Hotel } from "../types/hotel-types";
// import hotelClient from "../api/hotel-client";
// import DataLoadingError from "@/pages/error/application-error-page";

// // --- Define the shape of the context's value ---
// interface HotelContextType {
//   hotel: Hotel | null;
//   isLoading: boolean;
//   error: Error | null;
//   isError: boolean;
//   refetch: () => void;
// }

// // - - - Create the Context ---
// const HotelContext = createContext<HotelContextType | undefined>(undefined);

// const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;

// // - - - Create the Provider Component
// export function HotelProvider({ children }: { children: ReactNode }) {
//   const {
//     data: hotel,
//     isLoading,
//     error,
//     isError,
//     refetch,
//   } = useQuery<Hotel, Error>({
//     queryKey: ["hotel", HOTEL_ID],
//     queryFn: async () => {
//       const response = await hotelClient.get(`hotels/${HOTEL_ID}`);
//       return response.data;
//     },
//     enabled: !!HOTEL_ID,
//     staleTime: 1000 * 60 * 30,
//   });

//   // - - - Display a loading state while the initial hotel data is being fetched
//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
//         <p></p>
//       </div>
//     );
//   }

//   // - - - Display an Error if the request fails
//   if (isError) {
//     return (
//       <DataLoadingError
//         error={error}
//         title="Failed to Load Hotel Data"
//         subtitle="We couldn't load your hotel information"
//       />
//     );
//   }

//   // Add the new properties to the context value
//   const value = {
//     hotel: hotel || null,
//     isLoading,
//     error,
//     isError,
//     refetch: refetch as () => void,
//   };

//   return (
//     <HotelContext.Provider value={value}>{children}</HotelContext.Provider>
//   );
// }

// // - - - custom hook for consuming the context
// export function useHotel() {
//   const context = useContext(HotelContext);

//   if (context === undefined) {
//     throw new Error("useHotel must be used within a HotelProvider");
//   }

//   return context;
// }

// src/providers/hotel-provider.tsx
import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Hotel } from "../types/hotel-types";
import hotelClient from "../api/hotel-client";
import DataLoadingError from "@/pages/error/application-error-page";
import { useAuthStore } from "@/store/auth.store";

// Define the shape of the context's value
interface HotelContextType {
  hotel: Hotel | null;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
  refetch: () => void;
}

// Create the Context
const HotelContext = createContext<HotelContextType | undefined>(undefined);

// Create the Provider Component
export function HotelProvider({ children }: { children: ReactNode }) {
  const { hotelId } = useAuthStore(); // Get the dynamic hotelId from the auth store

  const {
    data: hotel,
    isLoading,
    error,
    isError,
    refetch,
  } = useQuery<Hotel, Error>({
    // The queryKey is now dynamic, tied to the hotelId from the store.
    // TanStack Query will automatically refetch when this ID changes.
    queryKey: ["hotel", hotelId],
    queryFn: async () => {
      // Use the dynamic hotelId in the API request URL.
      const response = await hotelClient.get(`hotels/${hotelId}`);
      return response.data;
    },
    // The query will only run if a hotelId exists in the auth store.
    enabled: !!hotelId,
    // Keep the data fresh for 30 minutes before considering it stale.
    staleTime: 1000 * 60 * 30,
  });

  // Display a loading state while the initial hotel data is being fetched
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-700">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p>Loading Your Hotel Dashboard...</p>
      </div>
    );
  }

  // Display an Error if the request fails
  if (isError) {
    return (
      <DataLoadingError
        error={error}
        title="Failed to Load Hotel Data"
        subtitle="We couldn't load your hotel information. Please try refreshing the page."
      />
    );
  }

  // Define the value to be passed down through the context
  const value = {
    hotel: hotel || null,
    isLoading,
    error,
    isError,
    refetch: refetch as () => void,
  };

  return (
    <HotelContext.Provider value={value}>{children}</HotelContext.Provider>
  );
}

// Custom hook for consuming the context
export function useHotel() {
  const context = useContext(HotelContext);

  if (context === undefined) {
    throw new Error("useHotel must be used within a HotelProvider");
  }

  return context;
}
