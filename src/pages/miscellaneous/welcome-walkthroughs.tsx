// // - - - src/pages/miscellaneous/welcome-walkthrough.tsx
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
// import type { Hotel, Vendor } from "./walkthrough";
// import Step4_ReviewHotel_ManualSave from "./step4_reviewHotel";

// const VENDOR_ID = import.meta.env.VITE_VENDOR_ID;
// const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;
// const VENDOR_API_URL = `http://vendor.safaripro.net/api/v1/vendors/${VENDOR_ID}`;
// const HOTEL_API_URL = `http://hotel.safaripro.net/api/v1/hotels/${HOTEL_ID}`;
// const WALKTHROUGH_STORAGE_KEY = "walkthrough_current_step";

// export default function WelcomeWalkthroughs() {
//   const TOTAL_STEPS = 4;
//   const navigate = useNavigate();

//   // --- SESSION PERSISTENCE FOR CURRENT STEP ---
//   const [currentStep, setCurrentStep] = useState(() => {
//     const savedStep = sessionStorage.getItem(WALKTHROUGH_STORAGE_KEY);
//     return savedStep ? parseInt(savedStep, 10) : 1;
//   });

//   const [isStepComplete, setIsStepComplete] = useState(false);

//   useEffect(() => {
//     sessionStorage.setItem(WALKTHROUGH_STORAGE_KEY, String(currentStep));
//   }, [currentStep]);
//   // --- END OF PERSISTENCE LOGIC ---

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
//       // Clear all walkthrough session storage on completion
//       sessionStorage.removeItem(WALKTHROUGH_STORAGE_KEY);
//       sessionStorage.removeItem("walkthrough_logo_preview");
//       sessionStorage.removeItem("walkthrough_step2_social");
//       sessionStorage.removeItem("walkthrough_step3_images");
//       sessionStorage.removeItem("walkthrough_step4_review");

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
//           <Step4_ReviewHotel_ManualSave
//             hotel={hotel}
//             onStepComplete={setIsStepComplete}
//           />
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

// - - - src/pages/miscellaneous/welcome-walkthrough.tsx (LAYOUT UPDATE)
// import { useState, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import { type AxiosError } from "axios";
// import { toast } from "sonner";
// import { motion, AnimatePresence } from "framer-motion";
// import { cn } from "@/lib/utils";

// // --- UI Components & Icons ---
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Loader2,
//   AlertCircle,
//   Check,
//   ArrowRight,
//   ArrowLeft,
//   Building,
//   Share2,
//   Camera,
//   FileCheck,
// } from "lucide-react";

// // --- Child Components & Types ---
// import Step1_UploadLogo from "./step1_uploadLogo";
// import Step2_UploadSocialMedia from "./step2_uploadSocialMedia";
// import Step3_UploadImages from "./step3_uploadImages";
// import Step4_ReviewHotel_ManualSave from "./step4_reviewHotel";
// import type { Hotel, Vendor } from "./walkthrough";

// // --- Centralized API Client & Env Variables ---
// import { getVendorProfile, getHotelProfile } from "@/api/apiClient";
// const VENDOR_ID = import.meta.env.VITE_VENDOR_ID;
// const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;

// // --- Constants ---
// const WALKTHROUGH_STORAGE_KEY = "walkthrough_current_step";
// const HIGHEST_STEP_KEY = "walkthrough_highest_step";
// const buttonClasses =
//   "bg-[#0081FB] text-[#FFF] hover:bg-blue-600 hover:text-[#FFF]";

// // --- Step Configuration ---
// const steps = [
//   { id: 1, title: "Branding", icon: <Building className="h-5 w-5" /> },
//   { id: 2, title: "Social Media", icon: <Share2 className="h-5 w-5" /> },
//   { id: 3, title: "Hotel Photos", icon: <Camera className="h-5 w-5" /> },
//   { id: 4, title: "Final Review", icon: <FileCheck className="h-5 w-5" /> },
// ];

