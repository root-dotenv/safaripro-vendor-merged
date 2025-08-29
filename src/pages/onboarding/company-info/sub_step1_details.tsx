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
import { Briefcase, Mail, Phone, Globe } from "lucide-react";
import { TbFileDescription } from "react-icons/tb";
import { FormField } from "../form-field";
import { SubStepNavigation } from "./sub_step_navigation";
import type { CompanyInfoSubStepProps } from "../vendor";
import { NotesSummary } from "../notes-summary";

export const SubStep1_Details: React.FC<CompanyInfoSubStepProps> = ({
  formData,
  setFormData,
  handleNext,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isComplete =
    formData.business_name.trim() !== "" &&
    formData.service_type.trim() !== "" &&
    formData.business_description.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phone_number.trim() !== "";

  return (
    <div className="space-y-8">
      <NotesSummary title="Why is this information important?">
        <p>
          Providing accurate company details helps us verify your business and
          ensures that your profile on SafariPro is professional and trustworthy
          for travelers.
        </p>
      </NotesSummary>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <FormField
          name="business_name"
          label="Official Business Name"
          icon={<Briefcase size={16} />}
          required
        >
          <Input
            name="business_name"
            value={formData.business_name}
            onChange={handleChange}
            placeholder="e.g. Acme Corporation Ltd."
            required
          />
        </FormField>
        <FormField
          name="trading_name"
          label="Trading Name"
          icon={<Briefcase size={16} />}
        >
          <Input
            name="trading_name"
            value={formData.trading_name}
            onChange={handleChange}
            placeholder="e.g. Acme Hotels"
          />
        </FormField>
        <div className="md:col-span-2">
          <FormField
            name="service_type"
            label="Primary Service Type"
            icon={<Briefcase size={16} />}
            required
          >
            <Select
              name="service_type"
              onValueChange={(value) =>
                handleSelectChange("service_type", value)
              }
              value={formData.service_type}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a service type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Accommodation">
                  Accommodation (Hotels, Apartments)
                </SelectItem>
                <SelectItem value="Tours & Travel">
                  Tours & Travel Agency
                </SelectItem>
                <SelectItem value="Transportation">
                  Transportation Services
                </SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>
        <div className="md:col-span-2">
          <FormField
            name="business_description"
            label="Business Description"
            icon={<TbFileDescription size={16} />}
            required
          >
            <Textarea
              name="business_description"
              value={formData.business_description}
              onChange={handleChange}
              placeholder="Briefly describe your company's primary activities..."
              required
              rows={4}
            />
          </FormField>
        </div>
        <FormField
          name="email"
          label="Business Email"
          icon={<Mail size={16} />}
          required
        >
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="contact@yourcompany.com"
            required
          />
        </FormField>
        <FormField
          name="phone_number"
          label="Business Phone"
          icon={<Phone size={16} />}
          required
        >
          <Input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="+255 123 456 789"
            required
          />
        </FormField>
        <div className="md:col-span-2">
          <FormField name="website" label="Website" icon={<Globe size={16} />}>
            <Input
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://www.yourcompany.com"
            />
          </FormField>
        </div>
      </div>
      <SubStepNavigation onNext={handleNext} isNextDisabled={!isComplete} />
    </div>
  );
};
