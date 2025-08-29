// "use client";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import {
//   UploadCloud,
//   CheckCircle,
//   Loader,
//   AlertCircleIcon,
//   FileCheck2,
//   FileText,
//   Calendar,
//   MapPin,
//   Building,
//   Hash,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Badge } from "@/components/ui/badge";
// import { Textarea } from "@/components/ui/textarea";
// import { FormField } from "./form-field";
// import type { DocumentType, VendorDetails } from "./vendor";
// import { NotesSummary } from "./notes-summary";

// const API_BASE_URL = import.meta.env.VITE_VENDOR_BASE_URL;

// interface SingleDocumentUploadFormProps {
//   vendorId: string;
//   docType: DocumentType;
//   onUploadSuccess: () => void;
// }

// const SingleDocumentUploadForm: React.FC<SingleDocumentUploadFormProps> = ({
//   vendorId,
//   docType,
//   onUploadSuccess,
// }) => {
//   const [number, setNumber] = useState("");
//   const [issueDate, setIssueDate] = useState("");
//   const [expiryDate, setExpiryDate] = useState("");
//   const [issuePlace, setIssuePlace] = useState("");
//   const [issuedBy, setIssuedBy] = useState("");
//   const [description, setDescription] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [errorMessage, setErrorMessage] = useState("");

//   const mutation = useMutation({
//     mutationFn: (formData: FormData) =>
//       axios.post(`${API_BASE_URL}vendor-documents`, formData),
//     onSuccess: () => {
//       onUploadSuccess();
//     },
//     onError: (error: any) => {
//       const serverError = error.response?.data;
//       let errorMsg = "Upload failed. Please check the file and details.";
//       if (typeof serverError === "object" && serverError !== null) {
//         errorMsg = Object.values(serverError).flat().join(" ");
//       }
//       setErrorMessage(errorMsg);
//     },
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorMessage("");
//     if (!file || !number || !issueDate) {
//       setErrorMessage("Document Number, Issue Date, and File are required.");
//       return;
//     }
//     if (file.size > docType.max_file_size_mb * 1024 * 1024) {
//       setErrorMessage(`File size cannot exceed ${docType.max_file_size_mb}MB.`);
//       return;
//     }

//     const formData = new FormData();
//     formData.append("vendor", vendorId);
//     formData.append("document_type", docType.id);
//     formData.append("number", number);
//     formData.append("issue_date", issueDate);
//     formData.append("file_path", file);

//     if (expiryDate) formData.append("expiry_date", expiryDate);
//     if (issuePlace) formData.append("issue_place", issuePlace);
//     if (issuedBy) formData.append("issued_by", issuedBy);
//     if (description) formData.append("description", description);

//     mutation.mutate(formData);
//   };

//   if (mutation.isSuccess) {
//     return (
//       <Alert
//         variant="default"
//         className="bg-teal-50 border-teal-200 text-teal-800"
//       >
//         <CheckCircle className="h-4 w-4 !text-teal-500" />
//         <AlertTitle>{docType.name} Uploaded Successfully!</AlertTitle>
//         <AlertDescription>
//           The document has been submitted and is pending verification.
//         </AlertDescription>
//       </Alert>
//     );
//   }

//   return (
//     <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <h3 className="font-semibold text-lg text-gray-800">{docType.name}</h3>
//         <p className="text-sm text-gray-500 -mt-2">{docType.description}</p>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
//           <FormField
//             name={`number-${docType.id}`}
//             label="Document/Certificate Number"
//             icon={<Hash size={16} />}
//             required
//           >
//             <Input
//               id={`number-${docType.id}`}
//               type="text"
//               value={number}
//               onChange={(e) => setNumber(e.target.value)}
//               placeholder="e.g., TIN123456789"
//               required
//             />
//           </FormField>
//           <FormField
//             name={`issueDate-${docType.id}`}
//             label="Issue Date"
//             icon={<Calendar size={16} />}
//             required
//           >
//             <Input
//               id={`issueDate-${docType.id}`}
//               type="date"
//               value={issueDate}
//               onChange={(e) => setIssueDate(e.target.value)}
//               required
//             />
//           </FormField>
//           <FormField
//             name={`expiryDate-${docType.id}`}
//             label="Expiry Date (Optional)"
//             icon={<Calendar size={16} />}
//           >
//             <Input
//               id={`expiryDate-${docType.id}`}
//               type="date"
//               value={expiryDate}
//               onChange={(e) => setExpiryDate(e.target.value)}
//             />
//           </FormField>
//           <FormField
//             name={`issuePlace-${docType.id}`}
//             label="Place of Issue (Optional)"
//             icon={<MapPin size={16} />}
//           >
//             <Input
//               id={`issuePlace-${docType.id}`}
//               type="text"
//               value={issuePlace}
//               onChange={(e) => setIssuePlace(e.target.value)}
//               placeholder="e.g. Dar es Salaam"
//             />
//           </FormField>
//           <div className="md:col-span-2">
//             <FormField
//               name={`issuedBy-${docType.id}`}
//               label="Issuing Authority (Optional)"
//               icon={<Building size={16} />}
//             >
//               <Input
//                 id={`issuedBy-${docType.id}`}
//                 type="text"
//                 value={issuedBy}
//                 onChange={(e) => setIssuedBy(e.target.value)}
//                 placeholder="e.g. Tanzania Revenue Authority"
//               />
//             </FormField>
//           </div>
//         </div>

