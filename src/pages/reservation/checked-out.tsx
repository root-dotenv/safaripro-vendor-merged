"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  DoorOpen,
  Plus,
  Eye,
  Trash2,
  ArrowUpDown,
  Loader2,
  Search,
  CircleXIcon,
  RefreshCw,
  Loader,
} from "lucide-react";
import { CiGrid42 } from "react-icons/ci";
import { TbFileTypeCsv } from "react-icons/tb";

import bookingClient from "@/api/booking-client";
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
import ServerPagination from "@/components/comp-459";
import { cn } from "@/lib/utils";
import ErrorPage from "@/components/custom/error-page";

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
  checkout: string | null;
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

// --- useDebounce Hook ---
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
const getBookingTypeBadgeClasses = (type: string): string => {
  return type === "Physical"
    ? "bg-blue-100 text-blue-800 border-blue-200"
    : "bg-yellow-100 text-yellow-800 border-yellow-200";
};

// --- Main Component ---
export default function CheckedOutGuests() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;
  const BOOKINGS_PER_PAGE = 10;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedGlobalFilter = useDebounce(globalFilter, 300);
  const [isExporting, setIsExporting] = useState(false);

  // --- Query for fetching guests ---
  const {
    data: paginatedResponse,
    isLoading: isTableLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<PaginatedBookingsResponse>({
    queryKey: [
      "allGuestsForCheckoutFilter",
      HOTEL_ID,
      currentPage,
      debouncedGlobalFilter,
      sorting,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        microservice_item_id: HOTEL_ID!,
        page: String(currentPage),
        page_size: String(BOOKINGS_PER_PAGE),
      });
      if (debouncedGlobalFilter) params.append("search", debouncedGlobalFilter);
      if (sorting.length > 0) {
        params.append(
          "ordering",
          `${sorting[0].desc ? "-" : ""}${sorting[0].id}`
        );
      }
      const response = await bookingClient.get(`/bookings`, { params });
      return response.data;
    },
    keepPreviousData: true,
    enabled: !!HOTEL_ID,
  });

  // --- Client-side filtering logic ---
  const checkedOutGuests = useMemo(() => {
    const allBookings = paginatedResponse?.results ?? [];
    return allBookings.filter(
      (booking) =>
        booking.booking_status === "Checked Out" || booking.checkout !== null
    );
  }, [paginatedResponse]);

  const totalCheckedOutCountOnPage = checkedOutGuests.length;
  const totalPages = Math.ceil(
    (paginatedResponse?.count ?? 0) / BOOKINGS_PER_PAGE
  );

  const deleteBookingMutation = useMutation({
    mutationFn: (bookingId: string) =>
      bookingClient.delete(`/bookings/${bookingId}`),
    onSuccess: () => {
      toast.success("Booking deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["allGuestsForCheckoutFilter"],
      });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to delete booking: ${
          error.response?.data?.detail || error.message
        }`
      );
    },
  });

  // --- NEW: CSV Export Logic ---
  const handleExportCSV = useCallback(async () => {
    setIsExporting(true);
    toast.info("Preparing CSV export...");
    try {
      const response = await bookingClient.get(`/bookings`, {
        params: {
          microservice_item_id: HOTEL_ID!,
          page_size: paginatedResponse?.count || BOOKINGS_PER_PAGE,
        },
      });

      const allGuests: Booking[] = response.data.results.filter(
        (booking: Booking) =>
          booking.booking_status === "Checked Out" || booking.checkout !== null
      );

      if (!allGuests || allGuests.length === 0) {
        toast.warning("No checked-out guests to export.");
        return;
      }

      const dataForCsv = allGuests.map((booking) => ({
        "Booking Code": booking.code,
        "Guest Name": booking.full_name,
        "Check-in Date": format(new Date(booking.start_date), "yyyy-MM-dd"),
        "Check-out Date": format(new Date(booking.end_date), "yyyy-MM-dd"),
        "Booking Type": booking.booking_type,
        "Payment Status": booking.payment_status,
      }));

      const csv = Papa.unparse(dataForCsv);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `checked-out-guests-${format(new Date(), "yyyy-MM-dd")}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Export successful!");
    } catch (err) {
      toast.error("Failed to export data.");
    } finally {
      setIsExporting(false);
    }
  }, [HOTEL_ID, paginatedResponse?.count]);

  // --- CHANGE: Updated Columns with Left-Alignment ---
  const columns = useMemo<ColumnDef<Booking>[]>(
    () => [
      {
        accessorKey: "full_name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Guest <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-left font-medium">{row.original.full_name}</div>
        ),
      },
      {
        accessorKey: "start_date",
        header: "Check-in Date",
        cell: ({ row }) => (
          <div className="text-left">
            {format(new Date(row.original.start_date), "PP")}
          </div>
        ),
      },
      {
        accessorKey: "end_date",
        header: "Check-out Date",
        cell: ({ row }) => (
          <div className="text-left">
            {format(new Date(row.original.end_date), "PP")}
          </div>
        ),
      },
      {
        accessorKey: "booking_type",
        header: "Booking Type",
        cell: ({ row }) => (
          <div className="flex justify-start">
            <Badge
              className={cn(
                getBookingTypeBadgeClasses(row.original.booking_type)
              )}
            >
              {row.original.booking_type}
            </Badge>
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/bookings/${row.original.id}`)}
              title="View Booking Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Delete Booking">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the booking for{" "}
                    <span className="font-semibold">
                      {row.original.full_name}
                    </span>{" "}
                    ({row.original.code}). This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      deleteBookingMutation.mutate(row.original.id)
                    }
                    className="bg-destructive text-white hover:bg-destructive/90"
                    disabled={deleteBookingMutation.isPending}
                  >
                    {deleteBookingMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Yes, delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ),
      },
    ],
    [navigate, deleteBookingMutation]
  );

  const table = useReactTable({
    data: checkedOutGuests,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    state: { sorting },
    onSortingChange: setSorting,
    pageCount: totalPages,
  });

  if (isError) return <ErrorPage error={error as Error} onRetry={refetch} />;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Checked-Out Guests
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleExportCSV}
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

      <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Checked Out
            </CardTitle>
            <DoorOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isTableLoading && !paginatedResponse ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                totalCheckedOutCountOnPage
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Guests who have completed their stay (on this page)
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-0 border-none bg-none shadow-none">
        <CardHeader>
          <CardTitle>Checked-Out Guests List</CardTitle>
          <CardDescription>
            A list of all guests who have completed their stay.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-4">
            <div className="relative">
              <Input
                className="peer min-w-60 ps-9"
                value={globalFilter}
                onChange={(e) => {
                  setGlobalFilter(e.target.value);
                  setCurrentPage(1);
                }}
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
                    setCurrentPage(1);
                  }}
                >
                  <CircleXIcon size={16} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => refetch()}
                disabled={isRefetching || isTableLoading}
              >
                {isRefetching ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}{" "}
                Refresh
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <CiGrid42 className="mr-2" /> View
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
                        {c.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((h) => (
                      <TableHead key={h.id} className="text-left">
                        {h.isPlaceholder
                          ? null
                          : flexRender(
                              h.column.columnDef.header,
                              h.getContext()
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
                      No checked-out guests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end items-center mt-4">
            {totalPages > 1 && (
              <ServerPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
