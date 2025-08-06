"use client";
import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  MessageSquareQuote,
  ConciergeBell,
  Search,
  Loader2,
  RefreshCw,
  Eye,
  Inbox,
  NotebookPen,
} from "lucide-react";

import bookingClient from "@/api/booking-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ServerPagination from "@/components/comp-459";

// --- Type Definitions ---
interface Booking {
  id: string;
  full_name: string;
  code: string;
  start_date: string;
  end_date: string;
  special_requests: string | null;
  service_notes: string | null;
}

interface SpecialNote {
  id: string;
  type: "Special Request" | "Service Note";
  note: string;
  guestName: string;
  bookingCode: string;
  startDate: string;
  endDate: string;
  bookingId: string;
}

interface PaginatedBookingsResponse {
  count: number;
  results: Booking[];
}

// --- Helper Functions ---
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

// This helper function filters out non-meaningful notes
const isMeaningfulNote = (note: string | null): boolean => {
  if (!note || note.trim() === "") return false;
  const lowerCaseNote = note.toLowerCase().trim();
  const placeholders = [
    "no",
    "n/a",
    "na",
    "none",
    "no special request",
    "no special requests",
    "no service notes",
    "no,thanks",
    "no notes",
  ];
  return !placeholders.includes(lowerCaseNote);
};

// --- Sub-component for displaying a single request card ---
const SpecialRequestCard = ({ item }: { item: SpecialNote }) => {
  const navigate = useNavigate();
  const isRequest = item.type === "Special Request";

  return (
    <div className="bg-white border rounded-lg p-4 flex flex-col justify-between gap-4 hover:shadow transition-shadow">
      <div>
        <Badge
          className={`text-[0.875rem] ${
            isRequest ? "bg-yellow-500" : "bg-green-600"
          } font-medium text-white`}
          variant={isRequest ? "default" : "secondary"}
        >
          {isRequest ? (
            <MessageSquareQuote className="h-3 w-3 mr-2" />
          ) : (
            <ConciergeBell className="h-3 w-3 mr-2" />
          )}
          {item.type}
        </Badge>
        <p className="text-gray-700 my-3 text-base">"{item.note}"</p>
      </div>
      <div className="border-t pt-3">
        <p className="font-semibold text-sm">{item.guestName}</p>
        <p className="text-xs text-muted-foreground">
          Stay: {format(new Date(item.startDate), "PP")} -{" "}
          {format(new Date(item.endDate), "PP")}
        </p>
        <div className="flex justify-end mt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/bookings/${item.bookingId}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Booking
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function SpecialRequests() {
  const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;
  const ITEMS_PER_PAGE = 12;

  const [currentPage, setCurrentPage] = useState(1);
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedGlobalFilter = useDebounce(globalFilter, 300);

  const {
    data: paginatedResponse,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<PaginatedBookingsResponse>({
    queryKey: [
      "allBookingsForNotes",
      HOTEL_ID,
      currentPage,
      debouncedGlobalFilter,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        microservice_item_id: HOTEL_ID!,
        page: String(currentPage),
        page_size: String(ITEMS_PER_PAGE),
      });
      if (debouncedGlobalFilter) params.append("search", debouncedGlobalFilter);
      const response = await bookingClient.get(`/bookings`, { params });
      return response.data;
    },
    keepPreviousData: true,
    enabled: !!HOTEL_ID,
  });

  const allNotes = useMemo(() => {
    const bookings = paginatedResponse?.results ?? [];
    const notes: SpecialNote[] = [];

    bookings.forEach((booking) => {
      if (isMeaningfulNote(booking.special_requests)) {
        notes.push({
          id: `${booking.id}-request`,
          type: "Special Request",
          note: booking.special_requests!,
          guestName: booking.full_name,
          bookingCode: booking.code,
          startDate: booking.start_date,
          endDate: booking.end_date,
          bookingId: booking.id,
        });
      }
      if (isMeaningfulNote(booking.service_notes)) {
        notes.push({
          id: `${booking.id}-service`,
          type: "Service Note",
          note: booking.service_notes!,
          guestName: booking.full_name,
          bookingCode: booking.code,
          startDate: booking.start_date,
          endDate: booking.end_date,
          bookingId: booking.id,
        });
      }
    });
    return notes;
  }, [paginatedResponse]);

  const totalPages = Math.ceil(
    (paginatedResponse?.count ?? 0) / ITEMS_PER_PAGE
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl text-neutral-900 font-bold tracking-tight">
          Guest Requests & Notes
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Special Requests
            </CardTitle>
            <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                allNotes.filter((n) => n.type === "Special Request").length
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Meaningful requests found on this page
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Service Notes
            </CardTitle>
            <NotebookPen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                allNotes.filter((n) => n.type === "Service Note").length
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Additional service notes on this page
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Requests & Notes Feed</CardTitle>
          <CardDescription>
            A live feed of all special requests and service notes from guests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-4">
            <div className="relative">
              <Input
                className="min-w-60 pl-9"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search by guest name or code..."
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isRefetching || isLoading}
            >
              {isRefetching ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>

          {isLoading && (
            <div className="text-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            </div>
          )}

          {isError && (
            <div className="text-center p-12 text-destructive">
              Error: {(error as Error).message}
            </div>
          )}

          {!isLoading && allNotes.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Inbox className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No requests or notes found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                There are no meaningful special requests or service notes on
                this page.
              </p>
            </div>
          )}

          {!isLoading && allNotes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allNotes.map((item) => (
                <SpecialRequestCard key={item.id} item={item} />
              ))}
            </div>
          )}

          <div className="flex justify-end items-center mt-6">
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
