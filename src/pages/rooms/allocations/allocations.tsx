// "use client";
// import { useState, useMemo, useEffect, useRef } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   type ColumnDef,
//   type ColumnFiltersState,
//   flexRender,
//   getCoreRowModel,
//   getSortedRowModel,
//   getFilteredRowModel,
//   getFacetedUniqueValues,
//   getPaginationRowModel,
//   useReactTable,
//   type SortingState,
//   type Row,
//   type PaginationState,
// } from "@tanstack/react-table";
// import {
//   ChevronDownIcon,
//   ChevronUpIcon,
//   CircleXIcon,
//   Columns3Icon,
//   EllipsisIcon,
//   Trash2,
//   ChevronFirstIcon,
//   ChevronLastIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   Search,
//   Loader2,
//   Loader,
//   Plus,
//   Edit,
//   Calendar,
// } from "lucide-react";
// import { toast } from "sonner";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
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
//   CardDescription,
// } from "@/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuLabel,
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
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { cn } from "@/lib/utils";
// import { IoRefreshOutline } from "react-icons/io5";
// import axios from "axios";
// import ErrorPage from "@/components/custom/error-page";

// // - - - API Client
// const hotelClient = axios.create({
//   baseURL: "https://hotel.safaripro.net/api/v1",
// });

// // - - - Type Definitions
// interface AllocationDetail {
//   id: string;
//   created_by: string | null;
//   updated_by: string | null;
//   deleted_by: string | null;
//   is_active: boolean;
//   is_deleted: boolean;
//   created_at: string;
//   updated_at: string;
//   deleted_at: string | null;
//   date: string;
//   status: "Draft" | "Pending" | "Confirmed" | "Cancelled" | "Expired";
//   is_price_per_night: boolean;
//   special_conditions: string;
//   allocation: string;
//   hotel: string;
//   room: string;
//   room_type: string;
// }

// interface Allocation {
//   id: string;
//   name: string;
//   start_date: string;
//   end_date: string;
//   status: string;
//   total_rooms: number;
//   notes: string;
//   approval_date: string | null;
//   hotel: string;
//   room_type: string;
// }

// interface Room {
//   id: string;
//   code: string;
//   description: string;
//   price_per_night: number;
//   availability_status: string;
// }

// interface PaginatedResponse<T> {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: T[];
// }

// // - - - Debounce Hook
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

// // - - - Status Color Helper
// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "Draft":
//       return "bg-gray-100 text-gray-800 border-gray-200";
//     case "Pending":
//       return "bg-yellow-100 text-yellow-800 border-yellow-200";
//     case "Confirmed":
//       return "bg-green-100 text-green-800 border-green-200";
//     case "Cancelled":
//       return "bg-red-100 text-red-800 border-red-200";
//     case "Expired":
//       return "bg-orange-100 text-orange-800 border-orange-200";
//     default:
//       return "bg-gray-100 text-gray-800 border-gray-200";
//   }
// };

// // - - - Form Component
// const AllocationDetailForm = ({
//   isOpen,
//   onClose,
//   editingDetail,
//   onSubmit,
//   isLoading,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   editingDetail?: AllocationDetail | null;
//   onSubmit: (data: any) => void;
//   isLoading: boolean;
// }) => {
//   const hotel_id = import.meta.env.VITE_HOTEL_ID;

//   const [formData, setFormData] = useState({
//     date: "",
//     allocation: "",
//     room: "",
//     room_type: "",
//     is_price_per_night: true,
//     status: "Pending" as AllocationDetail["status"],
//     special_conditions: "",
//   });

//   // Fetch allocations
//   const { data: allocationsResponse } = useQuery<PaginatedResponse<Allocation>>(
//     {
//       queryKey: ["allocations", hotel_id],
//       queryFn: async () => {
//         const response = await hotelClient.get(
//           `/allocations/?hotel=${hotel_id}`
//         );
//         return response.data;
//       },
//       enabled: isOpen,
//     }
//   );

//   // Fetch available rooms
//   const { data: roomsResponse } = useQuery<PaginatedResponse<Room>>({
//     queryKey: ["available-rooms", hotel_id],
//     queryFn: async () => {
//       const response = await hotelClient.get(
//         `/rooms/?hotel_id=${hotel_id}&availability_status=Available`
//       );
//       return response.data;
//     },
//     enabled: isOpen,
//   });

//   // Fetch room types (assuming similar structure to HotelRoomTypes.tsx)
//   const { data: hotelData } = useQuery({
//     queryKey: ["hotel", hotel_id],
//     queryFn: async () => {
//       const response = await hotelClient.get(`/hotels/${hotel_id}`);
//       return response.data;
//     },
//     enabled: isOpen,
//   });

