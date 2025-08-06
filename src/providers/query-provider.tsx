// * - - - Data Fetching Provider (Wraps the entire application)
import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 1000 * 60 * 15,
    },
  },
});

export default function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <div>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </div>
  );
}
