"use client";

import { useQuery, useQueries } from "@tanstack/react-query";
import axios from "axios";
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
  Building2,
  Hotel,
} from "lucide-react";
import { RiHotelLine } from "react-icons/ri";
import { IoAdd } from "react-icons/io5";

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
import { useHotel } from "@/providers/hotel-provider";

// Color Palette
const colors = {
  lightGreen: "#DCFCE6",
  blue: "#155DFC",
  lightOrange: "#FFF085",
  neutralGray: "#6B7280",
  neutralLight: "#F7F7F7",
};

// API Client
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

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
    <Icon className="h-5 w-5 text-blue flex-shrink-0" />
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
      className="p-2 rounded-full text-neutralGray bg-neutralLight hover:bg-blue hover:text-white transition-colors duration-200"
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
      <Icon className="h-5 w-5 text-blue flex-shrink-0 mt-1" />
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
        const response = await apiClient.get(url);
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
        <Icon className="h-5 w-5 text-blue" />
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

// Main Component
export function HotelDetailsSheet() {
  const HOTEL_BASE_URL = import.meta.env.VITE_HOTEL_BASE_URL;
  const { hotel } = useHotel();

  const { data: hotelTypeData, isLoading: isLoadingHotelType } = useQuery({
    queryKey: ["hotel-type", hotel?.hotel_type],
    queryFn: async () => {
      const { data } = await apiClient.get(
        `${HOTEL_BASE_URL}hotel-types/${hotel.hotel_type}`
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

  const socialLinks = [
    { label: "Website", href: hotel.website_url, icon: IoAdd },
    { label: "Facebook", href: hotel.facebook_url, icon: IoAdd },
    { label: "Instagram", href: hotel.instagram_url, icon: IoAdd },
    { label: "Twitter", href: hotel.twitter_url, icon: IoAdd },
    { label: "YouTube", href: hotel.youtube_url, icon: IoAdd },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="fixed bottom-8 right-8 h-18 w-18 rounded-full flex items-center justify-center text-[#155DFC] font-medium bg-blue border border-blue/20 shadow-lg hover:shadow-xl transition-shadow z-50">
          <RiHotelLine size={32} />
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg p-0 bg-neutral-100">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 bg-white border-b border-neutralGray/20 sticky top-0 z-10 shadow-sm">
            <SheetTitle className="text-2xl font-bold tracking-tight text-gray-900">
              {hotel.name}
            </SheetTitle>
            <div className="mt-2 flex items-center gap-3">
              {isLoadingHotelType && <SkeletonLoader className="h-6 w-28" />}
              {hotelTypeData && (
                <Badge
                  variant="secondary"
                  className="py-1 px-3 text-sm bg-lightGreen text-blue"
                >
                  <Building2 className="h-4 w-4 mr-2" />
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
                        ? "text-lightOrange fill-lightOrange"
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
            <Card className="border-neutralGray/20 shadow-sm">
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

            <Card className="border-neutralGray/20 shadow-sm">
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
                <Hotel className="h-5 w-5 text-blue" />
                Room Types
              </h3>
              <div className="space-y-4">
                {hotel.room_type?.map((room) => (
                  <Card
                    key={room.id}
                    className="p-4 flex justify-between items-center border-neutralGray/20 bg-white hover:bg-lightGreen/30 transition-colors shadow-sm"
                  >
                    <div>
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
                      <p className="font-semibold text-md text-blue">
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
              icon={Globe}
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
                {socialLinks.map((link) => (
                  <SocialIconLink
                    key={link.label}
                    href={link.href}
                    icon={link.icon}
                    label={link.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
