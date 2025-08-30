// src/pages/onboarding/step0_account_option.tsx
import { toast } from "sonner";
import { SelectionCard } from "./selection-card";
import { Building, Briefcase, User } from "lucide-react";
import { useOnboardingStore } from "@/store/onboarding.store";

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
    <div className="flex flex-col text-center">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to SafariPro!
        </h1>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
          To get started, please tell us what you would like to do. This will
          help us tailor your experience.
        </p>
      </header>
      <div className="space-y-6">
        <SelectionCard
          icon={<Building className="h-6 w-6" />}
          title="I'm a Vendor"
          description="List and manage your properties, tours, or transportation services on our platform."
          onClick={goToNextStep}
        />
        <SelectionCard
          icon={<User className="h-6 w-6" />}
          title="I just want to book"
          description="Explore and book hotels, tours, and rides across the country."
          onClick={handleNormalUserRedirect}
        />
        <SelectionCard
          icon={<Briefcase className="h-6 w-6" />}
          title="I'm an Agency"
          description="Manage bookings for your clients through our dedicated agency portal."
          onClick={handleAgencySelection}
          disabled
          comingSoon
        />
      </div>
    </div>
  );
};
