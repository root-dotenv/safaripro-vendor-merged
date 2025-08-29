import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image as Hash, Calendar, Users } from "lucide-react";
import { ImFolderUpload } from "react-icons/im";
import { FormField } from "../form-field";
import { SubStepNavigation } from "./sub_step_navigation";
import type { CompanyInfoSubStepProps } from "../vendor";
import { NotesSummary } from "../notes-summary";

interface SubStep4Props extends CompanyInfoSubStepProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  isPending: boolean;
  previewUrl: string | null; // <-- Accept the preview URL
}

export const SubStep4_Legal: React.FC<SubStep4Props> = ({
  formData,
  setFormData,
  handleBack,
  handleFileChange,
  handleSubmit,
  isPending,
  previewUrl,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const isComplete =
    formData.registration_number.trim() !== "" &&
    formData.tax_id.trim() !== "" &&
    formData.business_license.trim() !== "";

  return (
    <div className="space-y-8">
      <NotesSummary title="Final Verification Details">
        <p>
          Your legal information is required for account verification. For best
          results with your logo, use a high-resolution, square image.
        </p>
      </NotesSummary>

      {/* --- MODIFIED: Updated layout for Logo Upload --- */}
      <div className="pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Company Logo
        </h3>
        <div className="flex flex-col md:flex-row items-center gap-8 p-6 border border-gray-200 rounded-lg shadow-sm">
          <div className="flex-shrink-0">
            <img
              src={previewUrl || "https://via.placeholder.com/128"}
              alt="Company Logo Preview"
              className="h-32 w-32 rounded-full object-cover border-4 border-gray-100 bg-gray-100"
            />
          </div>
          <div className="w-full space-y-4 text-center md:text-left">
            <Label
              htmlFor="logo-upload"
              className="cursor-pointer block w-full p-6 rounded-md border border-gray-200 hover:border-blue-500 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <ImFolderUpload className="h-8 w-8 text-gray-400" />
                <span className="font-medium text-gray-700">
                  Click to upload or drag & drop
                </span>
                <p className="text-xs text-gray-500">PNG or JPG (max. 5MB)</p>
              </div>
            </Label>
            <Input
              id="logo-upload"
              name="logo"
              type="file"
              onChange={handleFileChange}
              accept=".jpg, .jpeg, .png"
              className="hidden"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <h3 className="md:col-span-2 text-lg font-semibold text-gray-800 -mb-2">
          Legal & Financial
        </h3>
        <FormField
          name="registration_number"
          label="Business Registration Number"
          icon={<Hash size={16} />}
          required
        >
          <Input
            name="registration_number"
            value={formData.registration_number}
            onChange={handleChange}
            placeholder="e.g. Z2023/12345"
            required
          />
        </FormField>
        <FormField
          name="tax_id"
          label="Tax ID (TIN)"
          icon={<Hash size={16} />}
          required
        >
          <Input
            name="tax_id"
            value={formData.tax_id}
            onChange={handleChange}
            placeholder="e.g. 100-200-300"
            required
          />
        </FormField>
        <FormField
          name="business_license"
          label="Business License Number"
          icon={<Hash size={16} />}
          required
        >
          <Input
            name="business_license"
            value={formData.business_license}
            onChange={handleChange}
            placeholder="e.g. B-12345678"
            required
          />
        </FormField>
        <FormField
          name="year_established"
          label="Year Established"
          icon={<Calendar size={16} />}
          required
        >
          <Input
            name="year_established"
            type="number"
            value={formData.year_established}
            onChange={handleChange}
            placeholder="e.g. 2010"
            required
          />
        </FormField>
        <div className="md:col-span-2">
          <FormField
            name="number_of_employees"
            label="Number of Employees"
            icon={<Users size={16} />}
            required
          >
            <Input
              name="number_of_employees"
              type="number"
              value={formData.number_of_employees}
              onChange={handleChange}
              placeholder="e.g. 25"
              required
            />
          </FormField>
        </div>
      </div>
      <SubStepNavigation
        onBack={handleBack}
        isNextDisabled={!isComplete || isPending}
        isFinalStep={true}
        onFinalSubmit={handleSubmit}
        finalSubmitText="Create Company Profile"
        isPending={isPending}
      />
    </div>
  );
};
