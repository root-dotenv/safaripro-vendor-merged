 // HotelCustomizationPage.tsx
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import type { Amenity, Country, Facility, Hotel, MealType, Service, Theme, Translation, Region, HotelType } from "./hotel";
import HotelCustomizationHeader from "./HotelCustomizationHeader";
import BasicInfoSection from "./BasicInfoSection";
import PropertyDetailsSection from "./PropertyDetailsSection";
import FeaturesSection from "./FeaturesSection";
import CurrentDetailsSection from "./CurrentDetailsSection"; // Import the section



const BASE_URL = import.meta.env.VITE_HOTEL_BASE_URL;
 
// --- API and Constants ---
const apiClient = axios.create({ baseURL: BASE_URL });
const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;

// --- Helper function for fetching data ---
const fetchResource = async <T>(url:string): Promise<{ results: T[] }> => {
  const response = await apiClient.get(url);
  if (Array.isArray(response.data)) {
    return { results: response.data };
  }
  return response.data;
};

export default function HotelCustomizationPage() {
  const [editData, setEditData] = useState<Partial<Hotel>>({});
  // Re-add 'current' to the state
  const [openSections, setOpenSections] = useState({
    basic: true,
    property: false,
    features: false,
    current: false, 
  });

  const queryClient = useQueryClient();

  // --- Data Fetching with React Query (unchanged) ---
  const { data: hotelData, isLoading: isLoadingHotel, error } = useQuery<Hotel>({
    queryKey: ["hotel", HOTEL_ID],
    queryFn: async () => (await apiClient.get(`hotels/${HOTEL_ID}`)).data,
  });

  const { data: countriesData, isLoading: isLoadingCountries } = useQuery({ queryKey: ["countries"], queryFn: () => fetchResource<Country>("countries/") });
  const { data: themesData, isLoading: isLoadingThemes } = useQuery({ queryKey: ["themes"], queryFn: () => fetchResource<Theme>("themes/") });
  const { data: mealTypesData, isLoading: isLoadingMealTypes } = useQuery({ queryKey: ["mealTypes"], queryFn: () => fetchResource<MealType>("meal-types/") });
  const { data: amenitiesData, isLoading: isLoadingAmenities } = useQuery({ queryKey: ["amenities"], queryFn: () => fetchResource<Amenity>("amenities/") });
  const { data: servicesData, isLoading: isLoadingServices } = useQuery({ queryKey: ["services"], queryFn: () => fetchResource<Service>("services/") });
  const { data: facilitiesData, isLoading: isLoadingFacilities } = useQuery({ queryKey: ["facilities"], queryFn: () => fetchResource<Facility>("facilities/") });
  const { data: translationsData, isLoading: isLoadingTranslations } = useQuery({ queryKey: ["translations"], queryFn: () => fetchResource<Translation>("translations/") });
  const { data: regionsData, isLoading: isLoadingRegions } = useQuery({ queryKey: ["regions"], queryFn: () => fetchResource<Region>("regions/") });
  const { data: hotelTypesData, isLoading: isLoadingHotelTypes } = useQuery({ queryKey: ["hotelTypes"], queryFn: () => fetchResource<HotelType>("hotel-types/") });

  const isLoading = isLoadingHotel || isLoadingCountries || isLoadingThemes || isLoadingMealTypes || isLoadingAmenities || isLoadingServices || isLoadingFacilities || isLoadingTranslations || isLoadingRegions || isLoadingHotelTypes;

  // --- Mutation for Updating Hotel (unchanged) ---
  const updateHotelMutation = useMutation({
    mutationFn: async (changes: Partial<Hotel>) => (await apiClient.patch(`hotels/${HOTEL_ID}/`, changes)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotel", HOTEL_ID] });
      alert("Hotel details updated successfully! ✅");
    },
    onError: (err: any) => {
      alert(`Failed to update hotel: ${err.response?.data?.message || err.message}`);
    },
  });

  useEffect(() => {
    if (hotelData) setEditData(hotelData);
  }, [hotelData]);

  const toggleSection = (section: keyof typeof openSections) => setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  const handleFieldChange = (field: keyof Hotel, value: any) => setEditData((prev) => ({ ...prev, [field]: value }));
  const handleArrayFieldChange = (field: keyof Hotel, value: string[]) => setEditData((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (!hotelData) return;
    const changes: Partial<Hotel> = {};
    Object.keys(editData).forEach((key) => {
      const k = key as keyof Hotel;
      if (JSON.stringify(editData[k]) !== JSON.stringify(hotelData[k])) {
        changes[k] = editData[k] as any;
      }
    });

    if (Object.keys(changes).length === 0) {
      alert("No changes to save.");
      return;
    }
    updateHotelMutation.mutate(changes);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading Hotel Data...</span>
      </div>
    );
  }

  if (error || !hotelData) {
    return <p className="p-8 text-center text-red-600">Error: Failed to load hotel data.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-none min-h-screen">
      <HotelCustomizationHeader hotelName={hotelData.name} onSave={handleSave} isSaving={updateHotelMutation.isPending} />
      <div className="space-y-1 mt-4">
        <BasicInfoSection isOpen={openSections.basic} onToggle={() => toggleSection("basic")} editData={editData} handleFieldChange={handleFieldChange} />
        <PropertyDetailsSection 
            isOpen={openSections.property} 
            onToggle={() => toggleSection("property")} 
            editData={editData} 
            handleFieldChange={handleFieldChange} 
            countries={countriesData?.results || []} 
            hotelTypes={hotelTypesData?.results || []}
        />
        <FeaturesSection 
            isOpen={openSections.features} 
            onToggle={() => toggleSection("features")} 
            editData={editData} 
            handleArrayFieldChange={handleArrayFieldChange}
            themes={themesData?.results || []}
            mealTypes={mealTypesData?.results || []}
            amenities={amenitiesData?.results || []}
            services={servicesData?.results || []}
            facilities={facilitiesData?.results || []}
            translations={translationsData?.results || []}
            regions={regionsData?.results || []}
        />
        <CurrentDetailsSection 
            isOpen={openSections.current} 
            onToggle={() => toggleSection("current")} 
            hotelData={hotelData} 
        />
      </div>
    </div>
  );
}