export interface VendorPayload {
  business_name: string;
  trading_name: string;
  business_description: string;
  phone_number: string;
  alternative_phone: string;
  email: string;
  contact_person_name: string;
  contact_person_title: string;
  contact_person_email: string;
  contact_person_phone: string;
  website: string;
  address: string;
  city: string;
  region: string;
  country: string;
  postal_code: string;
  registration_number: string;
  tax_id: string;
  business_license: string;
  year_established: number;
  number_of_employees: number;
  [key: string]: any;
}

export interface CreatedVendor {
  id: string;
  business_name: string;
}

export interface DocumentType {
  id: string;
  name: string;
  description: string;
  is_required: boolean;
  allowed_file_types: string;
  max_file_size_mb: number;
}

export interface OnboardingProgress {
  progress_percentage: number;
  steps: {
    document_verification: {
      missing_documents: string[];
    };
  };
}

export interface VendorDetails {
  id: string;
  business_name: string;
  onboarding_progress: OnboardingProgress;
}

export interface BankingDetailsPayload {
  vendor: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  swift_code: string;
  bank_branch: string;
  routing_number: string;
  preferred_currency: "TZS" | "USD" | "KES" | "";
}

export interface VendorDocument {
  id: string;
  document_type_name: string;
  number: string;
  issue_date: string;
}

export interface VendorBankingDetails {
  bank_name: string;
  account_name: string;
  account_number: string;
  swift_code: string;
  bank_branch: string;
  preferred_currency: string;
}

// Update the main VendorDetails to include the new fields
export interface VendorDetails {
  id: string;
  business_name: string;
  trading_name: string;
  phone_number: string;
  email: string;
  website: string;
  contact_person_name: string;
  contact_person_title: string;
  address: string;
  city: string;
  region: string;
  documents: VendorDocument[];
  banking_details: VendorBankingDetails | null;
  onboarding_progress: {
    progress_percentage: number;
  };
}

// --- TYPE DEFINITIONS (Should be in a central types file) ---
export interface HotelPayload {
  name: string;
  description: string;
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
  website_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  youtube_url?: string;
  [key: string]: any;
}

export interface FeatureOption {
  id: string;
  name: string;
  language?: string;
}

export interface CompanyInfoSubStepProps {
  formData: Omit<VendorPayload, "logo">;
  setFormData: React.Dispatch<
    React.SetStateAction<Omit<VendorPayload, "logo">>
  >;
  handleNext: () => void;
  handleBack: () => void;
}

// --- END OF TYPE DEFINITIONS ---
export interface HotelDetailsStepProps {
  vendorId: string;
  onComplete: () => void;
  onBack: () => void;
  onSuccess: (hotelId: string) => void;
}

export interface HotelDetailsSubStepProps {
  formData: HotelPayload;
  setFormData: React.Dispatch<React.SetStateAction<HotelPayload>>;
  handleNext: () => void;
  handleBack: () => void;
  handleCheckboxChange: (group: keyof HotelPayload, id: string) => void;
}
