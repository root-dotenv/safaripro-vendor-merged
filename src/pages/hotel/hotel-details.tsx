// src/pages/HotelDetails.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useHotel } from "../../providers/hotel-provider";
import {
  useQueries,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import hotelClient from "../../api/hotel-client";
import { toast } from "sonner";
import ErrorPage from "@/components/custom/error-page";
import {
  Loader,
  Pencil,
  Building,
  Clock,
  Leaf,
  Utensils,
  ParkingCircle,
  GlassWater,
  Tally5,
  Image as ImageIcon,
  PlusCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X as XIcon,
  Menu,
} from "lucide-react";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { FaRegCircleCheck } from "react-icons/fa6";
import { Gauge } from "@mui/x-charts/Gauge";
import {
  BarChart,
  PieChart,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddEditImageModal } from "./customize-hotel/AddEditImageModal";
import { PiMapPinSimpleArea } from "react-icons/pi";
import type { Amenity } from "@/types/amenities";
import type { Facility } from "@/types/facilities";
import type {
  Service,
  Department,
  MealType,
  HotelImage,
} from "../../types/hotel-types";
import { ExpandableText } from "@/components/custom/expandable-text";

// --- Helper Components & Functions ---
const renderStarRating = (rating: number) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      />
    ))}
  </div>
);

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}) => (
  <div>
    <p className="text-sm text-[#838383] flex items-center gap-2">
      {icon} {label}
    </p>
    <p className="font-semibold text-md text-[#334155] mt-1">
      {value || "N/A"}
    </p>
  </div>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "#4ade80";
    case "Booked":
      return "#f87171";
    case "Maintenance":
      return "#fbbf24";
    default:
      return "#94a3b8";
  }
};

const getRoomTypeColor = (roomType: string) => {
  const colors = [
    "#00DA7F",
    "#00D490",
    "#00CC9F",
    "#1C90F5",
    "#00BDBB",
    "#00A6DC",
    "#1397EE",
    "#2881FF",
  ];
  const index =
    roomType.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
};

