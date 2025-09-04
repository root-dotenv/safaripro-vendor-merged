// src/pages/onboarding/onboarding-wizard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboardingStore } from "@/store/onboarding.store";
import { useAuthStore } from "@/store/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { getRegions } from "@/api/locations";

// UI Components
import { Button } from "@/components/ui/button";
import { TbChevronsLeft, TbChevronsRight } from "react-icons/tb";

// Navigation and Step Components
import { OnboardingNavigation } from "./onboarding-navigation";
import { Step0_AccountOption } from "./step0_account_option";
import { Step0_ServiceSelection } from "./step0_service_selection";
import { Step1_CompanyInfo } from "./step1_company-info";
// --- MODIFICATION: Removed unused import for Step1_Success ---
// import { Step1_Success } from "./step1_success";
import { Step2_UploadDocument } from "./step2_upload-document";
import { Step3_BankingDetails } from "./step3_banking-details";
import { Step4_Review } from "./step4_review";
import { Step5_HotelDetails } from "./step5_hotel-details";
import { Step6_Finish } from "./step6_finish";
import OnboardingFooter from "./onboarding-footer";

// --- MODIFICATION: Removed 'Confirmation' step and re-numbered IDs ---
const steps = [
  { id: 1, title: "Account Type" },
  { id: 2, title: "Service" },
  { id: 3, title: "Company Info" },
  { id: 4, title: "Documents" },
  { id: 5, title: "Banking" },
  { id: 6, title: "Application Review" },
  { id: 7, title: "Create Hotel" },
  { id: 8, title: "Finish" },
];

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const {
    currentStep,
    vendorId,
    hotelId,
    setVendorId,
    setHotelId,
    goToNextStep,
    goToPreviousStep,
    resetOnboarding,
  } = useOnboardingStore();
  const { completeOnboarding } = useAuthStore();
  const [isStepComplete, setIsStepComplete] = useState(false);
  const queryClient = useQueryClient();

  // --- MODIFICATION: Updated step number for showing the footer ---
  const showFooter = currentStep === 5;

  useEffect(() => {
    console.log("Prefetching regions for onboarding...");
    queryClient.prefetchQuery({
      queryKey: ["allRegions"],
      queryFn: getRegions,
    });
  }, [queryClient]);

  useEffect(() => {
    setIsStepComplete(false);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      goToNextStep();
    } else {
      if (hotelId) {
        completeOnboarding(hotelId);
        resetOnboarding();
        toast.success("Setup complete! Welcome to your dashboard.");
        navigate("/");
      } else {
        toast.error("Could not finalize setup. Hotel ID is missing.");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      goToPreviousStep();
      setIsStepComplete(true);
    }
  };

  // --- MODIFICATION: Updated step number for form submission ---
  const getFormIdForStep = (step: number) => {
    switch (step) {
      case 5:
        return "banking-details-form";
      default:
        return undefined;
    }
  };

  // --- MODIFICATION: Removed success step and re-numbered subsequent cases ---
  const renderActiveStep = () => {
    switch (currentStep) {
      case 1:
        return <Step0_AccountOption />;
      case 2:
        return <Step0_ServiceSelection />;
      case 3:
        return (
          <Step1_CompanyInfo
            onSuccess={(newVendorId) => {
              setVendorId(newVendorId);
              goToNextStep();
            }}
            setStepComplete={setIsStepComplete}
          />
        );
      case 4: // Was previously case 5
        return vendorId ? (
          <Step2_UploadDocument
            vendorId={vendorId}
            setStepComplete={setIsStepComplete}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        ) : null;
      case 5: // Was previously case 6
        return vendorId ? (
          <Step3_BankingDetails
            vendorId={vendorId}
            onComplete={goToNextStep}
            setStepComplete={setIsStepComplete}
          />
        ) : null;
      case 6: // Was previously case 7
        return <Step4_Review onNext={goToNextStep} onBack={goToPreviousStep} />;
      case 7: // Was previously case 8
        return vendorId ? (
          <Step5_HotelDetails
            vendorId={vendorId}
            onSuccess={(newHotelId) => {
              setHotelId(newHotelId);
              goToNextStep();
            }}
            onBack={handleBack}
            setStepComplete={setIsStepComplete}
          />
        ) : null;
      case 8: // Was previously case 9
        return <Step6_Finish />;
      default:
        return <div>Invalid Step. Please refresh.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9FA] flex flex-col antialiased">
      <OnboardingNavigation />
      <div className="container max-w-4xl mx-auto px-4 sm:px-4 lg:px-6 flex-grow flex flex-col py-6">
        <div className="flex flex-col flex-grow">
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderActiveStep()}
              </motion.div>
            </AnimatePresence>
          </main>
          {showFooter && (
            <footer className="mt-10 pt-6">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="p-4 text-[1rem] rounded-[6px] font-semibold bg-white border-[#DADCE0]"
                >
                  <TbChevronsLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2 text-lg font-medium text-gray-600">
                  {steps[currentStep - 1]?.title}
                </div>
                <Button
                  type={getFormIdForStep(currentStep) ? "submit" : "button"}
                  form={getFormIdForStep(currentStep)}
                  onClick={
                    !getFormIdForStep(currentStep) ? handleNext : undefined
                  }
                  className="w-40 text-[1rem] rounded-[6px] font-semibold px-6 py-2.5 bg-[#0081FB] hover:bg-blue-600"
                  disabled={!isStepComplete}
                >
                  Continue
                  <TbChevronsRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </footer>
          )}
        </div>
      </div>
      <OnboardingFooter />
    </div>
  );
}
