// src/pages/onboarding/selection-card.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SelectionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  comingSoon?: boolean;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  icon,
  title,
  description,
  onClick,
  disabled = false,
  comingSoon = false,
}) => {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={cn(
        "relative group flex items-start gap-6 p-6 rounded-lg border-2 transition-all duration-200",
        disabled
          ? "bg-gray-50 border-gray-200 cursor-not-allowed"
          : "bg-white border-gray-300 hover:border-blue-500 hover:shadow-lg cursor-pointer"
      )}
    >
      {comingSoon && (
        <Badge
          variant="secondary"
          className="absolute -top-2 -right-3 bg-yellow-400 text-yellow-900 font-bold"
        >
          Coming Soon
        </Badge>
      )}
      <div
        className={cn(
          "flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full",
          disabled
            ? "bg-gray-200 text-gray-500"
            : "bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform"
        )}
      >
        {icon}
      </div>
      <div>
        <h3
          className={cn(
            "text-lg font-bold",
            disabled ? "text-gray-500" : "text-gray-900"
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-1 text-sm",
            disabled ? "text-gray-400" : "text-gray-600"
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
};
