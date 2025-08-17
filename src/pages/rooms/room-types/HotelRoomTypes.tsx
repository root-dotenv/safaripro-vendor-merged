"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaBed, FaBuilding, FaChartBar } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "lucide-react";
import ErrorPage from "@/components/custom/error-page";
import type { Hotel } from "./types";

// --- API CLIENT ---
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_HOTEL_BASE_URL,
});

/**
 * HotelRoomTypes Component
 *
 * Fetches and displays a summary of room types for the currently
 * configured hotel ID. This component serves as the content for the first tab.
 */
export default function HotelRoomTypes() {
  const hotelId = import.meta.env.VITE_HOTEL_ID;

  const { data, isLoading, isError, refetch, error } = useQuery<Hotel>({
    queryKey: ["hotelDashboard", hotelId],
    queryFn: async () => (await apiClient.get(`hotels/${hotelId}`)).data,
    enabled: !!hotelId,
  });

  if (isLoading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );

  if (isError) {
    return <ErrorPage error={error as Error} onRetry={refetch} />;
  }

  // Handle case where data might not be loaded
  if (!data) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No hotel data available.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {data.name}
        </h1>
        <p className="text-lg text-muted-foreground mt-1">
          Room Types Overview
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <FaBuilding className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.summary_counts.rooms}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Currently Available
            </CardTitle>
            <FaBed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.summary_counts.available_rooms}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Occupancy Rate
            </CardTitle>
            <FaChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.availability_stats.occupancy_rate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Room Types Summary</CardTitle>
          <CardDescription>
            A summary of all room types in your hotel. For a detailed,
            searchable list, see the "All Room Types" tab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="p-4 font-medium">Room Type</th>
                  <th className="p-4 font-medium text-center">Available</th>
                  <th className="p-4 font-medium text-center">Booked</th>
                  <th className="p-4 font-medium text-center">Maintenance</th>
                  <th className="p-4 font-medium text-right">
                    Avg. Price/Night
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.room_type.map((rt) => (
                  <tr key={rt.id} className="border-b">
                    <td className="p-4 align-middle">
                      <div className="font-medium text-gray-800">{rt.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Code: {rt.code}
                      </div>
                    </td>
                    <td className="p-4 text-center align-middle font-semibold text-green-600">
                      {rt.availability?.Available ?? 0}
                    </td>
                    <td className="p-4 text-center align-middle font-semibold text-amber-600">
                      {rt.availability?.Booked ?? 0}
                    </td>
                    <td className="p-4 text-center align-middle font-semibold text-red-600">
                      {rt.availability?.Maintenance ?? 0}
                    </td>
                    <td className="p-4 text-right align-middle font-bold text-primary">
                      ${parseFloat(rt.base_price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
