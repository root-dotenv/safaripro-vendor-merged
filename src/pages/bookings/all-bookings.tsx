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
import { format } from "date-fns";
import { toast } from "sonner";
import Papa from "papaparse";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CircleXIcon,
  Columns3Icon,
  DoorOpen,
  EllipsisIcon,
  Eye,
  FilterIcon,
  Loader2,
  Plus,
  Search,
  Trash2,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Users,
} from "lucide-react";
import { TbFileTypeCsv } from "react-icons/tb";
import { Checkbox } from "@/components/ui/checkbox";
import bookingClient from "@/api/booking-client";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

// --- Type Definitions ---
interface Booking {
  id: string;
  payment_status: "Paid" | "Pending" | "Failed";
  full_name: string;
  code: string;
  phone_number: string | number;
  email: string;
  start_date: string;
  end_date: string;
  booking_status:
    | "Confirmed"
    | "Processing"
    | "Checked In"
    | "Checked Out"
    | "Cancelled";
  booking_type: "Physical" | "Online";
  amount_paid: string;
  payment_reference: string;
}

interface PaginatedBookingsResponse {
  count: number;
  results: Booking[];
}

// --- Custom Filter Functions ---
const multiColumnFilterFn: FilterFn<Booking> = (row, columnId, filterValue) => {
  const searchableRowContent =
    `${row.original.full_name} ${row.original.email} ${row.original.code} ${row.original.phone_number}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const statusFilterFn: FilterFn<Booking> = (
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

// --- Helper Functions ---
const getStatusBadgeClasses = (status: string): string => {
  switch (status?.toLowerCase()) {
    case "completed":
    case "checked in":
    case "confirmed":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
    case "checked out":
      return "bg-muted-foreground/60 text-primary-foreground";
    case "pending":
    case "processing":
    case "reserved":
    case "in progress":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getBookingTypeBadgeClasses = (type: string): string => {
  return type === "Physical"
    ? "bg-blue-100 text-blue-800 border-blue-200"
    : "bg-yellow-100 text-yellow-800 border-yellow-200";
};

// --- Main Component ---
export default function AllBookings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;
  const BOOKINGS_PER_PAGE = 10;
  const id = useId();

  // --- State ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: BOOKINGS_PER_PAGE,
  });
  const debouncedGlobalFilter = useDebounce(globalFilter, 300);
  const [isExporting, setIsExporting] = useState(false);
  const [checkInError, setCheckInError] = useState<{ code: string } | null>(
    null
  );
  const [checkingInId, setCheckingInId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Data Queries & Mutations ---
  const {
    data: paginatedResponse,
    isLoading: isTableLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<PaginatedBookingsResponse>({
    queryKey: [
      "allBookings",
      HOTEL_ID,
      pagination.pageIndex + 1,
      debouncedGlobalFilter,
      sorting,
      columnFilters,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        microservice_item_id: HOTEL_ID!,
        page: String(pagination.pageIndex + 1),
        page_size: String(pagination.pageSize),
      });
      if (debouncedGlobalFilter) params.append("search", debouncedGlobalFilter);
      if (sorting.length > 0) {
        const sortKey = sorting[0].id;
        const sortDir = sorting[0].desc ? "-" : "";
        params.append("ordering", `${sortDir}${sortKey}`);
      }
      const response = await bookingClient.get(`/bookings`, { params });
      return response.data;
    },
    keepPreviousData: true,
    enabled: !!HOTEL_ID,
  });

  const { data: checkedInData, isLoading: isCheckInLoading } =
    useQuery<PaginatedBookingsResponse>({
      queryKey: ["activeCheckIns", HOTEL_ID],
      queryFn: async () => {
        const params = new URLSearchParams({
          microservice_item_id: HOTEL_ID!,
          booking_status: "Checked In",
        });
        const response = await bookingClient.get(`/bookings`, { params });
        return response.data;
      },
      enabled: !!HOTEL_ID,
    });
  const activeCheckInsCount = checkedInData?.count ?? 0;

  const checkInMutation = useMutation({
    mutationFn: (bookingId: string) => {
      setCheckingInId(bookingId);
      return bookingClient.post(`/bookings/${bookingId}/check_in`);
    },
    onSuccess: () => {
      toast.success("Guest checked in successfully!");
      queryClient.invalidateQueries({ queryKey: ["allBookings"] });
      queryClient.invalidateQueries({ queryKey: ["activeCheckIns"] });
    },
    onError: (error: any) => {
      toast.error(
        `Check-in failed: ${error.response?.data?.detail || error.message}`
      );
    },
    onSettled: () => {
      setCheckingInId(null);
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: (bookingId: string) =>
      bookingClient.delete(`/bookings/${bookingId}`),
    onSuccess: () => {
      toast.success("Booking deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["allBookings"] });
      queryClient.invalidateQueries({ queryKey: ["activeCheckIns"] });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to delete booking: ${
          error.response?.data?.detail || error.message
        }`
      );
    },
  });

  const bookingsForCurrentPage = paginatedResponse?.results ?? [];
  const totalBookingsCount = paginatedResponse?.count ?? 0;
  const totalPages = Math.ceil(totalBookingsCount / BOOKINGS_PER_PAGE);

  const summaryData = useMemo(() => {
    const totalEarnings = bookingsForCurrentPage.reduce(
      (acc, b) =>
        acc + (b.payment_status === "Paid" ? parseFloat(b.amount_paid) : 0),
      0
    );
    return { totalEarnings };
  }, [bookingsForCurrentPage]);

  // --- Export to CSV Function ---
  const handleExport = useCallback(async () => {
    if (!totalBookingsCount) {
      toast.info("No bookings to export.");
      return;
    }

    setIsExporting(true);
    toast.info("Exporting all bookings, please wait...");

    try {
      const params = new URLSearchParams({
        microservice_item_id: HOTEL_ID!,
        page_size: String(totalBookingsCount),
      });
      if (debouncedGlobalFilter) params.append("search", debouncedGlobalFilter);
      if (sorting.length > 0) {
        params.append(
          "ordering",
          `${sorting[0].desc ? "-" : ""}${sorting[0].id}`
        );
      }

      const response = await bookingClient.get<PaginatedBookingsResponse>(
        `/bookings`,
        { params }
      );
      const allBookings = response.data.results;

      const csvData = allBookings.map((b) => ({
        "Booking Code": b.code,
        "Guest Name": b.full_name,
        Email: b.email,
        "Phone Number": b.phone_number,
        "Check-in Date": format(new Date(b.start_date), "yyyy-MM-dd"),
        "Check-out Date": format(new Date(b.end_date), "yyyy-MM-dd"),
        "Booking Status": b.booking_status,
        "Payment Status": b.payment_status,
        "Amount Paid": b.amount_paid,
        "Payment Reference": b.payment_reference,
      }));

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `safaripro_bookings_export_${format(new Date(), "yyyy-MM-dd")}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Bookings exported successfully!");
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("An error occurred during the export.");
    } finally {
      setIsExporting(false);
    }
  }, [HOTEL_ID, totalBookingsCount, debouncedGlobalFilter, sorting]);

  // --- Table Column Definitions ---
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
            className="border-[#d6d5d5] border-[1.5px] data-[state=checked]:bg-[#d6d5d5] data-[state=checked]:text-transparent"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="border-[#d6d5d5] border-[1.5px] data-[state=checked]:bg-[#d6d5d5] data-[state=checked]:text-transparent"
          />
        ),
        size: 28,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "full_name",
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
            Guest
            {{
              asc: <ChevronUpIcon className="shrink-0 opacity-60" size={16} />,
              desc: (
                <ChevronDownIcon className="shrink-0 opacity-60" size={16} />
              ),
            }[column.getIsSorted() as string] ?? null}
          </div>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.original.full_name}</div>
        ),
        size: 180,
        filterFn: multiColumnFilterFn,
        enableHiding: false,
      },
      {
        accessorKey: "start_date",
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
            Stay Dates
            {{
              asc: <ChevronUpIcon className="shrink-0 opacity-60" size={16} />,
              desc: (
                <ChevronDownIcon className="shrink-0 opacity-60" size={16} />
              ),
            }[column.getIsSorted() as string] ?? null}
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-left">
            {format(new Date(row.original.start_date), "PP")} -{" "}
            {format(new Date(row.original.end_date), "PP")}
          </div>
        ),
        size: 220,
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
        size: 100,
        filterFn: statusFilterFn,
      },
      {
        accessorKey: "booking_status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            className={cn(getStatusBadgeClasses(row.original.booking_status))}
          >
            {row.original.booking_status}
          </Badge>
        ),
        size: 100,
        filterFn: statusFilterFn,
      },
      {
        accessorKey: "amount_paid",
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
            Amount (TZS)
            {{
              asc: <ChevronUpIcon className="shrink-0 opacity-60" size={16} />,
              desc: (
                <ChevronDownIcon className="shrink-0 opacity-60" size={16} />
              ),
            }[column.getIsSorted() as string] ?? null}
          </div>
        ),
        cell: ({ row }) => {
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "TZS",
          }).format(parseFloat(row.original.amount_paid));
          return <div className="font-medium">{formatted}</div>;
        },
        size: 120,
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <RowActions row={row} />,
        size: 60,
        enableHiding: false,
      },
    ],
    [navigate, deleteBookingMutation, checkInMutation, checkingInId]
  );

  // --- Table Instance ---
  const table = useReactTable({
    data: bookingsForCurrentPage,
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
    const statusColumn = table.getColumn("booking_status");
    if (!statusColumn) return [];
    const values = Array.from(statusColumn.getFacetedUniqueValues().keys());
    return values.sort();
  }, [table.getColumn("booking_status")?.getFacetedUniqueValues()]);

  // Get unique booking type values
  const uniqueBookingTypeValues = useMemo(() => {
    const bookingTypeColumn = table.getColumn("booking_type");
    if (!bookingTypeColumn) return [];
    const values = Array.from(
      bookingTypeColumn.getFacetedUniqueValues().keys()
    );
    return values.sort();
  }, [table.getColumn("booking_type")?.getFacetedUniqueValues()]);

  // Get counts for each status
  const statusCounts = useMemo(() => {
    const statusColumn = table.getColumn("booking_status");
    if (!statusColumn) return new Map();
    return statusColumn.getFacetedUniqueValues();
  }, [table.getColumn("booking_status")?.getFacetedUniqueValues()]);

  // Get counts for each booking type
  const bookingTypeCounts = useMemo(() => {
    const bookingTypeColumn = table.getColumn("booking_type");
    if (!bookingTypeColumn) return new Map();
    return bookingTypeColumn.getFacetedUniqueValues();
  }, [table.getColumn("booking_type")?.getFacetedUniqueValues()]);

  const selectedStatuses = useMemo(() => {
    const filterValue = table
      .getColumn("booking_status")
      ?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [table.getColumn("booking_status")?.getFilterValue()]);

  const selectedBookingTypes = useMemo(() => {
    const filterValue = table
      .getColumn("booking_type")
      ?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [table.getColumn("booking_type")?.getFilterValue()]);

  const handleStatusChange = (checked: boolean, value: string) => {
    const filterValue = table
      .getColumn("booking_status")
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
      .getColumn("booking_status")
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  const handleBookingTypeChange = (checked: boolean, value: string) => {
    const filterValue = table
      .getColumn("booking_type")
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
      .getColumn("booking_type")
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    selectedRows.forEach((row) => {
      deleteBookingMutation.mutate(row.original.id);
    });
    table.resetRowSelection();
  };

  if (isError)
    return (
      <div className="p-6 text-red-600">Error: {(error as Error).message}</div>
    );

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">All Bookings</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <TbFileTypeCsv className="mr-2 h-4 w-4" />
              )}
              {isExporting ? "Exporting..." : "Export"}
            </Button>
            <Button
              onClick={() => navigate("/bookings/new-booking")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" /> New Booking
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue (This Page)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                TZS {summaryData.totalEarnings?.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on currently visible bookings
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookingsCount}</div>
              <p className="text-xs text-muted-foreground">Across all pages</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Check-ins
              </CardTitle>
              <DoorOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isCheckInLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  activeCheckInsCount
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Guests currently checked in
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bookings List</CardTitle>
            <CardDescription>
              A comprehensive list of all bookings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Input
                    id={`${id}-input`}
                    ref={inputRef}
                    className={cn(
                      "peer min-w-60 ps-9",
                      Boolean(table.getColumn("full_name")?.getFilterValue()) &&
                        "pe-9"
                    )}
                    value={
                      (table.getColumn("full_name")?.getFilterValue() ??
                        "") as string
                    }
                    onChange={(e) =>
                      table
                        .getColumn("full_name")
                        ?.setFilterValue(e.target.value)
                    }
                    placeholder="Search by guest, code, email, phone..."
                    type="text"
                    aria-label="Search by guest, code, email, phone"
                  />
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                    <Search size={16} aria-hidden="true" />
                  </div>
                  {Boolean(table.getColumn("full_name")?.getFilterValue()) && (
                    <button
                      className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Clear search"
                      onClick={() => {
                        table.getColumn("full_name")?.setFilterValue("");
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
                              className="border-[#d6d5d5] border-[1.5px] data-[state=checked]:bg-[#d6d5d5] data-[state=checked]:text-transparent"
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <FilterIcon
                        className="-ms-1 opacity-60"
                        size={16}
                        aria-hidden="true"
                      />
                      Booking Type
                      {selectedBookingTypes.length > 0 && (
                        <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                          {selectedBookingTypes.length}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto min-w-36 p-3" align="start">
                    <div className="space-y-3">
                      <div className="text-muted-foreground text-xs font-medium">
                        Booking Type Filters
                      </div>
                      <div className="space-y-3">
                        {uniqueBookingTypeValues.map((value, i) => (
                          <div key={value} className="flex items-center gap-2">
                            <Checkbox
                              id={`${id}-booking-type-${i}`}
                              className="border-[#d6d5d5] border-[1.5px] data-[state=checked]:bg-[#d6d5d5] data-[state=checked]:text-transparent"
                              checked={selectedBookingTypes.includes(value)}
                              onCheckedChange={(checked: boolean) =>
                                handleBookingTypeChange(checked, value)
                              }
                            />
                            <Label
                              htmlFor={`${id}-booking-type-${i}`}
                              className="flex grow justify-between gap-2 font-normal"
                            >
                              {value}
                              <span className="text-muted-foreground ms-2 text-xs">
                                {bookingTypeCounts.get(value)}
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
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete{" "}
                          {table.getSelectedRowModel().rows.length} selected{" "}
                          {table.getSelectedRowModel().rows.length === 1
                            ? "booking"
                            : "bookings"}
                          . This action cannot be undone.
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
                  disabled={isRefetching || isTableLoading}
                >
                  <Loader2
                    className={cn(
                      "mr-2 h-4 w-4",
                      isRefetching && "animate-spin"
                    )}
                  />
                  Refresh
                </Button>
              </div>
            </div>

            <div className="bg-background overflow-hidden rounded-md border mt-4">
              <Table className="table-fixed">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="hover:bg-transparent"
                    >
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
                  {isTableLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        Loading bookings...
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
                        No bookings found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between gap-8 mt-4">
              <div className="flex items-center gap-3">
                <Label htmlFor={id} className="max-sm:sr-only">
                  Rows per page
                </Label>
                <Select
                  value={table.getState().pagination.pageSize.toString()}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger id={id} className="w-fit whitespace-nowrap">
                    <SelectValue placeholder="Select number of results" />
                  </SelectTrigger>
                  <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                    {[5, 10, 25, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={pageSize.toString()}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                      table.getRowCount()
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="text-foreground">
                    {table.getRowCount().toString()}
                  </span>
                </p>
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      size="icon"
                      variant="outline"
                      className="disabled:pointer-events-none disabled:opacity-50"
                      onClick={() => table.firstPage()}
                      disabled={!table.getCanPreviousPage()}
                      aria-label="Go to first page"
                    >
                      <ChevronFirstIcon size={16} aria-hidden="true" />
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      size="icon"
                      variant="outline"
                      className="disabled:pointer-events-none disabled:opacity-50"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      aria-label="Go to previous page"
                    >
                      <ChevronLeftIcon size={16} aria-hidden="true" />
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      size="icon"
                      variant="outline"
                      className="disabled:pointer-events-none disabled:opacity-50"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                      aria-label="Go to next page"
                    >
                      <ChevronRightIcon size={16} aria-hidden="true" />
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      size="icon"
                      variant="outline"
                      className="disabled:pointer-events-none disabled:opacity-50"
                      onClick={() => table.lastPage()}
                      disabled={!table.getCanNextPage()}
                      aria-label="Go to last page"
                    >
                      <ChevronLastIcon size={16} aria-hidden="true" />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>

        <AlertDialog
          open={!!checkInError}
          onOpenChange={() => setCheckInError(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Check-in Not Allowed</AlertDialogTitle>
              <AlertDialogDescription>
                The guest with booking code{" "}
                <span className="font-semibold">{checkInError?.code}</span>{" "}
                cannot be checked in. A booking must be "Confirmed" to allow
                check-in.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setCheckInError(null)}>
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}

function RowActions({ row }: { row: Row<Booking> }) {
  const navigate = useNavigate();
  const checkInMutation = useMutation({
    mutationFn: (bookingId: string) =>
      bookingClient.post(`/bookings/${bookingId}/check_in`),
    onSuccess: () => {
      toast.success("Guest checked in successfully!");
      queryClient.invalidateQueries({ queryKey: ["allBookings"] });
      queryClient.invalidateQueries({ queryKey: ["activeCheckIns"] });
    },
    onError: (error: any) => {
      toast.error(
        `Check-in failed: ${error.response?.data?.detail || error.message}`
      );
    },
  });
  const deleteBookingMutation = useMutation({
    mutationFn: (bookingId: string) =>
      bookingClient.delete(`/bookings/${bookingId}`),
    onSuccess: () => {
      toast.success("Booking deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["allBookings"] });
      queryClient.invalidateQueries({ queryKey: ["activeCheckIns"] });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to delete booking: ${
          error.response?.data?.detail || error.message
        }`
      );
    },
  });

  const booking = row.original;
  const canCheckIn = booking.booking_status === "Confirmed";
  const isCheckingIn = checkInMutation.isPending;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none"
            aria-label="Booking actions"
          >
            <EllipsisIcon size={16} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate(`/bookings/${booking.id}`)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (canCheckIn) {
                checkInMutation.mutate(booking.id);
              } else {
                setCheckInError({ code: booking.code });
              }
            }}
            disabled={!canCheckIn || isCheckingIn}
          >
            {isCheckingIn ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <DoorOpen className="mr-2 h-4 w-4" />
            )}
            Check In
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => deleteBookingMutation.mutate(booking.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
