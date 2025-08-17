import { type JSX } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HotelRoomTypes from "./HotelRoomTypes";
import SafariProRoomTypes from "./SafariProRoomTypes";
import { useHotel } from "@/providers/hotel-provider";
import { Building, Globe } from "lucide-react"; // Import icons

type TabId = "hotel-room-types" | "safaripro-room-types";

interface Tab {
  id: TabId;
  label: string;
  icon: JSX.Element; // Add icon property
  component: JSX.Element;
}

/**
 * RoomTypesTabController Component
 *
 * This component renders a tabbed interface to switch between viewing
 * room types specific to the current hotel and browsing all available
 * room types in the SafariPro system.
 */
export default function RoomTypesTabController() {
  const { hotel } = useHotel();

  const tabs: Tab[] = [
    {
      id: "hotel-room-types",
      label: `${hotel?.name || "Hotel"} Room Types`,
      icon: <Building />, // Add hotel icon
      component: <HotelRoomTypes />,
    },
    {
      id: "safaripro-room-types",
      label: "SafariPro Room Types",
      icon: <Globe />, // Add SafariPro icon
      component: <SafariProRoomTypes />,
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-6 min-h-screen">
      <Tabs defaultValue="hotel-room-types" className="w-full">
        {/* Updated TabsList to match the HotelFeatures style */}
        <TabsList className="h-auto p-1.5 bg-gray-100 rounded-lg w-full grid grid-cols-1 md:grid-cols-2">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="data-[state=active]:bg-background data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-muted-foreground flex items-center gap-2"
            >
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* TabsContent remains the same */}
        {tabs.map((tab) => (
          <TabsContent className="mt-6" key={tab.id} value={tab.id}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
