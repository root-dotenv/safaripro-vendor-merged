// src/pages/onboarding/step0_service_selection.tsx
import { useState } from "react";
import { toast } from "sonner";
import { SelectionCard } from "./selection-card";
import { Hotel, Map, Car, Plane, Building2, HelpCircle } from "lucide-react";
import { useOnboardingStore } from "@/store/onboarding.store";
import { Button } from "@/components/ui/button";
import { TbChevronsLeft, TbChevronsRight } from "react-icons/tb";

type ServiceType = "Hotel" | "Tour" | "Cab" | "Car" | "Flight" | "Other";

export const Step0_ServiceSelection = () => {
  const { goToNextStep, goToPreviousStep, setServiceType } =
    useOnboardingStore();
  const [selected, setSelected] = useState<ServiceType | null>(null);

  const handleSelect = (service: ServiceType) => {
    if (service === "Hotel") {
      setSelected(service);
    } else {
      toast.info(`${service} onboarding is coming soon!`, {
        description: "For now, please proceed with hotel setup.",
      });
    }
  };

  const handleContinue = () => {
    if (selected) {
      setServiceType(selected);
      goToNextStep();
    }
  };

  return (
    <div className="flex flex-col">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          What would you like to manage?
        </h1>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          Choose the primary service you want to bring to SafariPro. You can add
          more services later from your dashboard.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectionCard
          icon={<Hotel className="h-6 w-6" />}
          title="Hotel"
          description="Manage your hotel, apartment, or lodge."
          onClick={() => handleSelect("Hotel")}
        />
        <SelectionCard
          icon={<Map className="h-6 w-6" />}
          title="Tour & Travel"
          description="List and manage your tour packages."
          onClick={() => handleSelect("Tour")}
          disabled
          comingSoon
        />
        <SelectionCard
          icon={<Car className="h-6 w-6" />}
          title="Cab Service"
          description="Streamline your city taxi operations."
          onClick={() => handleSelect("Cab")}
          disabled
          comingSoon
        />
        <SelectionCard
          icon={<Plane className="h-6 w-6" />}
          title="Flight Booking"
          description="Integrate your flight booking system."
          onClick={() => handleSelect("Flight")}
          disabled
          comingSoon
        />
        <SelectionCard
          icon={<Building2 className="h-6 w-6" />}
          title="Car Rental"
          description="Manage your car rental fleet."
          onClick={() => handleSelect("Car")}
          disabled
          comingSoon
        />
        <SelectionCard
          icon={<HelpCircle className="h-6 w-6" />}
          title="Other Property"
          description="For other types of properties or services."
          onClick={() => handleSelect("Other")}
          disabled
          comingSoon
        />
      </div>

      <footer className="mt-10 pt-6 border-t flex justify-between items-center">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          className="w-40 text-[1rem] rounded-[6px] font-semibold px-6 py-2.5 bg-white border-[#DADCE0]"
        >
          <TbChevronsLeft className="mr-1 h-5 w-5" /> Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={selected !== "Hotel"}
          className="w-40 text-[1rem] rounded-[6px] font-semibold px-6 py-2.5 bg-[#0081FB] hover:bg-blue-600"
        >
          Continue
          <TbChevronsRight className="ml-1 h-4 w-4" />
        </Button>
      </footer>
    </div>
  );
};