//         <FormField
//           name={`description-${docType.id}`}
//           label="Description (Optional)"
//           icon={<FileText size={16} />}
//         >
//           <Textarea
//             id={`description-${docType.id}`}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Add any relevant notes about this document..."
//             rows={2}
//           />
//         </FormField>

//         <FormField
//           name={`file-${docType.id}`}
//           label="Upload File"
//           icon={<UploadCloud size={16} />}
//           required
//         >
//           <Input
//             id={`file-${docType.id}`}
//             type="file"
//             onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
//             accept={docType.allowed_file_types
//               .split(",")
//               .map((t) => `.${t}`)
//               .join(",")}
//             required
//             className="file:text-blue-600 file:font-semibold"
//           />
//           <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
//             <Badge variant="secondary">{`Max size: ${docType.max_file_size_mb}MB`}</Badge>
//             <Badge variant="secondary">{`Allowed types: ${docType.allowed_file_types}`}</Badge>
//           </div>
//         </FormField>

//         {errorMessage && (
//           <Alert variant="destructive">
//             <AlertCircleIcon className="h-4 w-4" />
//             <AlertTitle>Upload Error</AlertTitle>
//             <AlertDescription>{errorMessage}</AlertDescription>
//           </Alert>
//         )}

//         <div className="pt-2">
//           <Button
//             type="submit"
//             disabled={mutation.isPending}
//             className="w-full font-semibold text-lg py-6 bg-[#0081FB] hover:bg-blue-600"
//           >
//             {mutation.isPending ? (
//               <Loader className="mr-2 h-5 w-5 animate-spin" />
//             ) : (
//               <UploadCloud className="mr-2 h-5 w-5" />
//             )}
//             Submit {docType.name}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// interface DocumentUploadStepProps {
//   vendorId: string;
//   onComplete: () => void;
//   onBack: () => void;
//   setStepComplete: (isComplete: boolean) => void;
// }

// export const Step2_UploadDocument: React.FC<DocumentUploadStepProps> = ({
//   vendorId,
//   setStepComplete,
// }) => {
//   const {
//     data: vendorData,
//     isLoading: isVendorLoading,
//     error: vendorError,
//     refetch,
//   } = useQuery<VendorDetails>({
//     queryKey: ["vendorDetails", vendorId],
//     queryFn: () =>
//       axios.get(`${API_BASE_URL}vendors/${vendorId}`).then((res) => res.data),
//   });

//   const missingDocIds =
//     vendorData?.onboarding_progress.steps.document_verification
//       .missing_documents || [];

//   const { data: docTypes, isLoading: areDocTypesLoading } = useQuery<
//     DocumentType[]
//   >({
//     queryKey: ["documentTypes", missingDocIds],
//     queryFn: () =>
//       Promise.all(
//         missingDocIds.map((id) =>
//           axios
//             .get(`${API_BASE_URL}document-types/${id}`)
//             .then((res) => res.data)
//         )
//       ),
//     enabled: !isVendorLoading && missingDocIds.length > 0,
//   });

//   const allDocsSubmitted =
//     !isVendorLoading &&
//     !areDocTypesLoading &&
//     (!docTypes || docTypes.length === 0);

//   useEffect(() => {
//     setStepComplete(allDocsSubmitted);
//   }, [allDocsSubmitted, setStepComplete]);

//   if (isVendorLoading || areDocTypesLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center p-10 space-y-4 h-64">
//         <Loader className="animate-spin text-blue-600" size={40} />
//         <span className="text-lg text-slate-600">
//           Loading document requirements...
//         </span>
//       </div>
//     );
//   }
//   if (vendorError) {
//     return (
//       <Alert variant="destructive">
//         <AlertCircleIcon className="h-4 w-4" />
//         <AlertTitle>Failed to Load Data</AlertTitle>
//         <AlertDescription>
//           Could not load vendor data. Please refresh the page or go back.
//         </AlertDescription>
//       </Alert>
//     );
//   }

//   return (
//     <div>
//       <header className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">
//           Upload Required Documents
//         </h1>
//         <p className="mt-2 text-gray-600">
//           Your company profile is created! Now, please upload the following
//           documents for verification.
//         </p>
//       </header>

