import React from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  BedDouble,
  Building,
  Utensils,
  Wine,
  Users,
  ParkingCircle,
  Clock,
} from "lucide-react";
import { FormField } from "../form-field";
import { SubStepNavigation } from "../company-info/sub_step_navigation";
import type { FeatureOption, HotelDetailsSubStepProps } from "../vendor";
import { NotesSummary } from "../notes-summary";
import { StyledCheckboxCardGroup } from "./styled-checkbox-card-group";

interface SubStep3Props extends HotelDetailsSubStepProps {
  roomTypes: FeatureOption[] | undefined;
}

export const SubStep3_Property: React.FC<SubStep3Props> = ({
  formData,
  setFormData,
  handleNext,
  handleBack,
  roomTypes,
  handleCheckboxChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === "number";
    setFormData((prev) => ({
      ...prev,
      [name]: isNumber ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleToggle = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const isComplete = formData.year_built > 1800 && formData.number_rooms > 0;

  return (
    <div className="space-y-8">
      <NotesSummary title="Tell us about your property">
        <p>
          These details about your hotel's structure and room offerings are
          essential for guests to understand the scale and type of your
          property.
        </p>
      </NotesSummary>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        <FormField
          name="year_built"
          label="Year Built"
          icon={<Calendar size={16} />}
          required
        >
          <Input
            name="year_built"
            type="number"
            value={formData.year_built}
            onChange={handleChange}
            placeholder="e.g., 2015"
            required
          />
        </FormField>
        <FormField
          name="number_rooms"
          label="Number of Rooms"
          icon={<BedDouble size={16} />}
          required
        >
          <Input
            name="number_rooms"
            type="number"
            value={formData.number_rooms}
            onChange={handleChange}
            required
          />
        </FormField>
        <FormField
          name="number_floors"
          label="Number of Floors"
          icon={<Building size={16} />}
        >
          <Input
            name="number_floors"
            type="number"
            value={formData.number_floors}
            onChange={handleChange}
          />
        </FormField>
        <FormField
          name="number_restaurants"
          label="Number of Restaurants"
          icon={<Utensils size={16} />}
        >
          <Input
            name="number_restaurants"
            type="number"
            value={formData.number_restaurants}
            onChange={handleChange}
          />
        </FormField>
        <FormField
          name="number_bars"
          label="Number of Bars"
          icon={<Wine size={16} />}
        >
          <Input
            name="number_bars"
            type="number"
            value={formData.number_bars}
            onChange={handleChange}
          />
        </FormField>
        <FormField
          name="number_halls"
          label="Number of Halls"
          icon={<Users size={16} />}
        >
          <Input
            name="number_halls"
            type="number"
            value={formData.number_halls}
            onChange={handleChange}
          />
        </FormField>
        <FormField
          name="number_parks"
          label="Parking Spaces"
          icon={<ParkingCircle size={16} />}
        >
          <Input
            name="number_parks"
            type="number"
            value={formData.number_parks}
            onChange={handleChange}
          />
        </FormField>
        <FormField
          name="check_in_from"
          label="Check-in From"
          icon={<Clock size={16} />}
          required
        >
          <Input
            name="check_in_from"
            value={formData.check_in_from}
            onChange={handleChange}
            type="time"
            required
          />
        </FormField>
        <FormField
          name="check_out_to"
          label="Check-out To"
          icon={<Clock size={16} />}
          required
        >
          <Input
            name="check_out_to"
            value={formData.check_out_to}
            onChange={handleChange}
            type="time"
            required
          />
        </FormField>
        <div className="flex items-center pt-8">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_eco_certified"
              checked={formData.is_eco_certified}
              onCheckedChange={(c) =>
                handleToggle("is_eco_certified", c as boolean)
              }
            />
            <Label
              htmlFor="is_eco_certified"
              className="font-medium cursor-pointer"
            >
              Is Eco Certified?
            </Label>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <StyledCheckboxCardGroup
          title="Room Types"
          items={roomTypes}
          selectedItems={formData.room_type}
          onChange={(id) => handleCheckboxChange("room_type", id)}
        />
      </div>

      <SubStepNavigation
        onBack={handleBack}
        onNext={handleNext}
        isNextDisabled={!isComplete}
      />
    </div>
  );
};
