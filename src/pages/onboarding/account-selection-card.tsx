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
  isSelected?: boolean;
}

export const AccountSelectionCard: React.FC<AccountSelectionCardProps> = ({
  icon,
  title,
  description,
  onClick,
  showBadge = false,
  disabled = false,
  isSelected = false,
}) => {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={cn(
        // Base styles
        "relative group py-6 px-6 flex items-center gap-5 rounded-xl border border-[#DADCE0] transition-all duration-300 ease-in-out",
        // Disabled state
        disabled
          ? "bg-slate-50 cursor-not-allowed opacity-50 border-[1.25px] border-[#DADCE0] dark:bg-slate-800/50"
          : "cursor-pointer bg-white hover:shadow-sm hover:border-[1.25px] hover:border-[#DADCE0] dark:bg-slate-900 border border-[#DADCE0]",
        // Selected state
        isSelected
          ? "border-[#cfd3dc] border-[1.25px] ring-2 ring-offset-2 ring-[#DADCE0] dark:ring-offset-slate-900"
          : "border-slate-200 border-[1.25px]"
      )}
    >
      {showBadge && (
        <Badge className="absolute -top-3 right-5 bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold border-2 text-[0.9375rem] border-white shadow-md dark:border-slate-900">
          Start Here
        </Badge>
      )}

      <div
        className={cn(
          "flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full transition-colors duration-300",
          disabled
            ? "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
            : "bg-slate-200 text-slate-600 group-hover:bg-primary/10 group-hover:text-primary dark:bg-slate-800 dark:text-slate-300",
          isSelected && !disabled && "bg-slate-200 text-slate-600"
        )}
      >
        {icon}
      </div>

      <div className="flex-grow">
        <h3
          className={cn(
            "text-lg inter font-bold text-slate-800 dark:text-slate-100",
            disabled && "text-slate-500 dark:text-slate-400"
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-1 text-[0.9375rem] font-medium text-slate-600 dark:text-slate-400",
            disabled && "text-slate-400 dark:text-slate-500"
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
};
