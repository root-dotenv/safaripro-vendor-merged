// - - - src/pages/onboarding/company-info/sub_step2_address.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, AtSign } from "lucide-react";
import { FormField } from "../form-field";
import { SubStepNavigation } from "./sub_step_navigation";
import type { CompanyInfoSubStepProps } from "../vendor";
import { NotesSummary } from "../notes-summary";

// --- NEW: Location API Integration ---

const LOCATIONS_API_BASE = "https://api.locations.co.tz/v1";

// Location API Types
interface Region {
  regionCode: number;
  regionName: string;
}
interface District {
  districtCode: number;
  districtName: string;
}
interface Ward {
  wardCode: number;
  wardName: string;
}

export const SubStep2_Address: React.FC<CompanyInfoSubStepProps> = ({
  formData,
  setFormData,
  handleNext,
  handleBack,
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
    null
  );

  // 1. Fetch all regions
  const { data: regions, isLoading: regionsLoading } = useQuery<Region[]>({
    queryKey: ["allRegions"],
    queryFn: () =>
      axios
        .get(`${LOCATIONS_API_BASE}/regions?limit=100`)
        .then((res) => res.data.data),
  });

  // 2. Fetch districts for the selected region (Optimized Endpoint)
  const { data: districts, isLoading: districtsLoading } = useQuery<District[]>(
    {
      queryKey: ["districtsForRegion", selectedRegionId],
      queryFn: () =>
        axios
          .get(`${LOCATIONS_API_BASE}/regions/${selectedRegionId}/districts`)
          .then((res) => res.data.data),
      enabled: !!selectedRegionId, // Only run this query when a region is selected
    }
  );

  // 3. Fetch wards for the selected district (Optimized Endpoint)
  const { data: wards, isLoading: wardsLoading } = useQuery<Ward[]>({
    queryKey: ["wardsForDistrict", selectedDistrictId],
    queryFn: () =>
      axios
        .get(`${LOCATIONS_API_BASE}/districts/${selectedDistrictId}/wards`)
        .then((res) => res.data.data),
    enabled: !!selectedDistrictId, // Only run this query when a district is selected
  });

  // Effect to set default region to "Dar es Salaam"
  useEffect(() => {
    if (regions && !formData.region) {
      const darEsSalaam = regions.find(
        (region) => region.regionName === "Dar es Salaam"
      );
      if (darEsSalaam) {
        handleRegionChange(darEsSalaam.regionName);
      }
    }
  }, [regions, formData.region]);

  const handleRegionChange = (regionName: string) => {
    const selectedRegion = regions?.find((r) => r.regionName === regionName);
    if (selectedRegion) {
      setSelectedRegionId(selectedRegion.regionCode);
      setFormData((prev) => ({
        ...prev,
        region: regionName,
        city: regionName, // City is derived from region
        district: "", // Reset dependent fields
        ward: "",
      }));
      setSelectedDistrictId(null);
    }
  };

  const handleDistrictChange = (districtName: string) => {
    const selectedDistrict = districts?.find(
      (d) => d.districtName === districtName
    );
    if (selectedDistrict) {
      setSelectedDistrictId(selectedDistrict.districtCode);
      setFormData((prev) => ({
        ...prev,
        district: districtName,
        ward: "", // Reset dependent field
      }));
    }
  };

  const handleWardChange = (wardName: string) => {
    setFormData((prev) => ({ ...prev, ward: wardName }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isComplete =
    formData.region.trim() !== "" &&
    formData.district.trim() !== "" &&
    formData.ward.trim() !== "" &&
    formData.street.trim() !== "" &&
    formData.address.trim() !== "";

  return (
    <div className="space-y-8">
      <NotesSummary title="Accurate Location is Key">
        <p>
          A precise address helps guests find your property easily and ensures
          your listing appears correctly in search results for your area.
        </p>
      </NotesSummary>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* --- MODIFIED: Fields are now dynamic dropdowns --- */}
        <FormField name="region" label="Region" icon={""} required>
          <Select
            value={formData.region}
            onValueChange={handleRegionChange}
            required
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  regionsLoading ? "Loading regions..." : "Select a region"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {regions?.map((region) => (
                <SelectItem key={region.regionCode} value={region.regionName}>
                  {region.regionName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField name="city" label="City" icon={""} required>
          <Input
            name="city"
            value={formData.city}
            readOnly
            placeholder="Auto-filled from region"
            className="bg-gray-100"
          />
        </FormField>

        <FormField
          name="district"
          label="District / Municipality"
          icon={""}
          required
        >
          <Select
            value={formData.district}
            onValueChange={handleDistrictChange}
            disabled={!selectedRegionId || districtsLoading}
            required
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  districtsLoading ? "Loading..." : "Select a district"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {districts?.map((district) => (
                <SelectItem
                  key={district.districtCode}
                  value={district.districtName}
                >
                  {district.districtName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField name="ward" label="Ward" icon={""} required>
          <Select
            value={formData.ward}
            onValueChange={handleWardChange}
            disabled={!selectedDistrictId || wardsLoading}
            required
          >
            <SelectTrigger>
              <SelectValue
                placeholder={wardsLoading ? "Loading..." : "Select a ward"}
              />
            </SelectTrigger>
            <SelectContent>
              {wards?.map((ward) => (
                <SelectItem key={ward.wardCode} value={ward.wardName}>
                  {ward.wardName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        {/* --- UNCHANGED: These fields remain manual input --- */}
        <FormField name="street" label="Street" icon={""} required>
          <Input
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="e.g. Ali Hassan Mwinyi Rd"
            required
          />
        </FormField>
        <FormField name="postal_code" label="Postal Code (Optional)" icon={""}>
          <Input
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            placeholder="e.g. 11101"
          />
        </FormField>
        <FormField
          name="address"
          label="Address Line 1"
          icon={<MapPin size={16} />}
          required
        >
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Building, Plot No."
            required
          />
        </FormField>
        <FormField
          name="address_line2"
          label="Address Line 2 (Optional)"
          icon={<MapPin size={16} />}
        >
          <Input
            name="address_line2"
            value={formData.address_line2}
            onChange={handleChange}
            placeholder="Apartment, suite, etc."
          />
        </FormField>
        <div className="md:col-span-2">
          <FormField
            name="google_place_id"
            label="Google Place ID (Optional)"
            icon={<AtSign size={16} />}
          >
            <Input
              name="google_place_id"
              value={formData.google_place_id}
              onChange={handleChange}
              placeholder="e.g. ChIJ..."
            />
          </FormField>
        </div>
      </div>
      <SubStepNavigation
        onBack={handleBack}
        onNext={handleNext}
        isNextDisabled={!isComplete}
      />
    </div>
  );
};
