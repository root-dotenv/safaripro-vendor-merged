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

// // --- MODIFIED: Steps array updated to 5 steps ---
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
//     setVendorId,
//     setHotelId,
//     goToNextStep,
//     goToPreviousStep,
//     resetOnboarding,
//   } = useOnboardingStore();
//   const { completeOnboarding } = useAuthStore();
//   const [isStepComplete, setIsStepComplete] = useState(false);

//   const handleNext = () => {
//     if (currentStep < steps.length) {
//       goToNextStep();
//       setIsStepComplete(false); // Reset for the next step
//     } else {
//       // Final step action
//       completeOnboarding();
//       resetOnboarding();
//       toast.success("Setup complete! Welcome to your dashboard.");
//       navigate("/");
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 1) {
//       goToPreviousStep();
//       setIsStepComplete(true); // Any previous step is considered complete
//     }
//   };

//   const getFormIdForStep = (step: number) => {
//     switch (step) {
//       case 1:
//         return "company-info-form";
//       case 3:
//         return "banking-details-form";
//       case 4:
//         return "hotel-details-form";
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
//             onComplete={goToNextStep}
//             onBack={goToPreviousStep}
//             setStepComplete={setIsStepComplete}
//           />
//         ) : null;
//       case 3:
//         return vendorId ? (
//           <Step3_BankingDetails
//             vendorId={vendorId}
//             onComplete={goToNextStep}
//             onBack={goToPreviousStep}
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
//             onBack={goToPreviousStep}
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
//     <div className="min-h-screen bg-[#F9F9FA] flex flex-col justify-start antialiased pb-28">
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

//       <div className="w-full max-w-5xl bg-[#FFF] rounded-md border-[1px] border-[#DADCE0] mt-16 mx-auto p-4 sm:p-6 lg:p-10">
//         <main>
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
//       </div>

//       {currentStep < steps.length && (
//         <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-10 border-t border-gray-200">
//           <div className="max-w-4xl mx-auto flex justify-between items-center h-20 px-8">
//             <Button
//               variant="ghost"
//               onClick={handleBack}
//               disabled={currentStep === 1}
//               className="text-lg text-[#0081FB] hover:text-blue-600"
//             >
//               <TbChevronsLeft size={20} /> Back
//             </Button>

//             <div className="flex items-center gap-2 text-lg font-medium text-gray-600">
//               {steps[currentStep - 1]?.title}
//             </div>

//             <Button
//               type={getFormIdForStep(currentStep) ? "submit" : "button"}
//               form={getFormIdForStep(currentStep)}
//               onClick={!getFormIdForStep(currentStep) ? handleNext : undefined}
//               className="w-40 text-lg rounded-[6px] bg-[#0081FB] hover:bg-blue-600"
//               disabled={!isStepComplete}
//             >
//               {currentStep === steps.length ? "Finish" : "Continue"}
//               <TbChevronsRight size={20} />
//             </Button>
//           </div>
//         </footer>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useOnboardingStore } from "@/store/onboarding.store";
import { useAuthStore } from "@/store/auth.store";

// UI Components
import { Button } from "@/components/ui/button";
import { TbChevronsLeft, TbChevronsRight } from "react-icons/tb";

// Step Components
import { Step1_CompanyInfo } from "./step1_company-info";
import { Step2_UploadDocument } from "./step2_upload-document";
import { Step3_BankingDetails } from "./step3_banking-details";
import { Step5_HotelDetails } from "./step5_hotel-details";
import { Step6_Finish } from "./step6_finish";

const steps = [
  { id: 1, title: "Company Info" },
  { id: 2, title: "Documents" },
  { id: 3, title: "Banking" },
  { id: 4, title: "Create Hotel" },
  { id: 5, title: "Finish" },
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

  const handleNext = () => {
    if (currentStep < steps.length) {
      goToNextStep();
      setIsStepComplete(false); // Reset for the next step
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
      case 1:
        return "company-info-form";
      case 3:
        return "banking-details-form";
      case 4:
        return "hotel-details-form";
      default:
        return undefined;
    }
  };

  const renderActiveStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1_CompanyInfo
            onSuccess={(newVendorId) => {
              setVendorId(newVendorId);
              goToNextStep();
            }}
            setStepComplete={setIsStepComplete}
          />
        );
      case 2:
        return vendorId ? (
          <Step2_UploadDocument
            vendorId={vendorId}
            setStepComplete={setIsStepComplete}
          />
        ) : null;
      case 3:
        return vendorId ? (
          <Step3_BankingDetails
            vendorId={vendorId}
            onComplete={goToNextStep}
            setStepComplete={setIsStepComplete}
          />
        ) : null;
      case 4:
        return vendorId ? (
          <Step5_HotelDetails
            vendorId={vendorId}
            onSuccess={(newHotelId) => {
              setHotelId(newHotelId);
              goToNextStep();
            }}
            onBack={handleBack} // <-- THE FIX: Use handleBack, not handlePrevSubStep
            setStepComplete={setIsStepComplete}
          />
        ) : null;
      case 5:
        return <Step6_Finish />;
      default:
        return <div>Invalid Step. Please refresh.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9FA] flex flex-col justify-start antialiased pb-28">
      <div className="w-full bg-gray-100 h-2 flex">
        {steps.map((step) => {
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

      <div className="w-full max-w-5xl bg-[#FFF] rounded-md border-[1px] border-[#DADCE0] mt-16 mx-auto p-4 sm:p-6 lg:p-10">
        <main>
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
      </div>

      {currentStep < steps.length && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-10 border-t border-gray-200">
          <div className="max-w-4xl mx-auto flex justify-between items-center h-20 px-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="text-lg text-[#0081FB] hover:text-blue-600"
            >
              <TbChevronsLeft size={20} /> Back
            </Button>

            <div className="flex items-center gap-2 text-lg font-medium text-gray-600">
              {steps[currentStep - 1]?.title}
            </div>

            <Button
              type={getFormIdForStep(currentStep) ? "submit" : "button"}
              form={getFormIdForStep(currentStep)}
              onClick={!getFormIdForStep(currentStep) ? handleNext : undefined}
              className="w-40 text-lg rounded-[6px] bg-[#0081FB] hover:bg-blue-600"
              disabled={!isStepComplete}
            >
              {currentStep === steps.length ? "Finish" : "Continue"}
              <TbChevronsRight size={20} />
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
}
