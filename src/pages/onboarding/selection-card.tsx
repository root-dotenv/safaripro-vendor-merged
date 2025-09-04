// src/pages/onboarding/selection-card.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge"; // Import the Badge component

interface SelectionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  variant?: "light" | "dark";
  showBadge?: boolean;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  icon,
  title,
  description,
  onClick,
  variant = "light",
  showBadge = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative group p-6 flex flex-col items-center gap-y-2 rounded-[0.5rem] border-[1.25px] shadow transition-shadow cursor-pointer hover:shadow-sm",
        variant === "light"
          ? "bg-gradient-to-br from-white to-white border-[#DADCE0]"
          : "bg-gradient-to-br from-[#fdfdfe] to-[#fafafb] border-[#f2f2f2]"
      )}
    >
      {showBadge && (
        <Badge className="absolute -top-2.5 -right-3 bg-gradient-to-bl from-green-400 to-teal-500 text-[#FFF] font-bold inter py-1 border-2 border-white">
          Start Now
        </Badge>
      )}

      <div className="w-12 h-12 mb-2 bg-transparent border-transparent flex items-center justify-center">
        {icon}
      </div>
      <h4 className="font-medium text-center text-[1.125rem] inter text-[#111828]">
        {title}
      </h4>
      <p className="text-sm text-center text-gray-600">{description}</p>
      <div className="flex-grow" />
    </div>
  );
};
