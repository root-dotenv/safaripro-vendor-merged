// src/pages/onboarding/step1_company-info.tsx
"use client";
import { useState, useEffect } from "react";
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
import { useOnboardingStore } from "@/store/onboarding.store";

const API_BASE_URL = import.meta.env.VITE_VENDOR_BASE_URL;

interface CompanyInfoFormProps {
  onSuccess: (vendorId: string) => void;
  setStepComplete: (isComplete: boolean) => void;
}

export const Step1_CompanyInfo: React.FC<CompanyInfoFormProps> = ({
  onSuccess,
  setStepComplete,
}) => {
  const { goToPreviousStep, serviceType } = useOnboardingStore(); // <-- Get serviceType from store
  const [currentSubStep, setCurrentSubStep] = useState(1);

  // --- MODIFIED: Pre-fill service_type from the store ---
  const [formData, setFormData] = useState<Omit<VendorPayload, "logo">>({
    business_name: "",
    trading_name: "",
    business_description: "",
    service_type: serviceType || "", // Set initial value here
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

  // --- NEW: Effect to update service_type if it changes (e.g., on back navigation) ---
  useEffect(() => {
    if (serviceType) {
      setFormData((prev) => ({ ...prev, service_type: serviceType }));
    }
  }, [serviceType]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
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
            handleBack={goToPreviousStep}
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
    <div className="bg-white p-6 md:p-10 rounded-lg border border-gray-200">
      <header className="mb-8">
        <h1 className="text-2xl font-bold inter text-gray-900">
          Let's start with your {serviceType} company details
        </h1>
        <p className="mt-2 text-gray-600">
          Tell us about your company/business
        </p>
      </header>

      {renderSubStep()}

      {errorMessage && (
        <Alert variant="destructive" className="mt-6 shadow rounded-md">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle className="inter font-medium">
            Form Submission Error
          </AlertTitle>
          <AlertDescription className="capitalize italic">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
