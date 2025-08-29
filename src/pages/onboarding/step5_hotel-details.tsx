// "use client";
// import React, { useState } from "react";
// import axios from "axios";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { AlertCircleIcon } from "lucide-react";
// import { SubStep1_BasicInfo } from "./hotel-details/sub_step1_basic_info";
// import { SubStep2_Location } from "./hotel-details/sub_step2_location";
// import { SubStep3_Property } from "./hotel-details/sub_step3_property";
// import { SubStep4_Amenities } from "./hotel-details/sub_step4_amenities";
// import { SubStep5_Services } from "./hotel-details/sub_step5_services";
// import { SubStep6_Themes } from "./hotel-details/sub_step6_themes";
// import { SubStep7_Localization } from "./hotel-details/sub_step7_localization";
// import type {
//   FeatureOption,
//   HotelDetailsStepProps,
//   HotelPayload,
// } from "./vendor";

// const HOTEL_API_BASE_URL = import.meta.env.VITE_HOTEL_BASE_URL;

// export const Step5_HotelDetails: React.FC<HotelDetailsStepProps> = ({
//   vendorId,
//   onSuccess,
//   onBack,
// }) => {
//   const [currentSubStep, setCurrentSubStep] = useState(1);
//   const [formData, setFormData] = useState<HotelPayload>({
//     name: "",
//     description: "",
//     vendor_id: vendorId,
//     directions: "",
//     star_rating: 3,
//     zip_code: "",
//     address: "",
//     latitude: 0,
//     longitude: 0,
//     distance_from_center_km: 0,
//     destination: "",
//     code: "",
//     country: "",
//     hotel_type: "",
//     number_rooms: 10,
//     number_floors: 1,
//     number_restaurants: 0,
//     number_bars: 0,
//     number_parks: 0,
//     number_halls: 0,
//     discount: 0,
//     is_eco_certified: false,
//     year_built: new Date().getFullYear() - 10,
//     check_in_from: "14:00",
//     check_out_to: "11:00",
//     average_room_price: 0,
//     regions: [],
//     themes: [],
//     meal_types: [],
//     room_type: [],
//     amenities: [],
//     services: [],
//     facilities: [],
//     translations: [],
//     website_url: "",
//     facebook_url: "",
//     instagram_url: "",
//     twitter_url: "",
//     youtube_url: "",
//   });
//   const [errorMessage, setErrorMessage] = useState("");

//   const fetchOptions = (url: string) =>
//     axios.get(url).then((res) => res.data.results);

//   const { data: countries } = useQuery<FeatureOption[]>({
//     queryKey: ["countries"],
//     queryFn: () => fetchOptions(`${HOTEL_API_BASE_URL}countries/`),
//   });
//   const { data: hotelTypes } = useQuery<FeatureOption[]>({
//     queryKey: ["hotelTypes"],
//     queryFn: () => fetchOptions(`${HOTEL_API_BASE_URL}hotel-types/`),
//   });
//   const { data: regions } = useQuery<FeatureOption[]>({
//     queryKey: ["regions"],
//     queryFn: () => fetchOptions(`${HOTEL_API_BASE_URL}regions/`),
//   });
//   const { data: themes } = useQuery<FeatureOption[]>({
//     queryKey: ["themes"],
//     queryFn: () => fetchOptions(`${HOTEL_API_BASE_URL}themes/`),
//   });
//   const { data: mealTypes } = useQuery<FeatureOption[]>({
//     queryKey: ["mealTypes"],
//     queryFn: () => fetchOptions(`${HOTEL_API_BASE_URL}meal-types/`),
//   });
//   const { data: roomTypes } = useQuery<FeatureOption[]>({
//     queryKey: ["roomTypes"],
//     queryFn: () => fetchOptions(`${HOTEL_API_BASE_URL}room-types/`),
//   });
//   const { data: amenities } = useQuery<FeatureOption[]>({
//     queryKey: ["amenities"],
//     queryFn: () => fetchOptions(`${HOTEL_API_BASE_URL}amenities/`),
//   });
//   const { data: services } = useQuery<FeatureOption[]>({
//     queryKey: ["services"],
//     queryFn: () => fetchOptions(`${HOTEL_API_BASE_URL}services/`),
//   });
//   const { data: facilities } = useQuery<FeatureOption[]>({
//     queryKey: ["facilities"],
//     queryFn: () => fetchOptions(`${HOTEL_API_BASE_URL}facilities/`),
//   });
//   const { data: translations } = useQuery<FeatureOption[]>({
//     queryKey: ["translations"],
//     queryFn: () => fetchOptions(`${HOTEL_API_BASE_URL}translations/`),
//   });

