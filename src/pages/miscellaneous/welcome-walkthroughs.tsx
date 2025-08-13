// import { useState, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import axios, { type AxiosError } from "axios";
// import { toast } from "sonner";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import {
//   Loader2,
//   AlertCircle,
//   Check,
//   ArrowRight,
//   ArrowLeft,
// } from "lucide-react";
// import Step1_UploadLogo from "./step1_uploadLogo";
// import Step2_UploadSocialMedia from "./step2_uploadSocialMedia";
// import Step3_UploadImages from "./step3_uploadImages";
// import Step4_ReviewHotel from "./step4_reviewHotel";
// import type { Hotel, Vendor } from "./walkthrough";

// const VENDOR_ID = import.meta.env.VITE_VENDOR_ID;
// const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;
// const VENDOR_API_URL = `http://vendor.safaripro.net/api/v1/vendors/${VENDOR_ID}`;
// const HOTEL_API_URL = `http://hotel.safaripro.net/api/v1/hotels/${HOTEL_ID}`;

// export default function WelcomeWalkthroughs() {
//   const TOTAL_STEPS = 4;
//   const navigate = useNavigate();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isStepComplete, setIsStepComplete] = useState(false);

//   const { data: vendor, isLoading: isVendorLoading } = useQuery<Vendor>({
//     queryKey: ["vendorProfile", VENDOR_ID],
//     queryFn: async () => (await axios.get(VENDOR_API_URL)).data,
//     enabled: !!VENDOR_ID,
//   });

//   const {
//     data: hotel,
//     isLoading: isHotelLoading,
//     isError,
//     error,
//   } = useQuery<Hotel>({
//     queryKey: ["hotelProfile", HOTEL_ID],
//     queryFn: async () => (await axios.get(HOTEL_API_URL)).data,
//     enabled: !!HOTEL_ID,
//   });

//   const isLoading = isVendorLoading || isHotelLoading;

//   useEffect(() => {
//     if (currentStep === 2) {
//       setIsStepComplete(true);
//     }
//   }, [currentStep]);

//   const progressValue = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;

//   const handleNext = () => {
//     if (currentStep < TOTAL_STEPS) {
//       setCurrentStep((prev) => prev + 1);
//       setIsStepComplete(currentStep + 1 === 2);
//     } else {
//       toast.success("Setup complete! Redirecting to your dashboard...");
//       navigate("/hotel/hotel-details");
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep((prev) => prev - 1);
//       setIsStepComplete(true);
//     }
//   };

//   const renderActiveStep = () => {
//     if (!vendor || !hotel) return null;
//     switch (currentStep) {
//       case 1:
//         return (
//           <Step1_UploadLogo
//             vendor={vendor}
//             onStepComplete={setIsStepComplete}
//           />
//         );
//       case 2:
//         return (
//           <Step2_UploadSocialMedia
//             vendor={vendor}
//             onStepComplete={setIsStepComplete}
//           />
//         );
//       case 3:
//         return <Step3_UploadImages onStepComplete={setIsStepComplete} />;
//       case 4:
//         return (
//           <Step4_ReviewHotel hotel={hotel} onStepComplete={setIsStepComplete} />
//         );
//       default:
//         return <div>Invalid Step.</div>;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#FFF] flex items-center justify-center p-4 antialiased">
//       <Card className="w-full max-w-4xl bg-[#FFF] border-[#DADCEO] rounded shadow">
//         <CardHeader className="p-8">
//           <CardTitle className="text-3xl font-bold text-gray-900">
//             SafariPro Onboarding
//           </CardTitle>
//           <CardDescription className="text-gray-500">
//             Let's get your property set up and ready for guests.
//           </CardDescription>
//           <div className="pt-4">
//             <Progress value={progressValue} />
//             <p className="text-sm text-gray-500 mt-2 text-right font-medium">
//               Step {currentStep} of {TOTAL_STEPS}
//             </p>
//           </div>
//         </CardHeader>
//         <CardContent className="min-h-[550px] p-8 border-t border-b">
//           {isLoading && (
//             <div className="flex flex-col items-center justify-center h-full">
//               <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//               <p className="text-gray-500 mt-3">Loading Your Details...</p>
//             </div>
//           )}
//           {isError && (
//             <Alert variant="destructive">
//               <AlertCircle className="h-4 w-4" />
//               <AlertTitle>Error Loading Data</AlertTitle>
//               <AlertDescription>
//                 {(error as AxiosError)?.message ||
//                   "Could not fetch required details."}
//               </AlertDescription>
//             </Alert>
//           )}
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={currentStep}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.2 }}
//             >
//               {!isLoading && !isError && renderActiveStep()}
//             </motion.div>
//           </AnimatePresence>
//         </CardContent>
//         <CardFooter className="flex justify-between bg-none p-6">
//           <Button
//             variant="outline"
//             onClick={handleBack}
//             disabled={currentStep === 1}
//           >
//             <ArrowLeft className="mr-2 h-4 w-4" /> Back
//           </Button>
//           <Button
//             className="bg-blue-500 rounded-md transition-all hover:bg-blue-600"
//             onClick={handleNext}
//             disabled={!isStepComplete || isLoading}
//           >
//             {currentStep === TOTAL_STEPS ? "Finish Setup" : "Next Step"}
//             {currentStep === TOTAL_STEPS ? (
//               <Check className="ml-1 h-4 w-4" />
//             ) : (
//               <ArrowRight className="ml-1 h-4 w-4" />
//             )}
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios, { type AxiosError } from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Loader2,
  AlertCircle,
  Check,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Step1_UploadLogo from "./step1_uploadLogo";
