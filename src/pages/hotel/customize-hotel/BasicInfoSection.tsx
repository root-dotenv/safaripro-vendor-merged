// // BasicInfoSection.tsx
// import React from "react";
// import { Info } from "lucide-react";
// import type { Hotel } from "./hotel";
// import { AccordionItem, FormField } from "./shared";

// interface BasicInfoProps {
//   isOpen: boolean;
//   onToggle: () => void;
//   editData: Partial<Hotel>;
//   handleFieldChange: (field: keyof Hotel, value: any) => void;
// }

// const BasicInfoSection: React.FC<BasicInfoProps> = ({
//   isOpen,
//   onToggle,
//   editData,
//   handleFieldChange,
// }) => (
//   <AccordionItem
//     title="Basic Information"
//     icon={Info}
//     isOpen={isOpen}
//     onToggle={onToggle}
//   >
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
//       <FormField
//         label="Hotel Name"
//         value={editData.name || ""}
//         onChange={(v) => handleFieldChange("name", v)}
//         placeholder="Enter hotel name"
//       />
//       <FormField
//         label="Star Rating"
//         type="number"
//         value={editData.star_rating || ""}
//         onChange={(v) => handleFieldChange("star_rating", v)}
//         placeholder="e.g., 5"
//       />
//     </div>
//     <FormField
//       label="Description (At least 100 characters)"
//       type="textarea"
//       value={editData.description || ""}
//       onChange={(v) => handleFieldChange("description", v)}
//       placeholder="Enter a description for the hotel (At least 100 characters)"
//     />
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
//       <FormField
//         label="Check-in From"
//         type="text"
//         value={editData.check_in_from || ""}
//         onChange={(v) => handleFieldChange("check_in_from", v)}
//         placeholder="e.g., 14:00"
//       />
//       <FormField
//         label="Check-out Until"
//         type="text"
//         value={editData.check_out_to || ""}
//         onChange={(v) => handleFieldChange("check_out_to", v)}
//         placeholder="e.g., 11:00"
//       />
//     </div>
//   </AccordionItem>
// );

// export default BasicInfoSection;

// src/pages/hotel/customize-hotel/BasicInfoSection.tsx
import React from "react";
import { Info } from "lucide-react";
import type { Hotel } from "./hotel";
import { AccordionItem, FormField } from "./shared";
import { TimePicker } from "@/components/custom/time-picker";

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
}) => {
  // 2. Add validation logic for star rating
  const handleRatingChange = (value: string) => {
    let numValue = parseInt(value, 10);
    if (isNaN(numValue)) {
      numValue = 0;
    }
    // Enforce the 1-5 star range
    if (numValue > 5) numValue = 5;
    if (numValue < 1) numValue = 1;
    handleFieldChange("star_rating", numValue);
  };

  return (
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
          label="Hotel Star Rating (1-5)"
          type="number"
          value={editData.star_rating || ""}
          onChange={handleRatingChange} // Use the new handler
          placeholder="e.g., 5"
        />
      </div>
      <FormField
        label="Hotel Description (At least 100 characters)"
        type="textarea"
        value={editData.description || ""}
        onChange={(v) => handleFieldChange("description", v)}
        placeholder="Enter a description for the hotel"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mt-4">
        {/* 3. Replace text inputs with the TimePicker component */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-in From (Hours:Minutes)
          </label>
          <TimePicker
            value={editData.check_in_from || "06:00"}
            onChange={(v) => handleFieldChange("check_in_from", v)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-out Until (Hours:Minutes)
          </label>
          <TimePicker
            value={editData.check_out_to || "11:00"}
            onChange={(v) => handleFieldChange("check_out_to", v)}
          />
        </div>
      </div>
    </AccordionItem>
  );
};

export default BasicInfoSection;
