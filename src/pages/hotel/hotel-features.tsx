// // --- src/pages/hotel/hotel-features.tsx ---
// import { FaConciergeBell, FaStar } from "react-icons/fa";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import HotelFacilities from "./hotel-facilities";
// import HotelServices from "./hotel-services";
// import HotelMealTypes from "./hotel-meals";
// import HotelAmenities from "./hotel-amenities";
// import HotelTranslations from "./hotel-translations"; // Import the new component
// import { type JSX } from "react";
// import { BsGridFill } from "react-icons/bs";
// import { GiMeal } from "react-icons/gi";
// import { MdGTranslate } from "react-icons/md"; // Added a suitable icon

// type TabId =
//   | "amenities"
//   | "facilities"
//   | "services"
//   | "mealTypes"
//   | "translations";

// interface Tab {
//   id: TabId;
//   label: string;
//   icon: JSX.Element;
//   component: JSX.Element;
// }

// export default function HotelFeatures() {
//   const tabs: Tab[] = [
//     {
//       id: "amenities",
//       label: "Amenities",
//       icon: <FaStar />,
//       component: <HotelAmenities />,
//     },
//     {
//       id: "facilities",
//       label: "Facilities",
//       icon: <BsGridFill />,
//       component: <HotelFacilities />,
//     },
//     {
//       id: "services",
//       label: "Services",
//       icon: <FaConciergeBell />,
//       component: <HotelServices />,
//     },
//     {
//       id: "mealTypes",
//       label: "Meal Types",
//       icon: <GiMeal size={18} />,
//       component: <HotelMealTypes />,
//     },
//     // Added the new Translations tab
//     {
//       id: "translations",
//       label: "Translations",
//       icon: <MdGTranslate size={18} />,
//       component: <HotelTranslations />,
//     },
//   ];

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
//       <Tabs defaultValue="amenities" className="w-full">
//         {/* Updated grid to accommodate 5 tabs */}
//         <TabsList className="h-auto px-1.5 py-1.75 bg-gray-100 shadow shadow-gray-200 rounded-lg w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
//           {tabs.map((tab) => (
//             <TabsTrigger
//               key={tab.id}
//               value={tab.id}
//               className="data-[state=active]:bg-[#0081FB] data-[state=active]:text-[#FFF] data-[state=active]:shadow-sm text-[#0081FB] bg-[#FFF] shadow flex items-center gap-2 hover:text-[#0081FB] mx-0.75 cursor-pointer"
//             >
//               {tab.icon}
//               {tab.label}
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         {tabs.map((tab) => (
//           <TabsContent className="mt-6" key={tab.id} value={tab.id}>
//             {tab.component}
//           </TabsContent>
//         ))}
//       </Tabs>
//     </div>
//   );
// }

// --- src/pages/hotel/hotel-features.tsx ---
import { FaConciergeBell, FaStar } from "react-icons/fa";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HotelFacilities from "./hotel-facilities";
import HotelServices from "./hotel-services";
import HotelMealTypes from "./hotel-meals";
import HotelAmenities from "./hotel-amenities";
import HotelTranslations from "./hotel-translations"; // Import the new component
import { type JSX } from "react";
import { BsGridFill } from "react-icons/bs";
import { GiMeal } from "react-icons/gi";
import { MdGTranslate } from "react-icons/md"; // Added a suitable icon

type TabId =
  | "amenities"
  | "facilities"
  | "services"
  | "mealTypes"
  | "translations";

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
      icon: <BsGridFill />,
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
      icon: <GiMeal size={18} />,
      component: <HotelMealTypes />,
    },
    // Added the new Translations tab
    {
      id: "translations",
      label: "Translations",
      icon: <MdGTranslate size={18} />,
      component: <HotelTranslations />,
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <Tabs defaultValue="amenities" className="w-full">
        {/* Updated grid to accommodate 5 tabs */}
        <TabsList className="h-auto px-1.5 py-1.75 bg-gray-100 shadow shadow-gray-200 rounded-lg w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="data-[state=active]:bg-[#0081FB] data-[state=active]:text-[#FFF] data-[state=active]:shadow-sm text-[#0081FB] bg-[#FFF] shadow flex items-center gap-2 hover:text-[#0081FB] mx-0.75 cursor-pointer"
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
