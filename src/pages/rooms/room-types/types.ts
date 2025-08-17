export interface HotelImage {
  id: string;
  tag: string;
  original: string;
  category: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export interface RoomTypeAvailability {
  Available?: number;
  Booked?: number;
  Maintenance?: number;
}

export interface HotelRoomType {
  id: string;
  name: string;
  code: string;
  description: string;
  max_occupancy: number;
  bed_type: string;
  size_sqm: string;
  base_price: string;
  images: any[];
  amenities: Amenity[];
  availability: RoomTypeAvailability;
}

export interface Hotel {
  id: string;
  name: string;
  images: HotelImage[];
  room_type: HotelRoomType[];
  availability_stats: {
    status_counts: {
      Available: number;
    };
    occupancy_rate: number;
  };
  summary_counts: {
    rooms: number;
    available_rooms: number;
  };
  pricing_data: {
    avg: number;
  };
}

// src/types/room-types.ts

export interface AmenityDetail {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string;
  is_active: boolean;
}

export interface DetailedRoomType {
  id: string;
  name: string;
  code: string;
  description: string;
  bed_type: string;
  max_occupancy: number;
  room_availability: number;
  image: string;
  size_sqm: string | null;
  base_price: string;
  is_active: boolean;
  features_list: { id: string; name: string }[];
  amenities_details: AmenityDetail[];
}

export interface PaginatedRoomTypes {
  count: number;
  next: string | null;
  previous: string | null;
  results: DetailedRoomType[];
}
