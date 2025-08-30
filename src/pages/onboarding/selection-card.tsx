// // src/pages/onboarding/selection-card.tsx
// import React from "react";
// import { cn } from "@/lib/utils";
// import { TbArrowRight } from "react-icons/tb";

// interface SelectionCardProps {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
//   onClick: () => void;
//   variant?: "light" | "dark";
// }

// export const SelectionCard: React.FC<SelectionCardProps> = ({
//   icon,
//   title,
//   description,
//   onClick,
//   variant = "light",
// }) => {
//   return (
//     <div
//       onClick={onClick}
//       className={cn(
//         "relative group p-6 flex flex-col items-center gap-y-2 rounded-[0.5rem] border-[1.25px] shadow transition-shadow cursor-pointer hover:shadow-sm",
//         variant === "light"
//           ? "bg-gradient-to-br from-white to-white border-[#DADCE0]"
//           : "bg-gradient-to-br from-[#fcfdfe] to-[#f8f8fa] border-[#E6E7EB]"
//       )}
//     >
//       <div className="w-12 h-12 mb-2 text-black flex items-center justify-center">
//         {icon}
//       </div>
//       <h4 className="font-semibold text-center text-[1.125rem] text-[#111828]">
//         {title}
//       </h4>
//       <p className="mt-1 text-sm text-center text-gray-600">{description}</p>
//       {/* --- NEW: "Get Started" link with arrow --- */}
//       <div className="flex-grow" /> {/* This pushes the footer to the bottom */}
//       <div className="mt-1 flex items-center inter text-[0.9375rem] justify-center text-blue-600 hover:text-blue-700 font-medium transition-all duration-300">
//         <span>Get Started</span>
//         <TbArrowRight className="ml-1 h-4 w-4" />
//       </div>
//     </div>
//   );
// };

// src/pages/onboarding/selection-card.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { TbArrowRight } from "react-icons/tb";
import { Badge } from "@/components/ui/badge"; // Import the Badge component

interface SelectionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  variant?: "light" | "dark";
  showBadge?: boolean; // --- NEW: Prop to control the badge visibility ---
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  icon,
  title,
  description,
  onClick,
  variant = "light",
  showBadge = false, // Default to false
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative group p-6 flex flex-col items-center gap-y-2 rounded-[0.5rem] border-[1.25px] shadow transition-shadow cursor-pointer hover:shadow-sm",
        variant === "light"
          ? "bg-gradient-to-br from-white to-white border-[#DADCE0]"
          : "bg-gradient-to-br from-[#fcfdfe] to-[#f8f8fa] border-[#E6E7EB]"
      )}
    >
      {/* --- NEW: Conditionally render the blinking badge --- */}
      {showBadge && (
        <Badge className="absolute -top-2.5 -right-3 bg-gradient-to-bl from-green-400 to-teal-500 text-[#FFF] font-bold inter py-1 border-2 border-white">
          Start Now
        </Badge>
      )}

      <div className="w-12 h-12 mb-2 text-black flex items-center justify-center">
        {icon}
      </div>
      <h4 className="font-medium text-center text-[1.125rem] inter text-[#111828]">
        {title}
      </h4>
      <p className="mt-1 text-sm text-center text-gray-600">{description}</p>
      <div className="flex-grow" />
      {/* <div className="flex items-center inter text-[0.9375rem] justify-center text-blue-600 hover:text-blue-700 font-medium transition-all duration-300">
        <span>Get Started</span>
        <TbArrowRight className="ml-1 h-4 w-4" />
      </div> */}
    </div>
  );
};
