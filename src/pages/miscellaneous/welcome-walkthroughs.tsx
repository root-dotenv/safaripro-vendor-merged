// src/pages/miscellaneous/welcome-walkthrough.tsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { type AxiosError } from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

// --- UI Components & Icons ---
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

// --- Child Components & Types ---
import Step1_UploadLogo from "./step1_uploadLogo";
import Step4_ReviewHotel_ManualSave from "./step4_reviewHotel";
import type { Hotel, Vendor } from "./walkthrough";

// --- Centralized API Client & Env Variables ---
import { getVendorProfile, getHotelProfile } from "@/api/apiClient";
import { Step2_UploadSocialMedia } from "./step2_uploadSocialMedia";
import { Step3_UploadImages } from "./step3_uploadImages";
import { TbChevronsLeft, TbChevronsRight } from "react-icons/tb";
const VENDOR_ID = import.meta.env.VITE_VENDOR_ID;
const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;

// --- Constants ---
const WALKTHROUGH_STORAGE_KEY = "walkthrough_current_step";
const HIGHEST_STEP_KEY = "walkthrough_highest_step";
const buttonClasses =
  "bg-[#0081FB] text-[#FFF] hover:bg-blue-600 hover:text-[#FFF]";

// --- Step Configuration (simplified for progress bar) ---
const steps = [
  { id: 1, title: "Branding" },
  { id: 2, title: "Social Media" },
  { id: 3, title: "Hotel Photos" },
  { id: 4, title: "Final Review" },
];

export default function WelcomeWalkthroughs() {
  const TOTAL_STEPS = steps.length;
  const navigate = useNavigate();
  const { completeWalkthrough } = useAuthStore();

  // --- State Management ---
  const [currentStep, setCurrentStep] = useState(() =>
    parseInt(sessionStorage.getItem(WALKTHROUGH_STORAGE_KEY) || "1", 10)
  );
  const [highestStepReached, setHighestStepReached] = useState(() =>
    parseInt(
      sessionStorage.getItem(HIGHEST_STEP_KEY) || String(currentStep),
      10
    )
  );
  const [isStepComplete, setIsStepComplete] = useState(false);

  // --- Data Fetching ---
  const { data: vendor, isLoading: isVendorLoading } = useQuery<Vendor>({
    queryKey: ["vendorProfile", VENDOR_ID],
    queryFn: async () => (await getVendorProfile(VENDOR_ID)).data,
    enabled: !!VENDOR_ID,
  });
  const {
    data: hotel,
    isLoading: isHotelLoading,
    isError,
    error,
  } = useQuery<Hotel>({
    queryKey: ["hotelProfile", HOTEL_ID],
    queryFn: async () => (await getHotelProfile(HOTEL_ID)).data,
    enabled: !!HOTEL_ID,
  });
  const isLoading = isVendorLoading || isHotelLoading;

  // --- Effects ---
  useEffect(() => {
    sessionStorage.setItem(WALKTHROUGH_STORAGE_KEY, String(currentStep));
    sessionStorage.setItem(HIGHEST_STEP_KEY, String(highestStepReached));
  }, [currentStep, highestStepReached]);

  useEffect(() => {
    if (currentStep === 2) setIsStepComplete(true);
  }, [currentStep]);

  // --- Navigation ---
  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (nextStep > highestStepReached) setHighestStepReached(nextStep);
      setIsStepComplete(nextStep === 2);
    } else {
      sessionStorage.removeItem(WALKTHROUGH_STORAGE_KEY);
      sessionStorage.removeItem(HIGHEST_STEP_KEY);

      // Call the action to update the user's state
      completeWalkthrough();

      toast.success("Setup complete! Redirecting to your dashboard...");
      navigate("/");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setIsStepComplete(true);
    }
  };
  const handleStepClick = (stepId: number) => {
    if (stepId <= highestStepReached) {
      setCurrentStep(stepId);
      setIsStepComplete(true);
    }
  };

  // --- Content Rendering ---
  const renderActiveStep = () => {
    if (isLoading)
      return (
        <div className="flex flex-col items-start justify-start h-full min-h-[400px] pl-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-500 mt-3">Loading Your Details...</p>
        </div>
      );
    if (isError)
      return (
        <div className="pl-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Data</AlertTitle>
            <AlertDescription>
              {(error as AxiosError)?.message ||
                "Could not fetch required details."}
            </AlertDescription>
          </Alert>
        </div>
      );
    if (!vendor || !hotel) return null;

    switch (currentStep) {
      case 1:
        return (
          <Step1_UploadLogo
            vendor={vendor}
            onStepComplete={setIsStepComplete}
            footer={<></>}
          />
        );
      case 2:
        return (
          <Step2_UploadSocialMedia
            vendor={vendor}
            onStepComplete={setIsStepComplete}
          />
        );
      case 3:
        return <Step3_UploadImages onStepComplete={setIsStepComplete} />;
      case 4:
        return (
          <Step4_ReviewHotel_ManualSave
            hotel={hotel}
            onStepComplete={setIsStepComplete}
          />
        );
      default:
        return <div className="pl-8">Invalid Step.</div>;
    }
  };

  return (
    <div className="welcome min-h-screen bg-[#F9F9FA] flex flex-col justify-start antialiased pb-28">
      {/* Full-width progress bar at the top */}
      <div className="w-full bg-gray-100 h-2 flex">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted =
            step.id < currentStep ||
            (step.id <= highestStepReached && step.id < currentStep);
          const isClickable = step.id <= highestStepReached;

          return (
            <div
              key={step.id}
              className={cn(
                "flex-1 h-full transition-all duration-300 cursor-pointer relative",
                isActive && "bg-[#0081FB]",
                isCompleted && !isActive && "bg-[#0081FB]",
                !isActive && !isCompleted && "bg-gray-300",
                !isClickable && "cursor-not-allowed opacity-50"
              )}
              onClick={() => isClickable && handleStepClick(step.id)}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-1/2 right-0 w-[4px] h-full -translate-y-1/2 translate-x-1/2",
                    "bg-[#FFF]"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Main content area */}
      <div className="welcome lg:w-[800px] max-w-[800px] bg-[#FFF] rounded-md border-[1px] border-[#DADCE0] mt-16 mx-auto p-4 sm:p-6 lg:p-8">
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderActiveStep()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Fixed footer */}
      <footer className="welcome fixed bottom-0 left-0 right-0 bg-none backdrop-blur-sm z-10">
        <div className="max-w-2xl mx-auto flex justify-between items-center h-16 gap-4 px-8">
          <Button
            variant={"ghost"}
            onClick={handleBack}
            disabled={currentStep === 1}
            className="w-fit bg-none rounded-none shadow-none transition-all hover:shadow-none text-[1rem] text-[#0081FB] hover:text-blue-600 hover:bg-none"
          >
            <TbChevronsLeft size={18} /> Back
          </Button>

          <div className="flex items-center gap-2 text-[0.9375rem] font-medium text-gray-500">
            {steps[currentStep - 1]?.title}
          </div>

          <Button
            className={cn(
              buttonClasses,
              "w-32 rounded-[6px] bg-[#0081FB] text-[1rem]"
            )}
            onClick={handleNext}
            disabled={!isStepComplete || isLoading}
          >
            {currentStep === TOTAL_STEPS ? "Finish Setup" : "Continue"}
            <TbChevronsRight size={18} />
          </Button>
        </div>
      </footer>
    </div>
  );
}