// export default function WelcomeWalkthroughs() {
//   const TOTAL_STEPS = steps.length;
//   const navigate = useNavigate();

//   // --- State Management ---
//   const [currentStep, setCurrentStep] = useState(() => {
//     const savedStep = sessionStorage.getItem(WALKTHROUGH_STORAGE_KEY);
//     return savedStep ? parseInt(savedStep, 10) : 1;
//   });

//   const [highestStepReached, setHighestStepReached] = useState(() => {
//     const savedHighest = sessionStorage.getItem(HIGHEST_STEP_KEY);
//     return savedHighest ? parseInt(savedHighest, 10) : currentStep;
//   });

//   const [isStepComplete, setIsStepComplete] = useState(false);

//   // --- Data Fetching ---
//   const { data: vendor, isLoading: isVendorLoading } = useQuery<Vendor>({
//     queryKey: ["vendorProfile", VENDOR_ID],
//     queryFn: async () => (await getVendorProfile(VENDOR_ID)).data,
//     enabled: !!VENDOR_ID,
//   });

//   const {
//     data: hotel,
//     isLoading: isHotelLoading,
//     isError,
//     error,
//   } = useQuery<Hotel>({
//     queryKey: ["hotelProfile", HOTEL_ID],
//     queryFn: async () => (await getHotelProfile(HOTEL_ID)).data,
//     enabled: !!HOTEL_ID,
//   });

//   const isLoading = isVendorLoading || isHotelLoading;

//   // --- Effects for State Persistence ---
//   useEffect(() => {
//     sessionStorage.setItem(WALKTHROUGH_STORAGE_KEY, String(currentStep));
//     sessionStorage.setItem(HIGHEST_STEP_KEY, String(highestStepReached));
//   }, [currentStep, highestStepReached]);

//   useEffect(() => {
//     if (currentStep === 2) {
//       setIsStepComplete(true);
//     }
//   }, [currentStep]);

//   // --- Navigation Logic ---
//   const handleNext = () => {
//     if (currentStep < TOTAL_STEPS) {
//       const nextStep = currentStep + 1;
//       setCurrentStep(nextStep);
//       if (nextStep > highestStepReached) {
//         setHighestStepReached(nextStep);
//       }
//       setIsStepComplete(nextStep === 2);
//     } else {
//       sessionStorage.clear();
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

//   const handleTabClick = (stepId: number) => {
//     if (stepId <= highestStepReached) {
//       setCurrentStep(stepId);
//       setIsStepComplete(true);
//     }
//   };

//   // --- Content Rendering ---
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
//           <Step4_ReviewHotel_ManualSave
//             hotel={hotel}
//             onStepComplete={setIsStepComplete}
//           />
//         );
//       default:
//         return <div>Invalid Step.</div>;
//     }
//   };

//   return (
//     // The main container no longer centers everything. It just provides padding.
//     <div className="min-h-screen bg-[#FFF] p-4 sm:p-6 lg:p-8 antialiased">
//       <div className="max-w-7xl mx-auto">
//         {/* --- CONTAINER 1: Standalone Header and Tab Navigation --- */}
//         <header className="mb-8">
//           <h1 className="text-3xl font-bold tracking-tight text-gray-900">
//             SafariPro Onboarding
//           </h1>
//           <p className="mt-1 text-gray-600">
//             Let's get your property set up and ready for guests.
//           </p>

//           <div className="pt-6">
//             <Tabs
//               value={String(currentStep)}
//               onValueChange={(value) => handleTabClick(parseInt(value, 10))}
//               className="w-full"
//             >
//               <TabsList className="h-auto px-1.5 py-1.75 bg-gray-100 rounded-lg grid grid-cols-4 w-full">
//                 {steps.map((step) => {
//                   const isCompleted = step.id < highestStepReached;
//                   return (
//                     <TabsTrigger
//                       key={step.id}
//                       value={String(step.id)}
//                       disabled={step.id > highestStepReached}
//                       className={cn(
//                         "data-[state=active]:bg-[#0081FB] data-[state=active]:text-[#FFF] data-[state=active]:shadow-sm text-[#0081FB] bg-[#FFF] shadow flex items-center gap-2 hover:text-[#0081FB] mx-1 transition-all",
//                         isCompleted && "text-green-600 hover:text-green-700",
//                         "disabled:bg-gray-50 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
//                       )}
//                     >
//                       {isCompleted && currentStep !== step.id ? (
//                         <Check className="h-5 w-5" />
//                       ) : (
//                         step.icon
//                       )}
//                       <span className="font-medium">{step.title}</span>
//                     </TabsTrigger>
//                   );
//                 })}
//               </TabsList>
//             </Tabs>
//           </div>
//         </header>

