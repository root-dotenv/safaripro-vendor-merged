"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useHotel } from "../../providers/hotel-provider";
import {
  useQueries,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import hotelClient from "../../api/hotel-client";
import bookingClient from "../../api/booking-client";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format, startOfMonth } from "date-fns";
import {
  FaUtensils,
  FaRegBuilding,
  FaStar,
  FaMapMarkerAlt,
  FaLeaf,
  FaClock,
  FaDirections,
} from "react-icons/fa";
import {
  Pencil,
  Trash2,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Hotel,
  DollarSign,
  Percent,
  Shapes,
  ConciergeBell,
  CheckCircle,
  Clock as ClockIcon,
  XCircle,
  FileText,
  Building,
  ParkingCircle,
  GlassWater,
  Tally5,
  Calendar,
  Tag,
  Info,
  Image as ImageIcon,
  Building2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// --- UI Components ---
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AddEditImageModal } from "./customize-hotel/AddEditImageModal";
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
import ErrorPage from "@/components/custom/error-page";

// --- Type Imports ---
import type {
  HotelType,
  HotelImage,
  Service,
  Department,
} from "../../types/hotel-types";
import type { Amenity } from "@/types/amenities";
import type { Facility } from "@/types/facilities";
import type { Booking } from "@/types/booking-types";
import type { MealType } from "./features";
import type { RoomType } from "./customize-hotel/hotel";

// --- Helper Components & Functions ---

const StatCard = ({
  title,
  value,
  icon,
  stats,
  onManageClick,
  isLoading,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  stats?: {
    label: string;
    value: number | string;
    color: string;
    icon?: React.ReactNode;
  }[];
  onManageClick?: () => void;
  isLoading?: boolean;
}) => (
  <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
        {icon} {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-8 w-1/2 mb-2" />
      ) : (
        <div className="text-3xl font-bold text-gray-900">{value}</div>
      )}
      {stats && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {stats.map((s) => (
            <Badge key={s.label} variant="outline" className={s.color}>
              {s.icon} {s.value} {s.label}
            </Badge>
          ))}
        </div>
      )}
      {onManageClick && (
        <Button
          variant="link"
          className="p-0 mt-2 h-auto text-blue-600 hover:text-blue-800"
          onClick={onManageClick}
        >
          Manage
        </Button>
      )}
    </CardContent>
  </Card>
);

const FeatureCard = ({
  title,
  icon,
  items,
  isLoading,
}: {
  title: string;
  icon: React.ReactNode;
  items: { id: string; name: string }[];
  isLoading: boolean;
}) => (
  <Card className="bg-white border-gray-200">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
        {icon} {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {isLoading ? (
        [...Array(3)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)
      ) : items.length > 0 ? (
        items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 text-sm">
            <div className="bg-blue-50 p-2 rounded-full">
              <Shapes className="h-4 w-4 text-blue-500" />
            </div>
            <span className="font-medium text-gray-700">{item.name}</span>
          </div>
        ))
      ) : (
        <p className="text-sm text-center text-gray-500 py-4">
          No {title.toLowerCase()} listed.
        </p>
      )}
    </CardContent>
  </Card>
);

