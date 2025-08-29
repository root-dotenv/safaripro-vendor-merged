// - - - src/pages/onboarding/hotel-details/sub_step4_amenities.tsx

import React from "react";
import { SubStepNavigation } from "../company-info/sub_step_navigation";
import type { FeatureOption, HotelDetailsSubStepProps } from "../vendor";
import { NotesSummary } from "../notes-summary";
import { StyledCheckboxCardGroup } from "./styled-checkbox-card-group";

interface SubStep4Props extends HotelDetailsSubStepProps {
  amenities: FeatureOption[] | undefined;
  facilities: FeatureOption[] | undefined;
}

export const SubStep4_Amenities: React.FC<SubStep4Props> = ({
  formData,
  handleNext,
  handleBack,
  amenities,
  facilities,
  handleCheckboxChange,
}) => {
  return (
    <div className="space-y-8">
      <NotesSummary title="What amenities and facilities do you offer?">
        <p>
          Select all the features available at your property. This is one of the
          most important sections for guests when filtering search results.
        </p>
      </NotesSummary>
      <div className="space-y-6 pt-4">
        <StyledCheckboxCardGroup
          title="Amenities"
          items={amenities}
          selectedItems={formData.amenities}
          onChange={(id) => handleCheckboxChange("amenities", id)}
        />
        <StyledCheckboxCardGroup
          title="Facilities"
          items={facilities}
          selectedItems={formData.facilities}
          onChange={(id) => handleCheckboxChange("facilities", id)}
        />
      </div>
      <SubStepNavigation onBack={handleBack} onNext={handleNext} />
    </div>
  );
};
