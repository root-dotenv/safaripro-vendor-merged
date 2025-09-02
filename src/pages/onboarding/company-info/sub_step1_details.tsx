// // src/pages/onboarding/company-info/sub_step1_details.tsx
// import React from "react";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Mail, Phone, Globe } from "lucide-react";
// import { TbFileDescription } from "react-icons/tb";
// import { FormField } from "../form-field";
// import { SubStepNavigation } from "./sub_step_navigation";
// import type { CompanyInfoSubStepProps } from "../vendor";
// import { NotesSummary } from "../notes-summary";

// export const SubStep1_Details: React.FC<CompanyInfoSubStepProps> = ({
//   formData,
//   setFormData,
//   handleNext,
//   handleBack, // <-- Receive the handleBack prop
// }) => {
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;

//     if (name === "phone_number") {
//       let sanitized = value.replace(/[^0-9+]/g, "");
//       if (sanitized.lastIndexOf("+") > 0) {
//         sanitized = sanitized.replace(/\+/g, (match, offset) =>
//           offset === 0 ? "+" : ""
//         );
//       }
//       if (sanitized.length > 13) {
//         sanitized = sanitized.slice(0, 13);
//       }
//       setFormData((prev) => ({ ...prev, [name]: sanitized }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSelectChange = (name: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const isPhoneValid =
//     formData.phone_number.trim().length >= 10 &&
//     formData.phone_number.trim().length <= 13;

//   const isComplete =
//     formData.business_name.trim() !== "" &&
//     formData.service_type.trim() !== "" &&
//     formData.business_description.trim() !== "" &&
//     formData.email.trim() !== "" &&
//     isPhoneValid;

//   return (
//     <div className="space-y-8">
//       <NotesSummary title="Why is this information important?">
//         <p>
//           Providing accurate company details helps us verify your business and
//           ensures that your profile on SafariPro is professional and trustworthy
//           for travelers.
//         </p>
//       </NotesSummary>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
//         <FormField
//           name="business_name"
//           label="Official Business Name"
//           icon={""}
//           required
//         >
//           <Input
//             name="business_name"
//             value={formData.business_name}
//             onChange={handleChange}
//             placeholder="e.g. ABC Internatinal LLC."
//             required
//           />
//         </FormField>
//         <FormField
//           icon={""}
//           name="trading_name"
//           label="Company Trading Name (Optional)"
//         >
//           <Input
//             name="trading_name"
//             value={formData.trading_name}
//             onChange={handleChange}
//             placeholder="e.g. ABC Hotels"
//           />
//         </FormField>
//         <div className="md:col-span-2">
//           {/* --- MODIFIED: The Select component is now disabled --- */}
//           <FormField
//             name="service_type"
//             label="Primary Service Type"
//             icon={""}
//             required
//           >
//             <Select
//               name="service_type"
//               onValueChange={(value) =>
//                 handleSelectChange("service_type", value)
//               }
//               value={formData.service_type}
//               required
//               disabled // This field is now read-only
//             >
//               <SelectTrigger className="bg-gray-100 cursor-not-allowed">
//                 <SelectValue placeholder="Select a service type..." />
//               </SelectTrigger>
//               <SelectContent>
//                 {/* The options are still here to ensure the value is displayed correctly */}
//                 <SelectItem value="Hotel">Hotel / Accommodation</SelectItem>
//                 <SelectItem value="Tour">Tours & Travel Agency</SelectItem>
//                 <SelectItem value="Cab">Cab / Transportation</SelectItem>
//                 <SelectItem value="Other">Other</SelectItem>
//               </SelectContent>
//             </Select>
//           </FormField>
//         </div>
//         <div className="md:col-span-2">
//           <FormField
//             name="business_description"
//             label="Business Description"
//             icon={<TbFileDescription size={16} />}
//             required
//           >
//             <Textarea
//               name="business_description"
//               value={formData.business_description}
//               onChange={handleChange}
//               placeholder="Briefly describe your company's primary activities..."
//               required
//               rows={4}
//             />
//           </FormField>
//         </div>
//         <FormField
//           name="email"
//           label="Business Email (Company Email)"
//           icon={<Mail size={16} />}
//           required
//         >
//           <Input
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="contact@yourcompany.com"
//             required
//           />
//         </FormField>
//         <FormField
//           name="phone_number"
//           label="Business Phone (10-13 characters)"
//           icon={<Phone size={16} />}
//           required
//         >
//           <Input
//             name="phone_number"
//             value={formData.phone_number}
//             onChange={handleChange}
//             placeholder="+255..."
//             required
//             maxLength={13}
//           />
//         </FormField>
//         <div className="md:col-span-2">
//           <FormField
//             name="website"
//             label="Company Website"
//             icon={<Globe size={16} />}
//           >
//             <Input
//               name="website"
//               value={formData.website}
//               onChange={handleChange}
//               placeholder="https://www.yourcompany.com"
//             />
//           </FormField>
//         </div>
//       </div>
//       {/* --- MODIFIED: Pass the onBack handler to the navigation --- */}
//       <SubStepNavigation
//         onBack={handleBack}
//         onNext={handleNext}
//         isNextDisabled={!isComplete}
//       />
//     </div>
//   );
// };