const ImageSlider = ({
  images,
  hotelId,
}: {
  images: HotelImage[];
  hotelId: string;
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<HotelImage | null>(null);
  const [imageToDelete, setImageToDelete] = useState<HotelImage | null>(null);
  const queryClient = useQueryClient();

  const deleteImageMutation = useMutation({
    mutationFn: (imageId: string) =>
      hotelClient.delete(`/hotel-images/${imageId}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotelImages", hotelId] });
      setImageToDelete(null);
      toast.success("Image deleted successfully");
    },
    onError: () => toast.error("Failed to delete image. Please try again."),
  });

  const handleOpenAddModal = () => {
    setEditingImage(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (image: HotelImage) => {
    setEditingImage(image);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const checkScroll = () => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
      }
    };
    checkScroll();
    const slider = sliderRef.current;
    slider?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      slider?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [images]);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-500 rounded-lg">
        <div className="text-center">
          <p className="font-medium">No images available</p>
          <Button
            variant="ghost"
            onClick={handleOpenAddModal}
            className="mt-2 text-blue-600 hover:bg-blue-50"
          >
            <PlusCircle className="h-5 w-5 mr-2" /> Add Images
          </Button>
          <AddEditImageModal
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
            image={editingImage}
            hotelId={hotelId}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={sliderRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4"
      >
        {images.map((image) => (
          <div
            key={image.id}
            className="relative flex-shrink-0 w-64 h-64 snap-center group"
          >
            <img
              src={image.original}
              alt={image.tag || "Hotel image"}
              className="w-full h-full object-cover rounded-lg shadow-md"
            />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <Button
                variant="outline"
                size="icon"
                className="border-white text-white hover:bg-white hover:text-black"
                onClick={() => handleOpenEditModal(image)}
                aria-label={`Edit image ${image.tag}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-red-400 border-red-400 hover:bg-red-500 hover:text-white"
                onClick={() => setImageToDelete(image)}
                aria-label={`Delete image ${image.tag}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded">
              {image.tag || "Hotel image"}
            </div>
          </div>
        ))}
      </div>
      {canScrollLeft && (
        <Button
          onClick={() => scroll("left")}
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
          aria-label="Scroll left"
        >
          <ChevronLeft />
        </Button>
      )}
      {canScrollRight && (
        <Button
          onClick={() => scroll("right")}
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
          aria-label="Scroll right"
        >
          <ChevronRight />
        </Button>
      )}
      <AddEditImageModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        image={editingImage}
        hotelId={hotelId}
      />
      <AlertDialog
        open={!!imageToDelete}
        onOpenChange={() => setImageToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteImageMutation.mutate(imageToDelete!.id)}
              disabled={deleteImageMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteImageMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | null;
}) => (
  <div className="flex items-start gap-3">
    <div className="text-blue-600 mt-1">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value || "N/A"}</p>
    </div>
  </div>
);

// --- Main Component ---
export default function HotelDetails() {
  const {
    hotel,
    isLoading: isHotelLoading,
    isError,
    error,
    refetch,
  } = useHotel();
  const navigate = useNavigate();
  const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;

  const { data: hotelTypeDetails, isLoading: isLoadingHotelType } =
    useQuery<HotelType>({
      queryKey: ["hotelType", hotel?.hotel_type],
      queryFn: () =>
        hotelClient
          .get(`/hotel-types/${hotel?.hotel_type}/`)
          .then((res) => res.data),
      enabled: !!hotel?.hotel_type,
    });

  const { data: hotelImagesData, isLoading: isLoadingImages } = useQuery({
    queryKey: ["hotelImages", HOTEL_ID],
    queryFn: () =>
      hotelClient
        .get(`/hotel-images/?hotel_id=${HOTEL_ID}`)
        .then((res) => res.data.results as HotelImage[]),
    enabled: !!HOTEL_ID,
  });

  const { data: bookingsData, isLoading: isLoadingBookings } = useQuery<{
    results: Booking[];
    count: number;
  }>({
    queryKey: ["hotelBookings", HOTEL_ID],
    queryFn: () =>
      bookingClient
        .get(`/bookings?microservice_item_id=${HOTEL_ID}&page_size=1000`)
        .then((res) => res.data),
    enabled: !!HOTEL_ID,
  });

  const amenityQueries = useQueries({
    queries: (hotel?.amenities || []).map((id) => ({
      queryKey: ["amenity", id],
      queryFn: () =>
        hotelClient.get(`/amenities/${id}/`).then((res) => res.data as Amenity),
      enabled: !!hotel,
    })),
  });
  const facilityQueries = useQueries({
    queries: (hotel?.facilities || []).map((id) => ({
      queryKey: ["facility", id],
      queryFn: () =>
        hotelClient
          .get(`/facilities/${id}/`)
          .then((res) => res.data as Facility),
      enabled: !!hotel,
    })),
  });
  const serviceQueries = useQueries({
    queries: (hotel?.services || []).map((id) => ({
      queryKey: ["service", id],
      queryFn: () =>
        hotelClient.get(`/services/${id}/`).then((res) => res.data as Service),
      enabled: !!hotel,
    })),
  });
  const mealTypeQueries = useQueries({
    queries: (hotel?.meal_types || []).map((id) => ({
      queryKey: ["mealType", id],
      queryFn: () =>
        hotelClient
          .get(`/meal-types/${id}/`)
          .then((res) => res.data as MealType),
      enabled: !!hotel,
    })),
  });

  const departmentQueries = useQueries({
    queries: (hotel?.department_ids || []).map((id) => ({
      queryKey: ["department", id],
      queryFn: () =>
        hotelClient
          .get(`/departments/${id}/`)
          .then((res) => res.data as Department),
      enabled: !!hotel,
    })),
  });

  const bookingStats = useMemo(() => {
    if (!bookingsData)
      return { total: 0, confirmed: 0, pending: 0, cancelled: 0 };
    const bookings = bookingsData.results;
    return {
      total: bookingsData.count,
      confirmed: bookings.filter(
        (b) => b.booking_status.toLowerCase() === "confirmed"
      ).length,
      pending: bookings.filter(
        (b) => b.booking_status.toLowerCase() === "pending"
      ).length,
      cancelled: bookings.filter(
        (b) => b.booking_status.toLowerCase() === "cancelled"
      ).length,
    };
  }, [bookingsData]);

  const monthlyBookingData = useMemo(() => {
    if (!bookingsData) return [];
    const monthCounts = bookingsData.results.reduce((acc, booking) => {
      const month = format(
        startOfMonth(new Date(booking.created_at)),
        "MMM yyyy"
      );
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(monthCounts)
      .map(([name, value]) => ({ name, bookings: value }))
      .slice(-6); // Last 6 months
  }, [bookingsData]);

  if (isHotelLoading) {
    return (
      <div className="p-8 bg-gray-100 min-h-screen">
        <Skeleton className="h-12 w-1/3 mb-6" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) return <ErrorPage error={error as Error} onRetry={refetch} />;
  if (!hotel)
    return <div className="p-8 text-center">No hotel data available.</div>;

  const amenities = amenityQueries
    .filter((q) => q.isSuccess)
    .map((q) => q.data);
  const facilities = facilityQueries
    .filter((q) => q.isSuccess)
    .map((q) => q.data);
  const services = serviceQueries.filter((q) => q.isSuccess).map((q) => q.data);
  const mealTypes = mealTypeQueries
    .filter((q) => q.isSuccess)
    .map((q) => q.data);
  const departments = departmentQueries
    .filter((q) => q.isSuccess)
    .map((q) => q.data);

  const roomStatusData = {
    Available: hotel.availability_stats?.status_counts?.Available || 0,
    Booked: hotel.availability_stats?.status_counts?.Booked || 0,
    Maintenance: hotel.availability_stats?.status_counts?.Maintenance || 0,
  };

  const pieChartData = [
    { name: "Available", value: roomStatusData.Available, color: "#22c55e" },
    { name: "Booked", value: roomStatusData.Booked, color: "#eab308" },
    {
      name: "Maintenance",
      value: roomStatusData.Maintenance,
      color: "#ef4444",
    },
  ].filter((entry) => entry.value > 0);

  const renderStarRating = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-300" />);
      }
    }
    return <div className="flex items-center gap-1">{stars}</div>;
  };

  return (
    <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <header className="mb-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{hotel.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              {renderStarRating(hotel.star_rating)}
              <span className="text-sm text-gray-600">
                ({hotel.star_rating} Stars)
              </span>
            </div>
            <p className="text-md text-gray-600 mt-2">{hotel.description}</p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link to="/hotel/customize-hotel">
              <Pencil className="mr-2 h-4 w-4" /> Customize Hotel
            </Link>
          </Button>
        </div>
      </header>

      {/* --- Main Stat Cards --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Rooms"
          value={hotel.summary_counts.rooms}
          icon={<Hotel className="h-5 w-5 text-blue-600" />}
          isLoading={isHotelLoading}
          stats={[
            {
              label: "Available",
              value: roomStatusData.Available,
              color: "text-green-600 border-green-600",
              icon: <CheckCircle className="h-3 w-3 mr-1" />,
            },
            {
              label: "Booked",
              value: roomStatusData.Booked,
              color: "text-yellow-600 border-yellow-600",
              icon: <ClockIcon className="h-3 w-3 mr-1" />,
            },
            {
              label: "Maintenance",
              value: roomStatusData.Maintenance,
              color: "text-red-600 border-red-600",
              icon: <XCircle className="h-3 w-3 mr-1" />,
            },
          ]}
          onManageClick={() => navigate("/rooms/available-rooms")}
        />
        <StatCard
          title="Total Bookings"
          value={bookingStats.total}
          icon={<FileText className="h-5 w-5 text-gray-600" />}
          isLoading={isLoadingBookings}
          stats={[
            {
              label: "Confirmed",
              value: bookingStats.confirmed,
              color: "text-green-600 border-green-600",
              icon: <CheckCircle className="h-3 w-3 mr-1" />,
            },
            {
              label: "Pending",
              value: bookingStats.pending,
              color: "text-yellow-600 border-yellow-600",
              icon: <ClockIcon className="h-3 w-3 mr-1" />,
            },
            {
              label: "Cancelled",
              value: bookingStats.cancelled,
              color: "text-red-600 border-red-600",
              icon: <XCircle className="h-3 w-3 mr-1" />,
            },
          ]}
          onManageClick={() => navigate("/bookings/all-bookings")}
        />
        <StatCard
          title="Avg. Price"
          value={`$${hotel.average_room_price.toFixed(2)}`}
          icon={<DollarSign className="h-5 w-5 text-purple-600" />}
          isLoading={isHotelLoading}
          stats={[
            {
              label: "Min",
              value: `$${hotel.pricing_data.min.toFixed(2)}`,
              color: "text-blue-600 border-blue-600",
            },
            {
              label: "Max",
              value: `$${hotel.pricing_data.max.toFixed(2)}`,
              color: "text-red-600 border-red-600",
            },
            {
              label: "Discount",
              value: `${hotel.discount}%`,
              color: "text-green-600 border-green-600",
            },
          ]}
        />
        <StatCard
          title="Occupancy"
          value={`${hotel.occupancy_rate.toFixed(1)}%`}
          icon={<Percent className="h-5 w-5 text-teal-600" />}
          isLoading={isHotelLoading}
        />
      </div>

      {/* --- Hotel Gallery --- */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ImageIcon className="h-6 w-6 text-blue-600" /> Hotel Gallery
        </h2>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            {isLoadingImages ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ImageSlider images={hotelImagesData || []} hotelId={HOTEL_ID} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* --- Charts --- */}
      <div className="grid gap-6 lg:grid-cols-5 mt-6">
        <Card className="lg:col-span-3 bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Monthly Bookings
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Booking trends over the last few months
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyBookingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFF",
                    borderColor: "#DADCE0",
                  }}
                />
                <Legend />
                <Bar dataKey="bookings" fill="#155DFC" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Room Status Distribution
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Live overview of room availability
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFF",
                    borderColor: "#DADCE0",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* --- Additional Hotel Details --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {/* Hotel Information Card */}
        <Card className="lg:col-span-2 bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
              <Info /> Hotel Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem
              icon={<FaStar />}
              label="Star Rating"
              value={`${hotel.star_rating} Stars`}
            />
            <DetailItem
              icon={<FaMapMarkerAlt />}
              label="Address"
              value={`${hotel.address}, ${hotel.zip_code}, ${hotel.destination}`}
            />
            <DetailItem
              icon={<Calendar />}
              label="Year Built"
              value={hotel.year_built}
            />
            <DetailItem
              icon={<FaLeaf />}
              label="Eco Certified"
              value={hotel.is_eco_certified ? "Yes" : "No"}
            />
            <DetailItem
              icon={<FaClock />}
              label="Check-in Time"
              value={hotel.check_in_from}
            />
            <DetailItem
              icon={<FaClock />}
              label="Check-out Time"
              value={hotel.check_out_to}
            />
            <DetailItem
              icon={<Tag />}
              label="Rate Options"
              value={hotel.rate_options}
            />
            <DetailItem
              icon={<FaDirections />}
              label="Directions"
              value={hotel.directions}
            />
          </CardContent>
        </Card>

        {/* Property Details Card */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
              <Building /> Property Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem
              icon={<FaRegBuilding />}
              label="Floors"
              value={hotel.number_floors}
            />
            <DetailItem
              icon={<FaUtensils />}
              label="Restaurants"
              value={hotel.number_restaurants}
            />
            <DetailItem
              icon={<GlassWater />}
              label="Bars"
              value={hotel.number_bars}
            />
            <DetailItem
              icon={<ParkingCircle />}
              label="Parks"
              value={hotel.number_parks}
            />
            <DetailItem
              icon={<Tally5 />}
              label="Halls"
              value={hotel.number_halls}
            />
            <DetailItem
              icon={<Percent />}
              label="Discount"
              value={`${hotel.discount}%`}
            />
          </CardContent>
        </Card>
      </div>

      {/* --- Room Types --- */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Room Types
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hotel.room_type.map((rt: RoomType) => (
            <Card key={rt.id} className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>{rt.name}</CardTitle>
                <CardDescription>Code: {rt.code}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Max Occupancy:</span>{" "}
                  <span className="font-semibold">{rt.max_occupancy}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bed Type:</span>{" "}
                  <span className="font-semibold">{rt.bed_type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Price:</span>{" "}
                  <span className="font-semibold">
                    ${parseFloat(rt.base_price).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* --- Hotel Features --- */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Hotel Features
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            title="Amenities"
            icon={<Shapes className="h-5 w-5 text-indigo-600" />}
            items={amenities}
            isLoading={amenityQueries.some((q) => q.isLoading)}
          />
          <FeatureCard
            title="Facilities"
            icon={<Shapes className="h-5 w-5 text-pink-600" />}
            items={facilities}
            isLoading={facilityQueries.some((q) => q.isLoading)}
          />
          <FeatureCard
            title="Services"
            icon={<ConciergeBell className="h-5 w-5 text-blue-600" />}
            items={services}
            isLoading={serviceQueries.some((q) => q.isLoading)}
          />
          <FeatureCard
            title="Meal Plans"
            icon={<FaUtensils className="h-5 w-5 text-orange-600" />}
            items={mealTypes}
            isLoading={mealTypeQueries.some((q) => q.isLoading)}
          />
          <FeatureCard
            title="Departments"
            icon={<Building2 className="h-5 w-5 text-gray-600" />}
            items={departments}
            isLoading={departmentQueries.some((q) => q.isLoading)}
          />
        </div>
      </div>
    </div>
  );
}
