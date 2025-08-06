//  - - - src/pages/rooms/room-types.tsx
"use client";
import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  FaBed,
  FaUsers,
  FaSearch,
  FaTimes,
  FaSpinner,
  FaBuilding,
  FaChartBar,
} from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ChartConfig } from "@/components/ui/chart";
import { IoArrowBack } from "react-icons/io5";

// --- TYPE DEFINITIONS ---
interface RoomCounts {
  Available: number;
  Booked: number;
  Maintenance: number;
  total: number;
}
interface HotelRoomType {
  id: string;
  name: string;
  code: string;
  room_counts: RoomCounts;
  pricing: { avg_price: number };
}
interface Hotel {
  id: string;
  name: string;
  room_type: HotelRoomType[];
  availability_stats: { occupancy_rate: number };
  summary_counts: { rooms: number; available_rooms: number };
}
interface DetailedRoomType {
  id: string;
  name: string;
  code: string;
  description: string;
  bed_type: string;
  max_occupancy: number;
  room_availability: number;
  image: string;
  size_sqm: string | null;
  base_price: string;
  is_active: boolean;
  features_list?: { id: string; name: string }[];
  amenities_details?: { id: string; name: string }[];
}
interface FilterState {
  priceSort: "none" | "low-to-high" | "high-to-low";
  availabilitySort: "none" | "low-to-high" | "high-to-low";
  capacitySort: "none" | "low-to-high" | "high-to-low";
  availabilityFilter: "all" | "available" | "full";
}

// --- API CLIENT ---
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_HOTEL_BASE_URL,
});

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================
export default function RoomTypesDashboard() {
  const hotelId = import.meta.env.VITE_HOTEL_ID;
  const [activeView, setActiveView] = useState<"overview" | "details">(
    "overview"
  );

  const {
    data: hotelData,
    isLoading: isHotelLoading,
    isError: isHotelError,
    error: hotelError,
  } = useQuery<Hotel>({
    queryKey: ["hotelDashboard", hotelId],
    queryFn: async () => (await apiClient.get(`hotels/${hotelId}`)).data,
    enabled: !!hotelId,
  });

  if (isHotelLoading) return <div className="p-6">Loading Hotel Data...</div>;
  if (isHotelError)
    return (
      <div className="p-6 text-destructive">
        Error loading hotel data: {hotelError.message}
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      {activeView === "overview" ? (
        <OverviewView
          hotel={hotelData!}
          onSelectRoomType={() => setActiveView("details")}
        />
      ) : (
        <DetailedView onBack={() => setActiveView("overview")} />
      )}
    </div>
  );
}

// ============================================================================
// OVERVIEW COMPONENT (Refactored to use a Table)
// ============================================================================
interface OverviewProps {
  hotel: Hotel;
  onSelectRoomType: (id: string) => void;
}
const chartConfig = {
  Available: { label: "Available", color: "#8fc5ff" },
  Booked: { label: "Booked", color: "#155dfc" },
  Maintenance: { label: "Maintenance", color: "#193bb9" },
} satisfies ChartConfig;

