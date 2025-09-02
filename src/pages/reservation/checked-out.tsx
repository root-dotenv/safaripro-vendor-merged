// "use client";
// import {
//   useState,
//   useMemo,
//   useEffect,
//   useCallback,
//   useId,
//   useRef,
// } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import Papa from "papaparse";
// import {
//   type ColumnDef,
//   type ColumnFiltersState,
//   type SortingState,
//   type PaginationState,
//   flexRender,
//   getCoreRowModel,
//   getSortedRowModel,
//   useReactTable,
//   getFilteredRowModel,
//   getPaginationRowModel,
// } from "@tanstack/react-table";
// import { format } from "date-fns";
// import { toast } from "sonner";
// import {
//   Plus,
//   Eye,
//   Trash2,
//   Loader2,
//   Search,
//   CircleXIcon,
//   RefreshCw,
//   Loader,
//   ChevronUpIcon,
//   ChevronDownIcon,
//   EllipsisIcon,
//   FilterIcon,
//   Columns3Icon,
//   ChevronFirstIcon,
//   ChevronLastIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   Users,
// } from "lucide-react";
// import { TbFileTypeCsv } from "react-icons/tb";

// import bookingClient from "@/api/booking-client";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
// } from "@/components/ui/pagination";
// import { cn } from "@/lib/utils";
// import ErrorPage from "@/components/custom/error-page";

// // --- Type Definitions ---
// interface Booking {
//   id: string;
//   full_name: string;
//   code: string;
//   start_date: string;
//   end_date: string;
//   checkout: string | null;
//   booking_type: "Physical" | "Online";
// }

// interface PaginatedBookingsResponse {
//   count: number;
//   results: Booking[];
// }

// const useDebounce = <T,>(value: T, delay: number): T => {
//   const [debouncedValue, setDebouncedValue] = useState<T>(value);
//   useEffect(() => {
//     const handler = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(handler);
//   }, [value, delay]);
//   return debouncedValue;
// };

// const getBookingTypeBadgeClasses = (type: string): string =>
//   type === "Physical"
//     ? "bg-blue-100 text-blue-800 border-blue-200"
//     : "bg-yellow-100 text-yellow-800 border-yellow-200";

// // --- Main Component ---
// export default function CheckedOutGuests() {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;
//   const BOOKINGS_PER_PAGE = 10;
//   const id = useId();
//   const inputRef = useRef<HTMLInputElement>(null);

