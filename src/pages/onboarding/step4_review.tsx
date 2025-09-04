import React from "react";
import { Button } from "@/components/ui/button";
import { TbChevronsLeft, TbChevronsRight } from "react-icons/tb";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

interface StepReviewProps {
  onNext: () => void;
  onBack: () => void;
}

export const Step4_Review: React.FC<StepReviewProps> = ({ onNext, onBack }) => {
  return (
    <div className="bg-[#FFF] mt-4 p-6 md:p-10 rounded-none flex flex-col items-center text-center">
      <CheckCircle2
        className="h-20 w-20 text-teal-500 mb-6"
        strokeWidth={1.5}
      />
      <h1 className="text-3xl font-bold text-gray-900 inter">
        Application Submitted & Under Review
      </h1>
      <p className="mt-3 max-w-2xl text-gray-600 inter medium">
        Excellent! All your company details have been submitted for
        verification. While our team reviews your application, you can proceed
        to create your hotel profile.
      </p>
      <p className="mt-2 max-w-xl text-[0.9375rem] text-gray-500">
        You can always check the status of your application in your{" "}
        <Link
          to="/user-account"
          className="font-semibold underline text-blue-600 hover:underline"
        >
          user profile
        </Link>
        .
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