//   useEffect(() => {
//     if (editingDetail) {
//       setFormData({
//         date: editingDetail.date,
//         allocation: editingDetail.allocation,
//         room: editingDetail.room,
//         room_type: editingDetail.room_type,
//         is_price_per_night: editingDetail.is_price_per_night,
//         status: editingDetail.status,
//         special_conditions: editingDetail.special_conditions,
//       });
//     } else {
//       setFormData({
//         date: "",
//         allocation: "",
//         room: "",
//         room_type: "",
//         is_price_per_night: true,
//         status: "Pending",
//         special_conditions: "",
//       });
//     }
//   }, [editingDetail, isOpen]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const submitData = {
//       ...formData,
//       hotel: hotel_id,
//     };
//     onSubmit(submitData);
//   };

//   const allocations = allocationsResponse?.results || [];
//   const rooms = roomsResponse?.results || [];
//   const roomTypes = hotelData?.room_type || [];

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle>
//             {editingDetail
//               ? "Edit Allocation Detail"
//               : "Create Allocation Detail"}
//           </DialogTitle>
//           <DialogDescription>
//             {editingDetail
//               ? "Update the allocation detail information."
//               : "Create a new allocation detail."}
//           </DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <Label htmlFor="date">Date</Label>
//             <Input
//               id="date"
//               type="date"
//               value={formData.date}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, date: e.target.value }))
//               }
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="allocation">Allocation</Label>
//             <Select
//               value={formData.allocation}
//               onValueChange={(value) =>
//                 setFormData((prev) => ({ ...prev, allocation: value }))
//               }
//               required
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select allocation" />
//               </SelectTrigger>
//               <SelectContent>
//                 {allocations.map((allocation) => (
//                   <SelectItem key={allocation.id} value={allocation.id}>
//                     {allocation.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <Label htmlFor="room_type">Room Type</Label>
//             <Select
//               value={formData.room_type}
//               onValueChange={(value) =>
//                 setFormData((prev) => ({ ...prev, room_type: value }))
//               }
//               required
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select room type" />
//               </SelectTrigger>
//               <SelectContent>
//                 {roomTypes.map((roomType: any) => (
//                   <SelectItem key={roomType.id} value={roomType.id}>
//                     {roomType.name} ({roomType.code})
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <Label htmlFor="room">Room</Label>
//             <Select
//               value={formData.room}
//               onValueChange={(value) =>
//                 setFormData((prev) => ({ ...prev, room: value }))
//               }
//               required
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select room" />
//               </SelectTrigger>
//               <SelectContent>
//                 {rooms.map((room) => (
//                   <SelectItem key={room.id} value={room.id}>
//                     {room.code}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <Label htmlFor="status">Status</Label>
//             <Select
//               value={formData.status}
//               onValueChange={(value) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   status: value as AllocationDetail["status"],
//                 }))
//               }
//               required
//             >
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Draft">Draft</SelectItem>
//                 <SelectItem value="Pending">Pending</SelectItem>
//                 <SelectItem value="Confirmed">Confirmed</SelectItem>
//                 <SelectItem value="Cancelled">Cancelled</SelectItem>
//                 <SelectItem value="Expired">Expired</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               className="border-[#DADCE0] border-[1.5px] data-[state=checked]:bg-[#0081FB] data-[state=checked]:text-[#FFF]"
//               id="is_price_per_night"
//               checked={formData.is_price_per_night}
//               onCheckedChange={(checked) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   is_price_per_night: !!checked,
//                 }))
//               }
//             />
//             <Label htmlFor="is_price_per_night">Price per night</Label>
//           </div>

//           <div>
//             <Label htmlFor="special_conditions">Special Conditions</Label>
//             <Textarea
//               id="special_conditions"
//               value={formData.special_conditions}
//               onChange={(e) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   special_conditions: e.target.value,
//                 }))
//               }
//               placeholder="Enter any special conditions..."
//             />
//           </div>