//   // --- State (Aligned with AllBookings component) ---
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [pagination, setPagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: BOOKINGS_PER_PAGE,
//   });
//   const debouncedGlobalFilter = useDebounce(globalFilter, 300);
//   const [isExporting, setIsExporting] = useState(false);

//   // --- Data Query (Refactored for Server-Side Filtering) ---
//   const {
//     data: paginatedResponse,
//     isLoading: isTableLoading,
//     isError,
//     error,
//     refetch,
//     isRefetching,
//   } = useQuery<PaginatedBookingsResponse>({
//     queryKey: [
//       "checkedOutGuests",
//       pagination,
//       debouncedGlobalFilter,
//       sorting,
//       columnFilters,
//     ],
//     queryFn: async () => {
//       const params = new URLSearchParams({
//         microservice_item_id: HOTEL_ID!,
//         limit: String(pagination.pageSize),
//         offset: String(pagination.pageIndex * pagination.pageSize),
//         booking_status: "Checked Out", // EFFICIENT: Filtering is now done on the server
//       });
//       if (debouncedGlobalFilter) params.append("search", debouncedGlobalFilter);
//       if (sorting.length > 0) {
//         params.append(
//           "ordering",
//           `${sorting[0].desc ? "-" : ""}${sorting[0].id}`
//         );
//       }
//       columnFilters.forEach((filter) => {
//         if (Array.isArray(filter.value)) {
//           filter.value.forEach((value) =>
//             params.append(filter.id, value as string)
//           );
//         }
//       });
//       const response = await bookingClient.get(`/bookings`, { params });
//       return response.data;
//     },
//     keepPreviousData: true,
//     enabled: !!HOTEL_ID,
//   });

//   const deleteBookingMutation = useMutation({
//     mutationFn: (bookingId: string) =>
//       bookingClient.delete(`/bookings/${bookingId}`),
//     onSuccess: () => {
//       toast.success("Booking deleted successfully!");
//       queryClient.invalidateQueries({ queryKey: ["checkedOutGuests"] });
//     },
//     onError: (error: any) =>
//       toast.error(
//         `Failed to delete booking: ${
//           error.response?.data?.detail || error.message
//         }`
//       ),
//   });

//   const guests = paginatedResponse?.results ?? [];
//   const totalCount = paginatedResponse?.count ?? 0;
//   const totalPages = Math.ceil(totalCount / pagination.pageSize);

//   const handleExport = useCallback(async () => {
//     setIsExporting(true);
//     toast.info("Preparing CSV export...");
//     try {
//       const { data } = await bookingClient.get(`/bookings`, {
//         params: {
//           microservice_item_id: HOTEL_ID!,
//           booking_status: "Checked Out",
//           limit: totalCount || BOOKINGS_PER_PAGE,
//         },
//       });
//       if (!data.results || data.results.length === 0) {
//         toast.warning("No guests to export.");
//         return;
//       }
//       const csv = Papa.unparse(
//         data.results.map((b) => ({
//           "Booking Code": b.code,
//           "Guest Name": b.full_name,
//           "Check-in Date": format(new Date(b.start_date), "PP"),
//           "Check-out Date": format(new Date(b.end_date), "PP"),
//         }))
//       );
//       const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = `checked-out-guests-${format(
//         new Date(),
//         "yyyy-MM-dd"
//       )}.csv`;
//       link.click();
//       URL.revokeObjectURL(link.href);
//       toast.success("Export successful!");
//     } catch (err) {
//       toast.error("Failed to export data.");
//     } finally {
//       setIsExporting(false);
//     }
//   }, [HOTEL_ID, totalCount]);

//   const columns = useMemo<ColumnDef<Booking>[]>(
//     () => [
//       {
//         id: "select",
//         header: ({ table }) => (
//           <Checkbox
//             checked={
//               table.getIsAllPageRowsSelected() ||
//               (table.getIsSomePageRowsSelected() && "indeterminate")
//             }
//             onCheckedChange={(value) =>
//               table.toggleAllPageRowsSelected(!!value)
//             }
//             aria-label="Select all"
//             className="border-[#DADCE0] border-[1.5px] data-[state=checked]:bg-[#0081FB] data-[state=checked]:text-[#FFF]"
//           />
//         ),
//         cell: ({ row }) => (
//           <Checkbox
//             checked={row.getIsSelected()}
//             onCheckedChange={(value) => row.toggleSelected(!!value)}
//             aria-label="Select row"
//             className="border-[#DADCE0] border-[1.5px] data-[state=checked]:bg-[#0081FB] data-[state=checked]:text-[#FFF]"
//           />
//         ),
//         enableSorting: false,
//         enableHiding: false,
//         size: 28,
//       },
//       {
//         accessorKey: "full_name",
//         header: ({ column }) => (
//           <div
//             className="flex h-full cursor-pointer items-center justify-between gap-2 select-none"
//             onClick={column.getToggleSortingHandler()}
//           >
//             Guest{" "}
//             {{
//               asc: <ChevronUpIcon size={16} />,
//               desc: <ChevronDownIcon size={16} />,
//             }[column.getIsSorted() as string] ?? null}
//           </div>
//         ),
//         cell: ({ row }) => (
//           <div className="font-medium">{row.original.full_name}</div>
//         ),
//         size: 180,
//       },
//       {
//         accessorKey: "start_date",
//         header: "Check-in Date",
//         cell: ({ row }) => (
//           <div>{format(new Date(row.original.start_date), "PP")}</div>
//         ),
//         size: 150,
//       },
//       {
//         accessorKey: "end_date",
//         header: "Check-out Date",
//         cell: ({ row }) => (
//           <div>{format(new Date(row.original.end_date), "PP")}</div>
//         ),
//         size: 150,
//       },
//       {
//         accessorKey: "booking_type",
//         header: "Booking Type",
//         cell: ({ row }) => (
//           <Badge
//             className={cn(
//               getBookingTypeBadgeClasses(row.original.booking_type)
//             )}
//           >
//             {row.original.booking_type}
//           </Badge>
//         ),
//         size: 120,
//         enableColumnFilter: true,
//       },
//       {
//         id: "actions",
//         cell: ({ row }) => (
//           <RowActions row={row} deleteBookingMutation={deleteBookingMutation} />
//         ),
//         size: 60,
//         enableHiding: false,
//       },
//     ],
//     [deleteBookingMutation]
//   );

//   const table = useReactTable({
//     data: guests,
//     columns,
//     state: { sorting, columnFilters, pagination },
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onPaginationChange: setPagination,
//     manualPagination: true,
//     manualSorting: true,
//     manualFiltering: true,
//     pageCount: totalPages,
//   });

//   const handleDeleteRows = () => {
//     table
//       .getSelectedRowModel()
//       .rows.forEach((row) => deleteBookingMutation.mutate(row.original.id));
//     table.resetRowSelection();
//   };

//   if (isError) return <ErrorPage error={error as Error} onRetry={refetch} />;

//   return (
//     <div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
//       <div className="flex items-center justify-between space-y-2">
//         <h2 className="text-3xl font-bold tracking-tight">
//           Checked-Out Guests
//         </h2>
//         <div className="flex items-center space-x-2">
//           <Button
//             className="gap-1 bg-[#0EB981] text-[#FFF] border-none hover:bg-[#04966A] hover:text-[#FFF] cursor-pointer shadow"
//             variant="outline"
//             onClick={handleExport}
//             disabled={isExporting}
//           >
//             {isExporting ? (
//               <Loader2 className="mr-1 h-4 w-4 animate-spin" />
//             ) : (
//               <TbFileTypeCsv className="mr-2 h-4 w-4" />
//             )}
//             {isExporting ? "Exporting..." : "Export"}
//           </Button>
//           <Button
//             className="bg-[#0081FB] hover:bg-blue-700 cursor-pointer"
//             onClick={() => navigate("/bookings/new-booking")}
//           >
//             <Plus className="mr-1 h-4 w-4" /> New Booking
//           </Button>
//         </div>
//       </div>
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Total Checked Out
//             </CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {isTableLoading ? (
//                 <Loader2 className="h-6 w-6 animate-spin" />
//               ) : (
//                 totalCount
//               )}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               Guests who have completed their stay
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//       <Card className="p-0 mt-6 border-none bg-none shadow-none">
//         <CardHeader>
//           <CardTitle>Guests List</CardTitle>
//           <CardDescription>
//             A historical list of all guests who have completed their stay.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-wrap items-center justify-between gap-3">
//             <div className="flex items-center gap-3">
//               <div className="relative">
//                 <Input
//                   ref={inputRef}
//                   className="peer min-w-60 ps-9"
//                   value={globalFilter}
//                   onChange={(e) => setGlobalFilter(e.target.value)}
//                   placeholder="Search by guest, code, email..."
//                 />
//                 <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
//                   <Search size={16} />
//                 </div>
//                 {globalFilter && (
//                   <button
//                     className="text-muted-foreground/80 hover:text-foreground absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center"
//                     onClick={() => {
//                       setGlobalFilter("");
//                       inputRef.current?.focus();
//                     }}
//                   >
//                     <CircleXIcon size={16} />
//                   </button>
//                 )}
//               </div>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button variant="outline">
//                     <FilterIcon className="-ms-1 opacity-60" size={16} />
//                     Booking Type
//                     {(
//                       table
//                         .getColumn("booking_type")
//                         ?.getFilterValue() as string[]
//                     )?.length > 0 && (
//                       <span className="bg-background text-muted-foreground/70 -me-1 ml-2 inline-flex h-5 items-center rounded border px-1 text-[0.625rem] font-medium">
//                         {
//                           (
//                             table
//                               .getColumn("booking_type")
//                               ?.getFilterValue() as string[]
//                           )?.length
//                         }
//                       </span>
//                     )}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto min-w-36 p-3" align="start">
//                   <div className="space-y-3">
//                     <div className="text-muted-foreground text-xs font-medium">
//                       Filter by Type
//                     </div>
//                     <div className="space-y-3">
//                       {["Physical", "Online"].map((value, i) => (
//                         <div key={value} className="flex items-center gap-2">
//                           <Checkbox
//                             id={`${id}-type-${i}`}
//                             checked={(
//                               (table
//                                 .getColumn("booking_type")
//                                 ?.getFilterValue() as string[]) ?? []
//                             ).includes(value)}
//                             onCheckedChange={(checked: boolean) => {
//                               const old =
//                                 (table
//                                   .getColumn("booking_type")
//                                   ?.getFilterValue() as string[]) ?? [];
//                               const newFilter = checked
//                                 ? [...old, value]
//                                 : old.filter((v) => v !== value);
//                               table
//                                 .getColumn("booking_type")
//                                 ?.setFilterValue(
//                                   newFilter.length ? newFilter : undefined
//                                 );
//                             }}
//                             className="border-[#DADCE0] border-[1.5px] data-[state=checked]:bg-[#0081FB] data-[state=checked]:text-[#FFF]"
//                           />
//                           <Label
//                             htmlFor={`${id}-type-${i}`}
//                             className="font-normal"
//                           >
//                             {value}
//                           </Label>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </PopoverContent>
//               </Popover>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline">
//                     <Columns3Icon className="-ms-1 opacity-60" size={16} />
//                     View
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
//                   {table
//                     .getAllColumns()
//                     .filter((c) => c.getCanHide())
//                     .map((c) => (
//                       <DropdownMenuCheckboxItem
//                         key={c.id}
//                         className="capitalize"
//                         checked={c.getIsVisible()}
//                         onCheckedChange={(v) => c.toggleVisibility(!!v)}
//                         onSelect={(e) => e.preventDefault()}
//                       >
//                         {c.id.replace(/_/g, " ")}
//                       </DropdownMenuCheckboxItem>
//                     ))}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//             <div className="flex items-center gap-3">
//               {table.getSelectedRowModel().rows.length > 0 && (
//                 <AlertDialog>
//                   <AlertDialogTrigger asChild>
//                     <Button variant="outline">
//                       <Trash2 className="-ms-1 opacity-60" size={16} />
//                       Delete
//                       <span className="bg-[#f54943] text-white -me-1 inline-flex h-5 max-h-full items-center rounded border-none px-1 font-[inherit] text-[0.625rem] font-medium">
//                         {table.getSelectedRowModel().rows.length}
//                       </span>
//                     </Button>
//                   </AlertDialogTrigger>
//                   <AlertDialogContent>
//                     <AlertDialogHeader>
//                       <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                       <AlertDialogDescription>
//                         This will permanently delete{" "}
//                         {table.getSelectedRowModel().rows.length} selected
//                         booking(s). This action cannot be undone.
//                       </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                       <AlertDialogCancel>Cancel</AlertDialogCancel>
//                       <AlertDialogAction onClick={handleDeleteRows}>
//                         Delete
//                       </AlertDialogAction>
//                     </AlertDialogFooter>
//                   </AlertDialogContent>
//                 </AlertDialog>
//               )}
//               <Button
//                 className="cursor-pointer"
//                 variant="outline"
//                 onClick={() => refetch()}
//                 disabled={isRefetching || isTableLoading}
//               >
//                 <RefreshCw
//                   className={cn("mr-1 h-4 w-4", isRefetching && "animate-spin")}
//                 />
//                 Refresh
//               </Button>
//             </div>
//           </div>
//           <div className="bg-background overflow-hidden rounded-md border mt-4">
//             <Table>
//               <TableHeader>
//                 {table.getHeaderGroups().map((hg) => (
//                   <TableRow key={hg.id} className="hover:bg-transparent">
//                     {hg.headers.map((h) => (
//                       <TableHead
//                         key={h.id}
//                         style={{
//                           width:
//                             h.getSize() !== 150
//                               ? `${h.getSize()}px`
//                               : undefined,
//                         }}
//                         className="h-11"
//                       >
//                         {flexRender(h.column.columnDef.header, h.getContext())}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody>
//                 {isTableLoading ? (
//                   <TableRow>
//                     <TableCell
//                       colSpan={columns.length}
//                       className="h-24 text-center"
//                     >
//                       <Loader className="animate-spin" />
//                     </TableCell>
//                   </TableRow>
//                 ) : table.getRowModel().rows?.length ? (
//                   table.getRowModel().rows.map((row) => (
//                     <TableRow
//                       key={row.id}
//                       data-state={row.getIsSelected() && "selected"}
//                     >
//                       {row.getVisibleCells().map((cell) => (
//                         <TableCell key={cell.id} className="p-2.5 last:py-0">
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
//                       No checked-out guests found.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//           <div className="flex items-center justify-between gap-8 mt-4 w-full">
//             <div className="w-full text-muted-foreground flex grow justify-start text-sm">
//               {" "}
//               <p>
//                 Page{" "}
//                 <span className="font-medium text-foreground">
//                   {table.getState().pagination.pageIndex + 1} of{" "}
//                   {table.getPageCount()}
//                 </span>
//               </p>
//             </div>
//             <Pagination className="w-full justify-end">
//               <PaginationContent>
//                 <PaginationItem>
//                   <Button
//                     size="icon"
//                     variant="outline"
//                     onClick={() => table.firstPage()}
//                     disabled={!table.getCanPreviousPage()}
//                   >
//                     <ChevronFirstIcon size={16} />
//                   </Button>
//                 </PaginationItem>
//                 <PaginationItem>
//                   <Button
//                     size="icon"
//                     variant="outline"
//                     onClick={() => table.previousPage()}
//                     disabled={!table.getCanPreviousPage()}
//                   >
//                     <ChevronLeftIcon size={16} />
//                   </Button>
//                 </PaginationItem>
//                 <PaginationItem>
//                   <Button
//                     size="icon"
//                     variant="outline"
//                     onClick={() => table.nextPage()}
//                     disabled={!table.getCanNextPage()}
//                   >
//                     <ChevronRightIcon size={16} />
//                   </Button>
//                 </PaginationItem>
//                 <PaginationItem>
//                   <Button
//                     size="icon"
//                     variant="outline"
//                     onClick={() => table.lastPage()}
//                     disabled={!table.getCanNextPage()}
//                   >
//                     <ChevronLastIcon size={16} />
//                   </Button>
//                 </PaginationItem>
//               </PaginationContent>
//             </Pagination>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// function RowActions({
//   row,
//   deleteBookingMutation,
// }: {
//   row: any;
//   deleteBookingMutation: any;
// }) {
//   const navigate = useNavigate();
//   const booking = row.original;
//   return (
//     <div className="flex justify-end">
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button size="icon" variant="ghost" className="shadow-none">
//             <EllipsisIcon size={16} />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           <DropdownMenuGroup>
//             <DropdownMenuItem
//               onClick={() => navigate(`/bookings/${booking.id}`)}
//             >
//               <Eye className="mr-2 h-4 w-4" />
//               View Details
//             </DropdownMenuItem>
//           </DropdownMenuGroup>
//           <DropdownMenuSeparator />
//           <AlertDialog>
//             <AlertDialogTrigger asChild>
//               <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive">
//                 <Trash2 className="mr-2 h-4 w-4" />
//                 <span>Delete</span>
//               </div>
//             </AlertDialogTrigger>
//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                 <AlertDialogDescription>
//                   This will permanently delete the booking for{" "}
//                   <span className="font-semibold">{booking.full_name}</span>.
//                 </AlertDialogDescription>
//               </AlertDialogHeader>
//               <AlertDialogFooter>
//                 <AlertDialogCancel>Cancel</AlertDialogCancel>
//                 <AlertDialogAction
//                   onClick={() => deleteBookingMutation.mutate(booking.id)}
//                 >
//                   Delete
//                 </AlertDialogAction>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// }

"use client";
import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useId,
  useRef,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Plus,
  Eye,
  Trash2,
  Loader2,
  Search,
  CircleXIcon,
  RefreshCw,
  Loader,
  ChevronUpIcon,
  ChevronDownIcon,
  EllipsisIcon,
  FilterIcon,
  Columns3Icon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Users,
} from "lucide-react";
import { TbFileTypeCsv } from "react-icons/tb";

