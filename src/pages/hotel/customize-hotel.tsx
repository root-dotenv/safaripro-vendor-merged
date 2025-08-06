import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  ChevronDown,
  Save,
  Loader2,
  Building,
  MapPin,
  Globe,
  Settings,
  Star,
  Bed,
  Palette,
  Utensils,
  Wifi,
  Car,
  Coffee,
  X,
} from "lucide-react";

// Types
interface RoomType {
  id: string;
  name: string;
  code: string;
  max_occupancy: number;
  bed_type: string;
  room_counts?: {
    Available: number;
    Booked: number;
    Maintenance: number;
    Cancelled: number;
    Pending: number;
    Processing: number;
    Not_Available: number;
    total: number;
  };
  availability?: {
    status_counts: Record<string, number>;
    total_rooms: number;
    available_rooms: number;
    booked_rooms: number;
    maintenance_rooms: number;
    occupancy_percentage: number;
  };
  pricing?: {
    min_price: number;
    max_price: number;
    avg_price: number;
  };
}

interface Theme {
  id: string;
  name: string;
  description?: string;
}

interface MealType {
  id: string;
  code: string;
  name: string;
  score?: number;
}

interface Amenity {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
}

interface Facility {
  id: string;
  name: string;
}

interface Hotel {
  id: string;
  // ... (all other existing hotel properties)
  room_type: RoomType[];
  themes: string[] | Theme[];
  meal_types: string[] | MealType[];
  amenities: string[] | Amenity[];
  services: string[] | Service[];
  facilities: string[] | Facility[];
  // ... (rest of the existing interface)
}

const BASE_URL = import.meta.env.VITE_HOTEL_BASE_URL;
const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;

// API configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Component props
interface AccordionItemProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

interface FormFieldProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  options?: { value: any; label: string }[];
  isMulti?: boolean;
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "secondary" | "primary" | "destructive";
  onRemove?: () => void;
}

const AccordionItem = ({
  title,
  icon: Icon,
  isOpen,
  onToggle,
  children,
}: AccordionItemProps) => {
  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
      >
        <div className="flex items-center space-x-3">
          <Icon className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-white rounded-b-lg">{children}</div>
      )}
    </div>
  );
};

const FormField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
  options,
  isMulti = false,
}: FormFieldProps) => {
  if (type === "select") {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <select
          value={value || ""}
          onChange={(e) => {
            if (isMulti) {
              const selectedOptions = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              );
              onChange(selectedOptions);
            } else {
              onChange(e.target.value);
            }
          }}
          disabled={disabled}
          multiple={isMulti}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) =>
            onChange(
              type === "number"
                ? parseFloat(e.target.value) || ""
                : e.target.value
            )
          }
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        />
      )}
    </div>
  );
};

