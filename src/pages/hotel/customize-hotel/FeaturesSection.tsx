// FeaturesSection.tsx
import React from "react";
import { Settings } from "lucide-react";
import type {
  Amenity,
  Facility,
  Hotel,
  MealType,
  Service,
  Theme,
  Translation,
  Region,
} from "./hotel";
import { AccordionItem, MultiSelectInput } from "./shared";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FeaturesProps {
  isOpen: boolean;
  onToggle: () => void;
  editData: Partial<Hotel>;
  handleArrayFieldChange: (field: keyof Hotel, value: string[]) => void;
  themes: Theme[];
  mealTypes: MealType[];
  amenities: Amenity[];
  services: Service[];
  facilities: Facility[];
  translations: Translation[];
  regions: Region[];
}

const FeaturesSection: React.FC<FeaturesProps> = ({
  isOpen,
  onToggle,
  editData,
  handleArrayFieldChange,
  themes,
  mealTypes,
  amenities,
  services,
  facilities,
  translations,
  regions,
}) => (
  <AccordionItem
    title="Features & Services"
    icon={Settings}
    isOpen={isOpen}
    onToggle={onToggle}
  >
    <Alert className="my-6" variant={"default"}>
      <AlertTitle>Note!</AlertTitle>
      <AlertDescription>
        Please ensure that you add at least one theme, meal type, amenity,
        service, facility, region, and translation to your hotel. This is
        essential for the proper functioning of the hotel listing.
        <br />
        You can always come back and edit these later.
      </AlertDescription>
    </Alert>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
      <MultiSelectInput
        label="Themes"
        value={editData.themes || []}
        onChange={(v) => handleArrayFieldChange("themes", v)}
        options={themes.map((item) => ({ value: item.id, label: item.name }))}
        placeholder="Add themes..."
      />
      <MultiSelectInput
        label="Meal Types"
        value={editData.meal_types || []}
        onChange={(v) => handleArrayFieldChange("meal_types", v)}
        options={mealTypes.map((item) => ({
          value: item.id,
          label: item.name,
        }))}
        placeholder="Add meal types..."
      />
      <MultiSelectInput
        label="Amenities"
        value={editData.amenities || []}
        onChange={(v) => handleArrayFieldChange("amenities", v)}
        options={amenities.map((item) => ({
          value: item.id,
          label: item.name,
        }))}
        placeholder="Add amenities..."
      />
      <MultiSelectInput
        label="Services"
        value={editData.services || []}
        onChange={(v) => handleArrayFieldChange("services", v)}
        options={services.map((item) => ({ value: item.id, label: item.name }))}
        placeholder="Add services..."
      />
      <MultiSelectInput
        label="Facilities"
        value={editData.facilities || []}
        onChange={(v) => handleArrayFieldChange("facilities", v)}
        options={facilities.map((item) => ({
          value: item.id,
          label: item.name,
        }))}
        placeholder="Add facilities..."
      />
      <MultiSelectInput
        label="Regions"
        value={editData.regions || []}
        onChange={(v) => handleArrayFieldChange("regions", v)}
        options={regions.map((item) => ({ value: item.id, label: item.name }))}
        placeholder="Add regions..."
      />
      <MultiSelectInput
        label="Translations"
        value={editData.translations || []}
        onChange={(v) => handleArrayFieldChange("translations", v)}
        options={translations.map((item) => ({
          value: item.id,
          label: item.language,
        }))}
        placeholder="Add translations..."
      />
    </div>
  </AccordionItem>
);

export default FeaturesSection;
