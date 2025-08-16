"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
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
  type PaginationState,
} from "@tanstack/react-table";
import { format } from "date-fns";

import {
  CircleXIcon,
  Columns3Icon,
  Eye,
  FilterIcon,
  Loader2,
  Search,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Receipt,
  Loader,
} from "lucide-react";
import { TbFileTypeCsv } from "react-icons/tb";

// Local Imports
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { IoRefreshOutline } from "react-icons/io5";
import axios from "axios";
import { DualCurrencyDisplay } from "./DualCurrencyDisplay";
import { InvoiceTicket } from "./invoice-ticket";
import ErrorPage from "@/components/custom/error-page";

// --- Type Definitions ---
interface Invoice {
  id: string;
  invoice_number: string;
  booking_id: string;
  total_amount: string;
  currency: string;
  status: "DRAFT" | "ISSUED" | "PAID" | "OVERDUE" | "CANCELLED";
  amount_paid: string;
  issue_date: string;
}
interface Booking {
  id: string;
  full_name: string;
  payment_reference: string;
}
type InvoiceWithBooking = Invoice & { booking?: Booking | null };
interface PaginatedInvoicesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Invoice[];
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

// --- Helper Functions ---
const getStatusBadgeClasses = (status: string): string => {
  switch (status?.toUpperCase()) {
    case "PAID":
      return "bg-green-100 text-green-800 border-green-200";
    case "ISSUED":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "DRAFT":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "OVERDUE":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatCurrencySimple = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount
  );
};

