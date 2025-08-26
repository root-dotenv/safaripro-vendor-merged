"use client";
import { useQuery, useQueries } from "@tanstack/react-query";
import hotelClient from "../../api/hotel-client";
import {
  Users,
  BedDouble,
  Star,
  AreaChart,
  CheckCircle,
  ConciergeBell,
  Sparkles,
  Blocks,
  Clock,
  Calendar,
  Percent,
  Sprout,
  Building,
  Utensils,
  Car,
  DoorOpen,
  AlertCircle,
  Globe,
  Soup,
  MapPin,
  Hotel,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
} from "lucide-react";
import { RiHotelLine } from "react-icons/ri";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaGlobe,
} from "react-icons/fa";
import { Link } from "react-router-dom";

// Shadcn UI Components
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useHotel } from "@/providers/hotel-provider";
import { useState, useRef } from "react";
import { IoLanguageOutline } from "react-icons/io5";

// Type Definitions
type FeatureType =
  | "amenities"
  | "facilities"
  | "services"
  | "translations"
  | "meal-types"
  | "regions";

type FetchedFeature = {
  id: string;
  name: string;
  description: string;
};

type HotelImage = {
  id: string;
  original: string;
  tag: string;
};

type Vendor = {
  id: string;
  logo: string;
  website: string | null;
  social_media: {
    id: string;
    platform: string;
    platform_display: string;
    url: string;
    handle: string;
    is_active: boolean;
  }[];
};

// Skeleton & UI Helper Components
const SkeletonLoader = ({ className }: { className?: string }) => (
  <div className={`bg-neutralLight/80 animate-pulse rounded-md ${className}`} />
);

const IndividualFeatureCardSkeleton = () => (
  <div className="p-4 border border-neutralGray/20 rounded-lg flex items-start gap-4 bg-white shadow-sm">
    <SkeletonLoader className="h-6 w-6 rounded-full" />
    <div className="flex-1 space-y-2">
      <SkeletonLoader className="h-4 w-3/4" />
      <SkeletonLoader className="h-3 w-full" />
      <SkeletonLoader className="h-3 w-5/6" />
    </div>
  </div>
);

// Refined UI Components
const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-center gap-3">
    <Icon className="h-5 w-5 text-blue-500 flex-shrink-0" />
    <div>
      <div className="text-neutralGray text-xs font-medium">{label}</div>
      <div className="font-semibold text-sm text-gray-900">
        {value || "N/A"}
      </div>
    </div>
  </div>
);

const SocialIconLink = ({
  href,
  icon: Icon,
  label,
}: {
  href: string | null | undefined;
  icon: React.ElementType;
  label: string;
}) => {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="p-2 rounded-full text-[#FFF] bg-neutralLight bg-[#0081FB] hover:text-white transition-colors duration-200"
    >
      <Icon className="h-5 w-5" />
    </a>
  );
};

const IndividualFeatureCard = ({
  queryResult,
  icon: Icon,
}: {
  queryResult: {
    data?: FetchedFeature;
    isError: boolean;
  };
  icon: React.ElementType;
}) => {
  const { data, isError } = queryResult;

  if (isError || !data) {
    return (
      <div className="p-4 border border-red-200 rounded-lg flex items-center gap-3 bg-red-50 text-red-600">
        <AlertCircle className="h-5 w-5" />
        <span className="text-sm font-medium">Could not load this item.</span>
      </div>
    );
  }

  return (
    <div className="p-4 border border-neutralGray/20 rounded-lg flex items-start gap-4 bg-white hover:bg-lightGreen/30 transition-colors shadow-sm hover:shadow-md">
      <Icon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
      <div className="flex-1">
        <p className="font-semibold text-md text-gray-900">{data.name}</p>
        <p className="text-sm text-neutralGray mt-1">{data.description}</p>
      </div>
    </div>
  );
};

