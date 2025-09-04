// src/types/vendor.ts
import React from "react";

// --- NEW: Add ServiceType for selection step ---
export type ServiceType = "Hotel" | "Tour" | "Cab" | "Car" | "Flight" | "Other";

// --- CORE PAYLOADS ---
export interface VendorPayload {
  business_name: string;
  trading_name: string;
  business_description: string;
  service_type: string;
  phone_number: string;
  alternative_phone: string;
  email: string;
  contact_person_name: string;
  contact_person_title: string;
  contact_person_email: string;
  contact_person_phone: string;
  website: string;
  address: string;
  address_line2: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  region: string;
  country: string;
  postal_code: string;
  google_place_id: string;
  registration_number: string;
  tax_id: string;
  business_license: string;
  year_established: number;
  number_of_employees: number;
}

export interface BankingDetailsPayload {
  vendor: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  swift_code: string;
  bank_branch: string;
  routing_number: string;
  preferred_currency: string;
}

export interface HotelPayload {
  name: string;
  description: string;
  vendor_id: string;
  directions: string;
  star_rating: number;
  zip_code: string;
  address: string;
  latitude: number;
  longitude: number;
  distance_from_center_km: number;
  destination: string;
  code: string;
  country: string;
  hotel_type: string;
  number_rooms: number;
  number_floors: number;
  number_restaurants: number;
  number_bars: number;
  number_parks: number;
  number_halls: number;
  discount: number;
  is_eco_certified: boolean;
  year_built: number;
  check_in_from: string;
  check_out_to: string;
  average_room_price: number;
  regions: string[];
  themes: string[];
  meal_types: string[];
  room_type: string[];
  amenities: string[];
  services: string[];
  facilities: string[];
  translations: string[];
  website_url: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  youtube_url: string;
}

// --- API RESPONSE TYPES ---
export interface CreatedVendor {
  id: string;
}

export interface DocumentType {
  id: string;
  name: string;
  description: string;
  is_required: boolean;
  allowed_file_types: string;
  max_file_size_mb: number;
}

export interface VendorDocument {
  id: string;
  document_type_name: string;
  number: string;
  issue_date: string;
  is_verified: boolean;
  rejection_reason: string | null;
}

export interface VendorBankingDetails {
  id: string;
  bank_name: string;
  account_name: string;
  is_verified: boolean;
  vendor: string;
  account_number?: string;
  swift_code: string;
  bank_branch: string;
  routing_number: string;
  preferred_currency: string;
  verification_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface VendorDetails {
  id: string;
  business_name: string;
  trading_name: string;
  logo: string;
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  documents: VendorDocument[];
  banking_details: VendorBankingDetails | null;
  onboarding_progress: {
    progress_percentage: number;
    steps: {
      profile_completion: { status: string; completed: boolean };
      document_verification: {
        status: string;
        completed: boolean;
        missing_documents: string[];
      };
      banking_details: { status: string; completed: boolean };
    };
  };
}

export interface FeatureOption {
  id: string;
  name: string;
  language?: string;
}

// --- COMPONENT PROP TYPES ---
export interface CompanyInfoSubStepProps {
  formData: Omit<VendorPayload, "logo">;
  setFormData: React.Dispatch<
    React.SetStateAction<Omit<VendorPayload, "logo">>
  >;
  handleNext: () => void;
  handleBack: () => void;
}

export interface HotelDetailsStepProps {
  vendorId: string;
  onSuccess: (hotelId: string) => void;
  onBack: () => void;
  setStepComplete: (isComplete: boolean) => void;
}

export interface HotelDetailsSubStepProps {
  formData: HotelPayload;
  setFormData: React.Dispatch<React.SetStateAction<HotelPayload>>;
  handleNext: () => void;
  handleBack: () => void;
  handleCheckboxChange: (group: keyof HotelPayload, id: string) => void;
}

// --- NEW: Add OnboardingState interface for Zustand store ---
export interface OnboardingState {
  currentStep: number;
  vendorId: string | null;
  hotelId: string | null;
  serviceType: ServiceType | null;
  setVendorId: (id: string | null) => void;
  setHotelId: (id: string | null) => void;
  setServiceType: (service: ServiceType | null) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  resetOnboarding: () => void;
}
