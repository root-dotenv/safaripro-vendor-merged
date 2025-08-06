// import { useState, useMemo, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { format } from "date-fns";
// import { Calendar as CalendarIcon, ListFilterIcon, Eye } from "lucide-react";
// import { LuArrowDownUp, LuTicketPlus } from "react-icons/lu";
// import { type DateRange } from "react-day-picker";
// import {
//   type ColumnDef,
//   useReactTable,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   flexRender,
//   type SortingState,
// } from "@tanstack/react-table";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import hotelClient from "@/api/hotel-client"; // Assuming you have this client configured
// import { cn } from "@/lib/utils"; // Your utility function for classnames
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip"; // Import Tooltip for the experimental button

// // --- Type Definitions ---
// interface Room {
//   room_id: string;
//   room_code: string;
//   room_type_id: string;
//   price_per_night: number;
// }

// interface AvailabilityResponse {
//   rooms: Room[];
// }

// interface RoomTypeDetails {
//   id: string;
//   name: string;
//   max_occupancy: number;
//   image: string;
// }

// // Final data structure for our table rows
// interface EnrichedRoom {
//   roomId: string;
//   roomCode: string;
//   pricePerNight: number;
//   roomTypeName: string;
//   maxOccupancy: number;
//   roomTypeId: string;
// }

// // --- API Fetching Logic ---
// const fetchEnrichedRooms = async (
//   hotelId: string,
//   startDate: string,
//   endDate: string
// ): Promise<EnrichedRoom[]> => {
//   // 1. Fetch all available rooms
//   const availabilityRes = await hotelClient.get<AvailabilityResponse>(
//     `/rooms/availability/range/`,
//     { params: { hotel_id: hotelId, start_date: startDate, end_date: endDate } }
//   );
//   const rooms = availabilityRes.data.rooms;
//   if (!rooms || rooms.length === 0) return [];

//   // 2. Get unique room type IDs
//   const uniqueRoomTypeIds = [
//     ...new Set(rooms.map((room) => room.room_type_id)),
//   ];

//   // 3. Fetch details for each unique room type
//   const detailsPromises = uniqueRoomTypeIds.map((id) =>
//     hotelClient.get<RoomTypeDetails>(`/room-types/${id}/`)
//   );
//   const detailsResponses = await Promise.all(detailsPromises);

//   // 4. Create a map for easy lookup
//   const roomTypeDetailsMap = new Map<string, RoomTypeDetails>();
//   detailsResponses.forEach((res) =>
//     roomTypeDetailsMap.set(res.data.id, res.data)
//   );

//   // 5. Merge data
//   return rooms.map((room) => {
//     const details = roomTypeDetailsMap.get(room.room_type_id);
//     return {
//       roomId: room.room_id,
//       roomCode: room.room_code,
//       pricePerNight: room.price_per_night,
//       roomTypeName: details?.name || "N/A",
//       maxOccupancy: details?.max_occupancy || 0,
//       roomTypeId: room.room_type_id,
//     };
//   });
// };

// // --- Main Component ---
// export default function AvailableRoomsByDate() {
//   const navigate = useNavigate();
//   const [date, setDate] = useState<DateRange | undefined>(undefined);
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [data, setData] = useState<EnrichedRoom[]>([]);

//   const hotelId = import.meta.env.VITE_HOTEL_ID;
//   const startDate = date?.from ? format(date.from, "yyyy-MM-dd") : "";
//   const endDate = date?.to ? format(date.to, "yyyy-MM-dd") : "";

//   const {
//     data: fetchedData,
//     isLoading,
//     isError,
//     error,
//     refetch,
//   } = useQuery({
//     queryKey: ["enrichedAvailableRooms", hotelId, startDate, endDate],
//     queryFn: () => fetchEnrichedRooms(hotelId!, startDate, endDate),
//     enabled: false,
//   });

//   useEffect(() => {
//     if (startDate && endDate && hotelId) {
//       refetch();
//     }
//   }, [startDate, endDate, hotelId, refetch]);

//   useEffect(() => {
//     if (fetchedData) {
//       setData(fetchedData);
//     }
//   }, [fetchedData]);