// --- Quick Action Tab Component ---
const QuickActionTab = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-[#0081FB] border-[#0081FB] hover:bg-[#0081FB] hover:text-[#FFF] transition-all cursor-pointer"
        >
          <Menu className="h-4 w-4" />
          Quick Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem asChild>
          <Link to="/bookings/new-booking">Create New Booking</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/rooms/new-room">Add New Room</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/billings/invoices">View Invoices</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/reservations/checkin">Checked-In Guests</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/house-keeping/inventory-items">Manage Inventory</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/rooms/available-rooms">Available Rooms</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/reservations/special-requests">Special Requests</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/house-keeping/departments">Manage Departments</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// --- Image Slider Component ---
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
  const [fullscreenImage, setFullscreenImage] = useState<HotelImage | null>(
    null
  );
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
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
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

  return (
    <>
      <div className="relative">
        {!images || images.length === 0 ? (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-500 rounded-lg">
            <div className="text-center">
              <p className="font-medium">No images available</p>
              <Button
                variant="ghost"
                onClick={handleOpenAddModal}
                className="mt-2 text-[#1D4ED8] hover:bg-blue-50"
              >
                <PlusCircle className="h-5 w-5 mr-2 text-[#0081FB]" /> Add
                Images
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div
              ref={sliderRef}
              className="w-fit flex overflow-x-scroll gap-x-4 pb-2 scroll-smooth"
              style={{ scrollbarWidth: "none" }}
            >
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative flex-shrink-0 w-64 h-64 snap-center group cursor-pointer"
                  onClick={() => setFullscreenImage(image)}
                >
                  <img
                    src={image.original}
                    alt={image.tag || "Hotel image"}
                    className="w-full h-full object-cover rounded-none shadow-md"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none">
                    <div className="absolute top-2 right-2 flex gap-2 pointer-events-auto">
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-none hover:text-[#FFF] hover:bg-[#0081FB] text-black cursor-pointer transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(image);
                        }}
                        aria-label={`Edit image`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="hover:bg-red-500 hover:text-white border-none cursor-pointer transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageToDelete(image);
                        }}
                        aria-label={`Delete image`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {canScrollLeft && (
              <Button
                onClick={() => scroll("left")}
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full shadow bg-[#0081FB] cursor-pointer hover:bg-blue-600"
                aria-label="Scroll left"
              >
                <ChevronLeft className="text-[#FFF]" />
              </Button>
            )}
            {canScrollRight && (
              <Button
                onClick={() => scroll("right")}
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full shadow bg-[#0081FB] cursor-pointer hover:bg-blue-600"
                aria-label="Scroll right"
              >
                <ChevronRight className="text-[#FFF]" />
              </Button>
            )}
          </>
        )}
      </div>

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

      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
            aria-label="Close fullscreen image"
          >
            <XIcon size={32} />
          </button>
          <img
            src={fullscreenImage.original}
            alt={fullscreenImage.tag || "Fullscreen hotel image"}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

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

  const { data: hotelImagesData, isLoading: isLoadingImages } = useQuery({
    queryKey: ["hotelImages", hotel?.id],
    queryFn: async () => {
      const res = await hotelClient.get(`/hotel-images/?hotel_id=${hotel!.id}`);
      return (
        res.data && Array.isArray(res.data.results) ? res.data.results : []
      ) as HotelImage[];
    },
    enabled: !!hotel?.id,
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

  if (isHotelLoading) {
    return (
      <div className="p-6 w-full h-screen flex items-center justify-center text-[#334155]">
        <Loader className="animate-spin text-[#0081FB]" size={48} />
      </div>
    );
  }
  if (isError) {
    return <ErrorPage error={error as Error} onRetry={refetch} />;
  }
  if (!hotel) {
    return <div className="p-6 text-[#334155]">No hotel details found.</div>;
  }

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

  return (
    <div className="p-4 sm:p-6 bg-none min-h-screen">
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              <FaArrowLeft className="mr-2 text-[#0081FB]" />
              Back
            </button>
          </div>
          <div className="flex items-center gap-x-2.5">
            <QuickActionTab />
            <Button
              asChild
              className="bg-[#0081FB] text-[#FFF] cursor-pointer hover:bg-blue-700 transition-all"
            >
              <Link to="/hotel/customize-hotel">
                <Pencil className="mr-1 h-4 w-4 text-[#FFF]" /> Customize Hotel
              </Link>
            </Button>
          </div>
        </div>
        <div className="bg-none rounded-md border-none shadow-none py-3 px-0 mb-0">
          <h1 className="text-3xl uppercase font-bold text-[#202020]">
            {hotel.name}
          </h1>
          <div className="flex items-center gap-4 mt-2 mb-2">
            {renderStarRating(hotel.star_rating)}
            {hotel.year_built && (
              <>
                <span className="text-gray-300">|</span>
                <p className="text-sm text-gray-500">
                  Established {hotel.year_built}
                </p>
              </>
            )}
          </div>
          <p className="text-md text-[#838383]">
            {hotel.address}, {hotel.zip_code}
          </p>
        </div>

        <div className="w-full my-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-md shadow border-[1.25px] border-[#DADCE0] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Occupancy Rate</p>
                  <p className="text-2xl font-bold">{hotel.occupancy_rate}%</p>
                  <p className="text-xs text-gray-400">
                    Last updated:{" "}
                    {new Date(
                      hotel.availability_stats.last_updated
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div className="w-30 h-30">
                  <Gauge
                    value={hotel.occupancy_rate}
                    startAngle={360}
                    endAngle={0}
                    sx={{
                      [`& .MuiGauge-valueText`]: {
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                      },
                    }}
                    text={`${hotel.occupancy_rate}%`}
                  />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-md border-[1.25px] border-[#DADCE0] shadow p-4">
              <p className="text-sm text-gray-500">Room Pricing (USD)</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Average:</span>
                  <span className="font-semibold">
                    ${hotel.average_room_price?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Min:</span>
                  <span className="font-semibold">
                    ${hotel.pricing_data.min?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Max:</span>
                  <span className="font-semibold">
                    ${hotel.pricing_data.max?.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                  style={{
                    width: `${
                      ((hotel.average_room_price - hotel.pricing_data.min) /
                        (hotel.pricing_data.max - hotel.pricing_data.min)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="bg-white border-[1.25px] border-[#DADCE0] rounded-md shadow p-4">
              <p className="text-sm text-gray-500">Room Status</p>
              <div className="mt-2 space-y-2">
                {Object.entries(hotel.availability_stats.status_counts).map(
                  ([status, count]) => (
                    <div key={status} className="flex items-center">
                      <span className="text-xs w-24 truncate">{status}:</span>
                      <div className="flex-1 ml-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${
                                (count / hotel.summary_counts.rooms) * 100
                              }%`,
                              backgroundColor: getStatusColor(status),
                            }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-xs font-medium ml-2">{count}</span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="bg-white border-[1.25px] border-[#DADCE0] rounded-md shadow p-4">
              <p className="text-sm text-gray-500">Current Discount</p>
              <p className="text-3xl font-bold text-green-600 my-2">
                {hotel.discount}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                  style={{ width: `${hotel.discount}%` }}
                ></div>
              </div>
              <p className="text-[0.875rem] text-gray-400 mt-1">
                Max discount: {hotel.max_discount_percent || hotel.discount}%
              </p>
            </div>
          </div>
          {/*  - - - - Repositioned Hotel Gallery Section */}
          <div className="bg-none shadow-none border-none max-w-[100%] py-6 px-0">
            <h2 className="flex items-center gap-x-2 text-xl font-semibold text-[#334155] border-b border-[#E8E8E8] pb-3 mb-4">
              <ImageIcon size={18} className="text-[#0081FB]" /> Hotel Gallery
            </h2>
            {isLoadingImages ? (
              <div className="h-64 flex justify-center items-center">
                <Loader className="animate-spin text-[#0081FB]" />
              </div>
            ) : (
              <ImageSlider images={hotelImagesData || []} hotelId={hotel.id} />
            )}
          </div>
          {/* - - - -  */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border-[1.25px] border-[#DADCE0] rounded-md shadow p-4">
              <h3 className="text-lg font-semibold mb-4">
                Room Type Distribution
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={hotel.room_type.map((room) => ({
                        name: room.name,
                        value: room.room_counts.total,
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#1C90F5"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {hotel.room_type.map((room) => (
                        <Cell
                          key={`cell-${room.id}`}
                          fill={getRoomTypeColor(room.name)}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white border-[1.25px] border-[#DADCE0] rounded-md shadow p-4">
              <h3 className="text-lg font-semibold mb-4">
                Room Status Overview
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={hotel.room_type.map((room) => ({
                      name: room.name,
                      Available: room.availability.available_rooms,
                      Booked: room.availability.booked_rooms,
                      Maintenance: room.availability.maintenance_rooms,
                      Other:
                        room.room_counts.total -
                        (room.availability.available_rooms +
                          room.availability.booked_rooms +
                          room.availability.maintenance_rooms),
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Available" stackId="a" fill="#00C5AD" />
                    <Bar dataKey="Booked" stackId="a" fill="#089EE6" />
                    <Bar dataKey="Maintenance" stackId="a" fill="#fbbf24" />
                    <Bar dataKey="Other" stackId="a" fill="#94a3b8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border-[1.25px] border-[#DADCE0] rounded-md shadow p-6">
              <h2 className="flex items-center gap-x-2 text-xl font-semibold text-[#334155] border-b border-[#E8E8E8] pb-3 mb-4">
                Hotel Description
              </h2>
              <ExpandableText text={hotel.description} wordLimit={70} />
            </div>
            <div className="bg-white border-[1.25px] border-[#DADCE0] rounded-md shadow p-6">
              <h2 className="flex items-center gap-x-2 text-xl font-semibold text-[#334155] border-b border-[#E8E8E8] pb-3 mb-4">
                Hotel Direction
              </h2>
              <ExpandableText text={hotel.directions} wordLimit={70} />
            </div>
            <div className="bg-white border-[1.25px] border-[#DADCE0] rounded-md shadow p-6">
              <h2 className="text-xl font-semibold text-[#334155] pb-3 mb-4 border-b border-[#E8E8E8]">
                Hotel Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem
                  icon={<Clock size={16} className="text-[#0081FB]" />}
                  label="Check-in Time"
                  value={hotel.check_in_from}
                />
                <DetailItem
                  icon={<Clock size={16} className="text-[#0081FB]" />}
                  label="Check-out Time"
                  value={hotel.check_out_to}
                />
                <DetailItem
                  icon={<Leaf size={16} className="text-[#0081FB]" />}
                  label="Eco Certified"
                  value={hotel.is_eco_certified ? "Yes" : "No"}
                />
                <DetailItem
                  icon={
                    <PiMapPinSimpleArea size={16} className="text-[#0081FB]" />
                  }
                  label="Latitude"
                  value={hotel.latitude}
                />
                <DetailItem
                  icon={
                    <PiMapPinSimpleArea size={16} className="text-[#0081FB]" />
                  }
                  label="Longitude"
                  value={hotel.longitude}
                />
              </div>
            </div>
            <div className="bg-white border-[1.25px] border-[#DADCE0] rounded-md shadow p-6">
              <h2 className="text-xl font-semibold text-[#334155] border-b border-[#E8E8E8] pb-3 mb-4">
                Hotel Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <FeatureList
                  title="Amenities"
                  items={amenities}
                  isLoading={amenityQueries.some((q) => q.isLoading)}
                />
                <FeatureList
                  title="Facilities"
                  items={facilities}
                  isLoading={facilityQueries.some((q) => q.isLoading)}
                />
                <FeatureList
                  title="Services"
                  items={services}
                  isLoading={serviceQueries.some((q) => q.isLoading)}
                />
                <FeatureList
                  title="Meal Plans"
                  items={mealTypes}
                  isLoading={mealTypeQueries.some((q) => q.isLoading)}
                />
                <FeatureList
                  title="Departments"
                  items={departments}
                  isLoading={departmentQueries.some((q) => q.isLoading)}
                />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white border-[1.25px] border-[#DADCE0] rounded-md shadow p-6">
              <h2 className="text-xl font-semibold text-[#334155] border-b border-[#E8E8E8] pb-3 mb-4">
                Room & Pricing Overview
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[#838383]">Total Rooms</p>
                  <p className="font-bold text-lg text-[#334155]">
                    {hotel.summary_counts.rooms}
                  </p>
                </div>
                <div>
                  <p className="text-[#838383]">Occupancy Rate</p>
                  <p className="font-bold text-lg text-emerald-500">
                    {hotel.occupancy_rate}%
                  </p>
                </div>
                <div>
                  <p className="text-[#838383]">Average Price</p>
                  <p className="font-bold text-lg text-[#334155]">
                    ${hotel.average_room_price?.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-[#838383]">Discount</p>
                  <p className="font-bold text-lg text-[#334155]">
                    {hotel.discount}%
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white border-[1.25px] border-[#DADCE0] rounded-md shadow p-6">
              <h2 className="text-xl font-semibold text-[#334155] border-b border-[#E8E8E8] pb-3 mb-4">
                Property Details
              </h2>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <DetailItem
                  icon={<Building size={16} className="text-[#0081FB]" />}
                  label="Floors"
                  value={hotel.number_floors}
                />
                <DetailItem
                  icon={<Utensils size={16} className="text-[#0081FB]" />}
                  label="Restaurants"
                  value={hotel.number_restaurants}
                />
                <DetailItem
                  icon={<GlassWater size={16} className="text-[#0081FB]" />}
                  label="Bars"
                  value={hotel.number_bars}
                />
                <DetailItem
                  icon={<ParkingCircle size={16} className="text-[#0081FB]" />}
                  label="Parks"
                  value={hotel.number_parks}
                />
                <DetailItem
                  icon={<Tally5 size={16} className="text-[#0081FB]" />}
                  label="Halls"
                  value={hotel.number_halls}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const FeatureList = ({
  title,
  items,
  isLoading,
}: {
  title: string;
  items: { id: string; name: string }[];
  isLoading: boolean;
}) => (
  <div>
    <h3 className="text-md font-semibold text-[#334155] mb-2">{title}</h3>
    {isLoading ? (
      <p className="text-sm text-[#838383]">Loading...</p>
    ) : (
      <ul className="space-y-2">
        {items.length > 0 ? (
          items.map((item) => (
            <li
              key={item.id}
              className="flex items-center text-sm text-[#202020]"
            >
              <FaRegCircleCheck className="mr-2 text-green-500" /> {item.name}
            </li>
          ))
        ) : (
          <p className="text-sm text-gray-400">
            No {title.toLowerCase()} listed.
          </p>
        )}
      </ul>
    )}
  </div>
);
