// src/types/documents.ts
export interface VendorDetails {
  id: string;
  business_name: string;
  onboarding_progress: {
    progress_percentage: number;
    steps: {
      document_verification: {
        status: string;
        completed: boolean;
        missing_documents: string[];
      };
    };
  };
}

// The structure for a required document type
export interface DocumentType {
  id: string;
  name: string;
  description: string;
  is_required: boolean;
  allowed_file_types: string;
  max_file_size_mb: number;
}

// The payload for uploading a single document
export interface VendorDocumentPayload {
  vendor: string;
  document_type: string;
  number: string;
  issue_date: string;
  file_path: File;
}
