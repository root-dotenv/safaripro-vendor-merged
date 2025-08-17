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
//   if (error) {
//     return (
//       <DataLoadingError
//         error={error}
//         title="Failed to Load Hotel Data"
//         subtitle="We couldn't load your hotel information"
//       />
//     );
//   }

//   const value = { hotel: hotel || null, isLoading, error };

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

// --- Define the shape of the context's value ---
interface HotelContextType {
  hotel: Hotel | null;
  isLoading: boolean;
  error: Error | null;
  isError: boolean; // Added isError
  refetch: () => void; // Added refetch
}

// - - - Create the Context ---
const HotelContext = createContext<HotelContextType | undefined>(undefined);

const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;

// - - - Create the Provider Component
export function HotelProvider({ children }: { children: ReactNode }) {
  const {
    data: hotel,
    isLoading,
    error,
    isError,
    refetch,
  } = useQuery<Hotel, Error>({
    queryKey: ["hotel", HOTEL_ID],
    queryFn: async () => {
      const response = await hotelClient.get(`hotels/${HOTEL_ID}`);
      return response.data;
    },
    enabled: !!HOTEL_ID,
    staleTime: 1000 * 60 * 30,
  });

  // - - - Display a loading state while the initial hotel data is being fetched
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p></p>
      </div>
    );
  }

  // - - - Display an Error if the request fails
  if (isError) {
    return (
      <DataLoadingError
        error={error}
        title="Failed to Load Hotel Data"
        subtitle="We couldn't load your hotel information"
      />
    );
  }

  // Add the new properties to the context value
  const value = {
    hotel: hotel || null,
    isLoading,
    error,
    isError,
    refetch: refetch as () => void, // Cast to ensure type correctness
  };

  return (
    <HotelContext.Provider value={value}>{children}</HotelContext.Provider>
  );
}

// - - - custom hook for consuming the context
export function useHotel() {
  const context = useContext(HotelContext);

  if (context === undefined) {
    throw new Error("useHotel must be used within a HotelProvider");
  }

  return context;
}