import bookingClient from "@/api/booking-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import ErrorPage from "@/components/custom/error-page";
import { useAuthStore } from "@/store/auth.store"; // ✨ Step 2: Import the Auth Store

// --- Type Definitions ---
interface Booking {
  id: string;
  full_name: string;
  code: string;
  start_date: string;
  end_date: string;
  checkout: string | null;
  booking_type: "Physical" | "Online";
}

interface PaginatedBookingsResponse {
  count: number;
  results: Booking[];
}

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const getBookingTypeBadgeClasses = (type: string): string =>
  type === "Physical"
    ? "bg-blue-100 text-blue-800 border-blue-200"
    : "bg-yellow-100 text-yellow-800 border-yellow-200";

// --- Main Component ---
export default function CheckedOutGuests() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { hotelId } = useAuthStore(); // ✨ Step 3: Access the Dynamic ID
  const BOOKINGS_PER_PAGE = 10;
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  // --- State (Aligned with AllBookings component) ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: BOOKINGS_PER_PAGE,
  });
  const debouncedGlobalFilter = useDebounce(globalFilter, 300);
  const [isExporting, setIsExporting] = useState(false);

  // --- Data Query (Refactored for Server-Side Filtering) ---
  const {
    data: paginatedResponse,
    isLoading: isTableLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<PaginatedBookingsResponse>({
    queryKey: [
      // ✨ Step 6: Update queryKey
      "checkedOutGuests",
      hotelId,
      pagination,
      debouncedGlobalFilter,
      sorting,
      columnFilters,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        microservice_item_id: hotelId!, // ✨ Step 5 (Case B): Use correct key
        limit: String(pagination.pageSize),
        offset: String(pagination.pageIndex * pagination.pageSize),
        booking_status: "Checked Out", // EFFICIENT: Filtering is now done on the server
      });
      if (debouncedGlobalFilter) params.append("search", debouncedGlobalFilter);
      if (sorting.length > 0) {
        params.append(
          "ordering",
          `${sorting[0].desc ? "-" : ""}${sorting[0].id}`
        );
      }
      columnFilters.forEach((filter) => {
        if (Array.isArray(filter.value)) {
          filter.value.forEach((value) =>
            params.append(filter.id, value as string)
          );
        }
      });
      const response = await bookingClient.get(`/bookings`, { params });
      return response.data;
    },
    keepPreviousData: true,
    enabled: !!hotelId, // ✨ Step 6: Update enabled check
  });

  const deleteBookingMutation = useMutation({
    mutationFn: (bookingId: string) =>
      bookingClient.delete(`/bookings/${bookingId}`),
    onSuccess: () => {
      toast.success("Booking deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["checkedOutGuests"] });
    },
    onError: (error: any) =>
      toast.error(
        `Failed to delete booking: ${
          error.response?.data?.detail || error.message
        }`
      ),
  });

  const guests = paginatedResponse?.results ?? [];
  const totalCount = paginatedResponse?.count ?? 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    toast.info("Preparing CSV export...");
    try {
      const { data } = await bookingClient.get(`/bookings`, {
        params: {
          microservice_item_id: hotelId!, // ✨ Step 5 (Case B): Use correct key
          booking_status: "Checked Out",
          limit: totalCount || BOOKINGS_PER_PAGE,
        },
      });
      if (!data.results || data.results.length === 0) {
        toast.warning("No guests to export.");
        return;
      }
      const csv = Papa.unparse(
        data.results.map((b) => ({
          "Booking Code": b.code,
          "Guest Name": b.full_name,
          "Check-in Date": format(new Date(b.start_date), "PP"),
          "Check-out Date": format(new Date(b.end_date), "PP"),
        }))
      );
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `checked-out-guests-${format(
        new Date(),
        "yyyy-MM-dd"
      )}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
      toast.success("Export successful!");
    } catch (err) {
      toast.error("Failed to export data.");
    } finally {
      setIsExporting(false);
    }
  }, [hotelId, totalCount]); // ✨ Step 6: Update dependencies

  const columns = useMemo<ColumnDef<Booking>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="border-[#DADCE0] border-[1.5px] data-[state=checked]:bg-[#0081FB] data-[state=checked]:text-[#FFF]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="border-[#DADCE0] border-[1.5px] data-[state=checked]:bg-[#0081FB] data-[state=checked]:text-[#FFF]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 28,
      },
      {
        accessorKey: "full_name",
        header: ({ column }) => (
          <div
            className="flex h-full cursor-pointer items-center justify-between gap-2 select-none"
            onClick={column.getToggleSortingHandler()}
          >
            Guest{" "}
            {{
              asc: <ChevronUpIcon size={16} />,
              desc: <ChevronDownIcon size={16} />,
            }[column.getIsSorted() as string] ?? null}
          </div>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.original.full_name}</div>
        ),
        size: 180,
      },
      {
        accessorKey: "start_date",
        header: "Check-in Date",
        cell: ({ row }) => (
          <div>{format(new Date(row.original.start_date), "PP")}</div>
        ),
        size: 150,
      },
      {
        accessorKey: "end_date",
        header: "Check-out Date",
        cell: ({ row }) => (
          <div>{format(new Date(row.original.end_date), "PP")}</div>
        ),
        size: 150,
      },
      {
        accessorKey: "booking_type",
        header: "Booking Type",
        cell: ({ row }) => (
          <Badge
            className={cn(
              getBookingTypeBadgeClasses(row.original.booking_type)
            )}
          >
            {row.original.booking_type}
          </Badge>
        ),
        size: 120,
        enableColumnFilter: true,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <RowActions row={row} deleteBookingMutation={deleteBookingMutation} />
        ),
        size: 60,
        enableHiding: false,
      },
    ],
    [deleteBookingMutation]
  );

  const table = useReactTable({
    data: guests,
    columns,
    state: { sorting, columnFilters, pagination },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: totalPages,
  });

  const handleDeleteRows = () => {
    table
      .getSelectedRowModel()
      .rows.forEach((row) => deleteBookingMutation.mutate(row.original.id));
    table.resetRowSelection();
  };

  if (isError) return <ErrorPage error={error as Error} onRetry={refetch} />;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Checked-Out Guests
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            className="gap-1 bg-[#0EB981] text-[#FFF] border-none hover:bg-[#04966A] hover:text-[#FFF] cursor-pointer shadow"
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <TbFileTypeCsv className="mr-2 h-4 w-4" />
            )}
            {isExporting ? "Exporting..." : "Export"}
          </Button>
          <Button
            className="bg-[#0081FB] hover:bg-blue-700 cursor-pointer"
            onClick={() => navigate("/bookings/new-booking")}
          >
            <Plus className="mr-1 h-4 w-4" /> New Booking
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Checked Out
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isTableLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                totalCount
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Guests who have completed their stay
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="p-0 mt-6 border-none bg-none shadow-none">
        <CardHeader>
          <CardTitle>Guests List</CardTitle>
          <CardDescription>
            A historical list of all guests who have completed their stay.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Input
                  ref={inputRef}
                  className="peer min-w-60 ps-9"
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search by guest, code, email..."
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
                  <Search size={16} />
                </div>
                {globalFilter && (
                  <button
                    className="text-muted-foreground/80 hover:text-foreground absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center"
                    onClick={() => {
                      setGlobalFilter("");
                      inputRef.current?.focus();
                    }}
                  >
                    <CircleXIcon size={16} />
                  </button>
                )}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <FilterIcon className="-ms-1 opacity-60" size={16} />
                    Booking Type
                    {(
                      table
                        .getColumn("booking_type")
                        ?.getFilterValue() as string[]
                    )?.length > 0 && (
                      <span className="bg-background text-muted-foreground/70 -me-1 ml-2 inline-flex h-5 items-center rounded border px-1 text-[0.625rem] font-medium">
                        {
                          (
                            table
                              .getColumn("booking_type")
                              ?.getFilterValue() as string[]
                          )?.length
                        }
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto min-w-36 p-3" align="start">
                  <div className="space-y-3">
                    <div className="text-muted-foreground text-xs font-medium">
                      Filter by Type
                    </div>
                    <div className="space-y-3">
                      {["Physical", "Online"].map((value, i) => (
                        <div key={value} className="flex items-center gap-2">
                          <Checkbox
                            id={`${id}-type-${i}`}
                            checked={(
                              (table
                                .getColumn("booking_type")
                                ?.getFilterValue() as string[]) ?? []
                            ).includes(value)}
                            onCheckedChange={(checked: boolean) => {
                              const old =
                                (table
                                  .getColumn("booking_type")
                                  ?.getFilterValue() as string[]) ?? [];
                              const newFilter = checked
                                ? [...old, value]
                                : old.filter((v) => v !== value);
                              table
                                .getColumn("booking_type")
                                ?.setFilterValue(
                                  newFilter.length ? newFilter : undefined
                                );
                            }}
                            className="border-[#DADCE0] border-[1.5px] data-[state=checked]:bg-[#0081FB] data-[state=checked]:text-[#FFF]"
                          />
                          <Label
                            htmlFor={`${id}-type-${i}`}
                            className="font-normal"
                          >
                            {value}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Columns3Icon className="-ms-1 opacity-60" size={16} />
                    View
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  {table
                    .getAllColumns()
                    .filter((c) => c.getCanHide())
                    .map((c) => (
                      <DropdownMenuCheckboxItem
                        key={c.id}
                        className="capitalize"
                        checked={c.getIsVisible()}
                        onCheckedChange={(v) => c.toggleVisibility(!!v)}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {c.id.replace(/_/g, " ")}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-3">
              {table.getSelectedRowModel().rows.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">
                      <Trash2 className="-ms-1 opacity-60" size={16} />
                      Delete
                      <span className="bg-[#f54943] text-white -me-1 inline-flex h-5 max-h-full items-center rounded border-none px-1 font-[inherit] text-[0.625rem] font-medium">
                        {table.getSelectedRowModel().rows.length}
                      </span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete{" "}
                        {table.getSelectedRowModel().rows.length} selected
                        booking(s). This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteRows}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button
                className="cursor-pointer"
                variant="outline"
                onClick={() => refetch()}
                disabled={isRefetching || isTableLoading}
              >
                <RefreshCw
                  className={cn("mr-1 h-4 w-4", isRefetching && "animate-spin")}
                />
                Refresh
              </Button>
            </div>
          </div>
          <div className="bg-background overflow-hidden rounded-md border mt-4">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id} className="hover:bg-transparent">
                    {hg.headers.map((h) => (
                      <TableHead
                        key={h.id}
                        style={{
                          width:
                            h.getSize() !== 150
                              ? `${h.getSize()}px`
                              : undefined,
                        }}
                        className="h-11"
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isTableLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <Loader className="animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="p-2.5 last:py-0">
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
                      No checked-out guests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between gap-8 mt-4 w-full">
            <div className="w-full text-muted-foreground flex grow justify-start text-sm">
              {" "}
              <p>
                Page{" "}
                <span className="font-medium text-foreground">
                  {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </span>
              </p>
            </div>
            <Pagination className="w-full justify-end">
              <PaginationContent>
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ChevronFirstIcon size={16} />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ChevronLeftIcon size={16} />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <ChevronRightIcon size={16} />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <ChevronLastIcon size={16} />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RowActions({
  row,
  deleteBookingMutation,
}: {
  row: any;
  deleteBookingMutation: any;
}) {
  const navigate = useNavigate();
  const booking = row.original;
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="shadow-none">
            <EllipsisIcon size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => navigate(`/bookings/${booking.id}`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the booking for{" "}
                  <span className="font-semibold">{booking.full_name}</span>.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteBookingMutation.mutate(booking.id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
