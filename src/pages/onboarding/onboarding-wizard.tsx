// // - - - src/pages/onboarding/onboarding-wizard.tsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { motion, AnimatePresence } from "framer-motion";
// import { cn } from "@/lib/utils";
// import { useOnboardingStore } from "@/store/onboarding.store";
// import { useAuthStore } from "@/store/auth.store";

// // UI Components
// import { Button } from "@/components/ui/button";
// import { TbChevronsLeft, TbChevronsRight } from "react-icons/tb";

// // Step Components
// import { Step1_CompanyInfo } from "./step1_company-info";
// import { Step2_UploadDocument } from "./step2_upload-document";
// import { Step3_BankingDetails } from "./step3_banking-details";
// import { Step5_HotelDetails } from "./step5_hotel-details";
// import { Step6_Finish } from "./step6_finish";

// const steps = [
//   { id: 1, title: "Company Info" },
//   { id: 2, title: "Documents" },
//   { id: 3, title: "Banking" },
//   { id: 4, title: "Create Hotel" },
//   { id: 5, title: "Finish" },
// ];

// export default function OnboardingWizard() {
//   const navigate = useNavigate();
//   const {
//     currentStep,
//     vendorId,
//     hotelId,
//     setVendorId,
//     setHotelId,
//     goToNextStep,
//     goToPreviousStep,
//     resetOnboarding,
//   } = useOnboardingStore();
//   const { completeOnboarding } = useAuthStore();
//   const [isStepComplete, setIsStepComplete] = useState(false);

//   const showFooter = currentStep === 2 || currentStep === 3;

