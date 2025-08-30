// // src/pages/onboarding/step0_account_option.tsx
// import { toast } from "sonner";
// import { AccountSelectionCard } from "./account-selection-card"; // --- MODIFIED: Import the new component ---
// import { Building, Briefcase, User } from "lucide-react";
// import { useOnboardingStore } from "@/store/onboarding.store";

// export const Step0_AccountOption = () => {
//   const { goToNextStep } = useOnboardingStore();

//   const handleNormalUserRedirect = () => {
//     toast.info("Redirecting you to the SafariPro booking site...");
//     setTimeout(() => {
//       window.location.href = "https://web.safaripro.net/";
//     }, 1500);
//   };

//   const handleAgencySelection = () => {
//     toast.info("Agency portal is coming soon!", {
//       description: "We're working hard to bring this feature to you.",
//     });
//   };

//   return (
//     <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
//       <div className="w-full lg:w-5/12"></div>

//       <div className="w-full lg:w-7/12 flex flex-col text-left">
//         <header className="mb-8">
//           <h1 className="text-4xl font-bold tracking-tight text-gray-900">
//             Welcome to SafariPro!
//           </h1>
//           <p className="mt-3 text-lg text-gray-600">
//             Let's get you started. First, tell us what you'd like to do so we
//             can tailor your experience.
//           </p>
//         </header>
//         <div className="space-y-5">
//           {/* --- MODIFIED: Using the new AccountSelectionCard component --- */}
//           <AccountSelectionCard
//             icon={<Building className="h-7 w-7" />}
//             title="I'm a Vendor"
//             description="List and manage your properties, tours, or services on our platform."
//             onClick={goToNextStep}
//             showBadge
//           />
//           <AccountSelectionCard
//             icon={<User className="h-7 w-7" />}
//             title="I just want to book"
//             description="Explore and book hotels, tours, and rides across the country."
//             onClick={handleNormalUserRedirect}
//           />
//           <AccountSelectionCard
//             icon={<Briefcase className="h-7 w-7" />}
//             title="I'm an Agency"
//             description="Manage bookings for your clients through our dedicated agency portal."
//             onClick={handleAgencySelection}
//             disabled
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// // src/pages/onboarding/step0_account_option.tsx
// // src/pages/onboarding/step0_account_option.tsx
// import { toast } from "sonner";
// import { AccountSelectionCard } from "./account-selection-card";
// import {
//   Building,
//   Briefcase,
//   User,
//   CheckCircle,
//   ShieldCheck,
//   BarChart3,
//   MessageCircleQuestion,
//   DatabaseZap,
//   Globe,
// } from "lucide-react";
// import { useOnboardingStore } from "@/store/onboarding.store";
// import type { ReactNode } from "react";

// const FeatureListItem = ({ children }: { children: React.ReactNode }) => (
//   <li className="flex items-start gap-3">
//     <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
//     <span className="text-gray-600">{children}</span>
//   </li>
// );

// // --- NEW: A dedicated component for the informational cards at the bottom ---
// const InfoCard = ({
//   icon,
//   title,
//   description,
// }: {
//   icon: ReactNode;
//   title: string;
//   description: string;
// }) => (
//   <div className="flex items-start gap-4 p-4">
//     <div className="flex-shrink-0 text-blue-600 mt-1">{icon}</div>
//     <div>
//       <h4 className="font-bold text-gray-800">{title}</h4>
//       <p className="text-sm text-gray-600">{description}</p>
//     </div>
//   </div>
// );

// export const Step0_AccountOption = () => {
//   const { goToNextStep } = useOnboardingStore();

//   const handleNormalUserRedirect = () => {
//     toast.info("Redirecting you to the SafariPro booking site...");
//     setTimeout(() => {
//       window.location.href = "https://web.safaripro.net/";
//     }, 1500);
//   };

//   const handleAgencySelection = () => {
//     toast.info("Agency portal is coming soon!", {
//       description: "We're working hard to bring this feature to you.",
//     });
//   };

//   return (
//     // --- MODIFIED: Main container now controls the full-height, no-scroll layout ---
//     <div className="flex flex-col h-[calc(100vh-110px)]">
//       {/* Top Hero Section (takes up most of the space) */}
//       <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
//         {/* Left Column: Textual Content */}
//         <div className="flex flex-col text-left">
//           <header>
//             <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
//               Your World of Travel, Simplified.
//             </h1>
//             <p className="mt-4 text-lg text-gray-600">
//               Join the all-in-one platform designed to elevate your business.
//               Choose your path below to get started.
//             </p>
//           </header>

//           <ul className="mt-8 space-y-4">
//             <FeatureListItem>
//               <strong>Unified Dashboard:</strong> Manage hotels, tours, and
//               rentals from a single, integrated dashboard.
//             </FeatureListItem>
//             <FeatureListItem>
//               <strong>Real-Time Sync:</strong> Our event-driven architecture
//               prevents double-bookings and keeps you updated instantly.
//             </FeatureListItem>
//             <FeatureListItem>
//               <strong>Reach More Guests:</strong> Connect with travelers at
//               every step of their journey through our integrated network.
//             </FeatureListItem>
//           </ul>
//         </div>

