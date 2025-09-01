// src/pages/onboarding/account-selection-card.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
interface AccountSelectionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  showBadge?: boolean;
  disabled?: boolean;
}

export const AccountSelectionCard: React.FC<AccountSelectionCardProps> = ({
  icon,
  title,
  description,
  onClick,
  showBadge = false,
  disabled = false,
}) => {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={cn(
        "relative group p-5 w-full flex items-center gap-5 rounded-xl border transition-all duration-300",
        disabled
          ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-60"
          : "bg-gradient-to-br from-white to-gray-50 border-gray-200 cursor-pointer"
      )}
    >
      {showBadge && (
        <Badge className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-teal-500 text-white font-bold border-2 border-white animate-pulse-badge">
          Start Here
        </Badge>
      )}
      <div
        className={cn(
          "flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-lg",
          disabled
            ? "bg-gray-200 text-gray-500"
            : "bg-gradient-to-tr from-blue-100 to-blue-200 text-blue-600"
        )}
      >
        {icon}
      </div>
      <div className="flex-grow">
        <h3
          className={cn(
            "text-lg font-bold inter",
            disabled ? "text-gray-500" : "text-gray-900"
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-1 text-sm inter",
            disabled ? "text-gray-400" : "text-gray-600"
          )}
        >
          {description}
        </p>
      </div>
      {!disabled && ""}
    </div>
  );
};
