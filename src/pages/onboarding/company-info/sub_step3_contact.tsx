// - - - src/pages/onboarding/company-info/sub_step3_contact.tsx

import React from "react";
import { Input } from "@/components/ui/input";
import { User, Briefcase, Mail, Phone } from "lucide-react";
import { FormField } from "../form-field";
import { SubStepNavigation } from "./sub_step_navigation";
import type { CompanyInfoSubStepProps } from "../vendor";
import { NotesSummary } from "../notes-summary";
export const SubStep3_Contact: React.FC<CompanyInfoSubStepProps> = ({
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
    formData.contact_person_name.trim() !== "" &&
    formData.contact_person_title.trim() !== "" &&
    formData.contact_person_email.trim() !== "";

  return (
    <div className="space-y-8">
      <NotesSummary title="Who is our main point of contact?">
        <p>
          This person will be responsible for communications regarding your
          account, bookings, and payments. Please ensure their details are
          current.
        </p>
      </NotesSummary>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <FormField
          name="contact_person_name"
          label="Full Name"
          icon={<User size={16} />}
          required
        >
          <Input
            name="contact_person_name"
            value={formData.contact_person_name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </FormField>
        <FormField
          name="contact_person_title"
          label="Job Title"
          icon={<Briefcase size={16} />}
          required
        >
          <Input
            name="contact_person_title"
            value={formData.contact_person_title}
            onChange={handleChange}
            placeholder="e.g. General Manager"
            required
          />
        </FormField>
        <FormField
          name="contact_person_email"
          label="Email Address"
          icon={<Mail size={16} />}
          required
        >
          <Input
            name="contact_person_email"
            type="email"
            value={formData.contact_person_email}
            onChange={handleChange}
            placeholder="j.doe@yourcompany.com"
            required
          />
        </FormField>
        <FormField
          name="contact_person_phone"
          label="Direct Phone (Optional)"
          icon={<Phone size={16} />}
        >
          <Input
            name="contact_person_phone"
            value={formData.contact_person_phone}
            onChange={handleChange}
            placeholder="+255..."
          />
        </FormField>
      </div>
      <SubStepNavigation
        onBack={handleBack}
        onNext={handleNext}
        isNextDisabled={!isComplete}
      />
    </div>
  );
};
