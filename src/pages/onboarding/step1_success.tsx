import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { TbChevronsLeft, TbChevronsRight } from "react-icons/tb";

interface StepSuccessProps {
  onNext: () => void;
  onBack: () => void;
}

export const Step1_Success: React.FC<StepSuccessProps> = ({
  onNext,
  onBack,
}) => {
  return (
    <div className="bg-[#FFF] mt-8 p-6 md:p-10 rounded-none flex flex-col items-center text-center">
      <CheckCircle2
        className="h-20 w-20 text-teal-500 mb-6"
        strokeWidth={1.5}
      />
      <h1 className="text-3xl font-bold text-gray-900 inter">
        Success! Your Company Profile is Ready.
      </h1>
      <p className="mt-3 max-w-lg text-gray-600 inter medium">
        You've successfully created your vendor profile. The next step is to
        upload the required legal documents for verification. Let's keep the
        momentum going!
      </p>

      <div className="mt-10 pt-6 border-t border-gray-100 w-full flex gap-x-2 justify-end items-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="p-4 text-[1rem] rounded-[6px] font-semibold bg-white border-[#DADCE0]"
        >
          <TbChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          onClick={onNext}
          className="text-[1rem] rounded-[6px] font-semibold px-4 py-2.5 bg-[#0081FB] hover:bg-blue-600"
        >
          Continue
          <TbChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
