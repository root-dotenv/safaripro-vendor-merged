// - - - src/pages/onboarding/step1_company-info.tsx
"use client";
import { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import type { CreatedVendor, VendorPayload } from "./vendor";
import { SubStep1_Details } from "./company-info/sub_step1_details";
import { SubStep2_Address } from "./company-info/sub_step2_address";
import { SubStep3_Contact } from "./company-info/sub_step3_contact";
import { SubStep4_Legal } from "./company-info/sub_step4_legal";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_VENDOR_BASE_URL;

interface CompanyInfoFormProps {
  onSuccess: (vendorId: string) => void;
  setStepComplete: (isComplete: boolean) => void;
}

export const Step1_CompanyInfo: React.FC<CompanyInfoFormProps> = ({
  onSuccess,
  setStepComplete,
}) => {
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [formData, setFormData] = useState<Omit<VendorPayload, "logo">>({
    business_name: "",
    trading_name: "",
    business_description: "",
    service_type: "",
    phone_number: "",
    alternative_phone: "",
    email: "",
    contact_person_name: "",
    contact_person_title: "",
    contact_person_email: "",
    contact_person_phone: "",
    website: "",
    address: "",
    address_line2: "",
    street: "",
    ward: "",
    district: "",
    city: "",
    region: "",
    country: "Tanzania",
    postal_code: "",
    google_place_id: "",
    registration_number: "",
    tax_id: "",
    business_license: "",
    year_established: new Date().getFullYear(),
    number_of_employees: 1,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const mutation = useMutation({
    mutationFn: (vendorFormData: FormData) =>
      axios.post<CreatedVendor>(`${API_BASE_URL}vendors`, vendorFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: (response) => {
      onSuccess(response.data.id);
      setStepComplete(true);
    },
    onError: (error: any) => {
      const serverError = error.response?.data;
      let errorMsg =
        "An unknown error occurred. Please check the form and try again.";
      if (typeof serverError === "object" && serverError !== null) {
        errorMsg = Object.entries(serverError)
          .map(([key, value]) => `${key}: ${(value as string[]).join(", ")}`)
          .join("; ");
      }
      setErrorMessage(errorMsg);
    },
  });

  // --- MODIFIED: This function now handles both the file and its preview ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic validation
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File size cannot exceed 5MB.");
        return;
      }
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setLogoFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = () => {
    setErrorMessage("");
    const submissionFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        submissionFormData.append(key, String(value));
      }
    });
    if (logoFile) {
      submissionFormData.append("logo", logoFile);
    }
    mutation.mutate(submissionFormData);
  };

  const handleNextSubStep = () => setCurrentSubStep((prev) => prev + 1);
  const handlePrevSubStep = () => setCurrentSubStep((prev) => prev - 1);

  const renderSubStep = () => {
    switch (currentSubStep) {
      case 1:
        return (
          <SubStep1_Details
            formData={formData}
            setFormData={setFormData}
            handleNext={handleNextSubStep}
            handleBack={() => {}}
          />
        );
      case 2:
        return (
          <SubStep2_Address
            formData={formData}
            setFormData={setFormData}
            handleNext={handleNextSubStep}
            handleBack={handlePrevSubStep}
          />
        );
      case 3:
        return (
          <SubStep3_Contact
            formData={formData}
            setFormData={setFormData}
            handleNext={handleNextSubStep}
            handleBack={handlePrevSubStep}
          />
        );
      case 4:
        return (
          <SubStep4_Legal
            formData={formData}
            setFormData={setFormData}
            handleBack={handlePrevSubStep}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            isPending={mutation.isPending}
            previewUrl={previewUrl}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Company Information
        </h1>
        <p className="mt-2 text-gray-600">
          Step {currentSubStep} of 4: Let's start with the basics about your
          business.
        </p>
      </header>

      {renderSubStep()}

      {errorMessage && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Submission Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
