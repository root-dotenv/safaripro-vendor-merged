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
import { MapPin, Globe, Mail } from "lucide-react";
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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const isNumber = type === "number";
    setFormData((prev) => ({
      ...prev,
      [name]: isNumber ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isComplete =
    formData.address.trim() !== "" &&
    formData.country.trim() !== "" &&
    formData.zip_code.trim() !== "";

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
          label="Address"
          icon={<MapPin size={16} />}
          required
        >
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="e.g., Plot 123, Beach Road"
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
        <FormField
          name="zip_code"
          label="Zip/Postal Code"
          icon={<Mail size={16} />}
          required
        >
          <Input
            name="zip_code"
            value={formData.zip_code}
            onChange={handleChange}
            placeholder="e.g., 11101"
            required
          />
        </FormField>
        <FormField
          name="latitude"
          label="Latitude"
          icon={<MapPin size={16} />}
          required
        >
          <Input
            name="latitude"
            type="number"
            value={formData.latitude}
            onChange={handleChange}
            step="any"
            placeholder="e.g., -6.802353"
            required
          />
        </FormField>
        <FormField
          name="longitude"
          label="Longitude"
          icon={<MapPin size={16} />}
          required
        >
          <Input
            name="longitude"
            type="number"
            value={formData.longitude}
            onChange={handleChange}
            step="any"
            placeholder="e.g., 39.279556"
            required
          />
        </FormField>
        <FormField
          name="distance_from_center_km"
          label="Distance from Center (km)"
          icon={<MapPin size={16} />}
        >
          <Input
            name="distance_from_center_km"
            type="number"
            value={formData.distance_from_center_km}
            onChange={handleChange}
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