//   const mutation = useMutation({
//     mutationFn: (newHotel: HotelPayload) =>
//       axios.post<{ id: string }>(`${HOTEL_API_BASE_URL}hotels/`, newHotel),
//     onSuccess: (response) => {
//       toast.success("Hotel Profile Created!");
//       onSuccess(response.data.id);
//     },
//     onError: (error: any) => {
//       const serverError = error.response?.data;
//       let errorMsg = "An error occurred. Please review the form fields.";
//       if (typeof serverError === "object" && serverError !== null) {
//         errorMsg = Object.entries(serverError)
//           .map(([key, value]) => `${key}: ${(value as string[]).join(", ")}`)
//           .join("; ");
//       }
//       setErrorMessage(errorMsg);
//     },
//   });

//   const handleCheckboxChange = (group: keyof HotelPayload, id: string) => {
//     setFormData((prev) => {
//       const currentSelection = prev[group] as string[];
//       const newSelection = currentSelection.includes(id)
//         ? currentSelection.filter((itemId) => itemId !== id)
//         : [...currentSelection, id];
//       return { ...prev, [group]: newSelection };
//     });
//   };

//   const handleSubmit = () => {
//     setErrorMessage("");
//     mutation.mutate(formData);
//   };

//   const handleNextSubStep = () => setCurrentSubStep((prev) => prev + 1);
//   const handlePrevSubStep = () => setCurrentSubStep((prev) => prev - 1);

//   const renderSubStep = () => {
//     switch (currentSubStep) {
//       case 1:
//         return (
//           <SubStep1_BasicInfo
//             formData={formData}
//             setFormData={setFormData}
//             handleNext={handleNextSubStep}
//             handleBack={onBack}
//             hotelTypes={hotelTypes}
//             handleCheckboxChange={handleCheckboxChange}
//           />
//         );
//       case 2:
//         return (
//           <SubStep2_Location
//             formData={formData}
//             setFormData={setFormData}
//             handleNext={handleNextSubStep}
//             handleBack={handlePrevSubStep}
//             countries={countries}
//             handleCheckboxChange={handleCheckboxChange}
//           />
//         );
//       case 3:
//         return (
//           <SubStep3_Property
//             formData={formData}
//             setFormData={setFormData}
//             handleNext={handleNextSubStep}
//             handleBack={handlePrevSubStep}
//             roomTypes={roomTypes}
//             handleCheckboxChange={handleCheckboxChange}
//           />
//         );
//       case 4:
//         return (
//           <SubStep4_Amenities
//             formData={formData}
//             setFormData={setFormData}
//             handleNext={handleNextSubStep}
//             handleBack={handlePrevSubStep}
//             amenities={amenities}
//             facilities={facilities}
//             handleCheckboxChange={handleCheckboxChange}
//           />
//         );
//       case 5:
//         return (
//           <SubStep5_Services
//             formData={formData}
//             setFormData={setFormData}
//             handleNext={handleNextSubStep}
//             handleBack={handlePrevSubStep}
//             services={services}
//             mealTypes={mealTypes}
//             handleCheckboxChange={handleCheckboxChange}
//           />
//         );
//       case 6:
//         return (
//           <SubStep6_Themes
//             formData={formData}
//             setFormData={setFormData}
//             handleNext={handleNextSubStep}
//             handleBack={handlePrevSubStep}
//             themes={themes}
//             handleCheckboxChange={handleCheckboxChange}
//           />
//         );
//       case 7:
//         return (
//           <SubStep7_Localization
//             formData={formData}
//             setFormData={setFormData}
//             handleNext={handleNextSubStep}
//             handleBack={handlePrevSubStep}
//             translations={translations}
//             regions={regions}
//             handleCheckboxChange={handleCheckboxChange}
//             handleSubmit={handleSubmit}
//             isPending={mutation.isPending}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div>
//       <header className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">
//           Create Your Hotel Profile
//         </h1>
//         <p className="mt-2 text-gray-600">
//           Step {currentSubStep} of 7: Provide the details about your property.
//         </p>
//       </header>

