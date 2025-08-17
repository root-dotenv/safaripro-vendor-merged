"use client";
import { useHotel } from "../../providers/hotel-provider";
import {
  useQueries,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import hotelClient from "../../api/hotel-client";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaGlobe,
  FaImages,
  FaMapMarkerAlt,
  FaPencilAlt,
  FaDoorClosed,
  FaUserTie,
  FaStar,
  FaWifi,
  FaSwimmingPool,
  FaParking,
  FaUtensils,
  FaSpa,
  FaTv,
  FaSnowflake,
  FaCoffee,
  FaShuttleVan,
  FaConciergeBell,
} from "react-icons/fa";
import {
  Star,
  Phone,
  Mail,
  ChevronUp,
  ChevronDown,
  Pencil,
  Trash2,
  PlusCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { BsDashSquare } from "react-icons/bs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type {
  MealType,
  HotelType,
  HotelImage,
  Service,
} from "../../types/hotel-types";
import type { Amenity } from "@/types/amenities";
import type { Facility } from "@/types/facilities";
import type { RoomType } from "./customize-hotel/hotel";
import React, { useState, useRef, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { toast } from "sonner";
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
import { AddEditImageModal } from "./customize-hotel/AddEditImageModal";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Color Palette
const colors = {
  primary: "#155DFC",
  lightGreen: "#DCFCE6",
  neutralGray: "#6B7280",
  neutralLight: "#F7F7F7",
  error: "#EF4444",
};

// Room status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "#4ade80"; // green-600
    case "Booked":
      return "#f87171"; // amber-600
    case "Maintenance":
      return "#ef4444"; // red-600
    default:
      return "#94a3b8"; // gray-500
  }
};

// Skeleton Loader Component
const SkeletonLoader = ({ className }: { className?: string }) => (
  <div className={`bg-neutralLight/80 animate-pulse rounded-md ${className}`} />
);

// Helper functions
const getIconForEntity = (
  name: string,
  type: "amenity" | "facility" | "service"
) => {
  const lname = name.toLowerCase();
  if (type === "amenity") {
    if (lname.includes("wifi")) return <FaWifi className="text-blue-500" />;
    if (lname.includes("pool"))
      return <FaSwimmingPool className="text-blue-500" />;
    if (lname.includes("parking"))
      return <FaParking className="text-blue-500" />;
    if (lname.includes("tv")) return <FaTv className="text-blue-500" />;
    if (lname.includes("air cond"))
      return <FaSnowflake className="text-blue-500" />;
    if (lname.includes("coffee")) return <FaCoffee className="text-blue-500" />;
  }
  if (type === "facility") {
    if (lname.includes("restaurant"))
      return <FaUtensils className="text-blue-500" />;
    if (lname.includes("spa")) return <FaSpa className="text-blue-500" />;
    if (lname.includes("parking"))
      return <FaParking className="text-blue-500" />;
  }
  if (type === "service") {
    if (lname.includes("transport") || lname.includes("shuttle"))
      return <FaShuttleVan className="text-blue-500" />;
    if (lname.includes("concierge") || lname.includes("desk"))
      return <FaConciergeBell className="text-blue-500" />;
  }
  return <BsDashSquare className="text-blue-500" />;
};

