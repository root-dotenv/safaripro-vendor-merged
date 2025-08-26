// src/pages/hotel/customize-hotel/OtherPropertiesSection.tsx

import React from "react";
import { Link } from "lucide-react";
import type { Hotel } from "./hotel";
import { AccordionItem, FormField } from "./shared";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// A standard list of timezones for the dropdown
const timezones = [
  "UTC-12:00",
  "UTC-11:00",
  "UTC-10:00",
  "UTC-09:00",
  "UTC-08:00",
  "UTC-07:00",
  "UTC-06:00",
  "UTC-05:00",
  "UTC-04:00",
  "UTC-03:00",
  "UTC-02:00",
  "UTC-01:00",
  "UTC+00:00",
  "UTC+01:00",
  "UTC+02:00",
  "UTC+03:00",
  "UTC+04:00",
  "UTC+05:00",
  "UTC+06:00",
  "UTC+07:00",
  "UTC+08:00",
  "UTC+09:00",
  "UTC+10:00",
  "UTC+11:00",
  "UTC+12:00",
];

const rateOptions = [
  { value: "Full Payment", label: "Full Payment" },
  { value: "Deposit", label: "Deposit" },
  { value: "Partial Payment", label: "Partial Payment" },
  { value: "Free Cancellation", label: "Free Cancellation" },
  { value: "Non Refundable", label: "Non Refundable" },
  { value: "Pay at Hotel", label: "Pay at Hotel" },
  { value: "Gift Card", label: "Gift Card" },
];

interface OtherProps {
  isOpen: boolean;
  onToggle: () => void;
  editData: Partial<Hotel>;
  handleFieldChange: (field: keyof Hotel, value: any) => void;
}

const OtherPropertiesSection: React.FC<OtherProps> = ({
  isOpen,
  onToggle,
  editData,
  handleFieldChange,
}) => (
  <AccordionItem
    title="Other Properties"
    icon={Link}
    isOpen={isOpen}
    onToggle={onToggle}
  >
    {/* Social & Website Links */}
    <h4 className="text-md font-semibold text-gray-800 mb-3 mt-2">
      Social & Website Links
    </h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
      <FormField
        label="Website URL"
        value={editData.website_url || ""}
        onChange={(v) => handleFieldChange("website_url", v)}
        placeholder="https://example.com"
      />
      <FormField
        label="Facebook URL"
        value={editData.facebook_url || ""}
        onChange={(v) => handleFieldChange("facebook_url", v)}
        placeholder="https://facebook.com/yourhotel"
      />
      <FormField
        label="Instagram URL"
        value={editData.instagram_url || ""}
        onChange={(v) => handleFieldChange("instagram_url", v)}
        placeholder="https://instagram.com/yourhotel"
      />
      <FormField
        label="Twitter URL"
        value={editData.twitter_url || ""}
        onChange={(v) => handleFieldChange("twitter_url", v)}
        placeholder="https://twitter.com/yourhotel"
      />
    </div>

    {/* Financials & Location Details */}
    <h4 className="text-md font-semibold text-gray-800 mb-3 mt-6">
      Financials & Location
    </h4>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
      <FormField
        label="Current Discount (%)"
        type="number"
        value={editData.discount || ""}
        onChange={(v) => handleFieldChange("discount", v)}
        placeholder="e.g., 10"
      />
      <FormField
        label="Max Discount (%)"
        type="number"
        value={editData.max_discount_percent || ""}
        onChange={(v) => handleFieldChange("max_discount_percent", v)}
        placeholder="e.g., 50"
      />
      <FormField
        label="Distance from Center (km)"
        type="number"
        value={editData.distance_from_center_km || ""}
        onChange={(v) => handleFieldChange("distance_from_center_km", v)}
        placeholder="e.g., 5.5"
      />
    </div>

    {/* Options and Settings */}
    <h4 className="text-md font-semibold text-gray-800 mb-3 mt-6">
      Options & Settings
    </h4>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 items-start">
      <FormField
        label="Rate Options"
        type="select"
        value={editData.rate_options || ""}
        onChange={(v) => handleFieldChange("rate_options", v)}
        options={rateOptions}
        placeholder="Select a rate option"
      />
      <FormField
        label="Timezone"
        type="select"
        value={editData.timezone || ""}
        onChange={(v) => handleFieldChange("timezone", v)}
        options={timezones.map((tz) => ({ value: tz, label: tz }))}
        placeholder="Select a timezone"
      />

      {/* Switch for Eco Certified */}
      <div className="flex flex-col space-y-3 pt-2">
        <Label
          htmlFor="is_eco_certified"
          className="text-sm font-medium text-gray-700"
        >
          Eco Certified Status
        </Label>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_eco_certified"
            checked={!!editData.is_eco_certified}
            onCheckedChange={(isChecked) =>
              handleFieldChange("is_eco_certified", isChecked)
            }
          />
          <Label htmlFor="is_eco_certified">
            {editData.is_eco_certified ? "Certified" : "Not Certified"}
          </Label>
        </div>
      </div>
    </div>
  </AccordionItem>
);

export default OtherPropertiesSection;