const Badge = ({ children, variant = "secondary", onRemove }: BadgeProps) => {
  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variantClasses = {
    secondary: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    destructive: "bg-red-100 text-red-800",
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} mr-2 mb-2`}>
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 p-0.5 rounded-full hover:bg-gray-200 focus:outline-none"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};

const MultiSelectInput = ({
  label,
  value = [],
  onChange,
  options,
  placeholder = "Select items",
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    setFilteredOptions(
      options.filter(
        (option) =>
          !value.includes(option.value) &&
          option.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
  }, [inputValue, value, options]);

  const handleAddItem = (itemValue: string) => {
    if (!value.includes(itemValue)) {
      onChange([...value, itemValue]);
      setInputValue("");
      setIsOpen(false);
    }
  };

  const handleRemoveItem = (itemValue: string) => {
    onChange(value.filter((v) => v !== itemValue));
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="flex flex-wrap items-center border border-gray-300 rounded-md p-2 min-h-10">
          {value.length > 0 ? (
            value.map((itemValue) => {
              const item = options.find((opt) => opt.value === itemValue);
              return (
                <Badge
                  key={itemValue}
                  onRemove={() => handleRemoveItem(itemValue)}
                >
                  {item?.label || itemValue}
                </Badge>
              );
            })
          ) : (
            <span className="text-gray-400 text-sm">{placeholder}</span>
          )}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            className="flex-grow outline-none bg-transparent ml-1"
            placeholder={value.length === 0 ? placeholder : ""}
          />
        </div>
        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-300 max-h-60 overflow-auto">
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onMouseDown={() => handleAddItem(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function HotelCustomizationComponent() {
  const [editData, setEditData] = useState<Partial<Hotel>>({});
  const [openSections, setOpenSections] = useState({
    basic: true,
    property: false,
    features: false,
    current: false,
  });

  const queryClient = useQueryClient();

  // Fetch hotel data
  const {
    data: hotelData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hotel", HOTEL_ID],
    queryFn: async (): Promise<Hotel> => {
      const response = await apiClient.get(`hotels/${HOTEL_ID}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch available options for features
  const { data: roomTypes } = useQuery({
    queryKey: ["roomTypes"],
    queryFn: async (): Promise<RoomType[]> => {
      const response = await apiClient.get("room-types/");
      return response.data.results;
    },
  });

  const { data: themes } = useQuery({
    queryKey: ["themes"],
    queryFn: async (): Promise<Theme[]> => {
      const response = await apiClient.get("themes/");
      return response.data.results;
    },
  });

  const { data: mealTypes } = useQuery({
    queryKey: ["mealTypes"],
    queryFn: async (): Promise<MealType[]> => {
      const response = await apiClient.get("meal-types/");
      return response.data.results;
    },
  });

  const { data: amenities } = useQuery({
    queryKey: ["amenities"],
    queryFn: async (): Promise<Amenity[]> => {
      const response = await apiClient.get("amenities/");
      return response.data.results;
    },
  });

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async (): Promise<Service[]> => {
      const response = await apiClient.get("services/");
      return response.data.results;
    },
  });

  const { data: facilities } = useQuery({
    queryKey: ["facilities"],
    queryFn: async (): Promise<Facility[]> => {
      const response = await apiClient.get("facilities/");
      return response.data.results;
    },
  });

  // Update hotel mutation
  const updateHotelMutation = useMutation({
    mutationFn: async (changes: Partial<Hotel>) => {
      const response = await apiClient.patch(`hotels/${HOTEL_ID}/`, changes);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotel", HOTEL_ID] });
      alert("Hotel details updated successfully!");
    },
    onError: (error: any) => {
      console.error("Error updating hotel:", error);
      alert(
        `Failed to update hotel details: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  // Initialize edit data when hotel data is loaded
  useEffect(() => {
    if (hotelData) {
      setEditData(hotelData);
    }
  }, [hotelData]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFieldChange = (field: string, value: any) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayFieldChange = (field: string, value: string[]) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!hotelData) return;

    // Prepare changes
    const changes: Partial<Hotel> = {};

    Object.keys(editData).forEach((key) => {
      const editValue = editData[key as keyof Hotel];
      const originalValue = hotelData[key as keyof Hotel];

      if (JSON.stringify(editValue) !== JSON.stringify(originalValue)) {
        changes[key as keyof Hotel] = editValue as any;
      }
    });

    if (Object.keys(changes).length === 0) {
      alert("No changes to save");
      return;
    }

    updateHotelMutation.mutate(changes);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading hotel details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-red-600">
          Error loading hotel details: {error.message}
        </p>
      </div>
    );
  }

  if (!hotelData) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-gray-600">No hotel data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hotel Customization
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and edit details for {hotelData.name}
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={updateHotelMutation.isPending}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {updateHotelMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {updateHotelMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-4">
        {/* Basic Info */}
        <AccordionItem
          title="Basic Information"
          icon={Building}
          isOpen={openSections.basic}
          onToggle={() => toggleSection("basic")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Hotel Name"
              value={editData.name}
              onChange={(value) => handleFieldChange("name", value)}
              placeholder="Enter hotel name"
            />
            <FormField
              label="Hotel Code"
              value={editData.code}
              onChange={(value) => handleFieldChange("code", value)}
              placeholder="Enter hotel code"
            />
            <div className="md:col-span-2">
              <FormField
                label="Description"
                type="textarea"
                value={editData.description}
                onChange={(value) => handleFieldChange("description", value)}
                placeholder="Enter hotel description"
              />
            </div>
            <FormField
              label="Star Rating"
              type="number"
              value={editData.star_rating}
              onChange={(value) => handleFieldChange("star_rating", value)}
              placeholder="1-5"
            />
            <FormField
              label="Year Built"
              type="number"
              value={editData.year_built}
              onChange={(value) => handleFieldChange("year_built", value)}
              placeholder="Enter year built"
            />
            <FormField
              label="Number of Rooms"
              type="number"
              value={editData.number_rooms}
              onChange={(value) => handleFieldChange("number_rooms", value)}
              placeholder="Enter total rooms"
            />
            <FormField
              label="Number of Floors"
              type="number"
              value={editData.number_floors}
              onChange={(value) => handleFieldChange("number_floors", value)}
              placeholder="Enter number of floors"
            />
          </div>

          {/* Online Presence */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-blue-600" />
              Online Presence
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Website URL"
                value={editData.website_url}
                onChange={(value) => handleFieldChange("website_url", value)}
                placeholder="https://example.com"
              />
              <FormField
                label="Facebook URL"
                value={editData.facebook_url}
                onChange={(value) => handleFieldChange("facebook_url", value)}
                placeholder="https://facebook.com/..."
              />
              <FormField
                label="Instagram URL"
                value={editData.instagram_url}
                onChange={(value) => handleFieldChange("instagram_url", value)}
                placeholder="https://instagram.com/..."
              />
              <FormField
                label="Twitter URL"
                value={editData.twitter_url}
                onChange={(value) => handleFieldChange("twitter_url", value)}
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>
        </AccordionItem>

        {/* Property Details */}
        <AccordionItem
          title="Property Details"
          icon={MapPin}
          isOpen={openSections.property}
          onToggle={() => toggleSection("property")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormField
                label="Address"
                value={editData.address}
                onChange={(value) => handleFieldChange("address", value)}
                placeholder="Enter full address"
              />
            </div>
            <FormField
              label="Zip Code"
              value={editData.zip_code}
              onChange={(value) => handleFieldChange("zip_code", value)}
              placeholder="Enter zip code"
            />
            <FormField
              label="Country ID"
              value={editData.country}
              onChange={(value) => handleFieldChange("country", value)}
              placeholder="Country identifier"
            />
            <FormField
              label="Latitude"
              type="number"
              value={editData.latitude}
              onChange={(value) => handleFieldChange("latitude", value)}
              placeholder="Enter latitude"
            />
            <FormField
              label="Longitude"
              type="number"
              value={editData.longitude}
              onChange={(value) => handleFieldChange("longitude", value)}
              placeholder="Enter longitude"
            />
            <FormField
              label="Check-in From"
              value={editData.check_in_from}
              onChange={(value) => handleFieldChange("check_in_from", value)}
              placeholder="e.g., 14:00"
            />
            <FormField
              label="Check-out To"
              value={editData.check_out_to}
              onChange={(value) => handleFieldChange("check_out_to", value)}
              placeholder="e.g., 11:00"
            />
          </div>
        </AccordionItem>

        {/* Features */}
        <AccordionItem
          title="Features & Services"
          icon={Settings}
          isOpen={openSections.features}
          onToggle={() => toggleSection("features")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Room Types */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                <Bed className="h-4 w-4 mr-2 text-blue-600" />
                Room Types
              </h4>
              {roomTypes && (
                <MultiSelectInput
                  label="Select Room Types"
                  value={editData.room_type?.map((rt) => rt.id) || []}
                  onChange={(selectedIds) => {
                    const selectedRoomTypes = roomTypes.filter((rt) =>
                      selectedIds.includes(rt.id)
                    );
                    handleFieldChange("room_type", selectedRoomTypes);
                  }}
                  options={roomTypes.map((rt) => ({
                    value: rt.id,
                    label: `${rt.name} (${rt.code})`,
                  }))}
                  placeholder="Add room types"
                />
              )}
              <div className="space-y-2">
                {editData.room_type?.length ? (
                  editData.room_type.map((room) => (
                    <Badge key={room.id} variant="primary">
                      {room.name} ({room.code})
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No room types selected
                  </p>
                )}
              </div>
            </div>

            {/* Themes */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                <Palette className="h-4 w-4 mr-2 text-blue-600" />
                Themes
              </h4>
              {themes && (
                <MultiSelectInput
                  label="Select Themes"
                  value={editData.themes || []}
                  onChange={(value) => handleArrayFieldChange("themes", value)}
                  options={themes.map((theme) => ({
                    value: theme.id,
                    label: theme.name,
                  }))}
                  placeholder="Add themes"
                />
              )}
              <div className="space-y-2">
                {editData.themes?.length ? (
                  editData.themes.map((themeId, index) => {
                    const theme = themes?.find((t) => t.id === themeId);
                    return <Badge key={index}>{theme?.name || themeId}</Badge>;
                  })
                ) : (
                  <p className="text-gray-500 text-sm">No themes selected</p>
                )}
              </div>
            </div>

            {/* Meal Types */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                <Utensils className="h-4 w-4 mr-2 text-blue-600" />
                Meal Types
              </h4>
              {mealTypes && (
                <MultiSelectInput
                  label="Select Meal Types"
                  value={editData.meal_types || []}
                  onChange={(value) =>
                    handleArrayFieldChange("meal_types", value)
                  }
                  options={mealTypes.map((meal) => ({
                    value: meal.id,
                    label: `${meal.name} (${meal.code})`,
                  }))}
                  placeholder="Add meal types"
                />
              )}
              <div className="space-y-2">
                {editData.meal_types?.length ? (
                  editData.meal_types.map((mealId, index) => {
                    const meal = mealTypes?.find((m) => m.id === mealId);
                    return <Badge key={index}>{meal?.name || mealId}</Badge>;
                  })
                ) : (
                  <p className="text-gray-500 text-sm">
                    No meal types selected
                  </p>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                <Wifi className="h-4 w-4 mr-2 text-blue-600" />
                Amenities
              </h4>
              {amenities && (
                <MultiSelectInput
                  label="Select Amenities"
                  value={editData.amenities || []}
                  onChange={(value) =>
                    handleArrayFieldChange("amenities", value)
                  }
                  options={amenities.map((amenity) => ({
                    value: amenity.id,
                    label: amenity.name,
                  }))}
                  placeholder="Add amenities"
                />
              )}
              <div className="space-y-2">
                {editData.amenities?.length ? (
                  editData.amenities.map((amenityId, index) => {
                    const amenity = amenities?.find((a) => a.id === amenityId);
                    return (
                      <Badge key={index}>{amenity?.name || amenityId}</Badge>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-sm">No amenities selected</p>
                )}
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                <Coffee className="h-4 w-4 mr-2 text-blue-600" />
                Services
              </h4>
              {services && (
                <MultiSelectInput
                  label="Select Services"
                  value={editData.services || []}
                  onChange={(value) =>
                    handleArrayFieldChange("services", value)
                  }
                  options={services.map((service) => ({
                    value: service.id,
                    label: service.name,
                  }))}
                  placeholder="Add services"
                />
              )}
              <div className="space-y-2">
                {editData.services?.length ? (
                  editData.services.map((serviceId, index) => {
                    const service = services?.find((s) => s.id === serviceId);
                    return (
                      <Badge key={index}>{service?.name || serviceId}</Badge>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-sm">No services selected</p>
                )}
              </div>
            </div>

            {/* Facilities */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                <Car className="h-4 w-4 mr-2 text-blue-600" />
                Facilities
              </h4>
              {facilities && (
                <MultiSelectInput
                  label="Select Facilities"
                  value={editData.facilities || []}
                  onChange={(value) =>
                    handleArrayFieldChange("facilities", value)
                  }
                  options={facilities.map((facility) => ({
                    value: facility.id,
                    label: facility.name,
                  }))}
                  placeholder="Add facilities"
                />
              )}
              <div className="space-y-2">
                {editData.facilities?.length ? (
                  editData.facilities.map((facilityId, index) => {
                    const facility = facilities?.find(
                      (f) => f.id === facilityId
                    );
                    return (
                      <Badge key={index}>{facility?.name || facilityId}</Badge>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-sm">
                    No facilities selected
                  </p>
                )}
              </div>
            </div>
          </div>
        </AccordionItem>

        {/* Current Details */}
        <AccordionItem
          title="Current Details"
          icon={Star}
          isOpen={openSections.current}
          onToggle={() => toggleSection("current")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Stats */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">
                Basic Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{hotelData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Code:</span>
                  <span className="font-medium">{hotelData.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Star Rating:</span>
                  <span className="font-medium">{hotelData.star_rating}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year Built:</span>
                  <span className="font-medium">
                    {hotelData.year_built || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Location</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-medium text-right">
                    {hotelData.address}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Zip Code:</span>
                  <span className="font-medium">{hotelData.zip_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Coordinates:</span>
                  <span className="font-medium">
                    {hotelData.latitude}, {hotelData.longitude}
                  </span>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">
                System Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {new Date(hotelData.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Updated:</span>
                  <span className="font-medium">
                    {new Date(hotelData.updated_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-medium ${
                      hotelData.is_active ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {hotelData.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </AccordionItem>
      </div>
    </div>
  );
}