//         {/* Right Column: Selection Options */}
//         <div className="w-full">
//           <div className="space-y-5">
//             <AccountSelectionCard
//               icon={<Building className="h-7 w-7" />}
//               title="I'm a Vendor"
//               description="List and manage your properties, tours, or services on our platform."
//               onClick={goToNextStep}
//               showBadge
//             />
//             <AccountSelectionCard
//               icon={<User className="h-7 w-7" />}
//               title="I just want to book"
//               description="Explore and book hotels, tours, and rides across the country."
//               onClick={handleNormalUserRedirect}
//             />
//             <AccountSelectionCard
//               icon={<Briefcase className="h-7 w-7" />}
//               title="I'm an Agency"
//               description="Manage bookings for your clients through our dedicated agency portal."
//               onClick={handleAgencySelection}
//               disabled
//             />
//           </div>
//         </div>
//       </div>

//       {/* --- NEW: Bottom Informational Section --- */}
//       <div className="flex-shrink-0 mt-auto pt-6 border-t border-gray-200">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
//           <InfoCard
//             icon={<ShieldCheck size={24} />}
//             title="Full Control"
//             description="You control your property, prices, and policies."
//           />
//           <InfoCard
//             icon={<BarChart3 size={24} />}
//             title="In-depth Analytics"
//             description="Understand your business and customers better."
//           />
//           <InfoCard
//             icon={<MessageCircleQuestion size={24} />}
//             title="24/7 Local Support"
//             description="Our team in Dar es Salaam is always here to help."
//           />
//           <InfoCard
//             icon={<DatabaseZap size={24} />}
//             title="Eliminate Double-Bookings"
//             description="Our real-time sync ensures inventory is always accurate."
//           />
//           <InfoCard
//             icon={<Globe size={24} />}
//             title="Global Reach"
//             description="Get discovered by millions of travelers worldwide."
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// src/pages/onboarding/step0_account_option.tsx
import { toast } from "sonner";
import { AccountSelectionCard } from "./account-selection-card";
import { Briefcase, User, CheckCircle } from "lucide-react";
import { useOnboardingStore } from "@/store/onboarding.store";
import { TypeAnimation } from "react-type-animation";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa6";

// --- MODIFIED: InfoCard now uses the CheckCircle icon consistently ---
const InfoCard = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3">
    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
    <span className="text-sm font-medium text-gray-700">{text}</span>
  </div>
);

