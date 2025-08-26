// // PropertyDetailsSection.tsx
// import React from "react";
// import { Building2 } from "lucide-react";
// import type { Country, Hotel, HotelType } from "./hotel";
// import { AccordionItem, FormField } from "./shared";

// interface PropertyDetailsProps {
//   isOpen: boolean;
//   onToggle: () => void;
//   editData: Partial<Hotel>;
//   handleFieldChange: (field: keyof Hotel, value: any) => void;
//   countries: Country[];
//   hotelTypes: HotelType[];
// }

// const PropertyDetailsSection: React.FC<PropertyDetailsProps> = ({
//   isOpen,
//   onToggle,
//   editData,
//   handleFieldChange,
//   countries,
//   hotelTypes,
// }) => (
//   <AccordionItem
//     title="Property Details"
//     icon={Building2}
//     isOpen={isOpen}
//     onToggle={onToggle}
//   >
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
//       <FormField
//         label="Country"
//         type="select"
//         value={editData.country || ""}
//         onChange={(v) => handleFieldChange("country", v)}
//         options={countries.map((c) => ({ value: c.id, label: c.name }))}
//         placeholder="Select a country"
//       />
//       <FormField
//         label="Hotel Type"
//         type="select"
//         value={editData.hotel_type || ""}
//         onChange={(v) => handleFieldChange("hotel_type", v)}
//         options={hotelTypes.map((ht) => ({ value: ht.id, label: ht.name }))}
//         placeholder="Select a hotel type"
//       />
//       <FormField
//         label="Address"
//         type="text"
//         value={editData.address || ""}
//         onChange={(v) => handleFieldChange("address", v)}
//         placeholder="Enter full address"
//       />
//       <FormField
//         label="Zip Code"
//         type="text"
//         value={editData.zip_code || ""}
//         onChange={(v) => handleFieldChange("zip_code", v)}
//         placeholder="Enter zip code"
//       />
//       <FormField
//         label="Latitude"
//         type="number"
//         value={editData.latitude || ""}
//         onChange={(v) => handleFieldChange("latitude", v)}
//         placeholder="e.g., -6.7924"
//       />
//       <FormField
//         label="Longitude"
//         type="number"
//         value={editData.longitude || ""}
//         onChange={(v) => handleFieldChange("longitude", v)}
//         placeholder="e.g., 39.2083"
//       />
//       <FormField
//         label="Year Built"
//         type="number"
//         value={editData.year_built || ""}
//         onChange={(v) => handleFieldChange("year_built", v)}
//         placeholder="e.g., 2020"
//       />
//       <FormField
//         label="Number of Floors"
//         type="number"
//         value={editData.number_floors || ""}
//         onChange={(v) => handleFieldChange("number_floors", v)}
//       />
//       <FormField
//         label="Number of Restaurants"
//         type="number"
//         value={editData.number_restaurants || ""}
//         onChange={(v) => handleFieldChange("number_restaurants", v)}
//       />
//       <FormField
//         label="Number of Bars"
//         type="number"
//         value={editData.number_bars || ""}
//         onChange={(v) => handleFieldChange("number_bars", v)}
//       />
//       <FormField
//         label="Number of Parking Spots"
//         type="number"
//         value={editData.number_parks || ""}
//         onChange={(v) => handleFieldChange("number_parks", v)}
//       />
//       <FormField
//         label="Number of Halls"
//         type="number"
//         value={editData.number_halls || ""}
//         onChange={(v) => handleFieldChange("number_halls", v)}
//       />
//     </div>
//   </AccordionItem>
// );

// export default PropertyDetailsSection;

// src/pages/hotel/customize-hotel/PropertyDetailsSection.tsx

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
}) => {
  // --- VALIDATION HANDLERS ---

  // 1. Validate Year Built
  const handleYearChange = (value: string) => {
    const currentYear = new Date().getFullYear();
    let year = parseInt(value, 10);

    if (isNaN(year)) {
      handleFieldChange("year_built", ""); // Allow clearing the field
      return;
    }
    // Cap the year at the current year
    if (year > currentYear) {
      year = currentYear;
    }
    handleFieldChange("year_built", year);
  };

  // 2. Validate Latitude
  const handleLatitudeChange = (value: string) => {
    let lat = parseFloat(value);
    if (isNaN(lat)) {
      handleFieldChange("latitude", "");
      return;
    }
    // Enforce -90 to 90 range
    if (lat > 90) lat = 90;
    if (lat < -90) lat = -90;
    handleFieldChange("latitude", lat);
  };

  // 3. Validate Longitude
  const handleLongitudeChange = (value: string) => {
    let lon = parseFloat(value);
    if (isNaN(lon)) {
      handleFieldChange("longitude", "");
      return;
    }
    // Enforce -180 to 180 range
    if (lon > 180) lon = 180;
    if (lon < -180) lon = -180;
    handleFieldChange("longitude", lon);
  };

  return (
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
          label="Address (Street, City)"
          type="text"
          value={editData.address || ""}
          onChange={(v) => handleFieldChange("address", v)}
          placeholder="Enter full address"
        />
        <FormField
          label="Postal Code"
          type="text"
          value={editData.zip_code || ""}
          onChange={(v) => handleFieldChange("zip_code", v)}
          placeholder="Enter zip code"
        />
        <FormField
          label="Latitude (-90 to 90)"
          type="number"
          value={editData.latitude || ""}
          onChange={handleLatitudeChange} // Use new handler
          placeholder="e.g., -6.7924"
        />
        <FormField
          label="Longitude (-180 to 180)"
          type="number"
          value={editData.longitude || ""}
          onChange={handleLongitudeChange} // Use new handler
          placeholder="e.g., 39.2083"
        />
        <FormField
          label="Year Built"
          type="number"
          value={editData.year_built || ""}
          onChange={handleYearChange} // Use new handler
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
};

export default PropertyDetailsSection;
