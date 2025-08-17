// --- src/pages/hotel/hotel-features.tsx ---
import { FaConciergeBell, FaCubes, FaHamburger, FaStar } from "react-icons/fa";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HotelFacilities from "./hotel-facilities";
import HotelServices from "./hotel-services";
import HotelMealTypes from "./hotel-meals";
import HotelAmenities from "./hotel-amenities";
import { type JSX } from "react";

type TabId = "amenities" | "facilities" | "services" | "mealTypes";

interface Tab {
  id: TabId;
  label: string;
  icon: JSX.Element;
  component: JSX.Element;
}

export default function HotelFeatures() {
  const tabs: Tab[] = [
    {
      id: "amenities",
      label: "Amenities",
      icon: <FaStar />,
      component: <HotelAmenities />,
    },
    {
      id: "facilities",
      label: "Facilities",
      icon: <FaCubes />,
      component: <HotelFacilities />,
    },
    {
      id: "services",
      label: "Services",
      icon: <FaConciergeBell />,
      component: <HotelServices />,
    },
    {
      id: "mealTypes",
      label: "Meal Types",
      icon: <FaHamburger />,
      component: <HotelMealTypes />,
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <Tabs defaultValue="amenities" className="w-full">
        <TabsList className="h-auto p-1.5 bg-gray-100 rounded-lg w-full grid grid-cols-2 md:grid-cols-4">
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

        {tabs.map((tab) => (
          <TabsContent className="mt-6" key={tab.id} value={tab.id}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
