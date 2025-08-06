// --- src/components/hotel-features/hotel-features.tsx ---
import { FaConciergeBell, FaCubes, FaHamburger, FaStar } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HotelFacilities from "./hotel-facilities";
import HotelServices from "./hotel-services";
import HotelMealTypes from "./hotel-meals";
import HotelAmenities from "./hotel-amenities";

type TabId = "amenities" | "facilities" | "services" | "mealTypes";

interface Tab {
  id: TabId;
  label: string;
  icon: JSX.Element;
  component: JSX.Element;
}

/**
 * HotelFeatures Component
 *
 * This is the main container component that renders a tabbed interface
 * for displaying various features of a hotel, including amenities,
 * facilities, services, and meal types. Each tab loads a dedicated
 * component that presents the data in an expandable table.
 */
export default function HotelFeatures() {
  const tabs: Tab[] = [
    {
      id: "amenities",
      label: "Amenities",
      icon: <FaStar className="mr-2" />,
      component: <HotelAmenities />,
    },
    {
      id: "facilities",
      label: "Facilities",
      icon: <FaCubes className="mr-2" />,
      component: <HotelFacilities />,
    },
    {
      id: "services",
      label: "Services",
      icon: <FaConciergeBell className="mr-2" />,
      component: <HotelServices />,
    },
    {
      id: "mealTypes",
      label: "Meal Types",
      icon: <FaHamburger className="mr-2" />,
      component: <HotelMealTypes />,
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <Card>
        <Tabs defaultValue="amenities" className="w-full bg-none">
          <TabsList className="h-auto rounded-none border-b bg-none p-0 w-full grid grid-cols-2 md:grid-cols-4">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:after:bg-none relative rounded-none py-3 px-4 after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 data-[state=active]:bg-none data-[state=active]:text-blue-600 data-[state=active]:text-[1rem]  data-[state=active]:shadow-none bg-none"
              >
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent className="bg-none" key={tab.id} value={tab.id}>
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}