// Enhanced staff data
const staffData = [
  {
    id: "1",
    name: "Florence Mushi",
    department: "Front Desk",
    jobTitle: "Receptionist",
    email: "florence.mushi@hotel.com",
    phone: "+2554567890",
    rating: 4.5,
    isActive: true,
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    hireDate: "2022-03-15",
    address: "123 Ocean Drive, Dar es Salaam, Tanzania",
    skills: ["Customer Service", "Multilingual", "Reservation Systems"],
  },
  {
    id: "2",
    name: "Justin Lasway",
    department: "Housekeeping",
    jobTitle: "Housekeeping Supervisor",
    email: "justin.lasway@hotel.com",
    phone: "+2554567891",
    rating: 4.2,
    isActive: true,
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    hireDate: "2021-07-22",
    address: "456 Palm Street, Arusha, Tanzania",
    skills: ["Team Management", "Cleaning Protocols", "Inventory Control"],
  },
  {
    id: "3",
    name: "Bashiri Iddi",
    department: "Maintenance",
    jobTitle: "Maintenance Technician",
    email: "bashiri.iddi@hotel.com",
    phone: "+2554567892",
    rating: 4.8,
    isActive: true,
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    hireDate: "2020-11-10",
    address: "789 River Road, Zanzibar, Tanzania",
    skills: ["Electrical Repairs", "Plumbing", "HVAC Maintenance"],
  },
  {
    id: "4",
    name: "Emily Davis",
    department: "Restaurant",
    jobTitle: "Head Chef",
    email: "emily.davis@hotel.com",
    phone: "+2554567893",
    rating: 4.0,
    isActive: true,
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    hireDate: "2023-01-05",
    address: "101 Coral Avenue, Mwanza, Tanzania",
    skills: ["Culinary Arts", "Menu Planning", "Food Safety"],
  },
  {
    id: "5",
    name: "Elibariki Basso",
    department: "Security",
    jobTitle: "Security Officer",
    email: "elibariki.basso@hotel.com",
    phone: "+2554567894",
    rating: 4.7,
    isActive: false,
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    hireDate: "2019-09-18",
    address: "202 Beach Lane, Dodoma, Tanzania",
    skills: ["Surveillance", "Conflict Resolution", "First Aid"],
  },
];

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
    onError: () => {
      toast.error("Failed to delete image. Please try again.");
    },
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

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" && canScrollLeft) scrollLeft();
    if (e.key === "ArrowRight" && canScrollRight) scrollRight();
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-neutralLight flex items-center justify-center text-neutralGray rounded-lg">
        <div className="text-center">
          <p className="font-medium text-neutralGray">No images available</p>
          <Button
            variant="ghost"
            onClick={handleOpenAddModal}
            className="mt-2 flex items-center gap-2 text-blue-500 hover:bg-blue-50"
          >
            <PlusCircle className="h-5 w-5" />
            Add Images
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" onKeyDown={handleKeyDown} tabIndex={0}>
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
                className="border-white hover:bg-white hover:text-black"
                onClick={() => handleOpenEditModal(image)}
                aria-label={`Edit image ${image.tag}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-red-400 border-none hover:bg-red-500 hover:text-white"
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
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5 text-blue-500" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5 text-blue-500" />
        </button>
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
              This action cannot be undone. This will permanently delete the
              image from your gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (imageToDelete) {
                  deleteImageMutation.mutate(imageToDelete.id);
                }
              }}
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

const QuickLinks = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Card className="rounded-lg border-neutralGray/20 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <LinkIcon className="h-5 w-5 text-blue-500" />
          Quick Links
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="w-full text-blue-500 border-blue-500 hover:bg-blue-50"
            onClick={() => scrollToSection("room-types")}
          >
            Room Types
          </Button>
          <Button
            variant="outline"
            className="w-full text-blue-500 border-blue-500 hover:bg-blue-50"
            onClick={() => scrollToSection("staff")}
          >
            Staff Directory
          </Button>
          <Link to="/bookings/all-bookings">
            <Button
              variant="outline"
              className="w-full text-blue-500 border-blue-500 hover:bg-blue-50"
            >
              All Bookings
            </Button>
          </Link>
          <Link to="/reservations/checkin">
            <Button
              variant="outline"
              className="w-full text-blue-500 border-blue-500 hover:bg-blue-50"
            >
              Checked-In Guests
            </Button>
          </Link>
        </div>
        <Button
          variant="ghost"
          className="w-full mt-4 text-blue-500 hover:bg-blue-50"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to Top
        </Button>
      </CardContent>
    </Card>
  );
};

export default function HotelDetails() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const { hotel, isLoading: isHotelLoading } = useHotel();
  const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const {
    data: hotelTypeDetails,
    isLoading: isLoadingHotelType,
    isError: isHotelTypeError,
  } = useQuery<HotelType>({
    queryKey: ["hotelType", hotel?.hotel_type],
    queryFn: () =>
      hotelClient
        .get(`/hotel-types/${hotel?.hotel_type}/`)
        .then((res) => res.data),
    enabled: !!hotel?.hotel_type,
    staleTime: 1000 * 60 * 60 * 24,
    onError: () => toast.error("Failed to load hotel type. Please try again."),
  });

  const {
    data: departments,
    isLoading: isLoadingDepartments,
    isError: isDepartmentsError,
  } = useQuery({
    queryKey: ["departments", HOTEL_ID],
    queryFn: () =>
      hotelClient
        .get(`/departments/?hotel_id=${HOTEL_ID}`)
        .then((res) => res.data.results),
    enabled: !!HOTEL_ID,
    staleTime: 1000 * 60 * 60,
    onError: () => toast.error("Failed to load departments. Please try again."),
  });

  const {
    data: hotelImagesData,
    isLoading: isLoadingImages,
    isError: isImagesError,
  } = useQuery({
    queryKey: ["hotelImages", HOTEL_ID],
    queryFn: () =>
      hotelClient
        .get(`/hotel-images/?hotel_id=${HOTEL_ID}`)
        .then((res) => res.data.results as HotelImage[]),
    enabled: !!HOTEL_ID,
    staleTime: 1000 * 60 * 60,
    onError: () =>
      toast.error("Failed to load hotel images. Please try again."),
  });

  const amenityQueries = useQueries({
    queries: (hotel?.amenities || []).map((id) => ({
      queryKey: ["amenity", id],
      queryFn: () =>
        hotelClient.get(`/amenities/${id}/`).then((res) => res.data as Amenity),
      enabled: !!hotel,
      staleTime: 1000 * 60 * 60,
      onError: () => toast.error("Failed to load amenity. Please try again."),
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
      staleTime: 1000 * 60 * 60,
      onError: () => toast.error("Failed to load facility. Please try again."),
    })),
  });

  const serviceQueries = useQueries({
    queries: (hotel?.services || []).map((id) => ({
      queryKey: ["service", id],
      queryFn: () =>
        hotelClient.get(`/services/${id}/`).then((res) => res.data as Service),
      enabled: !!hotel,
      staleTime: 1000 * 60 * 60,
      onError: () => toast.error("Failed to load service. Please try again."),
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
      staleTime: 1000 * 60 * 60,
      onError: () => toast.error("Failed to load meal type. Please try again."),
    })),
  });

  if (isHotelLoading) {
    return (
      <div className="p-6 space-y-6">
        <SkeletonLoader className="h-12 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonLoader key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
        <SkeletonLoader className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="p-6 text-center text-red-600">
        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
        <p>No hotel data available.</p>
      </div>
    );
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

  const roomStatusData = {
    Available: hotel.availability_stats.status_counts.Available || 0,
    Booked: hotel.availability_stats.status_counts.Booked || 0,
    Maintenance: hotel.room_type.reduce(
      (acc, rt) => acc + (rt.room_counts.Maintenance || 0),
      0
    ),
  };

  // Pie chart data
  const pieChartData = [
    { name: "Available", value: roomStatusData.Available, color: "#4ade80" },
    { name: "Booked", value: roomStatusData.Booked, color: "#f87171" },
    {
      name: "Maintenance",
      value: roomStatusData.Maintenance,
      color: "#ef4444",
    },
  ].filter((entry) => entry.value > 0); // Filter out zero values for better visualization

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-neutralLight/50 space-y-6 font-sans">
      {/* Header */}
      <header className="sticky top-0 bg-white z-10 shadow-sm py-4 px-6 rounded-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {hotel.name} - Overview
            </h1>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-sm text-neutralGray">
              <span>{hotel.address}</span>
              <span className="text-gray-300 hidden md:inline">•</span>
              {isLoadingHotelType ? (
                <SkeletonLoader className="h-6 w-28" />
              ) : isHotelTypeError ? (
                <span className="text-error">Error</span>
              ) : (
                <span className="font-semibold text-primary">
                  {hotelTypeDetails?.name || "Unknown"}
                </span>
              )}
              <span className="text-gray-300 hidden md:inline">•</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: hotel.star_rating }).map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            asChild
            className="border-blue-500 text-blue-500 hover:bg-blue-50"
          >
            <Link to="/hotel/customize-hotel">
              <FaPencilAlt className="mr-2 h-4 w-4" />
              Customize Hotel
            </Link>
          </Button>
        </div>
      </header>

      {/* Second Row - Location, Status, Data Cards, Pie Chart */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Location & Contact Card */}
        <Card className="rounded-lg border-neutralGray/20 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-primary">
              <FaMapMarkerAlt /> Location & Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-800">Address</p>
              <p className="text-sm text-neutralGray">
                {hotel.address}, {hotel.zip_code}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Location Coordinates
              </p>
              <span className="block text-sm text-neutralGray">
                Latitude {hotel.latitude}
              </span>
              <span className="block text-sm text-neutralGray">
                Longitude {hotel.longitude}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {hotel.website_url && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-blue-500 border-blue-500 hover:bg-blue-50"
                >
                  <a
                    href={hotel.website_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Visit website"
                  >
                    <FaGlobe className="mr-2 h-4 w-4" />
                    Website
                  </a>
                </Button>
              )}
              {hotel.facebook_url && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-blue-500 border-blue-500 hover:bg-blue-50"
                >
                  <a
                    href={hotel.facebook_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Visit Facebook"
                  >
                    <FaFacebook className="mr-2 h-4 w-4" />
                    Facebook
                  </a>
                </Button>
              )}
              {hotel.instagram_url && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-blue-500 border-blue-500 hover:bg-blue-50"
                >
                  <a
                    href={hotel.instagram_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Visit Instagram"
                  >
                    <FaInstagram className="mr-2 h-4 w-4" />
                    Instagram
                  </a>
                </Button>
              )}
              {hotel.twitter_url && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-blue-500 border-blue-500 hover:bg-blue-50"
                >
                  <a
                    href={hotel.twitter_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Visit Twitter"
                  >
                    <FaTwitter className="mr-2 h-4 w-4" />
                    Twitter
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Room Status Card */}
        <Card className="rounded-lg border-neutralGray/20 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-primary">
              <FaDoorClosed /> Room Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-800">
                  Available
                </span>
                <span className="font-mono font-semibold text-green-600">
                  {roomStatusData.Available}
                </span>
              </div>
              <Progress
                value={(roomStatusData.Available / hotel.number_rooms) * 100}
                className="h-2"
                indicatorClassName="bg-green-600"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-800">
                  Booked
                </span>
                <span className="font-mono font-semibold text-amber-600">
                  {roomStatusData.Booked}
                </span>
              </div>
              <Progress
                value={(roomStatusData.Booked / hotel.number_rooms) * 100}
                className="h-2"
                indicatorClassName="bg-amber-600"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-800">
                  Maintenance
                </span>
                <span className="font-mono font-semibold text-red-600">
                  {roomStatusData.Maintenance}
                </span>
              </div>
              <Progress
                value={(roomStatusData.Maintenance / hotel.number_rooms) * 100}
                className="h-2"
                indicatorClassName="bg-red-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Occupancy Rate Card */}
        <div className="bg-white rounded-md shadow p-4">
          <p className="text-sm text-gray-500">Occupancy Rate</p>
          <div className="flex items-center justify-between mt-2">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {hotel.occupancy_rate.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-400">Last updated: Today</p>
            </div>
            <div className="w-20 h-20">
              <Progress
                value={hotel.occupancy_rate}
                className="h-2 mt-4"
                indicatorClassName="bg-gradient-to-r from-green-400 to-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Room Pricing Card */}
        <div className="bg-white rounded-md shadow p-4">
          <p className="text-sm text-gray-500">Room Pricing (USD)</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between">
              <span className="text-sm">Average:</span>
              <span className="font-semibold">
                ${hotel.average_room_price.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Min:</span>
              <span className="font-semibold">
                ${hotel.pricing_data.min.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Max:</span>
              <span className="font-semibold">
                ${hotel.pricing_data.max.toFixed(2)}
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

        {/* Hotel Spaces Card */}
        <div className="bg-white rounded-md shadow p-4">
          <p className="text-sm text-gray-500">Hotel Spaces</p>
          <div className="mt-2 space-y-1">
            {[
              { label: "Floors", value: hotel.number_floors },
              { label: "Rooms", value: hotel.number_rooms },
              { label: "Bars", value: hotel.number_bars },
              { label: "Halls", value: hotel.number_halls },
              { label: "Parks", value: hotel.number_parks },
              { label: "Restaurants", value: hotel.number_restaurants },
            ].map((item) => (
              <div key={item.label} className="flex justify-between">
                <span className="text-sm">{item.label}:</span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Discount Card */}
        <div className="bg-white rounded-md shadow p-4">
          <p className="text-sm text-gray-500">Current Discount</p>
          <p className="text-3xl font-bold text-green-600 my-2">
            {(hotel as any).discount ? `${(hotel as any).discount}%` : "N/A"}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ width: `${(hotel as any).discount || 0}%` }}
            >
              {(hotel as any).discount ? (hotel as any).discount / 100 : 0}
            </div>
          </div>
          <p className="text-[0.875rem] text-gray-400 mt-1">
            Max discount: {(hotel as any).max_discount_percent || "N/A"}%
          </p>
        </div>

        {/* Room Distribution Pie Chart */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-2 rounded-lg border-neutralGray/20 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-primary">
              <FaDoorClosed /> Room Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Gallery Card */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 rounded-lg border-neutralGray/20 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-primary">
              <FaImages /> Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingImages ? (
              <SkeletonLoader className="w-full h-64 rounded-lg" />
            ) : isImagesError ? (
              <div className="w-full h-64 flex items-center justify-center text-error rounded-lg">
                <AlertCircle className="h-8 w-8 mr-2" />
                <span>Failed to load images</span>
              </div>
            ) : (
              <ImageSlider images={hotelImagesData || []} hotelId={HOTEL_ID} />
            )}
          </CardContent>
        </Card>

        {/* Staff Table */}
        <Card
          id="staff"
          className="col-span-1 md:col-span-2 lg:col-span-3 rounded-lg border-neutralGray/20 shadow-sm hover:shadow-md transition-shadow"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
              <FaUserTie className="text-blue-500" />
              Staff Members
            </CardTitle>
            <CardDescription className="text-neutralGray">
              Current hotel staff directory
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-none hover:bg-none">
                    <TableHead className="text-gray-800">Name</TableHead>
                    <TableHead className="text-gray-800">Department</TableHead>
                    <TableHead className="text-gray-800">Contact</TableHead>
                    <TableHead className="text-gray-800">Rating</TableHead>
                    <TableHead className="text-gray-800">Status</TableHead>
                    <TableHead className="text-gray-800"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffData.map((staff) => (
                    <React.Fragment key={staff.id}>
                      <TableRow
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => toggleRow(staff.id)}
                        aria-expanded={expandedRow === staff.id}
                        aria-controls={`staff-details-${staff.id}`}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={staff.avatar} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800">
                                {staff.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-gray-800 font-medium">
                              {staff.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {staff.department}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-700" />
                              <span className="text-sm text-gray-600">
                                {staff.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-700" />
                              <span className="text-sm text-gray-600">
                                {staff.phone}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-gray-700">
                              {staff.rating}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={staff.isActive ? "secondary" : "outline"}
                            className={
                              staff.isActive
                                ? "bg-lightGreen text-green-800 border-green-200"
                                : "bg-gray-100 text-gray-600 border-gray-200"
                            }
                          >
                            {staff.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Collapsible>
                            <CollapsibleTrigger asChild>
                              {expandedRow === staff.id ? (
                                <ChevronUp className="h-4 w-4 text-blue-500" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-blue-500" />
                              )}
                            </CollapsibleTrigger>
                          </Collapsible>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={6} className="p-0">
                          <Collapsible open={expandedRow === staff.id}>
                            <CollapsibleContent
                              id={`staff-details-${staff.id}`}
                            >
                              <div className="p-4 bg-gray-50 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-800">
                                      Job Title
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {staff.jobTitle}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-800">
                                      Hire Date
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {staff.hireDate}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-800">
                                      Address
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {staff.address}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-800">
                                      Skills
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {staff.skills.map((skill, index) => (
                                        <Badge
                                          key={index}
                                          variant="outline"
                                          className="bg-lightGreen text-green-800 border-green-200"
                                        >
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Amenities Card */}
        <Card
          id="amenities"
          className="rounded-lg border-neutralGray/20 shadow-sm hover:shadow-md transition-shadow"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
              <BsDashSquare className="text-blue-500" /> Amenities
            </CardTitle>
            <CardDescription className="text-neutralGray">
              Available in-room amenities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {amenityQueries.some((q) => q.isLoading) ? (
                [...Array(3)].map((_, i) => (
                  <SkeletonLoader key={i} className="h-12 w-full rounded-lg" />
                ))
              ) : amenities.length > 0 ? (
                amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center gap-3">
                    <span className="bg-blue-50 p-2 rounded">
                      {getIconForEntity(amenity.name, "amenity")}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {amenity.name}
                      </p>
                      <p className="text-sm text-neutralGray">
                        {amenity.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-neutralGray">
                  No amenities listed
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Facilities Card */}
        <Card
          id="facilities"
          className="rounded-lg border-neutralGray/20 shadow-sm hover:shadow-md transition-shadow"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
              <BsDashSquare className="text-blue-500" /> Facilities
            </CardTitle>
            <CardDescription className="text-neutralGray">
              Available hotel facilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {facilityQueries.some((q) => q.isLoading) ? (
                [...Array(3)].map((_, i) => (
                  <SkeletonLoader key={i} className="h-12 w-full rounded-lg" />
                ))
              ) : facilities.length > 0 ? (
                facilities.map((facility) => (
                  <div key={facility.id} className="flex items-center gap-3">
                    <span className="bg-blue-50 p-2 rounded">
                      {getIconForEntity(facility.name, "facility")}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {facility.name}
                      </p>
                      <p className="text-sm text-neutralGray">
                        {facility.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-neutralGray">
                  No facilities listed
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Meal Types Card */}
        <Card
          id="meal-types"
          className="rounded-lg border-neutralGray/20 shadow-sm hover:shadow-md transition-shadow"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
              <BsDashSquare className="text-blue-500" /> Meal Plans
            </CardTitle>
            <CardDescription className="text-neutralGray">
              Available meal options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mealTypeQueries.some((q) => q.isLoading) ? (
                [...Array(3)].map((_, i) => (
                  <SkeletonLoader key={i} className="h-12 w-full rounded-lg" />
                ))
              ) : mealTypes.length > 0 ? (
                mealTypes.map((meal) => (
                  <div key={meal.id} className="flex items-center gap-3">
                    <span className="bg-blue-50 p-2 rounded">
                      {getIconForEntity(meal.name, "amenity")}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{meal.name}</p>
                      <div className="flex items-center gap-2 text-sm text-neutralGray">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{meal.score || "N/A"} Rating</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-neutralGray">
                  No meal plans listed
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Services Card */}
        <Card
          id="services"
          className="rounded-lg border-neutralGray/20 shadow-sm hover:shadow-md transition-shadow"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
              <BsDashSquare className="text-blue-500" /> Services
            </CardTitle>
            <CardDescription className="text-neutralGray">
              Available hotel services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {serviceQueries.some((q) => q.isLoading) ? (
                [...Array(3)].map((_, i) => (
                  <SkeletonLoader key={i} className="h-12 w-full rounded-lg" />
                ))
              ) : services.length > 0 ? (
                services.map((service) => (
                  <div key={service.id} className="flex items-center gap-3">
                    <span className="bg-blue-50 p-2 rounded">
                      {getIconForEntity(service.name, "service")}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {service.name}
                      </p>
                      <p className="text-sm text-neutralGray">
                        {service.service_type_name}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-neutralGray">
                  No services listed
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Room Types Card */}
        <Card
          id="room-types"
          className="rounded-lg border-neutralGray/20 shadow-sm hover:shadow-md transition-shadow"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
              <BsDashSquare className="text-blue-500" /> Room Types
            </CardTitle>
            <CardDescription className="text-neutralGray">
              Available room categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hotel.room_type?.length > 0 ? (
                hotel.room_type.map((room: RoomType) => (
                  <div key={room.id} className="flex items-center gap-3">
                    <span className="bg-blue-50 p-2 rounded">
                      <BsDashSquare className="h-5 w-5 text-blue-500" />
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {room.name} ({room.code})
                      </p>
                      <p className="text-sm text-neutralGray">
                        {room.max_occupancy} max occupancy • {room.bed_type}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-neutralGray">
                  No room types listed
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Departments Card */}
        <Card
          id="departments"
          className="rounded-lg border-neutralGray/20 shadow-sm hover:shadow-md transition-shadow"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
              <BsDashSquare className="text-blue-500" /> Departments
            </CardTitle>
            <CardDescription className="text-neutralGray">
              Hotel operational departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoadingDepartments ? (
                [...Array(3)].map((_, i) => (
                  <SkeletonLoader key={i} className="h-12 w-full rounded-lg" />
                ))
              ) : isDepartmentsError ? (
                <div className="text-center text-error">
                  <AlertCircle className="h-5 w-5 mx-auto mb-2" />
                  <p>Failed to load departments</p>
                </div>
              ) : departments?.length > 0 ? (
                departments.map((dept) => (
                  <div key={dept.id} className="flex items-center gap-3">
                    <span className="bg-blue-50 p-2 rounded">
                      <BsDashSquare className="h-5 w-5 text-blue-500" />
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{dept.name}</p>
                      <p className="text-sm text-neutralGray">
                        {dept.code} • {dept.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-neutralGray">
                  No departments listed
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <QuickLinks />
      </section>
    </div>
  );
}
