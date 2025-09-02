// "use client";

// import { useState, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import { SearchIcon, BedDouble, UserCheck, History } from "lucide-react";

// // --- Import your API clients ---
// import bookingClient from "@/api/booking-client";
// import hotelClient from "@/api/hotel-client";

// // --- UI Components ---
// import {
//   CommandDialog,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
//   CommandSeparator,
// } from "@/components/ui/command";
// import { Button } from "../ui/button";

// // --- Type definitions for API responses ---
// interface Booking {
//   id: string;
//   full_name: string;
//   code: string;
// }
// interface Room {
//   id: string;
//   code: string;
//   description: string;
// }

// // Combined type for search results
// interface SearchResult {
//   id: string;
//   type: "Booking" | "Room";
//   label: string;
//   description?: string;
//   url: string;
// }

// // --- Debounce Hook (to prevent API calls on every keystroke) ---
// const useDebounce = <T,>(value: T, delay: number): T => {
//   const [debouncedValue, setDebouncedValue] = useState<T>(value);
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);
//     return () => clearTimeout(handler);
//   }, [value, delay]);
//   return debouncedValue;
// };

// export function SearchCommand() {
//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const debouncedQuery = useDebounce(searchQuery, 300);

//   // --- NEW: State for storing recent searches ---
//   const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);

//   const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;

//   // --- React Query to fetch search results dynamically ---
//   const { data: searchResults, isLoading } = useQuery<SearchResult[]>({
//     queryKey: ["globalSearch", debouncedQuery],
//     queryFn: async () => {
//       const [bookingsResponse, roomsResponse] = await Promise.all([
//         bookingClient.get(`/bookings`, {
//           params: {
//             microservice_item_id: HOTEL_ID,
//             search: debouncedQuery,
//             limit: 5,
//           },
//         }),
//         hotelClient.get(`/rooms/`, {
//           params: { hotel_id: HOTEL_ID, search: debouncedQuery, page_size: 5 },
//         }),
//       ]);

//       const bookings = (bookingsResponse.data.results as Booking[]).map(
//         (b) => ({
//           id: b.id,
//           type: "Booking" as const,
//           label: b.full_name,
//           description: `Booking #${b.code}`,
//           url: `/bookings/${b.id}`,
//         })
//       );

//       const rooms = (roomsResponse.data.results as Room[]).map((r) => ({
//         id: r.id,
//         type: "Room" as const,
//         label: r.code,
//         description: r.description,
//         url: `/rooms/${r.id}`,
//       }));

//       return [...bookings, ...rooms];
//     },
//     enabled: debouncedQuery.length > 1,
//   });

//   // --- NEW: Load recent searches from localStorage when dialog opens ---
//   useEffect(() => {
//     if (open) {
//       const storedRecents = localStorage.getItem("recentSearches");
//       if (storedRecents) {
//         try {
//           setRecentSearches(JSON.parse(storedRecents));
//         } catch (e) {
//           console.error(
//             "Failed to parse recent searches from localStorage:",
//             e
//           );
//           setRecentSearches([]);
//         }
//       }
//     }
//   }, [open]);

//   useEffect(() => {
//     const down = (e: KeyboardEvent) => {
//       if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
//         e.preventDefault();
//         setOpen((open) => !open);
//       }
//     };
//     document.addEventListener("keydown", down);
//     return () => document.removeEventListener("keydown", down);
//   }, []);

//   const runCommand = (command: () => unknown) => {
//     setOpen(false);
//     command();
//   };

//   // --- NEW: handleSelect now accepts the full item to save it ---
//   const handleSelect = (item: SearchResult) => {
//     // Add the selected item to recents, avoiding duplicates
//     const updatedRecents = [
//       item,
//       ...recentSearches.filter((r) => r.id !== item.id),
//     ].slice(0, 5); // Keep only the 5 most recent items

//     setRecentSearches(updatedRecents);
//     localStorage.setItem("recentSearches", JSON.stringify(updatedRecents));

//     runCommand(() => navigate(item.url));
//   };

//   return (
//     <>
//       <Button
//         variant="outline"
//         className="relative h-9 w-full justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
//         onClick={() => setOpen(true)}
//       >
//         <SearchIcon className="mr-2 h-4 w-4" />
//         <span className="hidden lg:inline-flex">Search...</span>
//         <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
//           <span className="text-xs">⌘</span>K
//         </kbd>
//       </Button>

//       <CommandDialog open={open} onOpenChange={setOpen}>
//         <CommandInput
//           placeholder="Search for bookings, rooms, guests..."
//           value={searchQuery}
//           onValueChange={setSearchQuery}
//         />
//         <CommandList>
//           <CommandEmpty className={isLoading ? "animate-pulse" : ""}>
//             {isLoading ? "Searching..." : "No results found."}
//           </CommandEmpty>

//           {/* --- NEW: Show recent searches if query is empty --- */}
//           {searchQuery.length < 2 && recentSearches.length > 0 && (
//             <CommandGroup heading="Recent Searches">
//               {recentSearches.map((item) => (
//                 <CommandItem
//                   key={item.id}
//                   value={`${item.label} ${item.description}`}
//                   onSelect={() => handleSelect(item)}
//                 >
//                   <History className="mr-2 h-4 w-4" />
//                   <span>{item.label}</span>
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           )}