//         {/* --- CONTAINER 2: Left-Aligned Card for Form Content --- */}
//         <Card className="w-full max-w-[0px] border-[#DADCEO] rounded shadow">
//           <CardContent className="min-h-[550px] p-8">
//             {isLoading && (
//               <div className="flex flex-col items-center justify-center h-full">
//                 <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//                 <p className="text-gray-500 mt-3">Loading Your Details...</p>
//               </div>
//             )}
//             {isError && (
//               <Alert variant="destructive">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertTitle>Error Loading Data</AlertTitle>
//                 <AlertDescription>
//                   {(error as AxiosError)?.message ||
//                     "Could not fetch required details."}
//                 </AlertDescription>
//               </Alert>
//             )}
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={currentStep}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 {!isLoading && !isError && renderActiveStep()}
//               </motion.div>
//             </AnimatePresence>
//           </CardContent>

//           <CardFooter className="flex justify-between bg-none p-6 border-t">
//             <Button
//               variant="outline"
//               onClick={handleBack}
//               disabled={currentStep === 1}
//             >
//               <ArrowLeft className="mr-2 h-4 w-4" /> Back
//             </Button>
//             <Button
//               className={cn(buttonClasses)}
//               onClick={handleNext}
//               disabled={!isStepComplete || isLoading}
//             >
//               {currentStep === TOTAL_STEPS ? "Finish Setup" : "Next Step"}
//               {currentStep === TOTAL_STEPS ? (
//                 <Check className="ml-1 h-4 w-4" />
//               ) : (
//                 <ArrowRight className="ml-1 h-4 w-4" />
//               )}
//             </Button>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// }

// - - - src/pages/miscellaneous/welcome-walkthrough.tsx (COMPLETE)
// import { useState, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import { type AxiosError } from "axios";
// import { toast } from "sonner";
// import { motion, AnimatePresence } from "framer-motion";
// import { cn } from "@/lib/utils";

// // --- UI Components & Icons ---
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Loader2,
//   AlertCircle,
//   Check,
//   ArrowRight,
//   ArrowLeft,
//   Building,
//   Share2,
//   Camera,
//   FileCheck,
// } from "lucide-react";

// // --- Child Components & Types ---
// import Step1_UploadLogo from "./step1_uploadLogo";
// import Step4_ReviewHotel_ManualSave from "./step4_reviewHotel";
// import type { Hotel, Vendor } from "./walkthrough";

// // --- Centralized API Client & Env Variables ---
// import { getVendorProfile, getHotelProfile } from "@/api/apiClient";
// import { Step2_UploadSocialMedia } from "./step2_uploadSocialMedia";
// import { Step3_UploadImages } from "./step3_uploadImages";
// const VENDOR_ID = import.meta.env.VITE_VENDOR_ID;
// const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;

// // --- Constants ---
// const WALKTHROUGH_STORAGE_KEY = "walkthrough_current_step";
// const HIGHEST_STEP_KEY = "walkthrough_highest_step";
// const buttonClasses =
//   "bg-[#0081FB] text-[#FFF] hover:bg-blue-600 hover:text-[#FFF]";