// --- Main Component ---
export default function SafariProInvoices() {
  const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;

  // --- State ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const debouncedGlobalFilter = useDebounce(globalFilter, 500);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Data Queries ---
  const {
    data: paginatedResponse,
    isLoading: isTableLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<PaginatedInvoicesResponse>({
    queryKey: [
      "allInvoices",
      HOTEL_ID,
      pagination,
      sorting,
      columnFilters,
      debouncedGlobalFilter,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        hotel_id: HOTEL_ID!,
        limit: String(pagination.pageSize),
        offset: String(pagination.pageIndex * pagination.pageSize),
      });
      if (debouncedGlobalFilter) params.append("search", debouncedGlobalFilter);
      if (sorting.length > 0)
        params.append(
          "ordering",
          `${sorting[0].desc ? "-" : ""}${sorting[0].id}`
        );
      columnFilters.forEach((filter) => {
        if (Array.isArray(filter.value) && filter.value.length > 0) {
          filter.value.forEach((value) =>
            params.append(filter.id, value as string)
          );
        }
      });
      const response = await axios.get(
        `http://192.168.1.193:8030/api/v1/invoices?hotel_id=${HOTEL_ID}`,
        { params }
      );
      return response.data;
    },
    enabled: !!HOTEL_ID,
    placeholderData: keepPreviousData,
  });

  const invoiceResults = paginatedResponse?.results;
  const { data: bookingData, isLoading: areBookingsLoading } = useQuery<{
    [key: string]: Booking;
  }>({
    queryKey: [
      "bookingDetailsForInvoices",
      invoiceResults?.map((inv) => inv.booking_id),
    ],
    queryFn: async () => {
      if (!invoiceResults || invoiceResults.length === 0) return {};
      const bookingPromises = invoiceResults.map((invoice) =>
        axios
          .get(
            `http://192.168.1.193:8010/api/v1/bookings/${invoice.booking_id}`
          )
          .then((res) => ({ [invoice.booking_id]: res.data }))
          .catch(() => ({ [invoice.booking_id]: null }))
      );
      const results = await Promise.all(bookingPromises);
      return Object.assign({}, ...results);
    },
    enabled: !!invoiceResults && invoiceResults.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const invoicesWithBookingData = useMemo<InvoiceWithBooking[]>(() => {
    return (
      invoiceResults?.map((invoice) => ({
        ...invoice,
        booking: bookingData?.[invoice.booking_id],
      })) ?? []
    );
  }, [invoiceResults, bookingData]);

  const totalInvoicesCount = paginatedResponse?.count ?? 0;
  const totalPages = Math.ceil(totalInvoicesCount / pagination.pageSize);

  const summaryData = useMemo(() => {
    const totalsByCurrency = invoicesWithBookingData.reduce((acc, inv) => {
      if (!acc[inv.currency]) {
        acc[inv.currency] = 0;
      }
      acc[inv.currency] += parseFloat(inv.total_amount);
      return acc;
    }, {} as Record<string, number>);

    return { totalsByCurrency };
  }, [invoicesWithBookingData]);

  const handleExport = useCallback(async () => {
    /* ... same as before ... */
  }, []);

  const columns = useMemo<ColumnDef<InvoiceWithBooking>[]>(
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
            className="border-[#DADCE0] border-[1.5px] data-[state=checked]:bg-[#DADCE0] data-[state=checked]:text-[#9a9a9a]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="border-[#DADCE0] border-[1.5px] data-[state=checked]:bg-[#DADCE0] data-[state=checked]:text-[#9a9a9a]"
          />
        ),
        size: 40,
      },
      {
        accessorKey: "invoice_number",
        header: "Invoice #",
        cell: ({ row }) => (
          <div className="font-mono text-xs">{row.original.invoice_number}</div>
        ),
        size: 220,
      },
      {
        id: "payment_reference",
        header: "Payment Ref",
        cell: ({ row }) =>
          areBookingsLoading ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            <div className="text-sm font-mono text-muted-foreground">
              {row.original.booking?.payment_reference || "N/A"}
            </div>
          ),
        size: 220,
      },
      {
        accessorKey: "issue_date",
        header: "Issue Date",
        cell: ({ row }) => format(new Date(row.original.issue_date), "PP"),
        size: 140,
      },
      {
        accessorKey: "total_amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => (
          <DualCurrencyDisplay
            amount={row.original.total_amount}
            currency={row.original.currency}
          />
        ),
        size: 160,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            className={cn(
              "text-center",
              getStatusBadgeClasses(row.original.status)
            )}
          >
            {row.original.status}
          </Badge>
        ),
        enableColumnFilter: true,
        size: 120,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="text-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedInvoice(row.original)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        ),
        size: 60,
      },
    ],
    [areBookingsLoading]
  );

  const table = useReactTable({
    data: invoicesWithBookingData,
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

  const uniqueStatusValues = useMemo(
    () => ["DRAFT", "ISSUED", "PAID", "OVERDUE", "CANCELLED"].sort(),
    []
  );
  const selectedStatuses =
    (table.getColumn("status")?.getFilterValue() as string[]) ?? [];
  const handleStatusChange = (checked: boolean, value: string) => {
    const newFilter = checked
      ? [...selectedStatuses, value]
      : selectedStatuses.filter((v) => v !== value);
    table
      .getColumn("status")
      ?.setFilterValue(newFilter.length ? newFilter : undefined);
  };

  if (isError) return <ErrorPage error={error as Error} onRetry={refetch} />;

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">All Invoices</h2>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
            className="gap-1 rounded-md bg-green-600 text-[#FFF] border-none hover:bg-green-700 hover:text-[#FFF] cursor-pointer"
          >
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <TbFileTypeCsv className="mr-2 h-4 w-4" />
            )}
            Export
          </Button>
        </div>

        <div className="grid px-6 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Invoiced (This Page)
              </CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isTableLoading ? (
                <Skeleton className="h-8 w-3/4" />
              ) : (
                Object.entries(summaryData.totalsByCurrency).map(
                  ([currency, total]) => (
                    <div key={currency} className="text-2xl font-bold">
                      {formatCurrencySimple(total, currency)}
                    </div>
                  )
                )
              )}
              <p className="text-xs text-muted-foreground">
                Based on currently visible invoices
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Invoices
              </CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInvoicesCount}</div>
              <p className="text-xs text-muted-foreground">Across all pages</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-none p-0 shadow-none border-none">
          <CardHeader>
            <CardTitle>Invoices List</CardTitle>
            <CardDescription>
              A comprehensive list of all invoices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    placeholder="Search by invoice#, ref..."
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-1">
                      <FilterIcon size={14} /> Status{" "}
                      {selectedStatuses.length > 0 &&
                        `(${selectedStatuses.length})`}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3" align="start">
                    <div className="space-y-2">
                      {uniqueStatusValues.map((value) => (
                        <div key={value} className="flex items-center gap-2">
                          <Checkbox
                            id={`status-${value}`}
                            checked={selectedStatuses.includes(value)}
                            onCheckedChange={(checked) =>
                              handleStatusChange(!!checked, value)
                            }
                            className="border-[#DADCE0] border-[1.5px] data-[state=checked]:bg-[#DADCE0] data-[state=checked]:text-[#9a9a9a]"
                          />
                          <Label
                            htmlFor={`status-${value}`}
                            className="font-normal"
                          >
                            {value}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center gap-3">
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
                  disabled={isRefetching || isTableLoading}
                  className="gap-1"
                >
                  <IoRefreshOutline
                    className={cn("h-4 w-4", isRefetching && "animate-spin")}
                  />{" "}
                  Refresh
                </Button>
              </div>
            </div>

            <div className="rounded-md border mt-4">
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
                        No invoices found.
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
                <div className="flex items-center justify-center text-sm font-medium">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ChevronFirstIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <ChevronLastIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedInvoice && (
        <InvoiceTicket
          invoice={selectedInvoice}
          isOpen={!!selectedInvoice}
          onOpenChange={() => setSelectedInvoice(null)}
        />
      )}
    </>
  );
}
