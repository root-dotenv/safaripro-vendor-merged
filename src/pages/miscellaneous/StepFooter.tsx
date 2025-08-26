// src/pages/miscellaneous/StepFooter.tsx
import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonClasses =
  "bg-[#0081FB] text-[#FFF] hover:bg-blue-600 hover:text-[#FFF]";

interface StepFooterProps {
  onBack: () => void;
  onNext: () => void;
  isBackDisabled?: boolean;
  isNextDisabled?: boolean;
  isFinalStep?: boolean;
}

export const StepFooter: FC<StepFooterProps> = ({
  onBack,
  onNext,
  isBackDisabled,
  isNextDisabled,
  isFinalStep,
}) => {
  return (
    <div className="mt-8 flex items-center gap-4 border-t pt-6">
      <Button variant="outline" onClick={onBack} disabled={isBackDisabled}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Button
        onClick={onNext}
        disabled={isNextDisabled}
        className={cn(buttonClasses)}
      >
        {isFinalStep ? "Finish Setup" : "Continue"}
        {isFinalStep ? (
          <Check className="ml-2 h-4 w-4" />
        ) : (
          <ArrowRight className="ml-2 h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
