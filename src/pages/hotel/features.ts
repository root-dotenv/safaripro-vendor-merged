// src/types/features.ts

// --- Amenity ---
export interface Amenity {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string;
  usage_count?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// --- Facility ---
export interface Facility {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string;
  category_name?: string;
  fee_applies: boolean;
  reservation_required: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// --- Service ---
export interface Service {
  id: string;
  name: string;
  description: string;
  amendment: string | null;
  icon: string;
  service_type_name?: string;
  service_scope_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// --- Meal Type ---
export interface MealType {
  id: string;
  name: string;
  code: string;
  description: string;
  score: number;
  hotel_count?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
