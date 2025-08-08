import React from "react";
import { useCurrencyConversion } from "@/hooks/useCurrencyConversion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DualCurrencyDisplayProps {
  amount: string | number;
  currency: string;
  className?: string;
}

const formatDisplayCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const DualCurrencyDisplay: React.FC<DualCurrencyDisplayProps> = ({
  amount,
  currency,
  className,
}) => {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  // Determine the primary and secondary currencies
  const primaryCurrency = currency.toUpperCase();
  const secondaryCurrency = primaryCurrency === "USD" ? "TZS" : "USD";

  const { data: conversion, isLoading } = useCurrencyConversion({
    amount: String(numericAmount),
    from_currency: primaryCurrency,
    to_currency: secondaryCurrency,
  });

  const primaryDisplay = formatDisplayCurrency(numericAmount, primaryCurrency);

  // Don't attempt to show a secondary currency if the primary is not standard
  if (primaryCurrency !== "USD" && primaryCurrency !== "TZS") {
    return <span className={className}>{primaryDisplay}</span>;
  }

  return (
    <div className={cn("flex flex-col items-end", className)}>
      <span className="font-medium">{primaryDisplay}</span>
      <span className="text-xs text-muted-foreground">
        {isLoading ? (
          <Skeleton className="h-3 w-16 mt-1" />
        ) : conversion ? (
          `~ ${formatDisplayCurrency(
            conversion.converted_amount,
            secondaryCurrency
          )}`
        ) : (
          `(${secondaryCurrency})`
        )}
      </span>
    </div>
  );
};
