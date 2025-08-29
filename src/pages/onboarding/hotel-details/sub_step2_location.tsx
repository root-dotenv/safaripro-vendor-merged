// - - - src/pages/onboarding/hotel-details/sub_step2_location.tsx

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Globe } from "lucide-react";
import { FormField } from "../form-field";
import { SubStepNavigation } from "../company-info/sub_step_navigation";
import type { FeatureOption, HotelDetailsSubStepProps } from "../vendor";
import { NotesSummary } from "../notes-summary";

interface SubStep2Props extends HotelDetailsSubStepProps {
  countries: FeatureOption[] | undefined;
}

export const SubStep2_Location: React.FC<SubStep2Props> = ({
  formData,
  setFormData,
  handleNext,
  handleBack,
  countries,
}) => {
  // --- MODIFIED: Added validation for latitude and longitude ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const isNumber = type === "number";

    if (name === "latitude") {
      let lat = parseFloat(value);
      if (lat > 90) lat = 90;
      if (lat < -90) lat = -90;
      setFormData((prev) => ({ ...prev, [name]: isNaN(lat) ? 0 : lat }));
    } else if (name === "longitude") {
      let lon = parseFloat(value);
      if (lon > 180) lon = 180;
      if (lon < -180) lon = -180;
      setFormData((prev) => ({ ...prev, [name]: isNaN(lon) ? 0 : lon }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: isNumber ? parseFloat(value) || 0 : value,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isComplete =
    formData.address.trim() !== "" &&
    formData.country.trim() !== "" &&
    formData.zip_code.trim() !== "" &&
    formData.latitude >= -90 &&
    formData.latitude <= 90 &&
    formData.longitude >= -180 &&
    formData.longitude <= 180;

  return (
    <div className="space-y-8">
      <NotesSummary title="Pinpoint Your Location">
        <p>
          Accurate location details, including geographic coordinates, help
          guests find you and improve your visibility on maps.
        </p>
      </NotesSummary>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        <FormField
          name="address"
          label="Address (Street, City)"
          icon={<MapPin size={16} />}
          required
        >
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="e.g. Mbezi Beach, Dar es Salaam"
            required
          />
        </FormField>
        <FormField
          name="country"
          label="Country"
          icon={<Globe size={16} />}
          required
        >
          <Select
            name="country"
            onValueChange={(v) => handleSelectChange("country", v)}
            value={formData.country}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country..." />
            </SelectTrigger>
            <SelectContent>
              {countries?.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField name="zip_code" label="Postal Code" icon={""} required>
          <Input
            name="zip_code"
            value={formData.zip_code}
            onChange={handleChange}
            placeholder="e.g. 11101"
            required
          />
        </FormField>
        <FormField
          name="latitude"
          label="Latitude (-90 to 90)"
          icon={""}
          required
        >
          {/* --- MODIFIED: Added min/max for browser validation --- */}
          <Input
            name="latitude"
            type="number"
            value={formData.latitude}
            onChange={handleChange}
            step="any"
            placeholder="e.g. -6.802353"
            required
            min="-90"
            max="90"
          />
        </FormField>
        <FormField
          name="longitude"
          label="Longitude (-180 to 180)"
          icon={""}
          required
        >
          {/* --- MODIFIED: Added min/max for browser validation --- */}
          <Input
            name="longitude"
            type="number"
            value={formData.longitude}
            onChange={handleChange}
            step="any"
            placeholder="e.g. 39.279556"
            required
            min="-180"
            max="180"
          />
        </FormField>
        <FormField
          name="distance_from_center_km"
          label="Distance from Center (km)"
          icon={""}
        >
          <Input
            name="distance_from_center_km"
            type="number"
            value={formData.distance_from_center_km}
            onChange={handleChange}
            min="0"
          />
        </FormField>
        <div className="md:col-span-2 lg:col-span-3">
          <FormField
            name="directions"
            label="Directions (Optional)"
            icon={<MapPin size={16} />}
          >
            <Textarea
              name="directions"
              value={formData.directions}
              onChange={handleChange}
              placeholder="Provide detailed directions..."
              rows={4}
            />
          </FormField>
        </div>
      </div>
      <SubStepNavigation
        onBack={handleBack}
        onNext={handleNext}
        isNextDisabled={!isComplete}
      />
    </div>
  );
};
