"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import {
  PieChart,
  Hotel,
  Bed,
  Folder,
  Share,
  MoreHorizontal,
} from "lucide-react";
import { FiUserCheck } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useHotel } from "@/providers/hotel-provider";
import { MdOutlineInventory2 } from "react-icons/md";
// UI Components
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
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

// Icons
import { BiSupport } from "react-icons/bi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { LuTicketCheck } from "react-icons/lu";
import { TbFileTypeCsv } from "react-icons/tb";
import { MdOutlineFeedback } from "react-icons/md";
import { BsGrid } from "react-icons/bs";
import { Separator } from "../ui/separator";

// Data (as provided in your code)
const data = {
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
        {
          title: "Departments",
          url: "/house-keeping/departments",
        },
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
  ],
  navSecondary: [
    { title: "Support", url: "/support", icon: BiSupport },
    { title: "Feedback", url: "/feedback", icon: MdOutlineFeedback },
  ],
  projects: [
    {
      name: "Analytics",
      url: "/analytics",
      icon: PieChart,
    },
    {
      name: "Reports",
      url: "/reports",
      icon: HiOutlineDocumentReport,
      actions: [
        {
          label: "View Reports",
          url: "/view-reports",
          icon: Folder,
        },
        {
          label: "Share Report",
          url: "/share-reports",
          icon: Share,
        },
        {
          label: "Export Report",
          url: "/export-report",
          icon: TbFileTypeCsv,
        },
      ],
    },
  ],
  moreLinks: [
    { label: "Demo Link 1", url: "#", icon: MoreHorizontal },
    { label: "Demo Link 2", url: "#", icon: MoreHorizontal },
    { label: "Demo Link 3", url: "#", icon: MoreHorizontal },
    { label: "Demo Link 4", url: "#", icon: MoreHorizontal },
  ],
};

// --- Type definition for the fetched image data ---
interface HotelImageData {
  id: string;
  original: string;
  tag: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { hotel } = useHotel();
  const [hotelImage, setHotelImage] = useState<HotelImageData | null>(null);
  const HOTEL_BASE_URL = import.meta.env.VITE_HOTEL_BASE_URL;
  useEffect(() => {
    if (hotel && hotel.image_ids && hotel.image_ids.length > 0) {
      const firstImageId = hotel.image_ids[0];

      const fetchHotelImage = async () => {
        try {
          const response = await fetch(
            `${HOTEL_BASE_URL}hotel-images/${firstImageId}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data: HotelImageData = await response.json();
          setHotelImage(data);
        } catch (error) {
          console.error("Failed to fetch hotel image:", error);
          setHotelImage(null);
        }
      };

      fetchHotelImage();
    }
  }, [hotel, HOTEL_BASE_URL]);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        {/* --- Tooltip Implementation --- */}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/"
                className="flex items-center gap-2 font-semibold text-lg"
              >
                <BsGrid />
                <span className="flex-1 truncate">{hotel?.name}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              className="p-3 max-w-[280px] pb-6 bg-[#FFF] border-[1.5px] border-[#E5E5E5] mt-0 shadow-md"
              side={"right"}
            >
              {hotel ? (
                <div className="space-y-2">
                  <img
                    className="w-full h-auto rounded object-cover"
                    src={"../../../public/images/hotel_image_one.jpg"}
                    alt={"hotel image"}
                  />
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
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} moreLinks={data.moreLinks} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