//   const columns = useMemo<ColumnDef<EnrichedRoom>[]>(
//     () => [
//       { accessorKey: "roomTypeName", header: "Room Type" },
//       { accessorKey: "roomCode", header: "Room Code" },
//       {
//         accessorKey: "pricePerNight",
//         header: "Price/Night",
//         cell: ({ row }) =>
//           new Intl.NumberFormat("en-US", {
//             style: "currency",
//             currency: "USD",
//           }).format(row.getValue("pricePerNight")),
//       },
//       { accessorKey: "maxOccupancy", header: "Max Occupancy" },
//       {
//         id: "availableFrom",
//         header: "Available From",
//         cell: () =>
//           startDate ? format(new Date(startDate), "LLL dd, y") : "N/A",
//       },
//       {
//         id: "availableTo",
//         header: "Available To",
//         cell: () => (endDate ? format(new Date(endDate), "LLL dd, y") : "N/A"),
//       },
//       {
//         id: "actions",
//         header: () => <div className="text-center">Actions</div>,
//         cell: ({ row }) => (
//           <div className="flex items-center justify-center space-x-2">
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => navigate(`/rooms/${row.original.roomId}`)}
//                   >
//                     <Eye size={18} className="text-blue-600" />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>View Room Details</p>
//                 </TooltipContent>
//               </Tooltip>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   {/* The experimental button has no onClick and is disabled */}
//                   <span tabIndex={0}>
//                     <Button variant="outline" size="sm" disabled>
//                       Book Now
//                       <LuTicketPlus size={14} className="ml-2" />
//                     </Button>
//                   </span>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>Booking functionality coming soon!</p>
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//           </div>
//         ),
//       },
//     ],
//     [startDate, endDate, navigate]
//   );

//   const table = useReactTable({
//     data,
//     columns,
//     state: { sorting, globalFilter },
//     onSortingChange: setSorting,
//     onGlobalFilterChange: setGlobalFilter,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     initialState: { pagination: { pageSize: 13 } },
//   });

//   return (
//     <div className="space-y-6 p-4 md:p-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-2xl">
//             Find Available Rooms by Date
//           </CardTitle>
//           <CardDescription>
//             Select your check-in and check-out dates to find rooms.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 id="date"
//                 variant={"outline"}
//                 className={cn(
//                   "w-full max-w-sm justify-start text-left font-normal",
//                   !date && "text-muted-foreground"
//                 )}
//               >
//                 <CalendarIcon className="mr-2 h-4 w-4" />
//                 {date?.from ? (
//                   date.to ? (
//                     <>
//                       {format(date.from, "LLL dd, y")} -{" "}
//                       {format(date.to, "LLL dd, y")}
//                     </>
//                   ) : (
//                     format(date.from, "LLL dd, y")
//                   )
//                 ) : (
//                   <span>Pick a date range</span>
//                 )}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0" align="start">
//               <Calendar
//                 initialFocus
//                 mode="range"
//                 defaultMonth={date?.from}
//                 selected={date}
//                 onSelect={setDate}
//                 numberOfMonths={2}
//                 disabled={(day) =>
//                   day < new Date(new Date().setHours(0, 0, 0, 0))
//                 }
//               />
//             </PopoverContent>
//           </Popover>
//         </CardContent>
//       </Card>

//       {startDate && endDate && (
//         <div className="bg-white rounded-lg p-6 border">
//           <div className="flex items-center justify-between gap-3 mb-4">
//             <div className="relative flex-1">
//               <Input
//                 className="peer w-full max-w-md ps-9"
//                 value={globalFilter}
//                 onChange={(e) => setGlobalFilter(e.target.value)}
//                 placeholder="Filter by room type, code..."
//               />
//               <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
//                 <ListFilterIcon size={16} />
//               </div>
//             </div>
//           </div>

