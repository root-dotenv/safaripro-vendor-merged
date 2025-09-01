// src/pages/onboarding/step2_upload-document.tsx
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  UploadCloud,
  Loader,
  AlertCircleIcon,
  FileCheck2,
  FileText,
  Calendar,
  Eye,
  Check,
  ChevronsUpDown,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FormField } from "./form-field";
import type { DocumentType, VendorDetails, VendorDocument } from "./vendor";
import { NotesSummary } from "./notes-summary";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TbProgressCheck } from "react-icons/tb";

const API_BASE_URL = import.meta.env.VITE_VENDOR_BASE_URL;

// Comprehensive list of countries
const countries = [
  { value: "AF", label: "Afghanistan" },
  { value: "AL", label: "Albania" },
  { value: "DZ", label: "Algeria" },
  { value: "AS", label: "American Samoa" },
  { value: "AD", label: "Andorra" },
  { value: "AO", label: "Angola" },
  { value: "AI", label: "Anguilla" },
  { value: "AQ", label: "Antarctica" },
  { value: "AG", label: "Antigua and Barbuda" },
  { value: "AR", label: "Argentina" },
  { value: "AM", label: "Armenia" },
  { value: "AW", label: "Aruba" },
  { value: "AU", label: "Australia" },
  { value: "AT", label: "Austria" },
  { value: "AZ", label: "Azerbaijan" },
  { value: "BS", label: "Bahamas" },
  { value: "BH", label: "Bahrain" },
  { value: "BD", label: "Bangladesh" },
  { value: "BB", label: "Barbados" },
  { value: "BY", label: "Belarus" },
  { value: "BE", label: "Belgium" },
  { value: "BZ", label: "Belize" },
  { value: "BJ", label: "Benin" },
  { value: "BM", label: "Bermuda" },
  { value: "BT", label: "Bhutan" },
  { value: "BO", label: "Bolivia" },
  { value: "BA", label: "Bosnia and Herzegovina" },
  { value: "BW", label: "Botswana" },
  { value: "BR", label: "Brazil" },
  { value: "BN", label: "Brunei" },
  { value: "BG", label: "Bulgaria" },
  { value: "BF", label: "Burkina Faso" },
  { value: "BI", label: "Burundi" },
  { value: "CV", label: "Cape Verde" },
  { value: "KH", label: "Cambodia" },
  { value: "CM", label: "Cameroon" },
  { value: "CA", label: "Canada" },
  { value: "KY", label: "Cayman Islands" },
  { value: "CF", label: "Central African Republic" },
  { value: "TD", label: "Chad" },
  { value: "CL", label: "Chile" },
  { value: "CN", label: "China" },
  { value: "CO", label: "Colombia" },
  { value: "KM", label: "Comoros" },
  { value: "CG", label: "Congo" },
  { value: "CD", label: "Congo (Democratic Republic)" },
  { value: "CR", label: "Costa Rica" },
  { value: "CI", label: "Côte d'Ivoire" },
  { value: "HR", label: "Croatia" },
  { value: "CU", label: "Cuba" },
  { value: "CY", label: "Cyprus" },
  { value: "CZ", label: "Czech Republic" },
  { value: "DK", label: "Denmark" },
  { value: "DJ", label: "Djibouti" },
  { value: "DM", label: "Dominica" },
  { value: "DO", label: "Dominican Republic" },
  { value: "EC", label: "Ecuador" },
  { value: "EG", label: "Egypt" },
  { value: "SV", label: "El Salvador" },
  { value: "GQ", label: "Equatorial Guinea" },
  { value: "ER", label: "Eritrea" },
  { value: "EE", label: "Estonia" },
  { value: "SZ", label: "Eswatini" },
  { value: "ET", label: "Ethiopia" },
  { value: "FJ", label: "Fiji" },
  { value: "FI", label: "Finland" },
  { value: "FR", label: "France" },
  { value: "GA", label: "Gabon" },
  { value: "GM", label: "Gambia" },
  { value: "GE", label: "Georgia" },
  { value: "DE", label: "Germany" },
  { value: "GH", label: "Ghana" },
  { value: "GR", label: "Greece" },
  { value: "GD", label: "Grenada" },
  { value: "GT", label: "Guatemala" },
  { value: "GN", label: "Guinea" },
  { value: "GW", label: "Guinea-Bissau" },
  { value: "GY", label: "Guyana" },
  { value: "HT", label: "Haiti" },
  { value: "HN", label: "Honduras" },
  { value: "HU", label: "Hungary" },
  { value: "IS", label: "Iceland" },
  { value: "IN", label: "India" },
  { value: "ID", label: "Indonesia" },
  { value: "IR", label: "Iran" },
  { value: "IQ", label: "Iraq" },
  { value: "IE", label: "Ireland" },
  { value: "IL", label: "Israel" },
  { value: "IT", label: "Italy" },
  { value: "JM", label: "Jamaica" },
  { value: "JP", label: "Japan" },
  { value: "JO", label: "Jordan" },
  { value: "KZ", label: "Kazakhstan" },
  { value: "KE", label: "Kenya" },
  { value: "KI", label: "Kiribati" },
  { value: "KP", label: "North Korea" },
  { value: "KR", label: "South Korea" },
  { value: "KW", label: "Kuwait" },
  { value: "KG", label: "Kyrgyzstan" },
  { value: "LA", label: "Laos" },
  { value: "LV", label: "Latvia" },
  { value: "LB", label: "Lebanon" },
  { value: "LS", label: "Lesotho" },
  { value: "LR", label: "Liberia" },
  { value: "LY", label: "Libya" },
  { value: "LI", label: "Liechtenstein" },
  { value: "LT", label: "Lithuania" },
  { value: "LU", label: "Luxembourg" },
  { value: "MG", label: "Madagascar" },
  { value: "MW", label: "Malawi" },
  { value: "MY", label: "Malaysia" },
  { value: "MV", label: "Maldives" },
  { value: "ML", label: "Mali" },
  { value: "MT", label: "Malta" },
  { value: "MH", label: "Marshall Islands" },
  { value: "MR", label: "Mauritania" },
  { value: "MU", label: "Mauritius" },
  { value: "MX", label: "Mexico" },
  { value: "FM", label: "Micronesia" },
  { value: "MD", label: "Moldova" },
  { value: "MC", label: "Monaco" },
  { value: "MN", label: "Mongolia" },
  { value: "ME", label: "Montenegro" },
  { value: "MA", label: "Morocco" },
  { value: "MZ", label: "Mozambique" },
  { value: "MM", label: "Myanmar" },
  { value: "NA", label: "Namibia" },
  { value: "NR", label: "Nauru" },
  { value: "NP", label: "Nepal" },
  { value: "NL", label: "Netherlands" },
  { value: "NZ", label: "New Zealand" },
  { value: "NI", label: "Nicaragua" },
  { value: "NE", label: "Niger" },
  { value: "NG", label: "Nigeria" },
  { value: "NO", label: "Norway" },
  { value: "OM", label: "Oman" },
  { value: "PK", label: "Pakistan" },
  { value: "PW", label: "Palau" },
  { value: "PS", label: "Palestine" },
  { value: "PA", label: "Panama" },
  { value: "PG", label: "Papua New Guinea" },
  { value: "PY", label: "Paraguay" },
  { value: "PE", label: "Peru" },
  { value: "PH", label: "Philippines" },
  { value: "PL", label: "Poland" },
  { value: "PT", label: "Portugal" },
  { value: "QA", label: "Qatar" },
  { value: "RO", label: "Romania" },
  { value: "RU", label: "Russia" },
  { value: "RW", label: "Rwanda" },
  { value: "WS", label: "Samoa" },
  { value: "SM", label: "San Marino" },
  { value: "ST", label: "São Tomé and Príncipe" },
  { value: "SA", label: "Saudi Arabia" },
  { value: "SN", label: "Senegal" },
  { value: "RS", label: "Serbia" },
  { value: "SC", label: "Seychelles" },
  { value: "SL", label: "Sierra Leone" },
  { value: "SG", label: "Singapore" },
  { value: "SK", label: "Slovakia" },
  { value: "SI", label: "Slovenia" },
  { value: "SB", label: "Solomon Islands" },
  { value: "SO", label: "Somalia" },
  { value: "ZA", label: "South Africa" },
  { value: "SS", label: "South Sudan" },
  { value: "ES", label: "Spain" },
  { value: "LK", label: "Sri Lanka" },
  { value: "SD", label: "Sudan" },
  { value: "SR", label: "Suriname" },
  { value: "SE", label: "Sweden" },
  { value: "CH", label: "Switzerland" },
  { value: "SY", label: "Syria" },
  { value: "TW", label: "Taiwan" },
  { value: "TJ", label: "Tajikistan" },
  { value: "TZ", label: "Tanzania" },
  { value: "TH", label: "Thailand" },
  { value: "TL", label: "Timor-Leste" },
  { value: "TG", label: "Togo" },
  { value: "TO", label: "Tonga" },
  { value: "TT", label: "Trinidad and Tobago" },
  { value: "TN", label: "Tunisia" },
  { value: "TR", label: "Turkey" },
  { value: "TM", label: "Turkmenistan" },
  { value: "TV", label: "Tuvalu" },
  { value: "UG", label: "Uganda" },
  { value: "UA", label: "Ukraine" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "GB", label: "United Kingdom" },
  { value: "US", label: "United States" },
  { value: "UY", label: "Uruguay" },
  { value: "UZ", label: "Uzbekistan" },
  { value: "VU", label: "Vanuatu" },
  { value: "VA", label: "Vatican City" },
  { value: "VE", label: "Venezuela" },
  { value: "VN", label: "Vietnam" },
  { value: "YE", label: "Yemen" },
  { value: "ZM", label: "Zambia" },
  { value: "ZW", label: "Zimbabwe" },
].sort((a, b) => a.label.localeCompare(b.label));

