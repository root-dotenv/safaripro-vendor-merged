import axios from "axios";

const LOCATIONS_API_BASE = "https://api.locations.co.tz/v1";

// Centralized API Types
export interface Region {
  regionCode: number;
  regionName: string;
}

export interface District {
  districtCode: number;
  districtName: string;
}

export interface Ward {
  wardCode: number;
  wardName: string;
}

/**
 * Fetches a list of all regions.
 * This function is used for prefetching in the onboarding wizard.
 */
export const getRegions = async (): Promise<Region[]> => {
  const response = await axios.get(`${LOCATIONS_API_BASE}/regions?limit=100`);
  return response.data.data;
};
