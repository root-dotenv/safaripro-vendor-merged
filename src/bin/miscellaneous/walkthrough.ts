export interface Vendor {
  id: string;
  business_name: string;
  logo?: string;
}

export interface SocialMedia {
  id: string;
  platform_display: string;
  handle: string;
}

export interface HotelImage {
  id: string;
  original: string;
  tag: string;
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  star_rating: number;
  latitude: number;
  longitude: number;
  check_in_from: string;
  check_out_to: string;
}
