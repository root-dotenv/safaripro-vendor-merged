"use client";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

// - - - Hooks & Providers
import { useHotel } from "@/providers/hotel-provider";

// - - - UI Components ---
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "../ui/separator";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
  PieChart,
  Hotel,
  Bed,
  Folder,
  Share,
  Loader2,
  Receipt,
} from "lucide-react";
import { FiUserCheck } from "react-icons/fi";
import { MdOutlineInventory2, MdOutlineFeedback } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { LuTicketCheck } from "react-icons/lu";
import { TbFileTypeCsv } from "react-icons/tb";
import { GiCash } from "react-icons/gi";

// --- Static Navigation Data ---
const navData = {
  user: {
    name: "Root Dotenv",
    email: "dotenv@ostub.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Hotel Management",
      url: "#",
      icon: Hotel,
      items: [
        { title: "My Hotel", url: "/hotel/hotel-details" },
        { title: "Hotel Features", url: "/hotel/hotel-features" },
      ],
    },
    {
      title: "Bookings",
      url: "#",
      icon: LuTicketCheck,
      items: [
        { title: "New Booking", url: "/bookings/new-booking" },
        { title: "All Bookings", url: "/bookings/all-bookings" },
        { title: "Safari Pro Bookings", url: "/bookings/safaripro-bookings" },
      ],
    },
    {
      title: "Rooms",
      url: "#",
      icon: Bed,
      items: [
        { title: "New Room", url: "/rooms/new-room" },
        { title: "Available Rooms", url: "/rooms/available-rooms" },
        { title: "Booked Rooms", url: "/rooms/booked-rooms" },
        { title: "Maintenance Rooms", url: "/rooms/maintenance-rooms" },
        { title: "Room Types", url: "/rooms/room-types" },
        {
          title: "Available Rooms By Dates",
          url: "rooms/available-rooms-dates",
        },
        { title: "Allocations", url: "rooms/allocations" },
        { title: "Allocate Rooms", url: "rooms/allocate-rooms" },
      ],
    },
    {
      title: "Reservations",
      url: "#",
      icon: FiUserCheck,
      items: [
        { title: "Checkin", url: "/reservations/checkin" },
        { title: "Checkout", url: "/reservations/checkout" },
        { title: "Special Requests", url: "/reservations/special-requests" },
      ],
    },
    {
      title: "House Keeping",
      url: "#",
      icon: MdOutlineInventory2,
      items: [
        { title: "Departments", url: "/house-keeping/departments" },
        {
          title: "Inventory Categories",
          url: "/house-keeping/inventory-categories",
        },
        { title: "Inventory Items", url: "/house-keeping/inventory-items" },
        {
          title: "Event Spaces Types",
          url: "/house-keeping/event-space-types",
        },
        { title: "Event Spaces", url: "/house-keeping/event-spaces" },
      ],
    },
    {
      title: "Billings & Payments",
      url: "#",
      icon: GiCash,
      items: [
        { title: "Payouts", url: "/billings/payouts" },
        { title: "Charges", url: "/billings/charges" },
        { title: "SafariPro Invoices", url: "/billings/invoices" },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "https://web.safaripro.net/privacy-policy/support",
      icon: BiSupport,
    },
    {
      title: "Feedback",
      url: "https://web.safaripro.net/privacy-policy/support",
      icon: MdOutlineFeedback,
    },
  ],
  projects: [
    { name: "Analytics", url: "/analytics", icon: PieChart },
    {
      name: "Reports",
      url: "/reports",
      icon: HiOutlineDocumentReport,
      actions: [
        { label: "View Reports", url: "/view-reports", icon: Folder },
        { label: "Share Report", url: "/share-reports", icon: Share },
        { label: "Export Report", url: "/export-report", icon: TbFileTypeCsv },
      ],
    },
  ],
  moreLinks: [
    {
      label: "All Bookings",
      url: "/bookings/all-bookings",
      icon: LuTicketCheck,
    },
    { label: "Available Rooms", url: "/rooms/available-rooms", icon: Bed },
    { label: "Invoices", url: "/billings/invoices", icon: Receipt },
    { label: "Check-ins", url: "/reservations/checkin", icon: FiUserCheck },
    {
      label: "Inventory",
      url: "/house-keeping/inventory-items",
      icon: MdOutlineInventory2,
    },
  ],
};