// // --- Step Configuration ---
// const steps = [
//   { id: 1, title: "Branding", icon: <Building className="h-5 w-5" /> },
//   { id: 2, title: "Social Media", icon: <Share2 className="h-5 w-5" /> },
//   { id: 3, title: "Hotel Photos", icon: <Camera className="h-5 w-5" /> },
//   { id: 4, title: "Final Review", icon: <FileCheck className="h-5 w-5" /> },
// ];

// export default function WelcomeWalkthroughs() {
//   const TOTAL_STEPS = steps.length;
//   const navigate = useNavigate();

//   // --- State Management ---
//   const [currentStep, setCurrentStep] = useState(() =>
//     parseInt(sessionStorage.getItem(WALKTHROUGH_STORAGE_KEY) || "1", 10)
//   );
//   const [highestStepReached, setHighestStepReached] = useState(() =>
//     parseInt(
//       sessionStorage.getItem(HIGHEST_STEP_KEY) || String(currentStep),
//       10
//     )
//   );
//   const [isStepComplete, setIsStepComplete] = useState(false);

//   // --- Data Fetching ---
//   const { data: vendor, isLoading: isVendorLoading } = useQuery<Vendor>({
//     queryKey: ["vendorProfile", VENDOR_ID],
//     queryFn: async () => (await getVendorProfile(VENDOR_ID)).data,
//     enabled: !!VENDOR_ID,
//   });
//   const {
//     data: hotel,
//     isLoading: isHotelLoading,
//     isError,
//     error,
//   } = useQuery<Hotel>({
//     queryKey: ["hotelProfile", HOTEL_ID],
//     queryFn: async () => (await getHotelProfile(HOTEL_ID)).data,
//     enabled: !!HOTEL_ID,
//   });
//   const isLoading = isVendorLoading || isHotelLoading;

//   // --- Effects ---
//   useEffect(() => {
//     sessionStorage.setItem(WALKTHROUGH_STORAGE_KEY, String(currentStep));
//     sessionStorage.setItem(HIGHEST_STEP_KEY, String(highestStepReached));
//   }, [currentStep, highestStepReached]);

//   useEffect(() => {
//     if (currentStep === 2) setIsStepComplete(true);
//   }, [currentStep]);

//   // --- Navigation ---
//   const handleNext = () => {
//     if (currentStep < TOTAL_STEPS) {
//       const nextStep = currentStep + 1;
//       setCurrentStep(nextStep);
//       if (nextStep > highestStepReached) setHighestStepReached(nextStep);
//       setIsStepComplete(nextStep === 2);
//     } else {
//       sessionStorage.clear();
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
//   const handleTabClick = (stepId: number) => {
//     if (stepId <= highestStepReached) {
//       setCurrentStep(stepId);
//       setIsStepComplete(true);
//     }
//   };

//   // --- Content Rendering ---
//   const renderActiveStep = () => {
//     if (isLoading)
//       return (
//         <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
//           <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//           <p className="text-gray-500 mt-3">Loading Your Details...</p>
//         </div>
//       );
//     if (isError)
//       return (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Error Loading Data</AlertTitle>
//           <AlertDescription>
//             {(error as AxiosError)?.message ||
//               "Could not fetch required details."}
//           </AlertDescription>
//         </Alert>
//       );
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
//           <Step4_ReviewHotel_ManualSave
//             hotel={hotel}
//             onStepComplete={setIsStepComplete}
//           />
//         );
//       default:
//         return <div>Invalid Step.</div>;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#FFF] p-4 sm:p-6 lg:p-8 antialiased pb-28">
//       <div className="max-w-7xl mx-auto">
//         <header className="mb-8">
//           <h1 className="text-3xl font-bold tracking-tight text-gray-900">
//             SafariPro Onboarding
//           </h1>
//           <p className="mt-1 text-gray-600">
//             Let's get your property set up and ready for guests.
//           </p>
//           <div className="pt-6">
//             <Tabs
//               value={String(currentStep)}
//               onValueChange={(value) => handleTabClick(parseInt(value, 10))}
//               className="w-full"
//             >
//               <TabsList className="h-auto px-1.5 py-1.75 bg-gray-100 rounded-lg grid grid-cols-4 w-full">
//                 {steps.map((step) => {
//                   const isCompleted = step.id < highestStepReached;
//                   return (
//                     <TabsTrigger
//                       key={step.id}
//                       value={String(step.id)}
//                       disabled={step.id > highestStepReached}
//                       className={cn(
//                         "data-[state=active]:bg-[#0081FB] data-[state=active]:text-[#FFF] data-[state=active]:shadow-sm text-[#0081FB] bg-[#FFF] shadow flex items-center gap-2 hover:text-[#0081FB] mx-1 transition-all",
//                         isCompleted && "text-green-600 hover:text-green-700",
//                         "disabled:bg-gray-50 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
//                       )}
//                     >
//                       {isCompleted && currentStep !== step.id ? (
//                         <Check className="h-5 w-5" />
//                       ) : (
//                         step.icon
//                       )}
//                       <span className="font-medium">{step.title}</span>
//                     </TabsTrigger>
//                   );
//                 })}
//               </TabsList>
//             </Tabs>
//           </div>
//         </header>