//           <div className="overflow-hidden rounded-md border">
//             <Table>
//               <TableHeader>
//                 {table.getHeaderGroups().map((headerGroup) => (
//                   <TableRow
//                     key={headerGroup.id}
//                     className="hover:bg-transparent"
//                   >
//                     {headerGroup.headers.map((header) => (
//                       <TableHead key={header.id} className="h-11">
//                         {header.isPlaceholder ? null : (
//                           <div
//                             className={cn(
//                               "flex items-center gap-2",
//                               header.column.getCanSort() &&
//                                 "cursor-pointer select-none"
//                             )}
//                             onClick={header.column.getToggleSortingHandler()}
//                           >
//                             {flexRender(
//                               header.column.columnDef.header,
//                               header.getContext()
//                             )}
//                             {header.column.getCanSort() && (
//                               <LuArrowDownUp
//                                 size={14}
//                                 className="text-muted-foreground/70"
//                               />
//                             )}
//                           </div>
//                         )}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody>
//                 {isLoading ? (
//                   <TableRow>
//                     <TableCell
//                       colSpan={columns.length}
//                       className="h-24 text-center"
//                     >
//                       Searching for available rooms...
//                     </TableCell>
//                   </TableRow>
//                 ) : isError ? (
//                   <TableRow>
//                     <TableCell
//                       colSpan={columns.length}
//                       className="h-24 text-center text-destructive"
//                     >
//                       Could not fetch rooms:{" "}
//                       {error instanceof Error
//                         ? error.message
//                         : "An unknown error"}
//                     </TableCell>
//                   </TableRow>
//                 ) : table.getRowModel().rows?.length ? (
//                   table.getRowModel().rows.map((row) => (
//                     <TableRow key={row.id}>
//                       {row.getVisibleCells().map((cell) => (
//                         <TableCell key={cell.id}>
//                           {flexRender(
//                             cell.column.columnDef.cell,
//                             cell.getContext()
//                           )}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell
//                       colSpan={columns.length}
//                       className="h-24 text-center"
//                     >
//                       No rooms available for the selected dates.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>

