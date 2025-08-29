import React from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Mail, AtSign } from "lucide-react";
import { FormField } from "../form-field";
import { SubStepNavigation } from "./sub_step_navigation";
import type { CompanyInfoSubStepProps } from "../vendor";
import { NotesSummary } from "../notes-summary";

export const SubStep2_Address: React.FC<CompanyInfoSubStepProps> = ({
  formData,
  setFormData,
  handleNext,
  handleBack,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isComplete =
    formData.address.trim() !== "" &&
    formData.street.trim() !== "" &&
    formData.ward.trim() !== "" &&
    formData.district.trim() !== "" &&
    formData.city.trim() !== "" &&
    formData.region.trim() !== "";

  return (
    <div className="space-y-8">
      <NotesSummary title="Accurate Location is Key">
        <p>
          A precise address helps guests find your property easily and ensures
          your listing appears correctly in search results for your area.
        </p>
      </NotesSummary>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <FormField
          name="address"
          label="Address Line 1"
          icon={<MapPin size={16} />}
          required
        >
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="e.g. Millennium Towers, Plot 23"
            required
          />
        </FormField>
        <FormField
          name="address_line2"
          label="Address Line 2 (Optional)"
          icon={<MapPin size={16} />}
        >
          <Input
            name="address_line2"
            value={formData.address_line2}
            onChange={handleChange}
            placeholder="Apartment, suite, or floor"
          />
        </FormField>
        <FormField
          name="street"
          label="Street"
          icon={<MapPin size={16} />}
          required
        >
          <Input
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="e.g. Ali Hassan Mwinyi Rd"
            required
          />
        </FormField>
        <FormField
          name="ward"
          label="Ward"
          icon={<MapPin size={16} />}
          required
        >
          <Input
            name="ward"
            value={formData.ward}
            onChange={handleChange}
            placeholder="e.g. Masaki"
            required
          />
        </FormField>
        <FormField
          name="district"
          label="District / Municipality"
          icon={<MapPin size={16} />}
          required
        >
          <Input
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder="e.g. Kinondoni"
            required
          />
        </FormField>
        <FormField
          name="city"
          label="City"
          icon={<MapPin size={16} />}
          required
        >
          <Input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. Dar es Salaam"
            required
          />
        </FormField>
        <FormField
          name="region"
          label="Region"
          icon={<MapPin size={16} />}
          required
        >
          <Input
            name="region"
            value={formData.region}
            onChange={handleChange}
            placeholder="e.g. Dar es Salaam"
            required
          />
        </FormField>
        <FormField
          name="postal_code"
          label="Postal Code"
          icon={<Mail size={16} />}
        >
          <Input
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            placeholder="e.g. 11101"
          />
        </FormField>
        <div className="md:col-span-2">
          <FormField
            name="google_place_id"
            label="Google Place ID (Optional)"
            icon={<AtSign size={16} />}
          >
            <Input
              name="google_place_id"
              value={formData.google_place_id}
              onChange={handleChange}
              placeholder="e.g. ChIJ..."
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
