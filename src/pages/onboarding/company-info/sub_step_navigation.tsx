// // - - - src/pages/onboarding/company-info/sub_step_navigation.tsx
// import React from "react";
// import { Button } from "@/components/ui/button";
// import { IoArrowBack, IoArrowForward } from "react-icons/io5";
// import { Loader } from "lucide-react";

// interface SubStepNavigationProps {
//   onNext?: () => void;
//   onBack?: () => void;
//   isNextDisabled?: boolean;
//   isBackDisabled?: boolean;
//   isFinalStep?: boolean;
//   onFinalSubmit?: () => void;
//   finalSubmitText?: string;
//   isPending?: boolean;
// }

// export const SubStepNavigation: React.FC<SubStepNavigationProps> = ({
//   onNext,
//   onBack,
//   isNextDisabled = false,
//   isBackDisabled = false,
//   isFinalStep = false,
//   onFinalSubmit,
//   finalSubmitText = "Submit",
//   isPending = false,
// }) => {
//   return (
//     <div className="mt-8 pt-6 flex justify-between items-center border-t border-slate-200">
//       {onBack ? (
//         <Button
//           type="button"
//           onClick={onBack}
//           disabled={isBackDisabled || isPending}
//           variant="outline"
//           className="font-semibold text-lg px-8 py-6"
//         >
//           <IoArrowBack className="mr-2 h-5 w-5" /> Back
//         </Button>
//       ) : (
//         <div /> // Placeholder to keep the "Next" button on the right
//       )}

//       {isFinalStep ? (
//         <Button
//           type="button"
//           onClick={onFinalSubmit}
//           disabled={isNextDisabled || isPending}
//           className="font-semibold text-lg px-8 py-6"
//         >
//           {isPending && <Loader className="mr-2 h-5 w-5 animate-spin" />}
//           {finalSubmitText}
//         </Button>
//       ) : (
//         <Button
//           type="button"
//           onClick={onNext}
//           disabled={isNextDisabled || isPending}
//           className="font-semibold text-lg px-8 py-6"
//         >
//           Next <IoArrowForward className="ml-2 h-5 w-5" />
//         </Button>
//       )}
//     </div>
//   );
// };

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
    <div className="mt-8 pt-6 flex justify-between items-center border-t border-slate-200">
      {onBack ? (
        <Button
          type="button"
          onClick={onBack}
          disabled={isBackDisabled || isPending}
          variant="outline"
          className="font-semibold text-lg px-5 py-2.5 bg-white border-[#DADCE0] shadow-sm"
        >
          <TbChevronsLeft className="mr-2 h-5 w-5" /> Back
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
          {isPending && <Loader className="mr-2 h-5 w-5 animate-spin" />}
          {finalSubmitText}
          <TbChevronsRight className="ml-1.5 h-5 w-5" />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled || isPending}
          className="font-semibold rounded-[6px] text-[0.9375rem] px-5 py-2.5 bg-[#0081FB] hover:bg-blue-600"
        >
          Next <TbChevronsRight className="ml-1.5 h-5 w-5" />
        </Button>
      )}
    </div>
  );
};