// src/pages/onboarding/company-info/sub_step1_details.tsx
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
import { Mail, Phone, Globe } from "lucide-react";
import { TbFileDescription } from "react-icons/tb";
import { FormField } from "../form-field";
import { SubStepNavigation } from "./sub_step_navigation";
import type { CompanyInfoSubStepProps } from "../vendor";
import { NotesSummary } from "../notes-summary";

export const SubStep1_Details: React.FC<CompanyInfoSubStepProps> = ({
  formData,
  setFormData,
  handleNext,
  handleBack,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phone_number") {
      let sanitized = value.replace(/[^0-9+]/g, "");
      if (sanitized.lastIndexOf("+") > 0) {
        sanitized = sanitized.replace(/\+/g, (match, offset) =>
          offset === 0 ? "+" : ""
        );
      }
      if (sanitized.length > 13) {
        sanitized = sanitized.slice(0, 13);
      }
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isPhoneValid =
    formData.phone_number.trim().length >= 10 &&
    formData.phone_number.trim().length <= 13;

  // MODIFIED: The isComplete logic now considers 'trading_name' to potentially derive from 'business_name'
  const isComplete =
    formData.business_name.trim() !== "" &&
    formData.service_type.trim() !== "" &&
    formData.business_description.trim() !== "" &&
    formData.email.trim() !== "" &&
    isPhoneValid;

  // MODIFIED: Determine the effective trading name for display
  const effectiveTradingName =
    formData.trading_name.trim() !== ""
      ? formData.trading_name
      : formData.business_name;

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
          icon={""}
          required
        >
          <Input
            name="business_name"
            value={formData.business_name}
            onChange={handleChange}
            placeholder="e.g. ABC Internatinal LLC."
            required
          />
        </FormField>
        <FormField
          icon={""}
          name="trading_name"
          label="Company Trading Name (Optional)"
        >
          <Input
            name="trading_name"
            value={formData.trading_name} // Still bind to formData.trading_name for direct input
            onChange={handleChange}
            placeholder={
              formData.business_name.trim() !== ""
                ? `e.g. ${formData.business_name}` // Suggest the business name if available
                : "e.g. ABC Hotels"
            }
          />
        </FormField>
        <div className="md:col-span-2">
          <FormField
            name="service_type"
            label="Primary Service Type"
            icon={""}
            required
          >
            <Select
              name="service_type"
              onValueChange={(value) =>
                handleSelectChange("service_type", value)
              }
              value={formData.service_type}
              required
              disabled
            >
              <SelectTrigger className="bg-gray-100 cursor-not-allowed">
                <SelectValue placeholder="Select a service type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hotel">Hotel / Accommodation</SelectItem>
                <SelectItem value="Tour">Tours & Travel Agency</SelectItem>
                <SelectItem value="Cab">Cab / Transportation</SelectItem>
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
          label="Business Email (Company Email)"
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
          label="Business Phone (10-13 characters)"
          icon={<Phone size={16} />}
          required
        >
          <Input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="+255..."
            required
            maxLength={13}
          />
        </FormField>
        <div className="md:col-span-2">
          <FormField
            name="website"
            label="Company Website"
            icon={<Globe size={16} />}
          >
            <Input
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://www.yourcompany.com"
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