import Step2_UploadSocialMedia from "./step2_uploadSocialMedia";
import Step3_UploadImages from "./step3_uploadImages";
import type { Hotel, Vendor } from "./walkthrough";
import Step4_ReviewHotel_ManualSave from "./step4_reviewHotel";

const VENDOR_ID = import.meta.env.VITE_VENDOR_ID;
const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;
const VENDOR_API_URL = `http://vendor.safaripro.net/api/v1/vendors/${VENDOR_ID}`;
const HOTEL_API_URL = `http://hotel.safaripro.net/api/v1/hotels/${HOTEL_ID}`;
const WALKTHROUGH_STORAGE_KEY = "walkthrough_current_step";

export default function WelcomeWalkthroughs() {
  const TOTAL_STEPS = 4;
  const navigate = useNavigate();

  // --- SESSION PERSISTENCE FOR CURRENT STEP ---
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = sessionStorage.getItem(WALKTHROUGH_STORAGE_KEY);
    return savedStep ? parseInt(savedStep, 10) : 1;
  });

  const [isStepComplete, setIsStepComplete] = useState(false);

  useEffect(() => {
    sessionStorage.setItem(WALKTHROUGH_STORAGE_KEY, String(currentStep));
  }, [currentStep]);
  // --- END OF PERSISTENCE LOGIC ---

  const { data: vendor, isLoading: isVendorLoading } = useQuery<Vendor>({
    queryKey: ["vendorProfile", VENDOR_ID],
    queryFn: async () => (await axios.get(VENDOR_API_URL)).data,
    enabled: !!VENDOR_ID,
  });

  const {
    data: hotel,
    isLoading: isHotelLoading,
    isError,
    error,
  } = useQuery<Hotel>({
    queryKey: ["hotelProfile", HOTEL_ID],
    queryFn: async () => (await axios.get(HOTEL_API_URL)).data,
    enabled: !!HOTEL_ID,
  });

  const isLoading = isVendorLoading || isHotelLoading;

  useEffect(() => {
    if (currentStep === 2) {
      setIsStepComplete(true);
    }
  }, [currentStep]);

  const progressValue = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
      setIsStepComplete(currentStep + 1 === 2);
    } else {
      // Clear all walkthrough session storage on completion
      sessionStorage.removeItem(WALKTHROUGH_STORAGE_KEY);
      sessionStorage.removeItem("walkthrough_logo_preview");
      sessionStorage.removeItem("walkthrough_step2_social");
      sessionStorage.removeItem("walkthrough_step3_images");
      sessionStorage.removeItem("walkthrough_step4_review");

      toast.success("Setup complete! Redirecting to your dashboard...");
      navigate("/hotel/hotel-details");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setIsStepComplete(true);
    }
  };

  const renderActiveStep = () => {
    if (!vendor || !hotel) return null;
    switch (currentStep) {
      case 1:
        return (
          <Step1_UploadLogo
            vendor={vendor}
            onStepComplete={setIsStepComplete}
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
        return <div>Invalid Step.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF] flex items-center justify-center p-4 antialiased">
      <Card className="w-full max-w-4xl bg-[#FFF] border-[#DADCEO] rounded shadow">
        <CardHeader className="p-8">
          <CardTitle className="text-3xl font-bold text-gray-900">
            SafariPro Onboarding
          </CardTitle>
          <CardDescription className="text-gray-500">
            Let's get your property set up and ready for guests.
          </CardDescription>
          <div className="pt-4">
            <Progress value={progressValue} />
            <p className="text-sm text-gray-500 mt-2 text-right font-medium">
              Step {currentStep} of {TOTAL_STEPS}
            </p>
          </div>
        </CardHeader>
        <CardContent className="min-h-[550px] p-8 border-t border-b">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-gray-500 mt-3">Loading Your Details...</p>
            </div>
          )}
          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Data</AlertTitle>
              <AlertDescription>
                {(error as AxiosError)?.message ||
                  "Could not fetch required details."}
              </AlertDescription>
            </Alert>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {!isLoading && !isError && renderActiveStep()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between bg-none p-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            className="bg-blue-500 rounded-md transition-all hover:bg-blue-600"
            onClick={handleNext}
            disabled={!isStepComplete || isLoading}
          >
            {currentStep === TOTAL_STEPS ? "Finish Setup" : "Next Step"}
            {currentStep === TOTAL_STEPS ? (
              <Check className="ml-1 h-4 w-4" />
            ) : (
              <ArrowRight className="ml-1 h-4 w-4" />
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
