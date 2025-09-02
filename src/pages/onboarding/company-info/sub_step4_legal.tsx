// - - - src/pages/onboarding/company-info/sub_step4_legal.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { ImFolderUpload } from "react-icons/im";
import { FormField } from "../form-field";
import { SubStepNavigation } from "./sub_step_navigation";
import type { CompanyInfoSubStepProps } from "../vendor";
import { NotesSummary } from "../notes-summary";

interface SubStep4Props extends Omit<CompanyInfoSubStepProps, "handleNext"> {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  isPending: boolean;
  previewUrl: string | null;
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
  const currentYear = new Date().getFullYear();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    // --- MODIFIED: Sanitize BREG and TIN inputs to be alphanumeric ---
    if (name === "registration_number" || name === "tax_id") {
      const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: alphanumericValue }));
    } else if (name === "year_established") {
      let year = parseInt(value, 10);
      if (year > currentYear) {
        year = currentYear;
      }
      setFormData((prev) => ({ ...prev, [name]: isNaN(year) ? 0 : year }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? parseInt(value, 10) || 0 : value,
      }));
    }
  };

  // --- MODIFIED: Added specific validation checks for BREG and TIN ---
  const isRegistrationNumberValid =
    formData.registration_number.trim().length >= 4 &&
    formData.registration_number.trim().length <= 15;

  const isTaxIdValid =
    formData.tax_id.trim().length >= 6 && formData.tax_id.trim().length <= 12;

  // --- MODIFIED: Updated the main isComplete check to use the new validation rules ---
  const isComplete =
    isRegistrationNumberValid &&
    isTaxIdValid &&
    formData.business_license.trim() !== "" &&
    formData.year_established > 1800;

  return (
    <div className="space-y-8">
      <NotesSummary title="Final Verification Details">
        <p>
          Your legal information is required for account verification. For best
          results with your logo, use a high-resolution, square image.
        </p>
      </NotesSummary>

      <div className="pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Company Logo (Optional)
        </h3>
        <div className="flex flex-col md:flex-row items-center gap-8 p-6 border border-gray-200 rounded-lg shadow-sm">
          <div className="flex-shrink-0">
            <img
              src={
                previewUrl || "https://placehold.co/1080x1080/9AA1AF/FFFFFF/png"
              }
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
          label="Business Registration Number (BREG)"
          icon={""}
          required
        >
          <Input
            name="registration_number"
            value={formData.registration_number}
            onChange={handleChange}
            placeholder="4-15 Alphanumeric Characters"
            required
            maxLength={15}
          />
        </FormField>
        <FormField
          name="tax_id"
          label="Taxpayer Identification Number (TIN)"
          icon={""}
          required
        >
          <Input
            name="tax_id"
            value={formData.tax_id}
            onChange={handleChange}
            placeholder="6-12 Alphanumeric Characters"
            required
            maxLength={12}
          />
        </FormField>
        <FormField
          name="business_license"
          label="Business License Number"
          icon={""}
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
          icon={""}
          required
        >
          <Input
            name="year_established"
            type="number"
            value={formData.year_established}
            onChange={handleChange}
            placeholder="e.g. 2010"
            required
            min="1800"
            max={currentYear}
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
              min="1"
            />
          </FormField>
        </div>
      </div>
      <SubStepNavigation
        onBack={handleBack}
        isNextDisabled={!isComplete || isPending}
        isFinalStep={true}
        onFinalSubmit={handleSubmit}
        finalSubmitText="Continue"
        isPending={isPending}
      />
    </div>
  );
};