const FeatureList = ({
  title,
  icon: Icon,
  ids,
  featureType,
}: {
  title: string;
  icon: React.ElementType;
  ids: string[] | undefined;
  featureType: FeatureType;
}) => {
  if (!ids || ids.length === 0) {
    return null;
  }

  const HOTEL_BASE_URL = import.meta.env.VITE_HOTEL_BASE_URL;

  const featureQueries = useQueries({
    queries: ids.map((id) => ({
      queryKey: [featureType, id],
      queryFn: async (): Promise<FetchedFeature> => {
        const url = `${HOTEL_BASE_URL}${featureType}/${id}`;
        const response = await hotelClient.get(url);
        const data = response.data;

        if (featureType === "translations") {
          return {
            id: data.id,
            name: data.language,
            description: `Available for country: ${data.country_name}`,
          };
        }
        if (featureType === "regions") {
          return {
            id: data.id,
            name: data.name,
            description: `Country: ${data.country_name}`,
          };
        }
        return data;
      },
      staleTime: 1000 * 60 * 60,
      retry: 1,
    })),
  });

  const isLoading = featureQueries.some((q) => q.isLoading);

  return (
    <section>
      <h3 className="mb-4 text-lg font-semibold tracking-tight flex items-center gap-3 text-gray-900">
        <Icon className="h-5 w-5 text-blue-500" />
        {title}
      </h3>
      <div className="space-y-3">
        {isLoading
          ? ids.map((id) => <IndividualFeatureCardSkeleton key={id} />)
          : featureQueries.map((result, index) => (
              <IndividualFeatureCard
                key={ids[index]}
                queryResult={result}
                icon={Icon}
              />
            ))}
      </div>
    </section>
  );
};

const ImageSlider = ({ images }: { images: HotelImage[] }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

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

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-neutralLight flex items-center justify-center text-neutralGray">
        No images available
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={sliderRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4"
        onScroll={checkScroll}
      >
        {images.map((image) => (
          <div key={image.id} className="flex-shrink-0 w-64 h-64 snap-center">
            <img
              src={image.original}
              alt={image.tag || "Hotel image"}
              className="w-full h-full object-cover rounded-lg shadow-md"
            />
          </div>
        ))}
      </div>
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
        >
          <ChevronLeft className="h-5 w-5 text-blue-500" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
        >
          <ChevronRight className="h-5 w-5 text-blue-500" />
        </button>
      )}
    </div>
  );
};

const QuickLinks = () => {
  return (
    <section className="p-4 border-[1.5px] rounded-md border-[#DADCE0] bg-[#FFF]">
      <h3 className="mb-4 text-lg font-semibold tracking-tight flex items-center gap-3 text-gray-900">
        <LinkIcon className="h-5 w-5 text-green-500" />
        Quick Links
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <Link to="/hotel/hotel-features">
          <Button
            variant="outline"
            className="w-full bg-[#0081FB] hover:text-[#FFF] text-[#FFF] border-none hover:bg-blue-600 transition-all cursor-pointer"
          >
            Hotel Features
          </Button>
        </Link>
        <Link to="/bookings/all-bookings">
          <Button
            variant="outline"
            className="w-full bg-[#0081FB] hover:text-[#FFF] text-[#FFF] border-none hover:bg-blue-600 transition-all cursor-pointer"
          >
            All Bookings
          </Button>
        </Link>
        <Link to="/rooms/available-rooms">
          <Button
            variant="outline"
            className="w-full bg-[#0081FB] hover:text-[#FFF] text-[#FFF] border-none hover:bg-blue-600 transition-all cursor-pointer"
          >
            Available Rooms
          </Button>
        </Link>
        <Link to="/reservations/checkin">
          <Button
            variant="outline"
            className="w-full bg-[#0081FB] hover:text-[#FFF] text-[#FFF] border-none hover:bg-blue-600 transition-all cursor-pointer"
          >
            Checked-In Guests
          </Button>
        </Link>
      </div>
    </section>
  );
};