interface CountrySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onValueChange,
  placeholder = "Select country...",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);

  const selectedCountry = countries.find((country) => country.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          disabled={disabled}
        >
          {selectedCountry ? (
            <span className="flex items-center gap-2">
              <Globe size={16} className="text-gray-500" />
              {selectedCountry.label}
            </span>
          ) : (
            <span className="text-gray-500 flex items-center gap-2">
              <Globe size={16} />
              {placeholder}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search countries..." className="h-9" />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {countries.map((country) => (
              <CommandItem
                key={country.value}
                value={country.label}
                onSelect={() => {
                  onValueChange(country.value === value ? "" : country.value);
                  setOpen(false);
                }}
                className="flex items-center gap-2"
              >
                {country.label}
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === country.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface SingleDocumentUploadFormProps {
  vendorId: string;
  docType: DocumentType;
  onUploadSuccess: () => void;
}

const SingleDocumentUploadForm: React.FC<SingleDocumentUploadFormProps> = ({
  vendorId,
  docType,
  onUploadSuccess,
}) => {
  const [number, setNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [issuePlace, setIssuePlace] = useState("");
  const [issuedBy, setIssuedBy] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > docType.max_file_size_mb * 1024 * 1024) {
        toast.error(`File size cannot exceed ${docType.max_file_size_mb}MB.`);
        e.target.value = "";
        return;
      }
      setFile(selectedFile);
      if (
        selectedFile.type.startsWith("image/") ||
        selectedFile.type === "application/pdf"
      ) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const mutation = useMutation({
    mutationFn: (formData: FormData) =>
      axios.post(`${API_BASE_URL}vendor-documents`, formData),
    onSuccess: () => {
      onUploadSuccess();
    },
    onError: (error: any) => {
      const serverError = error.response?.data;
      let errorMsg = "Upload failed. Please check the file and details.";
      if (typeof serverError === "object" && serverError !== null) {
        errorMsg = Object.values(serverError).flat().join(" ");
      }
      setErrorMessage(errorMsg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!file || !number || !issueDate) {
      setErrorMessage("Document Number, Issue Date, and File are required.");
      return;
    }

    const formData = new FormData();
    formData.append("vendor", vendorId);
    formData.append("document_type", docType.id);
    formData.append("number", number);
    formData.append("issue_date", issueDate);
    formData.append("file_path", file);

    if (expiryDate) formData.append("expiry_date", expiryDate);
    if (issuePlace) {
      // Find the country label from the selected value
      const selectedCountry = countries.find((c) => c.value === issuePlace);
      formData.append("issue_place", selectedCountry?.label || issuePlace);
    }
    if (issuedBy) formData.append("issued_by", issuedBy);
    if (description) formData.append("description", description);

    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm font-medium inter text-gray-500">
        {docType.description}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <FormField
          name={`number-${docType.id}`}
          label="Document/Certificate Number"
          icon={""}
          required
        >
          <Input
            id={`number-${docType.id}`}
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Document Issued Number"
            required
          />
        </FormField>
        <FormField
          name={`issueDate-${docType.id}`}
          label="Issue Date"
          icon={<Calendar size={16} />}
          required
        >
          <Input
            id={`issueDate-${docType.id}`}
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            required
          />
        </FormField>
        <FormField
          name={`expiryDate-${docType.id}`}
          label="Expiry Date (Optional)"
          icon={<Calendar size={16} />}
        >
          <Input
            id={`expiryDate-${docType.id}`}
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </FormField>
        <FormField
          name={`issuePlace-${docType.id}`}
          label="Place of Issue (Optional)"
          icon={""}
        >
          <CountrySelector
            value={issuePlace}
            onValueChange={setIssuePlace}
            placeholder="Select country of issue..."
          />
        </FormField>
        <div className="md:col-span-2">
          <FormField
            name={`issuedBy-${docType.id}`}
            label="Issuing Authority (Optional)"
            icon={""}
          >
            <Input
              id={`issuedBy-${docType.id}`}
              type="text"
              value={issuedBy}
              onChange={(e) => setIssuedBy(e.target.value)}
              placeholder="e.g. Business Registrations and Licensing Agency (BRELA) or Tanzania Revenue Authority"
            />
          </FormField>
        </div>
      </div>
      <FormField
        name={`description-${docType.id}`}
        label="Description (Optional)"
        icon={<FileText size={16} />}
      >
        <Textarea
          id={`description-${docType.id}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add any relevant notes..."
          rows={2}
        />
      </FormField>
      <FormField
        name={`file-${docType.id}`}
        label="Upload File"
        icon={<UploadCloud size={16} />}
        required
      >
        <Input
          id={`file-${docType.id}`}
          type="file"
          onChange={handleFileChange}
          accept={docType.allowed_file_types
            .split(",")
            .map((t) => `.${t}`)
            .join(",")}
          required
          className="file:text-blue-600 file:font-semibold"
        />
        <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
          <Badge variant="secondary">{`Max size: ${docType.max_file_size_mb}MB`}</Badge>
          <Badge variant="secondary">{`Allowed types: ${docType.allowed_file_types}`}</Badge>
        </div>
      </FormField>
      {previewUrl && (
        <div className="mt-2">
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center inter gap-2 text-[0.9375rem] font-medium text-blue-600 hover:underline"
          >
            <Eye size={16} />
            Preview Document
          </a>
        </div>
      )}
      {errorMessage && (
        <Alert variant="destructive" className="!mt-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Upload Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full font-medium text-[0.9375rem] rounded-[6px] inter py-2.5 bg-[#0081FB] hover:bg-blue-600 shadow transition-all"
        >
          {mutation.isPending ? (
            <Loader className="mr-1 h-5 w-5 animate-spin" />
          ) : (
            <UploadCloud className="mr-1 h-5 w-5" />
          )}
          Submit {docType.name}
        </Button>
      </div>
    </form>
  );
};

interface DocumentUploadStepProps {
  vendorId: string;
  setStepComplete: (isComplete: boolean) => void;
}

export const Step2_UploadDocument: React.FC<DocumentUploadStepProps> = ({
  vendorId,
  setStepComplete,
}) => {
  const {
    data: vendorData,
    isLoading: isVendorLoading,
    error: vendorError,
    refetch,
  } = useQuery<VendorDetails>({
    queryKey: ["vendorDetails", vendorId],
    queryFn: () =>
      axios.get(`${API_BASE_URL}vendors/${vendorId}`).then((res) => res.data),
  });

  const missingDocIds =
    vendorData?.onboarding_progress.steps.document_verification
      .missing_documents || [];
  const submittedDocs = vendorData?.documents || [];

  const { data: docTypes, isLoading: areDocTypesLoading } = useQuery<
    DocumentType[]
  >({
    queryKey: ["documentTypes", missingDocIds],
    queryFn: () =>
      Promise.all(
        missingDocIds.map((id) =>
          axios
            .get(`${API_BASE_URL}document-types/${id}`)
            .then((res) => res.data)
        )
      ),
    enabled: !isVendorLoading && missingDocIds.length > 0,
  });

  const allRequiredDocsSubmitted =
    !isVendorLoading && missingDocIds.length === 0;

  useEffect(() => {
    setStepComplete(allRequiredDocsSubmitted);
  }, [allRequiredDocsSubmitted, setStepComplete]);

  if (isVendorLoading || areDocTypesLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 space-y-4 h-64">
        <Loader className="animate-spin text-blue-600" size={40} />
        <span className="text-lg text-slate-600">
          Loading document requirements...
        </span>
      </div>
    );
  }

  if (vendorError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Failed to Load Data</AlertTitle>
        <AlertDescription>
          Could not load vendor data. Please refresh the page or go back.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-[1.75rem] inter font-bold text-gray-900">
          Upload Required Documents
        </h1>
        <p className="mt-2 text-gray-600 inter">
          Click on a document name to expand the form and upload the required
          file.
        </p>
      </header>

      <NotesSummary title="Why are these documents required?">
        <p>
          Verifying your legal documents is a crucial step to ensure the safety
          and security of the SafariPro platform. We will notify you via email
          once your documents have been approved.
        </p>
      </NotesSummary>

      <div className="space-y-4 mt-8">
        {submittedDocs.map((doc: VendorDocument) => (
          <Alert
            key={doc.id}
            variant="default"
            className="bg-green-100 py-4 border-[1.25px] rounded-[6px] shadow border-green-200 text-green-800"
          >
            <TbProgressCheck className="h-4 w-4 !text-green-600" />
            <AlertTitle className="font-medium inter">
              {doc.document_type_name} - Under Review
            </AlertTitle>
            <AlertDescription className="font-medium inter text-gray-800">
              Congratulations! We have received your document and it is
              currently being verified by our team. You can check for documents
              verification status in your vendor's account, we'll also send you
              an email for any updates.
            </AlertDescription>
          </Alert>
        ))}

        {docTypes && docTypes.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {docTypes.map((docType) => (
              <AccordionItem
                key={docType.id}
                value={docType.id}
                className="border-[1px] border-[#DADCE0] rounded-[6px] shadow bg-white"
              >
                <AccordionTrigger className="p-4 md:p-6 font-semibold inter text-[1.125rem] text-gray-800 hover:no-underline">
                  {docType.name}
                </AccordionTrigger>
                <AccordionContent className="p-4 md:p-6 pt-0">
                  <SingleDocumentUploadForm
                    vendorId={vendorId}
                    docType={docType}
                    onUploadSuccess={() => {
                      toast.success(`${docType.name} uploaded successfully!`);
                      refetch();
                    }}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          !isVendorLoading &&
          allRequiredDocsSubmitted && (
            <div className="text-center bg-gray-50 p-10 rounded-md border-[1.5px] border-gray-200">
              <FileCheck2
                className="h-12 w-12 text-teal-500 mx-auto mb-4"
                strokeWidth={1.5}
              />
              <h3 className="text-xl font-bold text-slate-800">
                All Required Documents Submitted!
              </h3>
              <p className="text-slate-500 mt-2">
                You can now proceed to the next step. We will email you once
                verification is complete.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
