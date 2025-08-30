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
      <NotesSummary title="What if I don’t see a facility I offer?">
        <p className="mt-0.5">
          The facilities listed here are the ones most searched for by guests.
          After you complete your registration, you can add more facilities from
          a larger list in the your safaripro dashboard, the platform you'll use
          to manage your property.
        </p>
      </NotesSummary>
      <div className="space-y-6 pt-4">
        <StyledCheckboxCardGroup
          title="Hotel & Room Amenities"
          items={amenities}
          selectedItems={formData.amenities}
          onChange={(id) => handleCheckboxChange("amenities", id)}
        />
        <StyledCheckboxCardGroup
          title="Hotel & Room Facilities"
          items={facilities}
          selectedItems={formData.facilities}
          onChange={(id) => handleCheckboxChange("facilities", id)}
        />
      </div>
      <SubStepNavigation onBack={handleBack} onNext={handleNext} />
    </div>
  );
};
