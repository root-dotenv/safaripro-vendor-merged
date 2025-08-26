// src/api/apiClient.ts
import axios from "axios";
import type { Hotel } from "@/pages/miscellaneous/walkthrough";

// Read base URLs from the .env file
const VENDOR_BASE_URL = import.meta.env.VITE_VENDOR_BASE_URL;
const HOTEL_BASE_URL = import.meta.env.VITE_HOTEL_BASE_URL;

// Create separate axios instances for each microservice
const vendorApiClient = axios.create({ baseURL: VENDOR_BASE_URL });
const hotelApiClient = axios.create({ baseURL: HOTEL_BASE_URL });

// --- API Functions that build the full, direct URLs ---

// GET: Fetch a specific vendor's profile
export const getVendorProfile = (vendorId: string) => {
  return vendorApiClient.get(`/vendors/${vendorId}`);
};

// GET: Fetch a specific hotel's profile
export const getHotelProfile = (hotelId: string) => {
  return hotelApiClient.get(`/hotels/${hotelId}/`);
};

// PATCH: Upload a logo for a specific vendor
export const uploadVendorLogo = (vendorId: string, formData: FormData) => {
  return vendorApiClient.patch(`/vendors/${vendorId}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// GET: Fetch social accounts for a specific vendor
export const getSocialAccounts = (vendorId: string) => {
  return vendorApiClient.get(`/social-media?vendor=${vendorId}`);
};

// POST: Add a new social account for a specific vendor
export const addSocialAccount = (
  vendorId: string,
  data: { platform: string; url?: string; handle: string }
) => {
  return vendorApiClient.post(`/social-media`, {
    ...data,
    vendor: vendorId,
    is_active: true,
  });
};

// GET: Fetch images for a specific hotel
export const getHotelImages = (hotelId: string) => {
  return hotelApiClient.get(`/hotel-images/?hotel_id=${hotelId}`);
};

// POST: Add a new image for a specific hotel
export const addHotelImage = (
  hotelId: string,
  categoryId: string,
  data: { original: string }
) => {
  return hotelApiClient.post(`/hotel-images/`, {
    tag: "hotel-images",
    original: data.original,
    category: categoryId,
    hotel: hotelId,
  });
};

// PATCH: Update details for a specific hotel
export const updateHotelDetails = (hotelId: string, data: Partial<Hotel>) => {
  return hotelApiClient.patch(`/hotels/${hotelId}/`, data);
};