//       {renderSubStep()}

//       {errorMessage && (
//         <Alert variant="destructive" className="mt-6">
//           <AlertCircleIcon className="h-4 w-4" />
//           <AlertTitle>Submission Error</AlertTitle>
//           <AlertDescription>{errorMessage}</AlertDescription>
//         </Alert>
//       )}
//     </div>
//   );
// };

"use client";
import React, { useState } from "react";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

import { SubStep1_BasicInfo } from "./hotel-details/sub_step1_basic_info";
import { SubStep2_Location } from "./hotel-details/sub_step2_location";
import { SubStep3_Property } from "./hotel-details/sub_step3_property";
import { SubStep4_Amenities } from "./hotel-details/sub_step4_amenities";
import { SubStep5_Services } from "./hotel-details/sub_step5_services";
import { SubStep6_Themes } from "./hotel-details/sub_step6_themes";
import { SubStep7_Localization } from "./hotel-details/sub_step7_localization";
import type {
  FeatureOption,
  HotelDetailsStepProps,
  HotelPayload,
} from "./vendor";

const HOTEL_API_BASE_URL = import.meta.env.VITE_HOTEL_BASE_URL;

export const Step5_HotelDetails: React.FC<HotelDetailsStepProps> = ({
  vendorId,
  onSuccess,
  onBack,
  setStepComplete,
}) => {
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [formData, setFormData] = useState<HotelPayload>({
    name: "",
    description: "",
    vendor_id: vendorId,
    directions: "",
    star_rating: 3,
    zip_code: "",
    address: "",
    latitude: 0,
    longitude: 0,
    distance_from_center_km: 0,
    destination: "",
    code: "",
    country: "",
    hotel_type: "",
    number_rooms: 10,
    number_floors: 1,
    number_restaurants: 0,
    number_bars: 0,
    number_parks: 0,
    number_halls: 0,
    discount: 0,
    is_eco_certified: false,
    year_built: new Date().getFullYear() - 10,
    check_in_from: "14:00",
    check_out_to: "11:00",
    average_room_price: 0,
    regions: [],
    themes: [],
    meal_types: [],
    room_type: [],
    amenities: [],
    services: [],
    facilities: [],
    translations: [],
    website_url: "",
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
    youtube_url: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const fetchOptions = (url: string) =>
    axios.get(url).then((res) => res.data.results);

  const { data: countries } = useQuery<FeatureOption[]>({
    queryKey: ["countries"],
    queryFn: () => fetchOptions(`${HOTEL_API_BASE_URL}countries/`),
  });
  const { data: hotelTypes } = useQuery<FeatureOption[]>({
    queryKey: ["hotelTypes"],
    queryFn: () => fetchOptions(`${HOTEL_API_BASE_URL}hotel-types/`),
  });
  const { data: regions } = useQuery<FeatureOption[]>({
    queryKey: ["regions"],
    queryFn: () => fetchOptions(`${HOTEL_API_BASE_URL}regions/`),
  });
  const { data: themes } = useQuery<FeatureOption[]>({
    queryKey: ["themes"],
    queryFn: () => fetchOptions(`${HOTEL_API_BASE_URL}themes/`),
  });
  const { data: mealTypes } = useQuery<FeatureOption[]>({
    queryKey: ["mealTypes"],
    queryFn: () => fetchOptions(`${HOTEL_API_BASE_URL}meal-types/`),
  });
  const { data: roomTypes } = useQuery<FeatureOption[]>({
    queryKey: ["roomTypes"],
    queryFn: () => fetchOptions(`${HOTEL_API_BASE_URL}room-types/`),
  });
  const { data: amenities } = useQuery<FeatureOption[]>({
    queryKey: ["amenities"],
    queryFn: () => fetchOptions(`${HOTEL_API_BASE_URL}amenities/`),
  });
  const { data: services } = useQuery<FeatureOption[]>({
    queryKey: ["services"],
    queryFn: () => fetchOptions(`${HOTEL_API_BASE_URL}services/`),
  });
  const { data: facilities } = useQuery<FeatureOption[]>({
    queryKey: ["facilities"],
    queryFn: () => fetchOptions(`${HOTEL_API_BASE_URL}facilities/`),
  });
  const { data: translations } = useQuery<FeatureOption[]>({
    queryKey: ["translations"],
    queryFn: () => fetchOptions(`${HOTEL_API_BASE_URL}translations/`),
  });

  const mutation = useMutation({
    mutationFn: (newHotel: HotelPayload) =>
      axios.post<{ id: string }>(`${HOTEL_API_BASE_URL}hotels/`, newHotel),
    onSuccess: (response) => {
      toast.success("Hotel Profile Created!");
      onSuccess(response.data.id);
      setStepComplete(true);
    },
    onError: (error: any) => {
      const serverError = error.response?.data;
      let errorMsg = "An error occurred. Please review the form fields.";
      if (typeof serverError === "object" && serverError !== null) {
        errorMsg = Object.entries(serverError)
          .map(([key, value]) => `${key}: ${(value as string[]).join(", ")}`)
          .join("; ");
      }
      setErrorMessage(errorMsg);
    },
  });

  const handleCheckboxChange = (group: keyof HotelPayload, id: string) => {
    setFormData((prev) => {
      const currentSelection = prev[group] as string[];
      const newSelection = currentSelection.includes(id)
        ? currentSelection.filter((itemId) => itemId !== id)
        : [...currentSelection, id];
      return { ...prev, [group]: newSelection };
    });
  };

  const handleSubmit = () => {
    setErrorMessage("");
    mutation.mutate(formData);
  };

  const handleNextSubStep = () => setCurrentSubStep((prev) => prev + 1);
  const handlePrevSubStep = () => setCurrentSubStep((prev) => prev - 1);

  const renderSubStep = () => {
    switch (currentSubStep) {
      case 1:
        return (
          <SubStep1_BasicInfo
            formData={formData}
            setFormData={setFormData}
            handleNext={handleNextSubStep}
            handleBack={onBack}
            hotelTypes={hotelTypes}
            handleCheckboxChange={handleCheckboxChange}
          />
        );
      case 2:
        return (
          <SubStep2_Location
            formData={formData}
            setFormData={setFormData}
            handleNext={handleNextSubStep}
            handleBack={handlePrevSubStep}
            countries={countries}
            handleCheckboxChange={handleCheckboxChange}
          />
        );
      case 3:
        return (
          <SubStep3_Property
            formData={formData}
            setFormData={setFormData}
            handleNext={handleNextSubStep}
            handleBack={handlePrevSubStep}
            roomTypes={roomTypes}
            handleCheckboxChange={handleCheckboxChange}
          />
        );
      case 4:
        return (
          <SubStep4_Amenities
            formData={formData}
            setFormData={setFormData}
            handleNext={handleNextSubStep}
            handleBack={handlePrevSubStep}
            amenities={amenities}
            facilities={facilities}
            handleCheckboxChange={handleCheckboxChange}
          />
        );
      case 5:
        return (
          <SubStep5_Services
            formData={formData}
            setFormData={setFormData}
            handleNext={handleNextSubStep}
            handleBack={handlePrevSubStep}
            services={services}
            mealTypes={mealTypes}
            handleCheckboxChange={handleCheckboxChange}
          />
        );
      case 6:
        return (
          <SubStep6_Themes
            formData={formData}
            setFormData={setFormData}
            handleNext={handleNextSubStep}
            handleBack={handlePrevSubStep}
            themes={themes}
            handleCheckboxChange={handleCheckboxChange}
          />
        );
      case 7:
        return (
          <SubStep7_Localization
            formData={formData}
            setFormData={setFormData}
            handleNext={handleNextSubStep}
            handleBack={handlePrevSubStep}
            translations={translations}
            regions={regions}
            handleCheckboxChange={handleCheckboxChange}
            handleSubmit={handleSubmit}
            isPending={mutation.isPending}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Create Your Hotel Profile
        </h1>
        <p className="mt-2 text-gray-600">
          Step {currentSubStep} of 7: Provide the details about your property.
        </p>
      </header>

      {renderSubStep()}

      {errorMessage && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Submission Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
