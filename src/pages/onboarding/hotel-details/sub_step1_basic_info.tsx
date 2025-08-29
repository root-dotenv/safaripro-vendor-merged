// - - - src/pages/onboarding/hotel-details/sub_step1_basic_info.tsx
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
import { Hotel, MapPin, Building, Info } from "lucide-react";
import { FormField } from "../form-field";
import { SubStepNavigation } from "../company-info/sub_step_navigation";
import type { FeatureOption, HotelDetailsSubStepProps } from "../vendor";
import { NotesSummary } from "../notes-summary";

interface SubStep1Props extends HotelDetailsSubStepProps {
  hotelTypes: FeatureOption[] | undefined;
}

export const SubStep1_BasicInfo: React.FC<SubStep1Props> = ({
  formData,
  setFormData,
  handleNext,
  hotelTypes,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const isNumber = type === "number";
    setFormData((prev) => ({
      ...prev,
      [name]: isNumber ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isComplete =
    formData.name.trim() !== "" &&
    formData.code.trim() !== "" &&
    formData.description.trim() !== "" &&
    formData.destination.trim() !== "" &&
    formData.hotel_type.trim() !== "";

  return (
    <div className="space-y-8">
      <NotesSummary title="What defines your hotel?">
        <p>
          These basic details are the first thing guests will see. A compelling
          name and an accurate description are essential for attracting
          bookings.
        </p>
      </NotesSummary>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        <FormField
          name="name"
          label="Hotel Name"
          icon={<Hotel size={16} />}
          required
        >
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. The Grand Palace Hotel"
            required
          />
        </FormField>
        <FormField name="code" label="Hotel Code" icon={""} required>
          <Input
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Internal or unique code"
            required
          />
        </FormField>
        <FormField
          name="destination"
          label="Destination (City)"
          icon={<MapPin size={16} />}
          required
        >
          <Input
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="e.g. Zanzibar"
            required
          />
        </FormField>
        <div className="lg:col-span-2">
          <FormField
            name="hotel_type"
            label="Hotel Type"
            icon={<Building size={16} />}
            required
          >
            <Select
              name="hotel_type"
              onValueChange={(v) => handleSelectChange("hotel_type", v)}
              value={formData.hotel_type}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Hotel type..." />
              </SelectTrigger>
              <SelectContent>
                {hotelTypes?.map((ht) => (
                  <SelectItem key={ht.id} value={ht.id}>
                    {ht.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>
        <FormField
          name="star_rating"
          label="Star Rating (1-5)"
          icon={<Info size={16} />}
          required
        >
          <Input
            name="star_rating"
            type="number"
            value={formData.star_rating}
            onChange={handleChange}
            min="1"
            max="5"
            required
          />
        </FormField>
        <div className="md:col-span-2 lg:col-span-3">
          <FormField
            name="description"
            label="Hotel Description"
            icon={<Info size={16} />}
            required
          >
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="A captivating description of your hotel..."
              required
              rows={4}
            />
          </FormField>
        </div>
      </div>
      <SubStepNavigation onNext={handleNext} isNextDisabled={!isComplete} />
    </div>
  );
};