// - - - Main Component
export function HotelDetailsSheet() {
  const { hotel } = useHotel();

  const VENDOR_BASE_API_URL = import.meta.env.VITE_VENDOR_BASE_URL;
  const VENDOR_ID = import.meta.env.VITE_VENDOR_ID;
  const VENDOR_BASE_URL = `${VENDOR_BASE_API_URL}vendors/`;

  const { data: vendor, isLoading: isLoadingVendor } = useQuery<Vendor>({
    queryKey: ["vendor", VENDOR_ID],
    queryFn: async () => {
      const { data } = await hotelClient.get(`${VENDOR_BASE_URL}${VENDOR_ID}`);
      return data;
    },
    staleTime: 1000 * 60 * 60,
  });

  const { data: images, isLoading: isLoadingImages } = useQuery<HotelImage[]>({
    queryKey: ["hotelImages", hotel?.id],
    queryFn: async () => {
      if (!hotel?.id) {
        return [];
      }
      try {
        const response = await hotelClient.get(
          `/hotel-images/?hotel_id=${hotel.id}`
        );
        if (response.data && Array.isArray(response.data.results)) {
          return response.data.results;
        }
        return [];
      } catch (error) {
        console.error("Failed to fetch hotel images in sheet:", error);
        return [];
      }
    },
    enabled: !!hotel?.id,
    staleTime: 1000 * 60 * 60,
  });

  const { data: hotelTypeData, isLoading: isLoadingHotelType } = useQuery({
    queryKey: ["hotel-type", hotel?.hotel_type],
    queryFn: async () => {
      const { data } = await hotelClient.get(
        `/hotel-types/${hotel?.hotel_type}`
      );
      return data as { name: string };
    },
    enabled: !!hotel?.hotel_type,
    staleTime: 1000 * 60 * 60 * 24,
  });

  if (!hotel) return null;

  const formatCurrency = (amount: number | undefined) => {
    if (typeof amount !== "number") return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: hotel.pricing_data?.currency || "USD",
    }).format(amount);
  };

  const platformIcons: { [key: string]: React.ElementType } = {
    facebook: FaFacebookF,
    instagram: FaInstagram,
    twitter: FaTwitter,
    youtube: FaYoutube,
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="bg-[#FFF] fixed bottom-8 right-8 h-18 w-18 rounded-full flex items-center justify-center text-[#155DFC] font-medium bg-blue border border-blue/20 shadow-lg hover:shadow-xl transition-shadow z-50">
          <RiHotelLine size={32} />
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg p-0 bg-neutral-100">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-4 bg-white border-b border-neutralGray/20 sticky top-0 z-10 shadow-sm">
            {isLoadingVendor ? (
              <SkeletonLoader className="h-16 w-16 mx-auto rounded-full" />
            ) : (
              vendor?.logo && (
                <img
                  src={vendor.logo}
                  alt="Hotel Logo"
                  className="h-16 w-16 mx-auto rounded-full object-cover mb-4"
                />
              )
            )}
            <SheetTitle className="text-[1.75rem] font-bold tracking-tight text-gray-900">
              {hotel.name}
            </SheetTitle>
            <div className="mt-2 flex items-center gap-3">
              {isLoadingHotelType && <SkeletonLoader className="h-6 w-28" />}
              {hotelTypeData && (
                <Badge
                  variant="secondary"
                  className="py-0 px-0 rounded-none text-[1.125rem] bg-lightGreen text-blue-500"
                >
                  {hotelTypeData.name}
                </Badge>
              )}
            </div>
            <div className="flex items-center pt-2 gap-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < (hotel.star_rating ?? 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-neutralGray/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-neutralGray">
                ({hotel.star_rating}-star rating)
              </span>
            </div>
            <SheetDescription className="pt-2 text-sm text-neutralGray">
              {hotel.description}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutralLight/50">
            {isLoadingImages ? (
              <SkeletonLoader className="w-full h-64 rounded-lg" />
            ) : (
              <ImageSlider images={images || []} />
            )}
            <Card className="shadow-sm border-[1.5px] rounded-md border-[#DADCE0] bg-[#FFF]">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Hotel Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                <InfoItem
                  icon={AreaChart}
                  label="Occupancy"
                  value={`${hotel.availability_stats?.occupancy_rate}%`}
                />
                <InfoItem
                  icon={RiHotelLine}
                  label="Total Rooms"
                  value={hotel.summary_counts?.rooms}
                />
                <InfoItem
                  icon={CheckCircle}
                  label="Available"
                  value={hotel.availability_stats?.status_counts?.Available}
                />
                <InfoItem
                  icon={Building}
                  label="Floors"
                  value={hotel.number_floors}
                />
                <InfoItem
                  icon={Utensils}
                  label="Restaurants"
                  value={hotel.number_restaurants}
                />
                <InfoItem
                  icon={Car}
                  label="Parkings"
                  value={hotel.number_parks}
                />
                <InfoItem
                  icon={DoorOpen}
                  label="Halls"
                  value={hotel.number_halls}
                />
                <InfoItem
                  icon={Calendar}
                  label="Year Built"
                  value={hotel.year_built}
                />
                {hotel.discount > 0 && (
                  <InfoItem
                    icon={Percent}
                    label="Max Discount"
                    value={`${hotel.discount}%`}
                  />
                )}
              </CardContent>
            </Card>

            <Card className="border-neutralGray/20 shadow-sm border-[1.5px] rounded-md border-[#DADCE0] bg-[#FFF]">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Policies & Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                <InfoItem
                  icon={Clock}
                  label="Check-in Time"
                  value={`From ${hotel.check_in_from}`}
                />
                <InfoItem
                  icon={Clock}
                  label="Check-out Time"
                  value={`Until ${hotel.check_out_to}`}
                />
                <InfoItem
                  icon={Star}
                  label="Rate Options"
                  value={hotel.rate_options}
                />
                <InfoItem
                  icon={Sprout}
                  label="Eco-Certified"
                  value={hotel.is_eco_certified ? "Yes" : "No"}
                />
              </CardContent>
            </Card>

            <section>
              <h3 className="mb-4 text-lg font-semibold tracking-tight flex items-center gap-3 text-gray-900">
                <Hotel className="h-5 w-5 text-blue-500" />
                Room Types
              </h3>
              <div className="space-y-4">
                {hotel.room_type?.map((room) => (
                  <Card
                    key={room.id}
                    className="p-4 justify-between border-[1.5px] rounded-md border-[#DADCE0] bg-[#FFF] hover:bg-lightGreen/30 transition-colors shadow-sm flex flex-col items-center"
                  >
                    <div className="flex flex-col items-center">
                      <p className="font-semibold text-md text-gray-900">
                        {room.name}
                      </p>
                      <div className="flex items-center text-neutralGray text-sm mt-1 gap-4">
                        <span className="flex items-center gap-2">
                          <Users className="h-4 w-4" /> Max {room.max_occupancy}
                        </span>
                        <span className="flex items-center gap-2">
                          <BedDouble className="h-4 w-4" /> {room.bed_type}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-md text-green-500">
                        {formatCurrency(room.pricing?.avg_price)}
                      </p>
                      <p className="text-xs text-neutralGray">avg/night</p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <Separator className="bg-neutralGray/20" />

            <FeatureList
              title="Amenities"
              icon={Sparkles}
              ids={hotel.amenities}
              featureType="amenities"
            />
            <FeatureList
              title="Facilities"
              icon={Blocks}
              ids={hotel.facilities}
              featureType="facilities"
            />
            <FeatureList
              title="Services"
              icon={ConciergeBell}
              ids={hotel.services}
              featureType="services"
            />
            <FeatureList
              title="Meal Types"
              icon={Soup}
              ids={hotel.meal_types}
              featureType="meal-types"
            />
            <FeatureList
              title="Translations"
              icon={IoLanguageOutline}
              ids={hotel.translations}
              featureType="translations"
            />
            <FeatureList
              title="Regions"
              icon={MapPin}
              ids={hotel.regions}
              featureType="regions"
            />

            <Separator className="bg-neutralGray/20" />

            <div className="text-center py-4">
              <h3 className="mb-4 text-md font-semibold text-neutralGray">
                Connect With Us
              </h3>
              <div className="flex items-center justify-center gap-4">
                <SocialIconLink
                  href={vendor?.website}
                  icon={FaGlobe}
                  label="Website"
                />
                {vendor?.social_media
                  ?.filter((sm) => sm.is_active)
                  .map((sm) => (
                    <SocialIconLink
                      key={sm.id}
                      href={sm.url}
                      icon={platformIcons[sm.platform] || Globe}
                      label={sm.platform_display}
                    />
                  ))}
              </div>
            </div>

            <QuickLinks />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