//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button
//               className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
//               type="submit"
//               disabled={isLoading}
//             >
//               {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               {editingDetail ? "Update" : "Create"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// // - - - Main Component
// export default function Allocations() {
//   const queryClient = useQueryClient();
//   const hotel_id = import.meta.env.VITE_HOTEL_ID;
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [pagination, setPagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 15,
//   });
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingDetail, setEditingDetail] = useState<AllocationDetail | null>(
//     null
//   );

//   const debouncedGlobalFilter = useDebounce(globalFilter, 500);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // --- Data Queries ---
//   const {
//     data: paginatedResponse,
//     isLoading,
//     isError,
//     error,
//     refetch,
//     isRefetching,
//   } = useQuery<PaginatedResponse<AllocationDetail>>({
//     queryKey: [
//       "allocation-details",
//       hotel_id,
//       pagination.pageIndex,
//       debouncedGlobalFilter,
//       sorting,
//       columnFilters,
//     ],
//     queryFn: async () => {
//       const params = new URLSearchParams({
//         hotel: hotel_id,
//         page: String(pagination.pageIndex + 1),
//         page_size: String(pagination.pageSize),
//       });

//       if (debouncedGlobalFilter) params.append("search", debouncedGlobalFilter);
//       if (sorting.length > 0) {
//         const sortKey = sorting[0].id;
//         const sortDir = sorting[0].desc ? "-" : "";
//         params.append("ordering", `${sortDir}${sortKey}`);
//       }

//       const response = await hotelClient.get(`/allocation-details/`, {
//         params,
//       });
//       return response.data;
//     },
//     keepPreviousData: true,
//     enabled: !!hotel_id,
//   });

//   // --- Mutations ---
//   const createMutation = useMutation({
//     mutationFn: (data: any) =>
//       hotelClient.post(`/allocation-details/?hotel=${hotel_id}`, data),
//     onSuccess: () => {
//       toast.success("Allocation detail created successfully!");
//       queryClient.invalidateQueries({ queryKey: ["allocation-details"] });
//       setIsFormOpen(false);
//     },
//     onError: (error: any) => {
//       toast.error(
//         `Failed to create allocation detail: ${
//           error.response?.data?.detail || error.message
//         }`
//       );
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: ({ id, data }: { id: string; data: any }) =>
//       hotelClient.patch(`/allocation-details/${id}/`, data),
//     onSuccess: () => {
//       toast.success("Allocation detail updated successfully!");
//       queryClient.invalidateQueries({ queryKey: ["allocation-details"] });
//       setIsFormOpen(false);
//       setEditingDetail(null);
//     },
//     onError: (error: any) => {
//       toast.error(
//         `Failed to update allocation detail: ${
//           error.response?.data?.detail || error.message
//         }`
//       );
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id: string) =>
//       hotelClient.delete(`/allocation-details/${id}/`),
//     onSuccess: () => {
//       toast.success("Allocation detail deleted successfully!");
//       queryClient.invalidateQueries({ queryKey: ["allocation-details"] });
//     },
//     onError: (error: any) => {
//       toast.error(
//         `Failed to delete allocation detail: ${
//           error.response?.data?.detail || error.message
//         }`
//       );
//     },
//   });

//   // --- Handlers ---
//   const handleCreate = () => {
//     setEditingDetail(null);
//     setIsFormOpen(true);
//   };

//   const handleEdit = (detail: AllocationDetail) => {
//     setEditingDetail(detail);
//     setIsFormOpen(true);
//   };

//   const handleFormSubmit = (data: any) => {
//     if (editingDetail) {
//       updateMutation.mutate({ id: editingDetail.id, data });
//     } else {
//       console.log(`New Allocation Details Data`);
//       console.log(data);
//       createMutation.mutate(data);
//     }
//   };

//   const allocationDetails = paginatedResponse?.results ?? [];
//   const totalCount = paginatedResponse?.count ?? 0;
//   const totalPages = Math.ceil(totalCount / pagination.pageSize);
//   const hasNextPage = paginatedResponse?.next !== null;
//   const hasPreviousPage = paginatedResponse?.previous !== null;

//   // --- Table Column Definitions ---
//   const columns = useMemo<ColumnDef<AllocationDetail>[]>(
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
//         size: 40,
//         enableSorting: false,
//         enableHiding: false,
//       },
//       {
//         accessorKey: "date",
//         header: ({ column }) => (
//           <SortableHeader column={column}>
//             <Calendar className="mr-2 h-4 w-4" />
//             Date
//           </SortableHeader>
//         ),
//         cell: ({ row }) => (
//           <div className="font-medium">
//             {new Date(row.original.date).toLocaleDateString()}
//           </div>
//         ),
//         size: 120,
//       },
//       {
//         accessorKey: "status",
//         header: "Status",
//         cell: ({ row }) => (
//           <Badge className={cn(getStatusColor(row.getValue("status")))}>
//             {row.getValue("status")}
//           </Badge>
//         ),
//         size: 120,
//       },
//       {
//         accessorKey: "is_price_per_night",
//         header: "Price Type",
//         cell: ({ row }) => (
//           <span className="text-sm">
//             {row.getValue("is_price_per_night") ? "Per Night" : "Fixed"}
//           </span>
//         ),
//         size: 100,
//       },
//       {
//         accessorKey: "is_active",
//         header: "Active",
//         cell: ({ row }) => (
//           <Badge
//             className="bg-green-100 text-green-800 border-green-200"
//             variant={row.getValue("is_active") ? "default" : "secondary"}
//           >
//             {row.getValue("is_active") ? "Yes" : "No"}
//           </Badge>
//         ),
//         size: 80,
//       },
//       {
//         accessorKey: "special_conditions",
//         header: "Special Conditions",
//         cell: ({ row }) => {
//           const conditions = row.getValue("special_conditions") as string;
//           return (
//             <div className="max-w-xs truncate" title={conditions}>
//               {conditions || "None"}
//             </div>
//           );
//         },
//         size: 200,
//       },
//       {
//         accessorKey: "created_at",
//         header: ({ column }) => (
//           <SortableHeader column={column}>Created</SortableHeader>
//         ),
//         cell: ({ row }) => (
//           <div className="text-sm text-muted-foreground">
//             {new Date(row.original.created_at).toLocaleDateString()}
//           </div>
//         ),
//         size: 120,
//       },
//       {
//         id: "actions",
//         cell: ({ row }) => (
//           <RowActions
//             row={row}
//             onEdit={handleEdit}
//             deleteMutation={deleteMutation}
//           />
//         ),
//         size: 60,
//         enableHiding: false,
//       },
//     ],
//     [deleteMutation]
//   );

