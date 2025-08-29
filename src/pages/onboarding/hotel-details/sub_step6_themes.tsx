import React from "react";
import { SubStepNavigation } from "../company-info/sub_step_navigation";
import type { FeatureOption, HotelDetailsSubStepProps } from "../vendor";
import { NotesSummary } from "../notes-summary";
import { StyledCheckboxCardGroup } from "./styled-checkbox-card-group";

interface SubStep6Props extends HotelDetailsSubStepProps {
  themes: FeatureOption[] | undefined;
}

export const SubStep6_Themes: React.FC<SubStep6Props> = ({
  formData,
  handleNext,
  handleBack,
  themes,
  handleCheckboxChange,
}) => {
  return (
    <div className="space-y-8">
      <NotesSummary title="What is the theme of your hotel?">
        <p>
          Help guests find the perfect vibe. Are you a luxury resort, a
          budget-friendly getaway, or a business-oriented hotel?
        </p>
      </NotesSummary>
      <div className="pt-4">
        <StyledCheckboxCardGroup
          title="Hotel Themes"
          items={themes}
          selectedItems={formData.themes}
          onChange={(id) => handleCheckboxChange("themes", id)}
        />
      </div>
      <SubStepNavigation onBack={handleBack} onNext={handleNext} />
    </div>
  );
};
