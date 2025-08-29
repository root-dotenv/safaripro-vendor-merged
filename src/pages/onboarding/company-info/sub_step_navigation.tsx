// - - - src/pages/onboarding/company-info/sub_step_navigation.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { TbChevronsLeft, TbChevronsRight } from "react-icons/tb";
import { Loader } from "lucide-react";

interface SubStepNavigationProps {
  onNext?: () => void;
  onBack?: () => void;
  isNextDisabled?: boolean;
  isBackDisabled?: boolean;
  isFinalStep?: boolean;
  onFinalSubmit?: () => void;
  finalSubmitText?: string;
  isPending?: boolean;
}

export const SubStepNavigation: React.FC<SubStepNavigationProps> = ({
  onNext,
  onBack,
  isNextDisabled = false,
  isBackDisabled = false,
  isFinalStep = false,
  onFinalSubmit,
  finalSubmitText = "Submit",
  isPending = false,
}) => {
  return (
    <div className="mt-8 pt-6 flex space-x-4 items-center justify-end border-t border-slate-200">
      {onBack ? (
        <Button
          type="button"
          onClick={onBack}
          disabled={isBackDisabled || isPending}
          variant="outline"
          className="font-semibold text-lg px-3 py-2.5 bg-white border-[#DADCE0] shadow-sm"
        >
          <TbChevronsLeft className="h-5 w-5" />
        </Button>
      ) : (
        <div />
      )}

      {isFinalStep ? (
        <Button
          type="button"
          onClick={onFinalSubmit}
          disabled={isNextDisabled || isPending}
          className="font-semibold rounded-[6px] text-[0.9375rem] px-5 py-2.5 bg-[#0081FB] hover:bg-blue-600"
        >
          {isPending && <Loader className="mr-1 h-5 w-5 animate-spin" />}
          {finalSubmitText}
          <TbChevronsRight className="ml-1 h-5 w-5" />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled || isPending}
          className="font-semibold rounded-[6px] text-[0.9375rem] px-5 py-2.5 bg-[#0081FB] hover:bg-blue-600"
        >
          Next <TbChevronsRight className="ml-1 h-5 w-5" />
        </Button>
      )}
    </div>
  );
};
