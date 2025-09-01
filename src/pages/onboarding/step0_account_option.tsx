// src/pages/onboarding/step0_account_option.tsx
import { toast } from "sonner";
import { AccountSelectionCard } from "./account-selection-card";
import { Briefcase, User, CheckCircle } from "lucide-react";
import { useOnboardingStore } from "@/store/onboarding.store";
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
          />
        </div>
      </div>
    </div>
  );
};
