// src/types/booking-types.ts (or your preferred types file)

export interface Booking {
  id: string;
  full_name: string;
  code: string;
  email: string;
  start_date: string;
  end_date: string;
  amount_paid: string;
  amount_required: string;
  booking_status: string;
  payment_status: "Paid" | "Pending" | "Failed";
  microservice_item_name: string;
  property_item_type: string;
  created_at: string;
}

export interface PaginatedBookingsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Booking[];
}

export interface Room {
  id: string;
  code: string;
  description: string;
  image: string;
  price_per_night: number;
  availability_status: "Available" | "Booked" | "Maintenance" | "Processing";
  max_occupancy: number;
  is_active: boolean;
}

export interface PaginatedRoomsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Room[];
}

// src/types/booking-types.ts

// Add this new interface
export interface BookingDetails extends Booking {
  property_details: {
    id: string;
    name: string;
    category: string;
  };
  duration_days: number;
  status_history: Array<{
    timestamp: string;
    new_status: string;
    previous_status: string;
  }>;
  special_requests: string;
  payment_method: string;
}

// src/types/booking-types.ts

// Add this interface
export interface RoomDetails extends Room {
  hotel_name: string;
  room_type_name: string;
  amenities: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
}