//           <div className="flex items-center justify-between mt-4">
//             <div className="text-sm text-muted-foreground">
//               Showing {table.getRowModel().rows.length} of {data.length} rooms.
//             </div>
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => table.previousPage()}
//                 disabled={!table.getCanPreviousPage()}
//               >
//                 Previous
//               </Button>
//               <span className="text-sm">
//                 Page {table.getState().pagination.pageIndex + 1} of{" "}
//                 {table.getPageCount()}
//               </span>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => table.nextPage()}
//                 disabled={!table.getCanNextPage()}
//               >
//                 Next
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ListFilterIcon, Eye } from "lucide-react";
import { LuArrowDownUp, LuTicketPlus } from "react-icons/lu";
import { type DateRange } from "react-day-picker";
import {
  type ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import hotelClient from "@/api/hotel-client";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Type definitions (assuming they are correct as provided)
interface Room {
  room_id: string;
  room_code: string;
  room_type_id: string;
  price_per_night: number;
}
interface AvailabilityResponse {
  rooms: Room[];
}
interface RoomTypeDetails {
  id: string;
  name: string;
  max_occupancy: number;
  image: string;
  base_price: string;
}
interface EnrichedRoom {
  roomId: string;
  roomCode: string;
  pricePerNight: number;
  roomTypeName: string;
  maxOccupancy: number;
  roomTypeId: string;
}

// --- API Fetching Logic ---
const fetchEnrichedRooms = async (
  hotelId: string,
  startDate: string,
  endDate: string
): Promise<EnrichedRoom[]> => {
  const availabilityRes = await hotelClient.get<AvailabilityResponse>(
    `/rooms/availability/range/`,
    { params: { hotel_id: hotelId, start_date: startDate, end_date: endDate } }
  );
  const rooms = availabilityRes.data.rooms;
  if (!rooms || rooms.length === 0) return [];

  const uniqueRoomTypeIds = [
    ...new Set(rooms.map((room) => room.room_type_id)),
  ];
  const detailsPromises = uniqueRoomTypeIds.map((id) =>
    hotelClient.get<RoomTypeDetails>(`/room-types/${id}/`)
  );
  const detailsResponses = await Promise.all(detailsPromises);
  const roomTypeDetailsMap = new Map<string, RoomTypeDetails>();
  detailsResponses.forEach((res) =>
    roomTypeDetailsMap.set(res.data.id, res.data)
  );

  return rooms.map((room) => {
    const details = roomTypeDetailsMap.get(room.room_type_id);
    return {
      roomId: room.room_id,
      roomCode: room.room_code,
      pricePerNight: room.price_per_night,
      roomTypeName: details?.name || "N/A",
      maxOccupancy: details?.max_occupancy || 0,
      roomTypeId: room.room_type_id,
    };
  });
};

export default function AvailableRoomsByDate() {
  const navigate = useNavigate();
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [data, setData] = useState<EnrichedRoom[]>([]);

  const hotelId = import.meta.env.VITE_HOTEL_ID;
  const startDate = date?.from ? format(date.from, "yyyy-MM-dd") : "";
  const endDate = date?.to ? format(date.to, "yyyy-MM-dd") : "";

  const {
    data: fetchedData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["enrichedAvailableRooms", hotelId, startDate, endDate],
    queryFn: () => fetchEnrichedRooms(hotelId!, startDate, endDate),
    enabled: false,
  });

  useEffect(() => {
    if (startDate && endDate && hotelId) {
      refetch();
    }
  }, [startDate, endDate, hotelId, refetch]);

  useEffect(() => {
    if (fetchedData) {
      setData(fetchedData);
    }
  }, [fetchedData]);

  const handleBookNow = useCallback(
    (room: EnrichedRoom) => {
      if (!startDate || !endDate || !date?.from || !date?.to) return;

      const totalNights = Math.ceil(
        (date.to.getTime() - date.from.getTime()) / (1000 * 3600 * 24)
      );

      const params = new URLSearchParams();
      params.append("step", "2");
      params.append("startDate", startDate);
      params.append("endDate", endDate);
      params.append("propertyId", room.roomId);
      params.append("propertyItemType", room.roomTypeName);
      params.append(
        "amountRequired",
        (room.pricePerNight * totalNights).toFixed(2)
      );
      params.append("maxOccupancy", room.maxOccupancy.toString());

      // CORRECTED: The path now matches your router configuration.
      navigate(`/bookings/new-booking?${params.toString()}`);
    },
    [startDate, endDate, date, navigate]
  );

  const columns = useMemo<ColumnDef<EnrichedRoom>[]>(
    () => [
      { accessorKey: "roomTypeName", header: "Room Type" },
      { accessorKey: "roomCode", header: "Room Code" },
      {
        accessorKey: "pricePerNight",
        header: "Price/Night",
        cell: ({ row }) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(row.getValue("pricePerNight")),
      },
      { accessorKey: "maxOccupancy", header: "Max Occupancy" },
      {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/rooms/${row.original.roomId}`)}
                  >
                    <Eye size={18} className="text-blue-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Room Details</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBookNow(row.original)}
                  >
                    Book Now
                    <LuTicketPlus size={14} className="ml-2" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create a new booking for this room.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ),
      },
    ],
    [navigate, handleBookNow]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 13 } },
  });

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Find Available Rooms by Date
          </CardTitle>
          <CardDescription>
            Select your check-in and check-out dates to find rooms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full max-w-sm justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    `${format(date.from, "LLL dd, y")} - ${format(
                      date.to,
                      "LLL dd, y"
                    )}`
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                disabled={(day) =>
                  day < new Date(new Date().setHours(0, 0, 0, 0))
                }
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>
      {startDate && endDate && (
        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="relative flex-1">
              <Input
                className="peer w-full max-w-md ps-9"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Filter by room type, code..."
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
                <ListFilterIcon size={16} />
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="h-11">
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn(
                              "flex items-center gap-2",
                              header.column.getCanSort() &&
                                "cursor-pointer select-none"
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <LuArrowDownUp
                                size={14}
                                className="text-muted-foreground/70"
                              />
                            )}
                          </div>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Searching for available rooms...
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-destructive"
                    >
                      Could not fetch rooms:{" "}
                      {error instanceof Error
                        ? error.message
                        : "An unknown error"}
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No rooms available for the selected dates.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {table.getRowModel().rows.length} of {data.length} rooms.
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
