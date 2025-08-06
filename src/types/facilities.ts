// src/types/facilities.ts
export interface Facility {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string | null;
  availability: string | null;
  category_id: string | null;
  category_name?: string | null;
  fee_applies: boolean;
  reservation_required: boolean;
  additional_info: string | null;
  additional_info_parsed?: Record<string, any>;
  translation_id?: string | null;
  translation_language?: string | null;
  hotel_count?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
