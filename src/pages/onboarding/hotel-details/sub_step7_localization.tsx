// - - - src/pages/onboarding/hotel-details/sub_step7_localization.tsx
import React from "react";
import { SubStepNavigation } from "../company-info/sub_step_navigation";
import type { FeatureOption, HotelDetailsSubStepProps } from "../vendor";
import { NotesSummary } from "../notes-summary";
import { StyledCheckboxCardGroup } from "./styled-checkbox-card-group";

interface SubStep7Props extends Omit<HotelDetailsSubStepProps, "handleNext"> {
  translations: FeatureOption[] | undefined;
  regions: FeatureOption[] | undefined;
  handleSubmit: () => void;
  isPending: boolean;
}

export const SubStep7_Localization: React.FC<SubStep7Props> = ({
  formData,
  handleBack,
  translations,
  regions,
  handleCheckboxChange,
  handleSubmit,
  isPending,
}) => {
  return (
    <div className="space-y-8">
      <NotesSummary title="Localization and Regions">
        <p>
          Select the languages spoken at your property and the regions you cater
          to. This helps international travelers find and book with confidence.
        </p>
      </NotesSummary>
      <div className="space-y-6 pt-4">
        <StyledCheckboxCardGroup
          title="Languages Spoken (Hotel Translations)"
          items={translations}
          selectedItems={formData.translations}
          onChange={(id) => handleCheckboxChange("translations", id)}
        />
        <StyledCheckboxCardGroup
          title="Regions"
          items={regions}
          selectedItems={formData.regions}
          onChange={(id) => handleCheckboxChange("regions", id)}
        />
      </div>
      {/* --- MODIFIED: Updated button text for consistency --- */}
      <SubStepNavigation
        onBack={handleBack}
        isFinalStep={true}
        onFinalSubmit={handleSubmit}
        finalSubmitText="Continue"
        isPending={isPending}
        isNextDisabled={isPending}
      />
    </div>
  );
};