export const Step0_AccountOption = () => {
  const { goToNextStep } = useOnboardingStore();

  const handleNormalUserRedirect = () => {
    toast.info("Redirecting you to the SafariPro booking site...");
    setTimeout(() => {
      window.location.href = "https://web.safaripro.net/";
    }, 1500);
  };

  const handleAgencySelection = () => {
    toast.info("Agency portal is coming soon!", {
      description: "We're working hard to bring this feature to you.",
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Top Hero Section */}
      <div className="flex-grow p-0 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left Column: Textual Content */}
        <div className="flex flex-col text-left">
          <header>
            <h1 className="text-4xl lg:text-5xl font-extrabold inter tracking-tight text-gray-900 inter">
              Grow Your
              <br />
              <TypeAnimation
                sequence={[
                  "Hotel Business.",
                  2200,
                  "Tour Agency.",
                  2500,
                  "Rental Service.",
                  2000,
                ]}
                wrapper="span"
                speed={50}
                className="text-blue-600"
                repeat={Infinity}
              />
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Join the all-in-one platform designed to elevate your business and
              connect you with a world of travelers. Choose your path to get
              started.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a
                href="#"
                className="flex items-center bg-[#1E2938] text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <FaApple className="w-7 h-7 mr-2" />
                <div>
                  <p className="text-xs">Download on the</p>
                  <p className="text-lg font-semibold">App Store</p>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center bg-[#1E2938] text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <FaGooglePlay className="w-6 h-6 mr-2" />
                <div>
                  <p className="text-xs uppercase">GET IT ON</p>
                  <p className="text-lg font-semibold">Google Play</p>
                </div>
              </a>
            </div>
          </header>
        </div>

        {/* Right Column: Selection Options */}
        <div className="w-full">
          <div className="space-y-5">
            <AccountSelectionCard
              icon={<Briefcase className="h-7 w-7" />}
              title="I'm a Vendor"
              description="List and manage your properties, tours, or services on our platform."
              onClick={goToNextStep}
              showBadge
            />
            <AccountSelectionCard
              icon={<User className="h-7 w-7" />}
              title="I just want to book"
              description="Explore and book hotels, tours, and rides across the country."
              onClick={handleNormalUserRedirect}
            />
            <AccountSelectionCard
              icon={<FaUserTie className="h-7 w-7" />}
              title="I'm an Agency"
              description="Manage bookings for your clients through our dedicated agency portal."
              onClick={handleAgencySelection}
              disabled
            />
          </div>
        </div>
      </div>

      {/* Bottom Informational Section */}
      <div className="flex-shrink-0 mt-auto pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
          <InfoCard text="Full control over your property and prices." />
          <InfoCard text="In-depth analytics to grow your business." />
          <InfoCard text="24/7 support from our team in Dar es Salaam." />
          <InfoCard text="Real-time sync to prevent double-bookings." />
          <InfoCard text="Unified dashboard for all your services." />
          <InfoCard text="Global reach to a world of new guests." />
        </div>
      </div>
    </div>
  );
};

// // src/pages/onboarding/step0_account_option.tsx
// import { toast } from "sonner";
// import { AccountSelectionCard } from "./account-selection-card";
// import { Briefcase, User, CheckCircle } from "lucide-react";
// import { useOnboardingStore } from "@/store/onboarding.store";
// import { TypeAnimation } from "react-type-animation";
// import { FaApple, FaGooglePlay } from "react-icons/fa";
// import { FaUserTie } from "react-icons/fa6";

// // --- MODIFIED: Styling updated for InfoCard ---
// const InfoCard = ({ text }: { text: string }) => (
//   <div className="flex items-center gap-3">
//     <CheckCircle className="h-5 w-5 text-gray-800 flex-shrink-0" />
//     <span className="text-base font-medium text-gray-700 inter">{text}</span>
//   </div>
// );

// export const Step0_AccountOption = () => {
//   const { goToNextStep } = useOnboardingStore();

//   const handleNormalUserRedirect = () => {
//     toast.info("Redirecting you to the SafariPro booking site...");
//     setTimeout(() => {
//       window.location.href = "https://web.safaripro.net/";
//     }, 1500);
//   };

//   const handleAgencySelection = () => {
//     toast.info("Agency portal is coming soon!", {
//       description: "We're working hard to bring this feature to you.",
//     });
//   };

//   return (
//     // --- MODIFIED: Added a subtle background gradient for enhancement ---
//     <div className="flex flex-col h-full justify-between p-4">
//       {/* Top Hero Section */}
//       <div className="flex-grow p-0 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
//         {/* Left Column: Textual Content */}
//         <div className="flex flex-col text-left">
//           <header>
//             <h1 className="text-4xl lg:text-5xl font-extrabold inter tracking-tight text-gray-900">
//               Grow Your
//               <br />
//               <TypeAnimation
//                 sequence={[
//                   "Hotel Business.",
//                   2200,
//                   "Tour Agency.",
//                   2500,
//                   "Rental Service.",
//                   2000,
//                 ]}
//                 wrapper="span"
//                 speed={50}
//                 className="text-blue-600"
//                 repeat={Infinity}
//               />
//             </h1>
//             <p className="mt-4 text-lg text-gray-600">
//               Join the all-in-one platform designed to elevate your business and
//               connect you with a world of travelers. Choose your path to get
//               started.
//             </p>
//             {/* --- MODIFIED: Download button colors updated --- */}
//             <div className="mt-8">
//               <p className="text-sm text-gray-500 mb-3">
//                 For a seamless booking experience on the go, download the
//                 SafariPro app.
//               </p>
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//                 <a
//                   href="#"
//                   className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
//                 >
//                   <FaApple className="w-7 h-7 mr-2" />
//                   <div>
//                     <p className="text-xs">Download on the</p>
//                     <p className="text-lg font-semibold">App Store</p>
//                   </div>
//                 </a>
//                 <a
//                   href="#"
//                   className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
//                 >
//                   <FaGooglePlay className="w-6 h-6 mr-2" />
//                   <div>
//                     <p className="text-xs uppercase">GET IT ON</p>
//                     <p className="text-lg font-semibold">Google Play</p>
//                   </div>
//                 </a>
//               </div>
//             </div>
//           </header>
//         </div>

//         {/* Right Column: Selection Options */}
//         <div className="w-full">
//           <div className="space-y-5">
//             <AccountSelectionCard
//               icon={<Briefcase className="h-7 w-7" />}
//               title="I'm a Vendor"
//               description="List and manage your properties, tours, or services on our platform."
//               onClick={goToNextStep}
//               showBadge
//             />
//             <AccountSelectionCard
//               icon={<User className="h-7 w-7" />}
//               title="I just want to book"
//               description="Explore and book hotels, tours, and rides across the country."
//               onClick={handleNormalUserRedirect}
//             />
//             <AccountSelectionCard
//               icon={<FaUserTie className="h-7 w-7" />}
//               title="I'm an Agency"
//               description="Manage bookings for your clients through our dedicated agency portal."
//               onClick={handleAgencySelection}
//               disabled
//             />
//           </div>
//         </div>
//       </div>

//       {/* Bottom Informational Section */}
//       <div className="flex-shrink-0 mt-auto pt-6 border-t border-gray-200">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
//           <InfoCard text="Full control over your property and prices." />
//           <InfoCard text="In-depth analytics to grow your business." />
//           <InfoCard text="24/7 support from our team in Dar es Salaam." />
//           <InfoCard text="Real-time sync to prevent double-bookings." />
//           <InfoCard text="Unified dashboard for all your services." />
//           <InfoCard text="Global reach to a world of new guests." />
//         </div>
//       </div>
//     </div>
//   );
// };