//       <NotesSummary title="Why are these documents required?">
//         <p>
//           Verifying your legal documents is a crucial step to ensure the safety
//           and security of the SafariPro platform for both vendors and travelers.
//         </p>
//       </NotesSummary>

//       <div className="space-y-6 mt-8">
//         {docTypes && docTypes.length > 0 ? (
//           docTypes.map((docType) => (
//             <SingleDocumentUploadForm
//               key={docType.id}
//               vendorId={vendorId}
//               docType={docType}
//               onUploadSuccess={refetch}
//             />
//           ))
//         ) : (
//           <div className="text-center bg-gray-50 p-10 rounded-xl border-2 border-dashed border-gray-200">
//             <FileCheck2
//               className="h-16 w-16 text-teal-500 mx-auto mb-4"
//               strokeWidth={1.5}
//             />
//             <h3 className="text-xl font-bold text-slate-800">
//               All Documents Submitted!
//             </h3>
//             <p className="text-slate-500 mt-2">
//               You've uploaded all required documents. You can now proceed to the
//               next step while we review them.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

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
  MapPin,
  Building,
  Hash,
  Eye,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "./form-field";
import type { DocumentType, VendorDetails, VendorDocument } from "./vendor";
import { NotesSummary } from "./notes-summary";

const API_BASE_URL = import.meta.env.VITE_VENDOR_BASE_URL;

// --- Single Document Form ---
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
        e.target.value = ""; // Clear the input
        return;
      }
      setFile(selectedFile);
      // Create a temporary URL for preview
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
    if (issuePlace) formData.append("issue_place", issuePlace);
    if (issuedBy) formData.append("issued_by", issuedBy);
    if (description) formData.append("description", description);

    mutation.mutate(formData);
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="font-semibold text-lg text-gray-800">{docType.name}</h3>
        <p className="text-sm text-gray-500 -mt-2">{docType.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <FormField
            name={`number-${docType.id}`}
            label="Document/Certificate Number"
            icon={<Hash size={16} />}
            required
          >
            <Input
              id={`number-${docType.id}`}
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="e.g., TIN123456789"
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
            icon={<MapPin size={16} />}
          >
            <Input
              id={`issuePlace-${docType.id}`}
              type="text"
              value={issuePlace}
              onChange={(e) => setIssuePlace(e.target.value)}
              placeholder="e.g. Dar es Salaam"
            />
          </FormField>
          <div className="md:col-span-2">
            <FormField
              name={`issuedBy-${docType.id}`}
              label="Issuing Authority (Optional)"
              icon={<Building size={16} />}
            >
              <Input
                id={`issuedBy-${docType.id}`}
                type="text"
                value={issuedBy}
                onChange={(e) => setIssuedBy(e.target.value)}
                placeholder="e.g. Tanzania Revenue Authority"
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
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
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
            className="w-full font-semibold text-lg py-6 bg-[#0081FB] hover:bg-blue-600"
          >
            {mutation.isPending ? (
              <Loader className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 h-5 w-5" />
            )}
            Submit {docType.name}
          </Button>
        </div>
      </form>
    </div>
  );
};

// --- Main Step 2 Component ---
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
        <h1 className="text-3xl font-bold text-gray-900">
          Upload Required Documents
        </h1>
        <p className="mt-2 text-gray-600">
          Your company profile is created! Now, please upload the following
          documents for verification.
        </p>
      </header>

      <NotesSummary title="Why are these documents required?">
        <p>
          Verifying your legal documents is a crucial step to ensure the safety
          and security of the SafariPro platform. We will notify you via email
          once your documents have been approved.
        </p>
      </NotesSummary>

      <div className="space-y-6 mt-8">
        {submittedDocs.map((doc: VendorDocument) => (
          <Alert
            key={doc.id}
            variant="default"
            className="bg-yellow-50 border-yellow-200 text-yellow-800"
          >
            <Clock className="h-4 w-4 !text-yellow-600" />
            <AlertTitle>{doc.document_type_name} - Under Review</AlertTitle>
            <AlertDescription>
              We have received your document and it is currently being verified
              by our team.
            </AlertDescription>
          </Alert>
        ))}

        {docTypes && docTypes.length > 0
          ? docTypes.map((docType) => (
              <SingleDocumentUploadForm
                key={docType.id}
                vendorId={vendorId}
                docType={docType}
                onUploadSuccess={() => {
                  toast.success(`${docType.name} uploaded successfully!`);
                  refetch();
                }}
              />
            ))
          : !isVendorLoading &&
            allRequiredDocsSubmitted && (
              <div className="text-center bg-gray-50 p-10 rounded-xl border-2 border-dashed border-gray-200">
                <FileCheck2
                  className="h-16 w-16 text-teal-500 mx-auto mb-4"
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
            )}
      </div>
    </div>
  );
};
