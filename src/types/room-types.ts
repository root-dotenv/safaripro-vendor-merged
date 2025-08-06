export interface RoomType {
  id: string;
  created_by: string | null;
  updated_by: string | null;
  deleted_by: string | null;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  code: string;
  name: string;
  description: string;
  max_occupancy: number;
  bed_type: string;
  room_availability: number;
  image: string;
  size_sqm: number | null;
  base_price: string;
  translation: string | null;
  features: string[];
  amenities: string[];
}
