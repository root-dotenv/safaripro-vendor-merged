import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HotelRoomTypes from "./HotelRoomTypes";
import SafariProRoomTypes from "./SafariProRoomTypes";
import { useHotel } from "@/providers/hotel-provider";

type TabId = "hotel-room-types" | "safaripro-room-types";

interface Tab {
  id: TabId;
  label: string;
  component: JSX.Element;
}

/**
 * RoomTypesTabController Component
 *
 * This component renders a tabbed interface to switch between viewing
 * room types specific to the current hotel and Browse all available
 * room types in the SafariPro system.
 */
export default function RoomTypesTabController() {
  const { hotel } = useHotel();
  console.log("Hotel in RoomTypesTabController:", hotel?.id);

  const tabs: Tab[] = [
    {
      id: "hotel-room-types",
      label: `${hotel?.name || "Hotel"} Room Types`,
      component: <HotelRoomTypes />,
    },
    {
      id: "safaripro-room-types",
      label: "SafariPro Room Types",
      component: <SafariProRoomTypes />,
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-6 min-h-screen">
      <Card className="bg-none border-none shadow-none">
        <Tabs defaultValue="hotel-room-types" className="w-full bg-none">
          <TabsList className="h-auto rounded-none border-b bg-none p-0 w-full grid grid-cols-1 md:grid-cols-2">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:after:bg-blue-500 relative rounded-none py-3 px-4 after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 data-[state=active]:bg-none data-[state=active]:text-neutral-800 data-[state=active]:text-[1rem] data-[state=active]:shadow-none bg-none"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent className="bg-none p-0" key={tab.id} value={tab.id}>
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}
