// // src/pages/onboarding/onboarding-wizard.tsx
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { motion, AnimatePresence } from "framer-motion";
// import { useOnboardingStore } from "@/store/onboarding.store";
// import { useAuthStore } from "@/store/auth.store";

// // UI Components
// import { Button } from "@/components/ui/button";
// import { TbChevronsLeft, TbChevronsRight } from "react-icons/tb";

// // Navigation and Step Components
// import { OnboardingNavigation } from "./onboarding-navigation";
// import { Step0_AccountOption } from "./step0_account_option";
// import { Step0_ServiceSelection } from "./step0_service_selection";
// import { Step1_CompanyInfo } from "./step1_company-info";
// import { Step2_UploadDocument } from "./step2_upload-document";
// import { Step3_BankingDetails } from "./step3_banking-details";
// import { Step5_HotelDetails } from "./step5_hotel-details";
// import { Step6_Finish } from "./step6_finish";

// const steps = [
//   { id: 1, title: "Account Type" },
//   { id: 2, title: "Service" },
//   { id: 3, title: "Company Info" },
//   { id: 4, title: "Documents" },
//   { id: 5, title: "Banking" },
//   { id: 6, title: "Create Hotel" },
//   { id: 7, title: "Finish" },
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

//   const showFooter = currentStep === 4 || currentStep === 5;

//   useEffect(() => {
//     setIsStepComplete(false);
//   }, [currentStep]);

//   const handleNext = () => {
//     if (currentStep < steps.length) {
//       goToNextStep();
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
//       case 5:
//         return "banking-details-form";
//       default:
//         return undefined;
//     }
//   };

//   const renderActiveStep = () => {
//     // ... (renderActiveStep switch statement remains the same)
//     switch (currentStep) {
//       case 1:
//         return <Step0_AccountOption />;
//       case 2:
//         return <Step0_ServiceSelection />;
//       case 3:
//         return (
//           <Step1_CompanyInfo
//             onSuccess={(newVendorId) => {
//               setVendorId(newVendorId);
//               goToNextStep();
//             }}
//             setStepComplete={setIsStepComplete}
//           />
//         );
//       case 4:
//         return vendorId ? (
//           <Step2_UploadDocument
//             vendorId={vendorId}
//             setStepComplete={setIsStepComplete}
//           />
//         ) : null;
//       case 5:
//         return vendorId ? (
//           <Step3_BankingDetails
//             vendorId={vendorId}
//             onComplete={goToNextStep}
//             setStepComplete={setIsStepComplete}
//           />
//         ) : null;
//       case 6:
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
//       case 7:
//         return <Step6_Finish />;
//       default:
//         return <div>Invalid Step. Please refresh.</div>;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F9F9FA] flex flex-col antialiased">
//       <OnboardingNavigation />

//       {/* --- MODIFIED: Main content now uses the same container as the nav bar --- */}
//       <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex flex-col py-10">
//         {/* This inner wrapper constrains the form width while keeping it aligned left */}
//         <div className="w-[785px] max-w-[800px] flex flex-col flex-grow">
//           <main className="flex-grow">
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={currentStep}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 {renderActiveStep()}
//               </motion.div>
//             </AnimatePresence>
//           </main>

//           {showFooter && (
//             <footer className="mt-10 pt-6 border-t">
//               <div className="flex justify-between items-center">
//                 <Button
//                   variant="outline"
//                   onClick={handleBack}
//                   className="w-40 text-[1rem] rounded-[6px] font-semibold px-6 py-2.5 bg-white border-[#DADCE0]"
//                 >
//                   <TbChevronsLeft className="mr-1 h-5 w-5" /> Back
//                 </Button>
//                 <div className="flex items-center gap-2 text-lg font-medium text-gray-600">
//                   {steps[currentStep - 1]?.title}
//                 </div>
//                 <Button
//                   type={getFormIdForStep(currentStep) ? "submit" : "button"}
//                   form={getFormIdForStep(currentStep)}
//                   onClick={
//                     !getFormIdForStep(currentStep) ? handleNext : undefined
//                   }
//                   className="w-40 text-[1rem] rounded-[6px] font-semibold px-6 py-2.5 bg-[#0081FB] hover:bg-blue-600"
//                   disabled={!isStepComplete}
//                 >
//                   Continue
//                   <TbChevronsRight className="ml-1 h-4 w-4" />
//                 </Button>
//               </div>
//             </footer>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// src/pages/onboarding/onboarding-wizard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboardingStore } from "@/store/onboarding.store";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import { TbChevronsLeft, TbChevronsRight } from "react-icons/tb";

// Navigation and Step Components
import { OnboardingNavigation } from "./onboarding-navigation";
import { Step0_AccountOption } from "./step0_account_option";
import { Step0_ServiceSelection } from "./step0_service_selection";
import { Step1_CompanyInfo } from "./step1_company-info";
import { Step2_UploadDocument } from "./step2_upload-document";
import { Step3_BankingDetails } from "./step3_banking-details";
import { Step5_HotelDetails } from "./step5_hotel-details";
import { Step6_Finish } from "./step6_finish";

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

  const showFooter = currentStep === 4 || currentStep === 5;

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

  const getFormIdForStep = (step: number) => {
    switch (step) {
      case 5:
        return "banking-details-form";
      default:
        return undefined;
    }
  };

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
    <div className="min-h-screen bg-[#F9F9FA] flex flex-col antialiased">
      <OnboardingNavigation />

      <div className="container max-w-7xl mx-auto px-4 sm:px-4 lg:px-6 flex-grow flex flex-col py-6">
        <div
          className={cn(
            "flex flex-col flex-grow",
            currentStep > 1 && "w-[785px] max-w-[800px]"
            //  px-10 py-6 bg-[#FFF]
          )}
        >
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
    </div>
  );
}