// --- API & Type Definitions ---
interface HotelImageData {
  id: string;
  original: string;
  tag: string;
}

interface VendorData {
  id: string;
  logo: string;
  business_name: string;
}

// * * * Don't Question me what happened here, I was snoozing 😴
const VENDOR_BASE_API_URL = import.meta.env.VITE_VENDOR_BASE_URL;
const VENDOR_ID = import.meta.env.VITE_VENDOR_ID;
const VENDOR_API_URL = `${VENDOR_BASE_API_URL}vendors/${VENDOR_ID}`;
const HOTEL_BASE_URL = import.meta.env.VITE_HOTEL_BASE_URL;

// --- Helper Functions to Fetch Data ---
const fetchVendor = async (): Promise<VendorData> => {
  const { data } = await axios.get(VENDOR_API_URL);
  return data;
};

const fetchHotelImage = async (imageId: string): Promise<HotelImageData> => {
  const { data } = await axios.get(`${HOTEL_BASE_URL}hotel-images/${imageId}`);
  return data;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { hotel } = useHotel();

  // --- Data Fetching with React Query ---
  const {
    data: vendor,
    isLoading: isVendorLoading,
    isError: isVendorError,
  } = useQuery<VendorData>({
    queryKey: ["vendorDetails", VENDOR_ID],
    queryFn: fetchVendor,
  });

  const firstImageId = hotel?.image_ids?.[0];

  const { data: hotelImage, isLoading: isHotelImageLoading } =
    useQuery<HotelImageData>({
      queryKey: ["hotelImage", firstImageId],
      queryFn: () => fetchHotelImage(firstImageId!),
      enabled: !!firstImageId,
    });

  if (isVendorError) {
    console.log(`An Error`);
  }

  return (
    <Sidebar className={"welcome"} variant="inset" {...props}>
      <SidebarHeader>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/"
                className="flex items-center gap-2 font-semibold text-lg"
              >
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                  {isVendorLoading ? (
                    <Loader2 className="h-6 w- animate-spin text-gray-400" />
                  ) : vendor?.logo ? (
                    <img
                      src={vendor.logo}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <span className="flex-1 truncate">
                  {hotel?.name ?? "Loading..."}
                </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              className="p-3 max-w-[280px] pb-6 bg-[#FFF] border-[1.5px] border-[#E5E5E5] mt-0 shadow-md"
              side={"right"}
            >
              {hotel ? (
                <div className="space-y-2">
                  {isHotelImageLoading ? (
                    <div className="w-full h-32 bg-gray-200 rounded animate-pulse" />
                  ) : hotelImage ? (
                    <img
                      className="w-full h-auto rounded object-cover"
                      src={hotelImage.original}
                      alt={hotel.name}
                    />
                  ) : null}

                  <div className="space-y-1">
                    <p className="text-[0.9375rem] text-[#111828] font-bold uppercase">
                      {hotel.name}
                    </p>
                    <p className="text-neutral-800 text-[0.875rem]">
                      {hotel.address}
                    </p>
                    <Separator />
                    <p className="text-muted-foreground text-[0.875rem] max-w-[500ch]">
                      {hotel.description}
                    </p>
                  </div>
                </div>
              ) : (
                <p>Loading hotel details...</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navData.navMain} />
        <NavProjects
          projects={navData.projects}
          moreLinks={navData.moreLinks}
        />
        <NavSecondary items={navData.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={navData.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
