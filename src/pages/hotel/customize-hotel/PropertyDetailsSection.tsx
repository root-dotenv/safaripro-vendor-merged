// PropertyDetailsSection.tsx
import React from "react";
import { Building2 } from "lucide-react";
import type { Country, Hotel, HotelType } from "./hotel";
import { AccordionItem, FormField } from "./shared";

interface PropertyDetailsProps {
  isOpen: boolean;
  onToggle: () => void;
  editData: Partial<Hotel>;
  handleFieldChange: (field: keyof Hotel, value: any) => void;
  countries: Country[];
  hotelTypes: HotelType[];
}

const PropertyDetailsSection: React.FC<PropertyDetailsProps> = ({
  isOpen,
  onToggle,
  editData,
  handleFieldChange,
  countries,
  hotelTypes,
}) => (
  <AccordionItem
    title="Property Details"
    icon={Building2}
    isOpen={isOpen}
    onToggle={onToggle}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
      <FormField
        label="Country"
        type="select"
        value={editData.country || ""}
        onChange={(v) => handleFieldChange("country", v)}
        options={countries.map((c) => ({ value: c.id, label: c.name }))}
        placeholder="Select a country"
      />
      <FormField
        label="Hotel Type"
        type="select"
        value={editData.hotel_type || ""}
        onChange={(v) => handleFieldChange("hotel_type", v)}
        options={hotelTypes.map((ht) => ({ value: ht.id, label: ht.name }))}
        placeholder="Select a hotel type"
      />
      <FormField
        label="Address"
        type="text"
        value={editData.address || ""}
        onChange={(v) => handleFieldChange("address", v)}
        placeholder="Enter full address"
      />
      <FormField
        label="Zip Code"
        type="text"
        value={editData.zip_code || ""}
        onChange={(v) => handleFieldChange("zip_code", v)}
        placeholder="Enter zip code"
      />
      <FormField
        label="Latitude"
        type="number"
        value={editData.latitude || ""}
        onChange={(v) => handleFieldChange("latitude", v)}
        placeholder="e.g., -6.7924"
      />
      <FormField
        label="Longitude"
        type="number"
        value={editData.longitude || ""}
        onChange={(v) => handleFieldChange("longitude", v)}
        placeholder="e.g., 39.2083"
      />
      <FormField
        label="Year Built"
        type="number"
        value={editData.year_built || ""}
        onChange={(v) => handleFieldChange("year_built", v)}
        placeholder="e.g., 2020"
      />
      <FormField
        label="Number of Floors"
        type="number"
        value={editData.number_floors || ""}
        onChange={(v) => handleFieldChange("number_floors", v)}
      />
      <FormField
        label="Number of Restaurants"
        type="number"
        value={editData.number_restaurants || ""}
        onChange={(v) => handleFieldChange("number_restaurants", v)}
      />
      <FormField
        label="Number of Bars"
        type="number"
        value={editData.number_bars || ""}
        onChange={(v) => handleFieldChange("number_bars", v)}
      />
      <FormField
        label="Number of Parking Spots"
        type="number"
        value={editData.number_parks || ""}
        onChange={(v) => handleFieldChange("number_parks", v)}
      />
      <FormField
        label="Number of Halls"
        type="number"
        value={editData.number_halls || ""}
        onChange={(v) => handleFieldChange("number_halls", v)}
      />
    </div>
  </AccordionItem>
);

export default PropertyDetailsSection;