//   const handleNext = () => {
//     if (currentStep < steps.length) {
//       goToNextStep();
//       setIsStepComplete(false);
//     } else {
//       if (hotelId) {
//         completeOnboarding(hotelId);
//         resetOnboarding();
//         toast.success("Setup complete! Welcome to your dashboard.");
//         navigate("/");
//       } else {
//         toast.error("Could not finalize setup. Hotel ID is missing.");
//       }
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 1) {
//       goToPreviousStep();
//       setIsStepComplete(true);
//     }
//   };

//   const getFormIdForStep = (step: number) => {
//     switch (step) {
//       case 3:
//         return "banking-details-form";
//       default:
//         return undefined;
//     }
//   };

//   const renderActiveStep = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <Step1_CompanyInfo
//             onSuccess={(newVendorId) => {
//               setVendorId(newVendorId);
//               goToNextStep();
//             }}
//             setStepComplete={setIsStepComplete}
//           />
//         );
//       case 2:
//         return vendorId ? (
//           <Step2_UploadDocument
//             vendorId={vendorId}
//             setStepComplete={setIsStepComplete}
//           />
//         ) : null;
//       case 3:
//         return vendorId ? (
//           <Step3_BankingDetails
//             vendorId={vendorId}
//             onComplete={goToNextStep}
//             setStepComplete={setIsStepComplete}
//           />
//         ) : null;
//       case 4:
//         return vendorId ? (
//           <Step5_HotelDetails
//             vendorId={vendorId}
//             onSuccess={(newHotelId) => {
//               setHotelId(newHotelId);
//               goToNextStep();
//             }}
//             onBack={handleBack}
//             setStepComplete={setIsStepComplete}
//           />
//         ) : null;
//       case 5:
//         return <Step6_Finish />;
//       default:
//         return <div>Invalid Step. Please refresh.</div>;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F9F9FA] flex flex-col justify-start antialiased pb-12">
//       <div className="w-full bg-gray-100 h-2 flex">
//         {steps.map((step) => {
//           const isActive = step.id === currentStep;
//           const isCompleted = step.id < currentStep;
//           return (
//             <div
//               key={step.id}
//               className={cn(
//                 "flex-1 h-full transition-all duration-300",
//                 isActive && "bg-[#0081FB]",
//                 isCompleted && "bg-[#0081FB]",
//                 !isActive && !isCompleted && "bg-gray-300"
//               )}
//             />
//           );
//         })}
//       </div>

//       {/* --- MODIFIED: Added flex flex-col and flex-1 to make this container grow --- */}
//       <div className="w-full max-w-3xl bg-[#FFF] rounded-md border-[1px] border-[#DADCE0] mt-16 mx-auto p-4 sm:p-6 lg:p-10 flex flex-col flex-1">
//         {/* --- MODIFIED: Added flex-1 to make the main content area expand --- */}
//         <main className="flex-1">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={currentStep}
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               transition={{ duration: 0.3 }}
//             >
//               {renderActiveStep()}
//             </motion.div>
//           </AnimatePresence>
//         </main>

//         {showFooter && (
//           <footer className="mt-10 pt-6 border-t">
//             <div className="flex justify-between items-center">
//               <Button
//                 variant="outline"
//                 onClick={handleBack}
//                 className="w-40 text-[1rem] rounded-[6px] font-semibold px-6 py-2.5 bg-white border-[#DADCE0]"
//               >
//                 <TbChevronsLeft className="mr-1 h-5 w-5" /> Back
//               </Button>

//               <div className="flex items-center gap-2 text-lg font-medium text-gray-600">
//                 {steps[currentStep - 1]?.title}
//               </div>

//               <Button
//                 type={getFormIdForStep(currentStep) ? "submit" : "button"}
//                 form={getFormIdForStep(currentStep)}
//                 onClick={
//                   !getFormIdForStep(currentStep) ? handleNext : undefined
//                 }
//                 className="w-40 text-[1rem] rounded-[6px] font-semibold px-6 py-2.5 bg-[#0081FB] hover:bg-blue-600"
//                 disabled={!isStepComplete}
//               >
//                 Continue
//                 <TbChevronsRight className="ml-1 h-4 w-4" />
//               </Button>
//             </div>
//           </footer>
//         )}
//       </div>
//     </div>
//   );
// }

// src/pages/onboarding/onboarding-wizard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useOnboardingStore } from "@/store/onboarding.store";
import { useAuthStore } from "@/store/auth.store";

// UI Components
import { Button } from "@/components/ui/button";
import { TbChevronsLeft, TbChevronsRight } from "react-icons/tb";

// --- NEW: Import new step components ---
import { Step0_AccountOption } from "./step0_account_option";
import { Step0_ServiceSelection } from "./step0_service_selection";

// Step Components
import { Step1_CompanyInfo } from "./step1_company-info";
import { Step2_UploadDocument } from "./step2_upload-document";
import { Step3_BankingDetails } from "./step3_banking-details";
import { Step5_HotelDetails } from "./step5_hotel-details";
import { Step6_Finish } from "./step6_finish";

// --- MODIFIED: Updated steps array for the full 7-step flow ---
const steps = [
  { id: 1, title: "Account Type" },
  { id: 2, title: "Service" },
  { id: 3, title: "Company Info" },
  { id: 4, title: "Documents" },
  { id: 5, title: "Banking" },
  { id: 6, title: "Create Hotel" },
  { id: 7, title: "Finish" },
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

  // --- MODIFIED: Adjust footer visibility for new steps ---
  const showFooter = currentStep === 4 || currentStep === 5;

  // Effect to reset completion status when step changes
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
      setIsStepComplete(true); // Assume previous steps are complete
    }
  };

  // --- MODIFIED: Update case number for form ID retrieval ---
  const getFormIdForStep = (step: number) => {
    switch (step) {
      case 5:
        return "banking-details-form";
      default:
        return undefined;
    }
  };

  // --- MODIFIED: Updated render logic with new steps ---
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
      case 4:
        return vendorId ? (
          <Step2_UploadDocument
            vendorId={vendorId}
            setStepComplete={setIsStepComplete}
          />
        ) : null;
      case 5:
        return vendorId ? (
          <Step3_BankingDetails
            vendorId={vendorId}
            onComplete={goToNextStep}
            setStepComplete={setIsStepComplete}
          />
        ) : null;
      case 6:
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
      case 7:
        return <Step6_Finish />;
      default:
        return <div>Invalid Step. Please refresh.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9FA] flex flex-col justify-start antialiased pb-12">
      {/* --- MODIFIED: Conditionally render progress bar --- */}
      {currentStep > 2 && (
        <div className="w-full bg-gray-100 h-2 flex">
          {/* We only show progress for the main vendor setup steps */}
          {steps.slice(2).map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            return (
              <div
                key={step.id}
                className={cn(
                  "flex-1 h-full transition-all duration-300",
                  isActive && "bg-[#0081FB]",
                  isCompleted && "bg-[#0081FB]",
                  !isActive && !isCompleted && "bg-gray-300"
                )}
              />
            );
          })}
        </div>
      )}

      <div
        className={cn(
          "w-full max-w-3xl bg-[#FFF] rounded-md border-[1px] border-[#DADCE0] mt-16 mx-auto p-4 sm:p-6 lg:p-10 flex flex-col flex-1",
          currentStep <= 2 && "border-none shadow-none bg-transparent" // Cleaner look for initial steps
        )}
      >
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderActiveStep()}
            </motion.div>
          </AnimatePresence>
        </main>

        {showFooter && (
          <footer className="mt-10 pt-6 border-t">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handleBack}
                className="w-40 text-[1rem] rounded-[6px] font-semibold px-6 py-2.5 bg-white border-[#DADCE0]"
              >
                <TbChevronsLeft className="mr-1 h-5 w-5" /> Back
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
  );
}
