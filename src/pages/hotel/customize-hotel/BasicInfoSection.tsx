// BasicInfoSection.tsx
import React from "react";
import { Info } from "lucide-react";
import type { Hotel } from "./hotel";
import { AccordionItem, FormField } from "./shared";

interface BasicInfoProps {
  isOpen: boolean;
  onToggle: () => void;
  editData: Partial<Hotel>;
  handleFieldChange: (field: keyof Hotel, value: any) => void;
}

const BasicInfoSection: React.FC<BasicInfoProps> = ({
  isOpen,
  onToggle,
  editData,
  handleFieldChange,
}) => (
  <AccordionItem
    title="Basic Information"
    icon={Info}
    isOpen={isOpen}
    onToggle={onToggle}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
      <FormField
        label="Hotel Name"
        value={editData.name || ""}
        onChange={(v) => handleFieldChange("name", v)}
        placeholder="Enter hotel name"
      />
      <FormField
        label="Star Rating"
        type="number"
        value={editData.star_rating || ""}
        onChange={(v) => handleFieldChange("star_rating", v)}
        placeholder="e.g., 5"
      />
    </div>
    <FormField
      label="Description (At least 100 characters)"
      type="textarea"
      value={editData.description || ""}
      onChange={(v) => handleFieldChange("description", v)}
      placeholder="Enter a description for the hotel (At least 100 characters)"
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
      <FormField
        label="Check-in From"
        type="text"
        value={editData.check_in_from || ""}
        onChange={(v) => handleFieldChange("check_in_from", v)}
        placeholder="e.g., 14:00"
      />
      <FormField
        label="Check-out Until"
        type="text"
        value={editData.check_out_to || ""}
        onChange={(v) => handleFieldChange("check_out_to", v)}
        placeholder="e.g., 11:00"
      />
    </div>
  </AccordionItem>
);

export default BasicInfoSection;