//           {/* --- Show live search results if query is active --- */}
//           {searchResults &&
//             searchResults.length > 0 &&
//             searchQuery.length > 1 && (
//               <>
//                 {searchQuery.length > 1 && <CommandSeparator />}
//                 <CommandGroup heading="Bookings">
//                   {searchResults
//                     .filter((item) => item.type === "Booking")
//                     .map((item) => (
//                       <CommandItem
//                         key={item.id}
//                         value={`${item.label} ${item.description}`}
//                         onSelect={() => handleSelect(item)}
//                       >
//                         <UserCheck className="mr-2 h-4 w-4" />
//                         <span>{item.label}</span>
//                       </CommandItem>
//                     ))}
//                 </CommandGroup>

//                 <CommandSeparator />

//                 <CommandGroup heading="Rooms">
//                   {searchResults
//                     .filter((item) => item.type === "Room")
//                     .map((item) => (
//                       <CommandItem
//                         key={item.id}
//                         value={`${item.label} ${item.description}`}
//                         onSelect={() => handleSelect(item)}
//                       >
//                         <BedDouble className="mr-2 h-4 w-4" />
//                         <span>{item.label}</span>
//                       </CommandItem>
//                     ))}
//                 </CommandGroup>
//               </>
//             )}
//         </CommandList>
//       </CommandDialog>
//     </>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { SearchIcon, BedDouble, UserCheck, History } from "lucide-react";

// --- Import your API clients ---
import bookingClient from "@/api/booking-client";
import hotelClient from "@/api/hotel-client";

// --- UI Components ---
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/auth.store"; // ✨ Step 2: Import the Auth Store

// --- Type definitions for API responses ---
interface Booking {
  id: string;
  full_name: string;
  code: string;
}
interface Room {
  id: string;
  code: string;
  description: string;
}

// Combined type for search results
interface SearchResult {
  id: string;
  type: "Booking" | "Room";
  label: string;
  description?: string;
  url: string;
}

// --- Debounce Hook (to prevent API calls on every keystroke) ---
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export function SearchCommand() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);

  // --- NEW: State for storing recent searches ---
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);

  const { hotelId } = useAuthStore(); // ✨ Step 3: Access the Dynamic ID

  // --- React Query to fetch search results dynamically ---
  const { data: searchResults, isLoading } = useQuery<SearchResult[]>({
    queryKey: ["globalSearch", hotelId, debouncedQuery], // ✨ Step 6: Update queryKey
    queryFn: async () => {
      const [bookingsResponse, roomsResponse] = await Promise.all([
        bookingClient.get(`/bookings`, {
          params: {
            microservice_item_id: hotelId, // ✨ Step 5 (Case B): Use correct key
            search: debouncedQuery,
            limit: 5,
          },
        }),
        hotelClient.get(`/rooms/`, {
          params: { hotel_id: hotelId, search: debouncedQuery, page_size: 5 }, // ✨ Step 5 (Case A): Use correct key
        }),
      ]);

      const bookings = (bookingsResponse.data.results as Booking[]).map(
        (b) => ({
          id: b.id,
          type: "Booking" as const,
          label: b.full_name,
          description: `Booking #${b.code}`,
          url: `/bookings/${b.id}`,
        })
      );

      const rooms = (roomsResponse.data.results as Room[]).map((r) => ({
        id: r.id,
        type: "Room" as const,
        label: r.code,
        description: r.description,
        url: `/rooms/${r.id}`,
      }));

      return [...bookings, ...rooms];
    },
    enabled: debouncedQuery.length > 1 && !!hotelId, // ✨ Step 6: Update enabled check
  });

  // --- NEW: Load recent searches from localStorage when dialog opens ---
  useEffect(() => {
    if (open) {
      const storedRecents = localStorage.getItem("recentSearches");
      if (storedRecents) {
        try {
          setRecentSearches(JSON.parse(storedRecents));
        } catch (e) {
          console.error(
            "Failed to parse recent searches from localStorage:",
            e
          );
          setRecentSearches([]);
        }
      }
    }
  }, [open]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => unknown) => {
    setOpen(false);
    command();
  };

  // --- NEW: handleSelect now accepts the full item to save it ---
  const handleSelect = (item: SearchResult) => {
    // Add the selected item to recents, avoiding duplicates
    const updatedRecents = [
      item,
      ...recentSearches.filter((r) => r.id !== item.id),
    ].slice(0, 5); // Keep only the 5 most recent items

    setRecentSearches(updatedRecents);
    localStorage.setItem("recentSearches", JSON.stringify(updatedRecents));

    runCommand(() => navigate(item.url));
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search for bookings, rooms, guests..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty className={isLoading ? "animate-pulse" : ""}>
            {isLoading ? "Searching..." : "No results found."}
          </CommandEmpty>

          {/* --- NEW: Show recent searches if query is empty --- */}
          {searchQuery.length < 2 && recentSearches.length > 0 && (
            <CommandGroup heading="Recent Searches">
              {recentSearches.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`${item.label} ${item.description}`}
                  onSelect={() => handleSelect(item)}
                >
                  <History className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* --- Show live search results if query is active --- */}
          {searchResults &&
            searchResults.length > 0 &&
            searchQuery.length > 1 && (
              <>
                {searchQuery.length > 1 && <CommandSeparator />}
                <CommandGroup heading="Bookings">
                  {searchResults
                    .filter((item) => item.type === "Booking")
                    .map((item) => (
                      <CommandItem
                        key={item.id}
                        value={`${item.label} ${item.description}`}
                        onSelect={() => handleSelect(item)}
                      >
                        <UserCheck className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                      </CommandItem>
                    ))}
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Rooms">
                  {searchResults
                    .filter((item) => item.type === "Room")
                    .map((item) => (
                      <CommandItem
                        key={item.id}
                        value={`${item.label} ${item.description}`}
                        onSelect={() => handleSelect(item)}
                      >
                        <BedDouble className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              </>
            )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
