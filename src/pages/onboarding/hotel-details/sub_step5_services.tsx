// - - - src/pages/onboarding/hotel-details/sub_step5_services.tsx

import React from "react";
import { SubStepNavigation } from "../company-info/sub_step_navigation";
import type { FeatureOption, HotelDetailsSubStepProps } from "../vendor";
import { NotesSummary } from "../notes-summary";
import { StyledCheckboxCardGroup } from "./styled-checkbox-card-group";

interface SubStep5Props extends HotelDetailsSubStepProps {
  services: FeatureOption[] | undefined;
  mealTypes: FeatureOption[] | undefined;
}

export const SubStep5_Services: React.FC<SubStep5Props> = ({
  formData,
  handleNext,
  handleBack,
  services,
  mealTypes,
  handleCheckboxChange,
}) => {
  return (
    <div className="space-y-8">
      <NotesSummary title="Services & Meal Plans">
        <p>
          Let guests know about the services you provide and what meal options
          are available, from room service to all-inclusive plans.
        </p>
      </NotesSummary>
      <div className="space-y-6 pt-4">
        <StyledCheckboxCardGroup
          title="Hotel ervices"
          items={services}
          selectedItems={formData.services}
          onChange={(id) => handleCheckboxChange("services", id)}
        />
        <StyledCheckboxCardGroup
          title="Hotel Meal Types"
          items={mealTypes}
          selectedItems={formData.meal_types}
          onChange={(id) => handleCheckboxChange("meal_types", id)}
        />
      </div>
      <SubStepNavigation onBack={handleBack} onNext={handleNext} />
    </div>
  );
};
