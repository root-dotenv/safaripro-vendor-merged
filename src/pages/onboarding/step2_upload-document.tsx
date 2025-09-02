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
  Building2,
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
  CommandList,
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
import { countries, issuingAuthorities } from "@/api/local";
// --- NEW: Import the SubStepNavigation component ---
import { SubStepNavigation } from "./company-info/sub_step_navigation";

const API_BASE_URL = import.meta.env.VITE_VENDOR_BASE_URL;

// ... (CountrySelector and AuthoritySelector components remain unchanged)
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

interface AuthoritySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const AuthoritySelector: React.FC<AuthoritySelectorProps> = ({
  value,
  onValueChange,
  placeholder = "Select an authority...",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const fullList = [
    ...issuingAuthorities,
    { value: "Other", label: "Other (Please specify)" },
  ];
  const selectedAuthority = fullList.find((item) => item.value === value);

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
          {selectedAuthority ? (
            <span className="flex items-center gap-2 truncate">
              <Building2 size={16} className="text-gray-500 flex-shrink-0" />
              {selectedAuthority.label}
            </span>
          ) : (
            <span className="text-gray-500 flex items-center gap-2">
              <Building2 size={16} />
              {placeholder}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search authorities..." className="h-9" />
          <CommandList>
            <CommandEmpty>No authority found.</CommandEmpty>
            <CommandGroup>
              {fullList.map((authority) => (
                <CommandItem
                  key={authority.value}
                  value={authority.label}
                  onSelect={() => {
                    onValueChange(authority.value);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  {authority.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === authority.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
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
  const [authoritySelection, setAuthoritySelection] = useState("");
  const [customAuthority, setCustomAuthority] = useState("");
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

    const finalIssuedBy =
      authoritySelection === "Other" ? customAuthority : authoritySelection;

    const formData = new FormData();
    formData.append("vendor", vendorId);
    formData.append("document_type", docType.id);
    formData.append("number", number);
    formData.append("issue_date", issueDate);
    formData.append("file_path", file);

    if (expiryDate) formData.append("expiry_date", expiryDate);
    if (issuePlace) {
      const selectedCountry = countries.find((c) => c.value === issuePlace);
      formData.append("issue_place", selectedCountry?.label || issuePlace);
    }
    if (finalIssuedBy) formData.append("issued_by", finalIssuedBy);
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
        <div className="md:col-span-2 space-y-4">
          <FormField
            name={`issuedBySelector-${docType.id}`}
            label="Issuing Authority (Optional)"
            icon={""}
          >
            <AuthoritySelector
              value={authoritySelection}
              onValueChange={setAuthoritySelection}
            />
          </FormField>
          {authoritySelection === "Other" && (
            <FormField
              name={`customAuthority-${docType.id}`}
              label="Specify Other Issuing Authority"
              icon={""}
            >
              <Input
                id={`customAuthority-${docType.id}`}
                type="text"
                value={customAuthority}
                onChange={(e) => setCustomAuthority(e.target.value)}
                placeholder="Enter the name of the authority"
              />
            </FormField>
          )}
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

// --- MODIFIED: Update props to accept navigation handlers ---
interface DocumentUploadStepProps {
  vendorId: string;
  setStepComplete: (isComplete: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2_UploadDocument: React.FC<DocumentUploadStepProps> = ({
  vendorId,
  setStepComplete,
  onNext,
  onBack,
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
                <AccordionTrigger className="p-4 md-p-6 font-semibold inter text-[1.125rem] text-gray-800 hover-no-underline">
                  {docType.name}
                </AccordionTrigger>
                <AccordionContent className="p-4 md-p-6 pt-0">
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
            // --- MODIFIED: Added navigation buttons after the success message ---
            <>
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
              <SubStepNavigation onNext={onNext} onBack={onBack} />
            </>
          )
        )}
      </div>
    </div>
  );
};