//   const table = useReactTable({
//     data: allocationDetails,
//     columns,
//     state: { sorting, columnFilters, pagination },
//     pageCount: totalPages,
//     manualPagination: true,
//     manualSorting: true,
//     manualFiltering: true,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onPaginationChange: setPagination,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getFacetedUniqueValues: getFacetedUniqueValues(),
//     getPaginationRowModel: getPaginationRowModel(),
//   });

//   const handleDeleteSelected = () => {
//     const selectedRows = table.getSelectedRowModel().rows;
//     selectedRows.forEach((row) => deleteMutation.mutate(row.original.id));
//     table.resetRowSelection();
//   };

//   if (isError) {
//     return <ErrorPage error={error as Error} onRetry={refetch} />;
//   }

//   return (
//     <div className="flex-1 space-y-4 md:p-4 pt-4">
//       <div className="flex items-center justify-between px-4">
//         <h2 className="text-3xl font-bold tracking-tight">
//           Allocation Details
//         </h2>
//         <Button
//           onClick={handleCreate}
//           className="gap-2 bg-[#0081FB] hover:bg-blue-700 cursor-pointer rounded-md"
//         >
//           <Plus className="h-4 w-4" />
//           Create Allocation Detail
//         </Button>
//       </div>

//       <Card className="bg-none p-0 border-none shadow-none">
//         <CardHeader>
//           <CardDescription>
//             <Badge
//               className="px-4 py-1 block mb-3 rounded-full bg-[#FFF] border-[#DADCE0] dark:text-[#0A0A0A]"
//               variant="outline"
//             >
//               Total Details:{" "}
//               <span className="font-bold text-gray-700 ml-1">{totalCount}</span>
//             </Badge>
//             Manage allocation details for your hotel rooms.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
//             <div className="flex items-center gap-3">
//               <div className="relative">
//                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   ref={inputRef}
//                   placeholder="Search allocation details..."
//                   value={globalFilter}
//                   onChange={(e) => setGlobalFilter(e.target.value)}
//                   className="pl-8 sm:w-[300px]"
//                 />
//                 {globalFilter && (
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="absolute right-0 top-0 h-full px-3"
//                     onClick={() => setGlobalFilter("")}
//                   >
//                     <CircleXIcon size={16} />
//                   </Button>
//                 )}
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               {table.getSelectedRowModel().rows.length > 0 && (
//                 <AlertDialog>
//                   <AlertDialogTrigger asChild>
//                     <Button variant="outline" className="gap-1">
//                       <Trash2 size={14} /> Delete (
//                       {table.getSelectedRowModel().rows.length})
//                     </Button>
//                   </AlertDialogTrigger>
//                   <AlertDialogContent>
//                     <AlertDialogHeader>
//                       <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                       <AlertDialogDescription>
//                         This will permanently delete{" "}
//                         {table.getSelectedRowModel().rows.length} selected
//                         allocation detail(s). This action cannot be undone.
//                       </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                       <AlertDialogCancel>Cancel</AlertDialogCancel>
//                       <AlertDialogAction onClick={handleDeleteSelected}>
//                         Delete
//                       </AlertDialogAction>
//                     </AlertDialogFooter>
//                   </AlertDialogContent>
//                 </AlertDialog>
//               )}
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" className="gap-1 cursor-pointer">
//                     <Columns3Icon size={14} /> View
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
//                         checked={c.getIsVisible()}
//                         onCheckedChange={c.toggleVisibility}
//                         className="capitalize"
//                       >
//                         {c.id.replace(/_/g, " ")}
//                       </DropdownMenuCheckboxItem>
//                     ))}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//               <Button
//                 variant="outline"
//                 onClick={() => refetch()}
//                 disabled={isRefetching || isLoading}
//                 className="gap-1 cursor-pointer"
//               >
//                 <IoRefreshOutline
//                   className={cn("h-4 w-4", isRefetching && "animate-spin")}
//                 />
//                 Refresh
//               </Button>
//             </div>
//           </div>

//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 {table.getHeaderGroups().map((headerGroup) => (
//                   <TableRow key={headerGroup.id}>
//                     {headerGroup.headers.map((header) => (
//                       <TableHead
//                         key={header.id}
//                         style={{
//                           width:
//                             header.getSize() !== 150
//                               ? header.getSize()
//                               : undefined,
//                         }}
//                       >
//                         {flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
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
//                       <div className="w-full flex items-center justify-center">
//                         <Loader />
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ) : table.getRowModel().rows?.length ? (
//                   table.getRowModel().rows.map((row) => (
//                     <TableRow
//                       key={row.id}
//                       data-state={row.getIsSelected() && "selected"}
//                     >
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
//                       No allocation details found.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>

//           <div className="flex items-center justify-between gap-4 mt-4 w-full">
//             <div className="flex-1 text-sm text-muted-foreground">
//               {table.getFilteredSelectedRowModel().rows.length} of{" "}
//               {table.getFilteredRowModel().rows.length} row(s) selected.
//             </div>
//             <div className="flex items-center gap-6">
//               <div className="flex items-center justify-center text-sm font-medium">
//                 Page {table.getState().pagination.pageIndex + 1} of{" "}
//                 {table.getPageCount()}
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Button
//                   variant="outline"
//                   className="h-8 w-8 p-0"
//                   onClick={() => table.firstPage()}
//                   disabled={!hasPreviousPage}
//                 >
//                   <ChevronFirstIcon className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="h-8 w-8 p-0"
//                   onClick={() => table.previousPage()}
//                   disabled={!hasPreviousPage}
//                 >
//                   <ChevronLeftIcon className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="h-8 w-8 p-0"
//                   onClick={() => table.nextPage()}
//                   disabled={!hasNextPage}
//                 >
//                   <ChevronRightIcon className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="h-8 w-8 p-0"
//                   onClick={() => table.lastPage()}
//                   disabled={!hasNextPage}
//                 >
//                   <ChevronLastIcon className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <AllocationDetailForm
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingDetail(null);
//         }}
//         editingDetail={editingDetail}
//         onSubmit={handleFormSubmit}
//         isLoading={createMutation.isLoading || updateMutation.isLoading}
//       />
//     </div>
//   );
// }

// // Reusable component for sortable headers
// const SortableHeader = ({
//   column,
//   children,
//   className,
// }: {
//   column: any;
//   children: React.ReactNode;
//   className?: string;
// }) => (
//   <div
//     className={cn(
//       "flex items-center gap-2 cursor-pointer select-none",
//       className
//     )}
//     onClick={column.getToggleSortingHandler()}
//   >
//     {children}
//     {{
//       asc: <ChevronUpIcon size={16} className="text-muted-foreground/70" />,
//       desc: <ChevronDownIcon size={16} className="text-muted-foreground/70" />,
//     }[column.getIsSorted() as string] ?? null}
//   </div>
// );

// function RowActions({
//   row,
//   onEdit,
//   deleteMutation,
// }: {
//   row: Row<AllocationDetail>;
//   onEdit: (detail: AllocationDetail) => void;
//   deleteMutation: any;
// }) {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <div className="flex justify-end">
//           <Button
//             size="icon"
//             variant="ghost"
//             className="shadow-none"
//             aria-label="Allocation detail actions"
//           >
//             <EllipsisIcon size={16} aria-hidden="true" />
//           </Button>
//         </div>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem onClick={() => onEdit(row.original)}>
//           <Edit className="mr-2 h-4 w-4" /> Edit
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <AlertDialog>
//           <AlertDialogTrigger asChild>
//             <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive">
//               <Trash2 className="mr-2 h-4 w-4" />
//               <span>Delete</span>
//             </div>
//           </AlertDialogTrigger>
//           <AlertDialogContent className="bg-[#FFF] rounded-md">
//             <AlertDialogHeader>
//               <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//               <AlertDialogDescription>
//                 This will permanently delete this allocation detail. This action
//                 cannot be undone.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction
//                 className="bg-red-500 border-none"
//                 onClick={() => deleteMutation.mutate(row.original.id)}
//               >
//                 Delete
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

"use client";
import { useState, useEffect, useId } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { format } from "date-fns";
import { toast } from "sonner";
import localHotelClient from "@/api/local-hotel-client";
import { useAuthStore } from "@/store/auth.store"; // ✨ Step 2: Import the Auth Store

// --- UI Components ---
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

// --- Icons ---
import {
  Bed,
  BedDouble,
  Calendar,
  Hotel,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Wrench,
} from "lucide-react";

// ✨ Step 4: Remove Static ID Import (line was here)

// --- Type Definitions ---
interface RoomStats {
  available: number;
  booked: number;
  maintenance: number;
}

interface RoomType {
  id: string;
  name: string;
  room_availability: number;
}

interface Allocation {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: "Pending" | "Confirmed" | "Cancelled" | "Expired";
  total_rooms: number;
  notes: string;
  room_type: {
    id: string;
    name: string;
    image: string;
    base_price: string;
  };
}

interface PaginatedResponse<T> {
  count: number;
  results: T[];
}

type AllocationFormData = {
  name: string;
  start_date: string;
  end_date: string;
  status: "Pending" | "Confirmed" | "Cancelled" | "Expired";
  total_rooms: number;
  notes: string;
  room_type: string;
};

// --- Validation Schema ---
const allocationSchema = yup.object({
  name: yup.string().required("Allocation name is required."),
  room_type: yup.string().required("You must select a room type."),
  total_rooms: yup
    .number()
    .typeError("Total rooms must be a number.")
    .required("Number of rooms is required.")
    .min(1, "You must allocate at least one room."),
  start_date: yup.date().required("Start date is required."),
  end_date: yup
    .date()
    .required("End date is required.")
    .min(yup.ref("start_date"), "End date cannot be before the start date."),
  status: yup
    .string()
    .oneOf(["Pending", "Confirmed", "Cancelled", "Expired"])
    .required("Status is required."),
  notes: yup.string().optional(),
});

// --- API Functions ---

/**
 * Fetches live statistics for room statuses (Available, Booked, Maintenance).
 * It makes parallel API calls to efficiently get the count for each status.
 */
const fetchRoomStats = async (hotelId: string): Promise<RoomStats> => {
  // ✨ Pass hotelId
  // Helper function to fetch count for a specific status
  const fetchCountForStatus = async (status: string) => {
    try {
      const response = await localHotelClient.get<PaginatedResponse<any>>(
        `/rooms/`,
        {
          params: {
            hotel_id: hotelId, // ✨ Use dynamic hotelId
            availability_status: status,
            page_size: 1,
          },
        }
      );
      return response.data.count || 0;
    } catch (error) {
      console.error(`Failed to fetch count for ${status} rooms:`, error);
      return 0; // Return 0 if there's an error
    }
  };

  // Run all fetch requests in parallel for better performance
  const [available, booked, maintenance] = await Promise.all([
    fetchCountForStatus("Available"),
    fetchCountForStatus("Booked"),
    fetchCountForStatus("Maintenance"),
  ]);

  return { available, booked, maintenance };
};

const fetchRoomTypes = async (hotelId: string): Promise<RoomType[]> => {
  // ✨ Pass hotelId
  const { data } = await localHotelClient.get<PaginatedResponse<RoomType>>(
    `/room-types/?hotel_id=${hotelId}` // ✨ Use dynamic hotelId
  );
  return data.results;
};

const fetchAllocations = async (
  hotelId: string, // ✨ Pass hotelId
  statusFilter: string
): Promise<Allocation[]> => {
  let url = `/allocations/?hotel=${hotelId}`; // ✨ Use dynamic hotelId
  if (statusFilter) {
    url += `&status=${statusFilter}`;
  }
  const { data } = await localHotelClient.get<PaginatedResponse<Allocation>>(
    url
  );
  return data.results;
};

const createAllocation = (data: AllocationFormData & { hotel: string }) => {
  return localHotelClient.post("/allocations/", data);
};

const updateAllocation = ({
  id,
  payload,
}: {
  id: string;
  payload: Partial<AllocationFormData>;
}) => {
  return localHotelClient.patch(`/allocations/${id}/`, payload);
};

const deleteAllocation = (id: string) => {
  return localHotelClient.delete(`/allocations/${id}/`);
};

// --- Reusable Components ---
const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}) => (
  <Card className="shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={color}>{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const AllocationCard = ({
  allocation,
  onEdit,
  onDelete,
}: {
  allocation: Allocation;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800 border-green-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      case "Expired":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden bg-[#FFF] border-[#DADCE0] hover:shadow-sm transition-shadow duration-300 flex flex-col pt-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{allocation.name}</CardTitle>
            <CardDescription>{allocation.room_type.name}</CardDescription>
          </div>
          <Badge className={getStatusBadgeColor(allocation.status)}>
            {allocation.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        <div className="flex items-center text-sm text-gray-600">
          <BedDouble className="h-4 w-4 mr-2 text-blue-500" />
          <span>{allocation.total_rooms} Rooms Allocated</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2 text-blue-500" />
          <span>
            {format(new Date(allocation.start_date), "MMM dd, yyyy")} -{" "}
            {format(new Date(allocation.end_date), "MMM dd, yyyy")}
          </span>
        </div>
        <p className="text-sm text-gray-500 pt-2 border-t mt-2">
          {allocation.notes || "No additional notes."}
        </p>
      </CardContent>
      <CardFooter className="bg-none p-3 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-2" /> Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

// --- Main Page Component ---
export default function AllocateRooms() {
  const queryClient = useQueryClient();
  const { hotelId } = useAuthStore(); // ✨ Step 3: Access the Dynamic ID
  const [isCreateFormOpen, setCreateFormOpen] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState<Allocation | null>(
    null
  );
  const [deletingAllocationId, setDeletingAllocationId] = useState<
    string | null
  >(null);
  const [statusFilter, setStatusFilter] = useState("");

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["roomStats", hotelId], // ✨ Step 6: Update queryKey
    queryFn: () => fetchRoomStats(hotelId!), // ✨ Pass hotelId
    enabled: !!hotelId, // ✨ Step 6: Update enabled check
  });

  const { data: roomTypes, isLoading: isLoadingRoomTypes } = useQuery({
    queryKey: ["roomTypesForAllocation", hotelId], // ✨ Step 6: Update queryKey
    queryFn: () => fetchRoomTypes(hotelId!), // ✨ Pass hotelId
    enabled: !!hotelId, // ✨ Step 6: Update enabled check
  });

  const {
    data: allocations,
    isLoading: isLoadingAllocations,
    refetch,
  } = useQuery({
    queryKey: ["allocations", statusFilter, hotelId], // ✨ Step 6: Update queryKey
    queryFn: () => fetchAllocations(hotelId!, statusFilter), // ✨ Pass hotelId
    enabled: !!hotelId, // ✨ Step 6: Update enabled check
  });

  const createMutation = useMutation({
    mutationFn: createAllocation,
    onSuccess: () => {
      toast.success("Allocation created successfully!");
      queryClient.invalidateQueries({ queryKey: ["allocations"] });
      setCreateFormOpen(false);
    },
    onError: (error: any) => {
      toast.error("Failed to create allocation", {
        description: error.response?.data?.detail || error.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAllocation,
    onSuccess: () => {
      toast.success("Allocation updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["allocations", statusFilter],
      });
      setEditingAllocation(null);
    },
    onError: (error: any) => {
      toast.error("Failed to update allocation", {
        description: error.response?.data?.detail || error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAllocation,
    onSuccess: () => {
      toast.success("Allocation deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["allocations", statusFilter],
      });
      setDeletingAllocationId(null);
    },
    onError: (error: any) => {
      toast.error("Failed to delete allocation", {
        description: error.response?.data?.detail || error.message,
      });
    },
  });

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Room Allocations
          </h1>
          <p className="text-muted-foreground">
            Allocate rooms for third-party partners like SafariPro.
          </p>
        </div>
        <Button
          className="rounded-[6px] bg-[#0081FB] hover:bg-blue-600 cursor-pointer"
          onClick={() => setCreateFormOpen(true)}
        >
          <Plus className="mr-1 h-5 w-5" />
          New Allocation
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Allocations"
          value={
            isLoadingAllocations ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              allocations?.length ?? 0
            )
          }
          icon={<Hotel />}
          color="text-blue-500"
        />
        <StatCard
          title="Available Rooms"
          value={
            isLoadingStats ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              stats?.available ?? 0
            )
          }
          icon={<BedDouble />}
          color="text-green-500"
        />
        <StatCard
          title="Booked Rooms"
          value={
            isLoadingStats ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              stats?.booked ?? 0
            )
          }
          icon={<Bed />}
          color="text-yellow-500"
        />
        <StatCard
          title="Maintenance"
          value={
            isLoadingStats ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              stats?.maintenance ?? 0
            )
          }
          icon={<Wrench />}
          color="text-gray-500"
        />
      </div>

      {/* Filters and Allocations Grid */}
      <Card className="shadow-none bg-none border-none px-0">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Current Allocations</CardTitle>
              <CardDescription>
                View and manage all room allocations.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => refetch()}
                disabled={isLoadingAllocations}
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    isLoadingAllocations ? "animate-spin" : ""
                  }`}
                />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingAllocations ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : allocations && allocations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allocations.map((alloc) => (
                <AllocationCard
                  key={alloc.id}
                  allocation={alloc}
                  onEdit={() => setEditingAllocation(alloc)}
                  onDelete={() => setDeletingAllocationId(alloc.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No allocations found for the selected filter.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Allocation Dialog */}
      <AllocationForm
        isOpen={isCreateFormOpen}
        onOpenChange={setCreateFormOpen}
        roomTypes={roomTypes}
        isLoadingRoomTypes={isLoadingRoomTypes}
        mutation={createMutation}
        formTitle="Create New Allocation"
        formDescription="Set aside a number of rooms of a specific type for a partner."
        submitButtonText="Create Allocation"
      />

      {/* Edit Allocation Dialog */}
      {editingAllocation && (
        <AllocationForm
          isOpen={!!editingAllocation}
          onOpenChange={(isOpen) => !isOpen && setEditingAllocation(null)}
          roomTypes={roomTypes}
          isLoadingRoomTypes={isLoadingRoomTypes}
          mutation={updateMutation}
          formTitle={`Edit Allocation: ${editingAllocation?.name}`}
          formDescription="Update the details for this allocation."
          submitButtonText="Save Changes"
          existingAllocation={editingAllocation}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingAllocationId}
        onOpenChange={() => setDeletingAllocationId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              allocation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(deletingAllocationId!)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// --- Reusable Allocation Form Component ---
interface AllocationFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  roomTypes: RoomType[] | undefined;
  isLoadingRoomTypes?: boolean;
  mutation: any;
  formTitle: string;
  formDescription: string;
  submitButtonText: string;
  existingAllocation?: Allocation | null;
}

function AllocationForm({
  isOpen,
  onOpenChange,
  roomTypes,
  isLoadingRoomTypes,
  mutation,
  formTitle,
  formDescription,
  submitButtonText,
  existingAllocation,
}: AllocationFormProps) {
  const formId = useId();
  const { hotelId } = useAuthStore(); // ✨ Step 3: Access the Dynamic ID
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<AllocationFormData>({
    resolver: yupResolver(allocationSchema),
  });

  useEffect(() => {
    if (isOpen && existingAllocation) {
      reset({
        name: existingAllocation.name,
        room_type: existingAllocation.room_type.id,
        total_rooms: existingAllocation.total_rooms,
        start_date: format(
          new Date(existingAllocation.start_date),
          "yyyy-MM-dd"
        ),
        end_date: format(new Date(existingAllocation.end_date), "yyyy-MM-dd"),
        status: existingAllocation.status,
        notes: existingAllocation.notes,
      });
    } else if (isOpen) {
      reset({
        name: "SafariPro Allocation",
        status: "Confirmed",
        notes: "",
        room_type: "",
        start_date: "",
        end_date: "",
        total_rooms: 1,
      });
    }
  }, [isOpen, existingAllocation, reset]);

  const onSubmit = (data: AllocationFormData) => {
    // Format dates correctly before submitting
    const formattedData = {
      ...data,
      start_date: format(new Date(data.start_date), "yyyy-MM-dd"),
      end_date: format(new Date(data.end_date), "yyyy-MM-dd"),
    };

    if (existingAllocation) {
      const payload: Partial<AllocationFormData> = {};
      (Object.keys(dirtyFields) as Array<keyof AllocationFormData>).forEach(
        (key) => {
          // @ts-ignore
          payload[key] = formattedData[key];
        }
      );

      if (Object.keys(payload).length > 0) {
        mutation.mutate({ id: existingAllocation.id, payload });
      } else {
        toast.info("No changes were made.");
        onOpenChange(false);
      }
    } else {
      const payload = { ...formattedData, hotel: hotelId! }; // ✨ Step 5: Update API parameter
      mutation.mutate(payload);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
          <DialogDescription>{formDescription}</DialogDescription>
        </DialogHeader>

        <form
          id={formId}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Allocation Name</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input id="name" {...field} />}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="room_type">Room Type</Label>
            <Controller
              name="room_type"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoadingRoomTypes}
                >
                  <SelectTrigger id="room_type">
                    <SelectValue
                      placeholder={
                        isLoadingRoomTypes
                          ? "Loading types..."
                          : "Select a room type"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes?.map((rt) => (
                      <SelectItem key={rt.id} value={rt.id}>
                        {rt.name} ({rt.room_availability} available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.room_type && (
              <p className="text-sm text-red-500">{errors.room_type.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="total_rooms">Number of Rooms to Allocate</Label>
            <Controller
              name="total_rooms"
              control={control}
              render={({ field }) => (
                <Input id="total_rooms" type="number" {...field} />
              )}
            />
            {errors.total_rooms && (
              <p className="text-sm text-red-500">
                {errors.total_rooms.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Controller
                name="start_date"
                control={control}
                render={({ field }) => (
                  <Input id="start_date" type="date" {...field} />
                )}
              />
              {errors.start_date && (
                <p className="text-sm text-red-500">
                  {errors.start_date.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Controller
                name="end_date"
                control={control}
                render={({ field }) => (
                  <Input id="end_date" type="date" {...field} />
                )}
              />
              {errors.end_date && (
                <p className="text-sm text-red-500">
                  {errors.end_date.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Allocation Notes (Optional)</Label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => <Textarea id="notes" {...field} />}
            />
          </div>
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#0081FB] hover:bg-blue-600 transition-all"
            type="submit"
            form={formId}
            disabled={mutation.isPending || (existingAllocation && !isDirty)}
          >
            {mutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
