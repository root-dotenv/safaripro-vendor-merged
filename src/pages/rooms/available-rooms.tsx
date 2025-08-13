"use client";
import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
  useId,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  useReactTable,
  type SortingState,
  type Row,
  type PaginationState,
} from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CircleXIcon,
  Columns3Icon,
  EllipsisIcon,
  Eye,
  Trash2,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Search,
  Loader2,
  Loader,
} from "lucide-react";
import Papa from "papaparse";
import { toast } from "sonner";
import hotelClient from "../../api/hotel-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { IoRefreshOutline } from "react-icons/io5";
import { TbFileTypeCsv } from "react-icons/tb";

// --- Type Definitions ---
interface Room {
  id: string;
  code: string;
  description: string;
  image: string;
  price_per_night: number;
  availability_status: "Available" | "Booked" | "Maintenance";
}

interface PaginatedRoomsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Room[];
}

// --- Debounce Hook ---
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

const getAvailabilityColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "available":
      return "bg-green-100 text-green-800 border-green-200";
    case "booked":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "maintenance":
      return "bg-muted-foreground/60 text-primary-foreground";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// --- Main Component ---
export default function AvailableRooms() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hotel_id = import.meta.env.VITE_HOTEL_ID;
  const id = useId();

  // --- State ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15, // First page shows 15 rooms
  });
  const debouncedGlobalFilter = useDebounce(globalFilter, 500);
  const [isExporting, setIsExporting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Data Queries ---
  const {
    data: paginatedResponse,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<PaginatedRoomsResponse>({
    queryKey: [
      "available-rooms",
      hotel_id,
      pagination.pageIndex,
      debouncedGlobalFilter,
      sorting,
      columnFilters,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        hotel_id: hotel_id!,
        availability_status: "Available",
        page: String(pagination.pageIndex + 1),
        page_size: String(pagination.pageIndex === 0 ? 15 : 7), // 15 for first page, 7 for second
      });

      if (debouncedGlobalFilter) params.append("search", debouncedGlobalFilter);
      if (sorting.length > 0) {
        const sortKey = sorting[0].id;
        const sortDir = sorting[0].desc ? "-" : "";
        params.append("ordering", `${sortDir}${sortKey}`);
      }

      const response = await hotelClient.get(`/rooms/`, { params });
      return response.data;
    },
    keepPreviousData: true,
    enabled: !!hotel_id,
  });

  const deleteRoomMutation = useMutation({
    mutationFn: (roomId: string) => hotelClient.delete(`rooms/${roomId}/`),
    onSuccess: () => {
      toast.success("Room deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["available-rooms"] });
    },
    onError: (error: any) => {
      // toast.error(
      //   `Failed to delete room: ${
      //     error.response?.data?.detail || error.message
      //   }`
      // );
      console.log(`An error has occured: ${error}`);
    },
  });

  const roomsForCurrentPage = paginatedResponse?.results ?? [];
  const totalRoomsCount = paginatedResponse?.count ?? 0;
  const totalPages = Math.ceil(totalRoomsCount / 15); // Based on first page size
  const hasNextPage = paginatedResponse?.next !== null;
  const hasPreviousPage = paginatedResponse?.previous !== null;

  // Adjust page size dynamically for second page
  useEffect(() => {
    if (pagination.pageIndex === 1 && pagination.pageSize !== 7) {
      setPagination((prev) => ({ ...prev, pageSize: 7 }));
    } else if (pagination.pageIndex === 0 && pagination.pageSize !== 15) {
      setPagination((prev) => ({ ...prev, pageSize: 15 }));
    }
  }, [pagination.pageIndex]);

  // --- Export to CSV Function ---
  const handleExport = useCallback(async () => {
    if (!totalRoomsCount) {
      toast.info("No rooms to export.");
      return;
    }

    setIsExporting(true);
    toast.info("Exporting all available rooms, please wait...");

    try {
      const params = new URLSearchParams({
        hotel_id: hotel_id!,
        availability_status: "Available",
        page_size: String(totalRoomsCount),
      });
      if (debouncedGlobalFilter) params.append("search", debouncedGlobalFilter);
      if (sorting.length > 0) {
        params.append(
          "ordering",
          `${sorting[0].desc ? "-" : ""}${sorting[0].id}`
        );
      }

      const response = await hotelClient.get<PaginatedRoomsResponse>(
        "/rooms/",
        { params }
      );
      const allRooms = response.data.results;

      const csvData = allRooms.map((r) => ({
        "Room Code": r.code,
        Description: r.description,
        "Price/Night (USD)": r.price_per_night,
        "Availability Status": r.availability_status,
      }));

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `available_rooms_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Rooms exported successfully!");
    } catch (err) {
      console.error("Export failed:", err);
      // toast.error("An error occurred during the export.");
    } finally {
      setIsExporting(false);
    }
  }, [hotel_id, totalRoomsCount, debouncedGlobalFilter, sorting]);

  // --- Table Column Definitions ---
  const columns = useMemo<ColumnDef<Room>[]>(
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
            className="border-[#171717] border-[1.5px] data-[state=checked]:bg-[#171717] data-[state=checked]:text-[#CCC]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="border-[#171717] border-[1.5px] data-[state=checked]:bg-[#171717] data-[state=checked]:text-[#CCC]"
          />
        ),
        size: 40,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => (
          <img
            src={row.original.image || "https://placehold.co/100x60"}
            alt={row.original.code}
            className="h-10 w-16 object-cover rounded-md"
          />
        ),
        size: 100,
        enableSorting: false,
      },
      {
        accessorKey: "code",
        header: ({ column }) => (
          <SortableHeader column={column}>Room Code</SortableHeader>
        ),
        cell: ({ row }) => (
          <div className="font-mono text-sm">{row.original.code}</div>
        ),
        size: 150,
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <div className="max-w-xs truncate" title={row.original.description}>
            {row.original.description}
          </div>
        ),
        size: 300,
      },
      {
        accessorKey: "price_per_night",
        header: ({ column }) => (
          <SortableHeader column={column} className="justify-end">
            Price/Night
          </SortableHeader>
        ),
        cell: ({ row }) => {
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(row.original.price_per_night);
          return <div className="text-right font-medium">{formatted}</div>;
        },
        size: 150,
      },
      {
        accessorKey: "availability_status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            className={cn(
              getAvailabilityColor(row.getValue("availability_status"))
            )}
          >
            {row.getValue("availability_status")}
          </Badge>
        ),
        size: 120,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <RowActions row={row} deleteRoomMutation={deleteRoomMutation} />
        ),
        size: 60,
        enableHiding: false,
      },
    ],
    [navigate, deleteRoomMutation]
  );

  const table = useReactTable({
    data: roomsForCurrentPage,
    columns,
    state: { sorting, columnFilters, pagination },
    pageCount: totalPages,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    selectedRows.forEach((row) => deleteRoomMutation.mutate(row.original.id));
    table.resetRowSelection();
  };

  if (isError)
    return (
      <div className="p-6 text-red-600">Error: {(error as Error).message}</div>
    );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Available Rooms</h2>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Available</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRoomsCount} Rooms</div>
          <p className="text-xs text-muted-foreground">
            Across all pages matching filter
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rooms List</CardTitle>
          <CardDescription>
            A list of all currently available rooms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  placeholder="Search by code, description..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-8 sm:w-[300px]"
                />
                {globalFilter && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setGlobalFilter("")}
                  >
                    <CircleXIcon size={16} />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {table.getSelectedRowModel().rows.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="gap-1">
                      <Trash2 size={14} /> Delete (
                      {table.getSelectedRowModel().rows.length})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete{" "}
                        {table.getSelectedRowModel().rows.length} selected
                        room(s). This action cannot be undone.
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
                variant="outline"
                onClick={handleExport}
                disabled={isExporting}
                className="gap-1"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <TbFileTypeCsv className="h-4 w-4" />
                )}
                {isExporting ? "Exporting..." : "Export CSV"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <Columns3Icon size={14} /> View
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
                        checked={c.getIsVisible()}
                        onCheckedChange={c.toggleVisibility}
                        className="capitalize"
                      >
                        {c.id.replace(/_/g, " ")}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                onClick={() => refetch()}
                disabled={isRefetching || isLoading}
                className="gap-1"
              >
                <IoRefreshOutline
                  className={cn("h-4 w-4", isRefetching && "animate-spin")}
                />{" "}
                Refresh
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        style={{
                          width:
                            header.getSize() !== 150
                              ? header.getSize()
                              : undefined,
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
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
                      <Loader/>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
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
                      No available rooms found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between gap-4 mt-4 w-full">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => table.setPageSize(Number(value))}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue
                      placeholder={table.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[15, 7].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.firstPage()}
                  disabled={!hasPreviousPage}
                >
                  <ChevronFirstIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!hasPreviousPage}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!hasNextPage}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.lastPage()}
                  disabled={!hasNextPage}
                >
                  <ChevronLastIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Reusable component for sortable headers
const SortableHeader = ({
  column,
  children,
  className,
}: {
  column: any;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex items-center gap-2 cursor-pointer select-none",
      className
    )}
    onClick={column.getToggleSortingHandler()}
  >
    {children}
    {{
      asc: <ChevronUpIcon size={16} className="text-muted-foreground/70" />,
      desc: <ChevronDownIcon size={16} className="text-muted-foreground/70" />,
    }[column.getIsSorted() as string] ?? null}
  </div>
);

function RowActions({
  row,
  deleteRoomMutation,
}: {
  row: Row<Room>;
  deleteRoomMutation: any;
}) {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none"
            aria-label="Room actions"
          >
            <EllipsisIcon size={16} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => navigate(`/rooms/${row.original.id}`)}>
          <Eye className="mr-2 h-4 w-4" /> View Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the room '{row.original.code}'.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteRoomMutation.mutate(row.original.id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