function OverviewView({ hotel, onSelectRoomType }: OverviewProps) {
  const chartData = hotel.room_type.map((rt) => ({
    name: rt.name,
    Available: rt.room_counts.Available,
    Booked: rt.room_counts.Booked,
    Maintenance: rt.room_counts.Maintenance,
  }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {hotel.name}
        </h1>
        <p className="text-lg text-muted-foreground mt-1">
          Room Types Overview
        </p>
      </header>

      {/* Hotel Stat Cards (Unchanged) */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <FaBuilding className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hotel.summary_counts.rooms}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Currently Available
            </CardTitle>
            <FaBed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hotel.summary_counts.available_rooms}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Occupancy Rate
            </CardTitle>
            <FaChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hotel.availability_stats.occupancy_rate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- REFACTORED SECTION: From Cards to Table --- */}
      <Card>
        <CardHeader>
          <CardTitle>Room Types Summary</CardTitle>
          <CardDescription>
            A sortable summary of all room types. Click a row for more details.
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
                {hotel.room_type.map((rt) => (
                  <tr
                    key={rt.id}
                    className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                    onClick={() => onSelectRoomType(rt.id)}
                  >
                    <td className="p-4 align-middle">
                      <div className="font-medium text-gray-800">{rt.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Code: {rt.code}
                      </div>
                    </td>
                    <td className="p-4 text-center align-middle font-semibold text-green-600">
                      {rt.room_counts.Available}
                    </td>
                    <td className="p-4 text-center align-middle font-semibold text-amber-600">
                      {rt.room_counts.Booked}
                    </td>
                    <td className="p-4 text-center align-middle font-semibold text-red-600">
                      {rt.room_counts.Maintenance}
                    </td>
                    <td className="p-4 text-right align-middle font-bold text-primary">
                      ${rt.pricing.avg_price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* --- END REFACTORED SECTION --- */}
    </div>
  );
}
// ============================================================================
// DETAILED LIST VIEW COMPONENT (Unchanged)
// ============================================================================
interface DetailedViewProps {
  onBack: () => void;
}
function DetailedView({ onBack }: DetailedViewProps) {
  const [selectedRoom, setSelectedRoom] = useState<DetailedRoomType | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    priceSort: "none",
    availabilitySort: "none",
    capacitySort: "none",
    availabilityFilter: "all",
  });

  const { data: allRoomTypes, isLoading: isListLoading } = useQuery<
    DetailedRoomType[]
  >({
    queryKey: ["allRoomTypesList"],
    queryFn: async () => (await apiClient.get("room-types/")).data.results,
  });

  const { data: detailedRoom, isLoading: isLoadingDetails } =
    useQuery<DetailedRoomType>({
      queryKey: ["roomDetail", selectedRoom?.id],
      queryFn: async () =>
        apiClient
          .get(`room-types/${selectedRoom!.id}/`)
          .then((res) => res.data),
      enabled: !!selectedRoom?.id,
    });

  const filteredRooms = useMemo(() => {
    if (!allRoomTypes) return [];
    let filtered = [...allRoomTypes];

    if (searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (room) =>
          room.name.toLowerCase().includes(lowerCaseQuery) ||
          room.description.toLowerCase().includes(lowerCaseQuery) ||
          room.bed_type.toLowerCase().includes(lowerCaseQuery)
      );
    }

    if (filters.availabilityFilter !== "all") {
      filtered = filtered.filter((room) => {
        const isAvailable = room.is_active && room.room_availability > 0;
        if (filters.availabilityFilter === "available") return isAvailable;
        if (filters.availabilityFilter === "full") return !isAvailable;
        return true;
      });
    }

    if (filters.priceSort !== "none") {
      filtered.sort((a, b) => {
        const priceA = parseFloat(a.base_price);
        const priceB = parseFloat(b.base_price);
        return filters.priceSort === "low-to-high"
          ? priceA - priceB
          : priceB - priceA;
      });
    } else if (filters.availabilitySort !== "none") {
      filtered.sort((a, b) => {
        return filters.availabilitySort === "low-to-high"
          ? a.room_availability - b.room_availability
          : b.room_availability - a.room_availability;
      });
    } else if (filters.capacitySort !== "none") {
      filtered.sort((a, b) => {
        return filters.capacitySort === "low-to-high"
          ? a.max_occupancy - b.max_occupancy
          : b.max_occupancy - a.max_occupancy;
      });
    }

    return filtered;
  }, [allRoomTypes, searchQuery, filters]);

  useEffect(() => {
    if (!selectedRoom && filteredRooms.length > 0) {
      setSelectedRoom(filteredRooms[0]);
    }
  }, [filteredRooms, selectedRoom]);

  if (isListLoading) return <p>Loading room types...</p>;

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack}>
        <IoArrowBack className="mr-1 h-4 w-4" /> Back to Overview
      </Button>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filter & Search Room Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Filter by name, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setSearchQuery("")}
                  >
                    <FaTimes />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select
                  onValueChange={(v) =>
                    setFilters((f) => ({
                      ...f,
                      priceSort: v as any,
                      availabilitySort: "none",
                      capacitySort: "none",
                    }))
                  }
                  value={filters.priceSort}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sort by Price</SelectItem>
                    <SelectItem value="low-to-high">Low to High</SelectItem>
                    <SelectItem value="high-to-low">High to Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={(v) =>
                    setFilters((f) => ({
                      ...f,
                      availabilitySort: v as any,
                      priceSort: "none",
                      capacitySort: "none",
                    }))
                  }
                  value={filters.availabilitySort}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sort by Availability</SelectItem>
                    <SelectItem value="low-to-high">Low to High</SelectItem>
                    <SelectItem value="high-to-low">High to Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={(v) =>
                    setFilters((f) => ({
                      ...f,
                      capacitySort: v as any,
                      priceSort: "none",
                      availabilitySort: "none",
                    }))
                  }
                  value={filters.capacitySort}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by Capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sort by Capacity</SelectItem>
                    <SelectItem value="low-to-high">Low to High</SelectItem>
                    <SelectItem value="high-to-low">High to Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={(v) =>
                    setFilters((f) => ({ ...f, availabilityFilter: v as any }))
                  }
                  value={filters.availabilityFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available Only</SelectItem>
                    <SelectItem value="full">Full Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {filteredRooms.map((room) => (
              <Card
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`cursor-pointer transition-colors ${
                  selectedRoom?.id === room.id ? "ring-2 ring-primary/20" : ""
                }`}
              >
                <CardContent className="p-4 grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3">
                    <img
                      src={room.image || "https://placehold.co/600x400"}
                      alt={room.name}
                      className="rounded-md object-cover aspect-video w-full"
                    />
                  </div>
                  <div className="col-span-6 space-y-1">
                    <p className="font-bold text-lg">{room.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {room.description}
                    </p>
                    <div className="flex items-center flex-wrap gap-2 text-xs pt-1">
                      <Badge variant="outline">
                        <FaUsers className="mr-1.5" />
                        {room.max_occupancy} Guests
                      </Badge>
                      <Badge variant="outline">
                        <FaBed className="mr-1.5" />
                        {room.bed_type}
                      </Badge>
                    </div>
                  </div>
                  <div className="col-span-3 text-right">
                    <p className="text-2xl font-bold text-primary">
                      ${parseFloat(room.base_price).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">/night</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-5 xl:col-span-4">
          <Card className="sticky top-8">
            <CardHeader>
              {isLoadingDetails && (
                <FaSpinner className="animate-spin text-xl text-primary" />
              )}
              {detailedRoom && <CardTitle>{detailedRoom.name}</CardTitle>}
              {detailedRoom && (
                <CardDescription>Code: {detailedRoom.code}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {detailedRoom ? (
                <>
                  <img
                    src={detailedRoom.image || "https://placehold.co/600x400"}
                    alt={detailedRoom.name}
                    className="rounded-lg object-cover w-full aspect-video"
                  />
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {detailedRoom.description}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Features & Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {detailedRoom.features_list?.map((f) => (
                        <Badge key={f.id} variant="secondary">
                          {f.name}
                        </Badge>
                      ))}
                      {detailedRoom.amenities_details?.map((a) => (
                        <Badge key={a.id} variant="secondary">
                          {a.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-20 text-muted-foreground">
                  <FaBed className="mx-auto text-4xl mb-2" />
                  <p>Select a room to see details.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
