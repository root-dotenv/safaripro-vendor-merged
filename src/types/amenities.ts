// src/types/amenities.ts
export interface Amenity {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  usage_count?: number;
}
