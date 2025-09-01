// src/types/company.ts

/**
 * Represents the full data structure for a Vendor as returned by the backend.
 * It includes read-only fields like IDs and timestamps.
 */
export interface Vendor {
  id: string;
  status_display: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
  business_name: string;
  trading_name: string;
  logo: string | null;
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
  address_line2: string;
  city: string;
  region: string;
  street: string;
  country: string;
  postal_code: string;
  latitude: string;
  longitude: string;
  google_place_id: string;
  registration_number: string;
  tax_id: string;
  business_license: string;
  year_established: number;
  number_of_employees: number;
  rating: string;
  featured: boolean;
  subscription_id: string | null;
  analytics_id: string;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string;
  suspended_at: string | null;
  suspension_reason: string;
  last_verified_by: string | null;
  last_verification_date: string | null;
}

/**
 * Represents the data structure needed to create a new Vendor.
 * This is what our Step 1 form will send to the backend.
 * We can make some fields optional if they are not strictly required for creation.
 */
export type CreateVendorPayload = Omit<
  Vendor,
  | "id"
  | "status_display"
  | "created_at"
  | "updated_at"
  | "is_deleted"
  | "deleted_at"
  | "approved_at"
  | "rejected_at"
  | "rejection_reason"
  | "suspended_at"
  | "suspension_reason"
  | "last_verified_by"
  | "last_verification_date"
  | "subscription_id"
  | "analytics_id"
  | "logo"
>;
