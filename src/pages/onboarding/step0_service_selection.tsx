// // src/pages/onboarding/step0_service_selection.tsx
// import { useOnboardingStore } from "@/store/onboarding.store";
// import { SelectionCard } from "./selection-card";
// import { Button } from "@/components/ui/button";
// import { TbChevronsLeft } from "react-icons/tb";

// // --- NEW: Importing the specific icons ---
// import { RiHotelLine } from "react-icons/ri";
// import { FaRoute, FaPlane } from "react-icons/fa";
// import { BiSolidCar, BiSolidHelpCircle } from "react-icons/bi";
// import { AiFillCar } from "react-icons/ai";

// type ServiceType = "Hotel" | "Tour" | "Cab" | "Car" | "Flight" | "Other";

// // --- NEW: Data array for services to keep JSX clean ---
// const services = [
//   {
//     type: "Hotel",
//     icon: <RiHotelLine className="w-9 h-9 text-black" />,
//     title: "Hotel Management",
//     description: "Manage your hotel, apartment, or lodge.",
//   },
//   {
//     type: "Tour",
//     icon: <FaRoute className="w-9 h-9 text-black" />,
//     title: "Tour & Travel",
//     description: "List and manage your tour packages.",
//   },
//   {
//     type: "Cab",
//     icon: <AiFillCar className="w-9 h-9 text-black" />,
//     title: "Cab Service",
//     description: "Streamline your city taxi operations.",
//   },
//   {
//     type: "Car",
//     icon: <BiSolidCar className="w-9 h-9 text-black" />,
//     title: "Car Rental",
//     description: "Manage your car rental fleet.",
//   },
//   {
//     type: "Flight",
//     icon: <FaPlane className="w-9 h-9 text-black" />,
//     title: "Flight Booking",
//     description: "Integrate your flight booking system.",
//   },
//   {
//     type: "Other",
//     icon: <BiSolidHelpCircle className="w-9 h-9 text-black" />,
//     title: "Other Property",
//     description: "For other types of properties or services.",
//   },
// ];

// export const Step0_ServiceSelection = () => {
//   const { goToNextStep, goToPreviousStep, setServiceType } =
//     useOnboardingStore();

//   const handleSelect = (service: ServiceType) => {
//     // Set the selected service type in the store
//     setServiceType(service);
//     // Proceed to the next step (which is the hotel/accommodation flow for now)
//     goToNextStep();
//   };

//   return (
//     <div className="flex flex-col">
//       {/* --- MODIFIED: Header is now left-aligned with converting copy --- */}
//       <header className="mb-10 text-left">
//         <h1 className="text-2xl font-bold inter tracking-tight text-gray-900">
//           Connect to the SafariPro in minutes, get bookings from travelers
//           across all our integrated services.
//         </h1>
//         <p className="mt-2 inter text-[0.9375rem] text-gray-600 max-w-prose">
//           List your service and start welcoming a world of new guests from our
//           complete travel network, instantly.
//         </p>
//       </header>

//       {/* --- MODIFIED: Grid is now 3 columns on desktop --- */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//         {services.map((service, index) => (
//           <SelectionCard
//             key={service.type}
//             icon={service.icon}
//             title={service.title}
//             description={service.description}
//             onClick={() => handleSelect(service.type as ServiceType)}
//             // --- NEW: Alternating color variant logic ---
//             variant={index % 2 === 0 ? "light" : "dark"}
//           />
//         ))}
//       </div>

//       <footer className="mt-10 pt-6 flex justify-start items-center">
//         <Button
//           variant="outline"
//           onClick={goToPreviousStep}
//           className="text-[1rem] rounded-[6px] font-semibold px-4 py-2.5 bg-white border-[#DADCE0]"
//         >
//           <TbChevronsLeft className="h-5 w-5" />
//         </Button>
//       </footer>
//     </div>
//   );
// };

// src/pages/onboarding/step0_service_selection.tsx
import { useOnboardingStore } from "@/store/onboarding.store";
import { SelectionCard } from "./selection-card";
import { Button } from "@/components/ui/button";
import { TbChevronsLeft } from "react-icons/tb";
import { RiHotelLine } from "react-icons/ri";
import { FaRoute, FaPlane } from "react-icons/fa";
import { BiSolidCar, BiSolidHelpCircle } from "react-icons/bi";
import { AiFillCar } from "react-icons/ai";

type ServiceType = "Hotel" | "Tour" | "Cab" | "Car" | "Flight" | "Other";

const services = [
  {
    type: "Hotel",
    icon: <RiHotelLine className="w-9 h-9 text-black" />,
    title: "Hotel Management",
    description: "Manage your hotel, apartment, or lodge.",
    showBadge: true, // --- NEW: Add property to trigger the badge ---
  },
  {
    type: "Tour",
    icon: <FaRoute className="w-9 h-9 text-black" />,
    title: "Tour & Travel",
    description: "List and manage your tour packages.",
  },
  {
    type: "Cab",
    icon: <AiFillCar className="w-9 h-9 text-black" />,
    title: "Cab Service",
    description: "Streamline your city taxi operations.",
  },
  // ... other services
  {
    type: "Car",
    icon: <BiSolidCar className="w-9 h-9 text-black" />,
    title: "Car Rental",
    description: "Manage your car rental fleet.",
  },
  {
    type: "Flight",
    icon: <FaPlane className="w-9 h-9 text-black" />,
    title: "Flight Booking",
    description: "Integrate your flight booking system.",
  },
  {
    type: "Other",
    icon: <BiSolidHelpCircle className="w-9 h-9 text-black" />,
    title: "Other Property",
    description: "For other types of properties or services.",
  },
];

export const Step0_ServiceSelection = () => {
  const { goToNextStep, goToPreviousStep, setServiceType } =
    useOnboardingStore();

  const handleSelect = (service: ServiceType) => {
    setServiceType(service);
    goToNextStep();
  };

  return (
    <div className="flex flex-col">
      <header className="mb-10 text-left">
        <h1 className="text-2xl font-bold inter tracking-tight text-gray-900">
          Connect to the SafariPro in minutes, get bookings from travelers
          across all our integrated services.
        </h1>
        <p className="mt-2 inter text-[0.9375rem] text-gray-600 max-w-prose">
          List your service and start welcoming a world of new guests from our
          complete travel network, instantly.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((service, index) => (
          <SelectionCard
            key={service.type}
            icon={service.icon}
            title={service.title}
            description={service.description}
            onClick={() => handleSelect(service.type as ServiceType)}
            variant={index % 2 === 0 ? "light" : "dark"}
            // --- NEW: Pass the showBadge prop to the card ---
            showBadge={service.showBadge}
          />
        ))}
      </div>

      <footer className="mt-10 pt-6 flex justify-start items-center">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          className="text-[1rem] rounded-[6px] font-semibold px-4 py-2.5 bg-white border-[#DADCE0]"
        >
          <TbChevronsLeft className="h-5 w-5" />
        </Button>
      </footer>
    </div>
  );
};
