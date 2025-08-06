"use client";
import { useMemo } from "react";
import { useHotel } from "../../providers/hotel-provider";
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  FaBed,
  FaBuilding,
  FaDollarSign,
  FaStar,
  FaConciergeBell,
  FaUsersCog,
  FaRegBuilding,
  FaSwimmer,
  FaTshirt,
  FaRegCommentDots,
  FaArrowRight,
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// Fix for Leaflet's default icon path issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// --- MAIN COMPONENT ---
export default function MainOverview() {
  const { hotel, isLoading, error } = useHotel();

  const roomStatusDistributionData = useMemo(() => {
    if (!hotel?.availability_stats?.status_counts) return [];
    return Object.entries(hotel.availability_stats.status_counts).map(
      ([name, value]) => ({ name, value })
    );
  }, [hotel]);

  if (isLoading)
    return <div className="p-8 text-center">Loading dashboard data...</div>;
  if (error || !hotel)
    return (
      <div className="p-8 text-center text-destructive">
        Error fetching hotel data: {error?.message || "Hotel not found."}
      </div>
    );

  const chartData = roomStatusDistributionData;
  const chartConfig: ChartConfig = {
    value: { label: "Rooms" },
    ...Object.fromEntries(
      chartData.map((item) => [item.name, { label: item.name }])
    ),
  };
  const PIE_CHART_COLORS = ["#193bb9", "#1547e5", "#2c7fff", "#8fc5ff"];

  const infoCards = [
    {
      title: "Amenities",
      value: hotel.amenities.length,
      icon: <FaSwimmer className="text-cyan-500" />,
    },
    {
      title: "Facilities",
      value: hotel.facilities.length,
      icon: <FaRegBuilding className="text-indigo-400" />,
    },
    {
      title: "Services",
      value: hotel.services.length,
      icon: <FaConciergeBell className="text-teal-400" />,
    },
    {
      title: "Themes",
      value: hotel.themes.length,
      icon: <FaTshirt className="text-rose-400" />,
    },
    {
      title: "Departments",
      value: hotel.department_ids.length,
      icon: <FaUsersCog className="text-orange-400" />,
    },
    {
      title: "Total Reviews",
      value: hotel.review_count,
      icon: <FaRegCommentDots className="text-lime-500" />,
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {hotel.name} Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            A high-level overview of hotel activities and metrics.
          </p>
        </div>
        <Button variant="outline">
          View All Reports <FaArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* --- Top Level Stat Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Star Rating</CardTitle>
            <FaStar className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hotel.star_rating}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <FaBuilding className="h-4 w-4 text-primary" />
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
              Avg. Room Price
            </CardTitle>
            <FaDollarSign className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${hotel.average_room_price.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Occupancy Rate
            </CardTitle>
            <FaBed className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hotel.occupancy_rate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- Charts and Info Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Room Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={<ChartTooltipContent nameKey="value" hideLabel />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features at a Glance</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {infoCards.map((card) => (
              <div
                key={card.title}
                className="flex items-center space-x-4 rounded-md border p-4"
              >
                <div className="text-2xl">{card.icon}</div>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {card.title}
                  </p>
                  <p className="text-lg font-bold">{card.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* --- Map and Room Types Table --- */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Hotel Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] border rounded-md overflow-hidden">
              <MapContainer
                center={[hotel.latitude, hotel.longitude]}
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[hotel.latitude, hotel.longitude]}>
                  <Popup>{hotel.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Room Type Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Type</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="text-right">Avg. Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotel.room_type.map((rt) => (
                  <TableRow key={rt.id}>
                    <TableCell className="font-medium">
                      {rt.name}
                      <p className="text-xs text-muted-foreground">
                        Max: {rt.max_occupancy} guests
                      </p>
                    </TableCell>
                    <TableCell>
                      {rt.availability.available_rooms} /{" "}
                      {rt.availability.total_rooms}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${rt.pricing.avg_price.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
