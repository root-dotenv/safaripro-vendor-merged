// * * * Quick Actions for Booking Status
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
  type FilterFn,
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
  FilterIcon,
  Loader2,
  Trash2,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Search,
  Loader,
  CheckCircle,
  BookCheck,
} from "lucide-react";
import Papa from "papaparse";
import { toast } from "sonner";
import hotelClient from "../../api/hotel-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { IoRefreshOutline } from "react-icons/io5";
import { TbFileTypeCsv } from "react-icons/tb";
import ErrorPage from "@/components/custom/error-page";

// --- Type Definitions ---
interface Room {
  id: string;
  code: string;
  description: string;
  image: string;
  price_per_night: number;
  availability_status: string;
}

interface PaginatedRoomsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Room[];
}

// --- Custom Filter Functions ---
const multiColumnFilterFn: FilterFn<Room> = (row, columnId, filterValue) => {
  const searchableRowContent =
    `${row.original.code} ${row.original.description}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const statusFilterFn: FilterFn<Room> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

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
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-[#FFF2F3] text-[#C10008] border-gray-200";
  }
};

// --- Main Component ---
export default function MaintenanceRooms() {
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
  const debouncedGlobalFilter = useDebounce(globalFilter, 300);
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
      "maintenance-rooms",
      hotel_id,
      pagination.pageIndex,
      debouncedGlobalFilter,
      sorting,
      columnFilters,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        hotel_id: hotel_id!,
        availability_status: "Maintenance",
        page: String(pagination.pageIndex + 1),
        page_size: String(pagination.pageIndex === 0 ? 15 : 7),
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
    mutationFn: (roomId: string) => hotelClient.delete(`/rooms/${roomId}/`),
    onSuccess: () => {
      toast.success("Room deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["maintenance-rooms"] });
    },
    onError: (error: any) => {
      console.error(
        `Failed to delete room: ${
          error.response?.data?.detail || error.message
        }`
      );
    },
  });

  const roomsForCurrentPage = paginatedResponse?.results ?? [];
  const totalRoomsCount = paginatedResponse?.count ?? 0;
  const totalPages = Math.ceil(totalRoomsCount / 15);
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
    toast.info("Exporting all rooms under maintenance, please wait...");

    try {
      const params = new URLSearchParams({
        hotel_id: hotel_id!,
        availability_status: "Maintenance",
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
        `/rooms/`,
        { params }
      );
      const allRooms = response.data.results;

      const csvData = allRooms.map((r) => ({
        "Room Code": r.code,
        Description: r.description,
        "Price/Night": new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(r.price_per_night),
        "Availability Status": r.availability_status,
      }));

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `maintenance_rooms_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Rooms exported successfully!");
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("An error occurred during the export.");
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
        size: 28,
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
          <div
            className={cn(
              column.getCanSort() &&
                "flex h-full cursor-pointer items-center justify-between gap-2 select-none"
            )}
            onClick={column.getToggleSortingHandler()}
            onKeyDown={(e) => {
              if (column.getCanSort() && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                column.getToggleSortingHandler()?.(e);
              }
            }}
            tabIndex={column.getCanSort() ? 0 : undefined}
          >
            Room Code
            {{
              asc: <ChevronUpIcon className="shrink-0 opacity-60" size={16} />,
              desc: (
                <ChevronDownIcon className="shrink-0 opacity-60" size={16} />
              ),
            }[column.getIsSorted() as string] ?? null}
          </div>
        ),
        size: 120,
        filterFn: multiColumnFilterFn,
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <div className="max-w-xs truncate" title={row.original.description}>
            {row.original.description}
          </div>
        ),
        size: 200,
      },
      {
        accessorKey: "price_per_night",
        header: ({ column }) => (
          <div
            className={cn(
              column.getCanSort() &&
                "flex h-full cursor-pointer items-center justify-between gap-2 select-none"
            )}
            onClick={column.getToggleSortingHandler()}
            onKeyDown={(e) => {
              if (column.getCanSort() && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                column.getToggleSortingHandler()?.(e);
              }
            }}
            tabIndex={column.getCanSort() ? 0 : undefined}
          >
            Price/Night
            {{
              asc: <ChevronUpIcon className="shrink-0 opacity-60" size={16} />,
              desc: (
                <ChevronDownIcon className="shrink-0 opacity-60" size={16} />
              ),
            }[column.getIsSorted() as string] ?? null}
          </div>
        ),
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("price_per_night"));
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount);
          return <div className="font-medium">{formatted}</div>;
        },
        size: 120,
      },
      {
        accessorKey: "availability_status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            className={cn(
              getAvailabilityColor(row.getValue("availability_status")),
              "hover:bg-opacity-80"
            )}
          >
            {row.getValue("availability_status")}
          </Badge>
        ),
        size: 100,
        filterFn: statusFilterFn,
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <RowActions row={row} />,
        size: 60,
        enableHiding: false,
      },
    ],
    [navigate, deleteRoomMutation]
  );

  // --- Table Instance ---
  const table = useReactTable({
    data: roomsForCurrentPage,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    state: { sorting, columnFilters, pagination },
    pageCount: totalPages,
  });

  // Get unique status values
  const uniqueStatusValues = useMemo(() => {
    const statusColumn = table.getColumn("availability_status");
    if (!statusColumn) return [];
    const values = Array.from(statusColumn.getFacetedUniqueValues().keys());
    return values.sort();
  }, [table.getColumn("availability_status")?.getFacetedUniqueValues()]);

  // Get counts for each status
  const statusCounts = useMemo(() => {
    const statusColumn = table.getColumn("availability_status");
    if (!statusColumn) return new Map();
    return statusColumn.getFacetedUniqueValues();
  }, [table.getColumn("availability_status")?.getFacetedUniqueValues()]);

  const selectedStatuses = useMemo(() => {
    const filterValue = table
      .getColumn("availability_status")
      ?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [table.getColumn("availability_status")?.getFilterValue()]);

  const handleStatusChange = (checked: boolean, value: string) => {
    const filterValue = table
      .getColumn("availability_status")
      ?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];
    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }
    table
      .getColumn("availability_status")
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    selectedRows.forEach((row) => {
      deleteRoomMutation.mutate(row.original.id);
    });
    table.resetRowSelection();
  };

  if (isError) {
    return <ErrorPage error={error as Error} onRetry={refetch} />;
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Rooms Under Maintenance
            </h2>
            <Badge className="px-4 py-1 rounded-full" variant={"outline"}>
              Total Maintenance Rooms:{" "}
              <span className="font-bold text-gray-700 ml-1">
                {totalRoomsCount}
              </span>
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              className="gap-1 bg-[#0EB981] text-[#FFF] border-none hover:bg-[#04966A] hover:text-[#FFF] cursor-pointer shadow"
              variant="outline"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <TbFileTypeCsv className="mr-2 h-4 w-4" />
              )}
              {isExporting ? "Exporting..." : "Export to CSV"}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Input
                id={`${id}-input`}
                ref={inputRef}
                className={cn("peer min-w-60 ps-9", globalFilter && "pe-9")}
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Filter by code, description..."
                type="text"
                aria-label="Filter by code, description"
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <Search size={16} aria-hidden="true" />
              </div>
              {globalFilter && (
                <button
                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Clear filter"
                  onClick={() => {
                    setGlobalFilter("");
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }}
                >
                  <CircleXIcon size={16} aria-hidden="true" />
                </button>
              )}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <FilterIcon
                    className="-ms-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Status
                  {selectedStatuses.length > 0 && (
                    <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                      {selectedStatuses.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto min-w-36 p-3" align="start">
                <div className="space-y-3">
                  <div className="text-muted-foreground text-xs font-medium">
                    Status Filters
                  </div>
                  <div className="space-y-3">
                    {uniqueStatusValues.map((value, i) => (
                      <div key={value} className="flex items-center gap-2">
                        <Checkbox
                          id={`${id}-status-${i}`}
                          checked={selectedStatuses.includes(value)}
                          onCheckedChange={(checked: boolean) =>
                            handleStatusChange(checked, value)
                          }
                          className="border-[#DADCE0] border-[1.5px] data-[state=checked]:bg-[#0081FB] data-[state=checked]:text-[#FFF]"
                        />
                        <Label
                          htmlFor={`${id}-status-${i}`}
                          className="flex grow justify-between gap-2 font-normal"
                        >
                          {value}
                          <span className="text-muted-foreground ms-2 text-xs">
                            {statusCounts.get(value)}
                          </span>
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
                  <Columns3Icon
                    className="-ms-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      onSelect={(event) => event.preventDefault()}
                    >
                      {column.id}
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
                    <Trash2
                      className="-ms-1 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Delete
                    <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                      {table.getSelectedRowModel().rows.length}
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{" "}
                      {table.getSelectedRowModel().rows.length} selected{" "}
                      {table.getSelectedRowModel().rows.length === 1
                        ? "room"
                        : "rooms"}
                      .
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
              onClick={() => refetch()}
              disabled={isRefetching || isLoading}
            >
              <IoRefreshOutline
                className={cn("mr-2 h-4 w-4", isRefetching && "animate-spin")}
              />
              Refresh
            </Button>
          </div>
        </div>

        <div className="bg-background overflow-hidden rounded-md border">
          <Table className="table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="h-11"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
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
                    <div className="w-full flex items-center justify-center">
                      <Loader />
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="last:py-0">
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
                    Currently There are no rooms under maintenance.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between gap-8 mt-4">
          <div className="flex items-center gap-3 w-full"></div>
          <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
            <p aria-live="polite">
              <span className="text-foreground">
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}
                -
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  totalRoomsCount
                )}
              </span>{" "}
              of <span className="text-foreground">{totalRoomsCount}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="icon"
              variant="outline"
              className="disabled:pointer-events-none disabled:opacity-50"
              onClick={() => table.firstPage()}
              disabled={!hasPreviousPage}
              aria-label="Go to first page"
            >
              <ChevronFirstIcon size={16} aria-hidden="true" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="disabled:pointer-events-none disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!hasPreviousPage}
              aria-label="Go to previous page"
            >
              <ChevronLeftIcon size={16} aria-hidden="true" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="disabled:pointer-events-none disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!hasNextPage}
              aria-label="Go to next page"
            >
              <ChevronRightIcon size={16} aria-hidden="true" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="disabled:pointer-events-none disabled:opacity-50"
              onClick={() => table.lastPage()}
              disabled={!hasNextPage}
              aria-label="Go to last page"
            >
              <ChevronLastIcon size={16} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RowActions({ row }: { row: Row<Room> }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteRoomMutation = useMutation({
    mutationFn: (roomId: string) => hotelClient.delete(`/rooms/${roomId}/`),
    onSuccess: () => {
      toast.success("Room deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["maintenance-rooms"] });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to delete room: ${
          error.response?.data?.detail || error.message
        }`
      );
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      roomId,
      status,
    }: {
      roomId: string;
      status: "Available" | "Booked";
    }) =>
      hotelClient.patch(`/rooms/${roomId}/`, { availability_status: status }),
    onSuccess: () => {
      toast.success("Room status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["maintenance-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["available-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["booked-rooms"] });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to update room status: ${
          error.response?.data?.detail || error.message
        }`
      );
    },
  });

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
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() =>
              updateStatusMutation.mutate({
                roomId: row.original.id,
                status: "Available",
              })
            }
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            <span>Mark as Available</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              updateStatusMutation.mutate({
                roomId: row.original.id,
                status: "Booked",
              })
            }
          >
            <BookCheck className="mr-2 h-4 w-4" />
            <span>Mark as Booked</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => deleteRoomMutation.mutate(row.original.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