//         <main>
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={currentStep}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.2 }}
//             >
//               {renderActiveStep()}
//             </motion.div>
//           </AnimatePresence>
//         </main>
//       </div>

//       <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 z-10">
//         <div className="max-w-7xl mx-auto flex justify-center items-center h-20 gap-4 px-8">
//           <Button
//             variant="outline"
//             onClick={handleBack}
//             disabled={currentStep === 1}
//             className="w-32"
//           >
//             <ArrowLeft className="mr-2 h-4 w-4" /> Back
//           </Button>
//           <Button
//             className={cn(buttonClasses, "w-32")}
//             onClick={handleNext}
//             disabled={!isStepComplete || isLoading}
//           >
//             {currentStep === TOTAL_STEPS ? "Finish Setup" : "Next Step"}
//             {currentStep === TOTAL_STEPS ? (
//               <Check className="ml-2 h-4 w-4" />
//             ) : (
//               <ArrowRight className="ml-2 h-4 w-4" />
//             )}
//           </Button>
//         </div>
//       </footer>
//     </div>
//   );
// }

// - - - src/pages/miscellaneous/welcome-walkthrough.tsx (IMPROVED)
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { type AxiosError } from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// --- UI Components & Icons ---
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Loader2,
  AlertCircle,
  Check,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

// --- Child Components & Types ---
import Step1_UploadLogo from "./step1_uploadLogo";
import Step4_ReviewHotel_ManualSave from "./step4_reviewHotel";
import type { Hotel, Vendor } from "./walkthrough";

// --- Centralized API Client & Env Variables ---
import { getVendorProfile, getHotelProfile } from "@/api/apiClient";
import { Step2_UploadSocialMedia } from "./step2_uploadSocialMedia";
import { Step3_UploadImages } from "./step3_uploadImages";
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
      sessionStorage.clear();
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
    <div className="min-h-screen bg-[#FFF] antialiased pb-28">
      {/* Full-width progress bar at the top */}
      <div className="w-full bg-gray-100 h-10 flex">
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
                isActive && "bg-blue-500",
                isCompleted && !isActive && "bg-blue-500",
                !isActive && !isCompleted && "bg-gray-300",
                !isClickable && "cursor-not-allowed opacity-50"
              )}
              onClick={() => isClickable && handleStepClick(step.id)}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-1/2 right-0 w-px h-6 -translate-y-1/2 translate-x-1/2",
                    "bg-white"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
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
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-20 gap-4 px-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="w-32"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            {steps[currentStep - 1]?.title}
          </div>

          <Button
            className={cn(buttonClasses, "w-32")}
            onClick={handleNext}
            disabled={!isStepComplete || isLoading}
          >
            {currentStep === TOTAL_STEPS ? "Finish Setup" : "Continue"}
            {currentStep === TOTAL_STEPS ? (
              <Check className="ml-2 h-4 w-4" />
            ) : (
              <ArrowRight className="ml-2 h-4 w-4" />
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}
