"use client";
import { useMemo, type JSX } from "react";
import { useForm, useController, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GrMultiple } from "react-icons/gr";
import hotelClient from "../../api/hotel-client";

// --- Icon Imports ---
import { IoAddOutline } from "react-icons/io5";
import { Loader2, X } from "lucide-react";
import { FiEdit } from "react-icons/fi";

// --- TYPE DEFINITIONS (Unchanged) ---
interface RoomTypeOption {
  id: string;
  name: string;
}
interface AmenityOption {
  id: string;
  name: string;
}
const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;

// --- FORM SCHEMAS ---
const singleRoomSchema = yup.object({
  hotel: yup.string().required(),
  code: yup.string().required("Room code is required."),
  description: yup.string().required("Description is required."),
  room_type: yup.string().required("A room type is required."),
  max_occupancy: yup
    .number()
    .typeError("Max occupancy must be a number")
    .required("Max occupancy is required")
    .min(1, "Occupancy must be at least 1."),
  price_per_night: yup
    .number()
    .typeError("Price must be a number")
    .required("Price per night is required")
    .positive("Price must be a positive number."),
  availability_status: yup
    .string()
    .oneOf(["Available", "Booked", "Maintenance"], "Invalid status")
    .required("Availability status is required."),
  room_amenities: yup.array().of(yup.string().required()).optional(),
  image: yup
    .string()
    .url("Must be a valid image URL.")
    .required("A primary image URL is required."),
});

// MODIFICATION: Added optional description to bulk schema
const bulkCreateSchema = yup.object({
  hotel_id: yup.string().required(),
  room_type_id: yup.string().required("A room type is required."),
  description: yup.string().optional(), // Added optional description
  count: yup
    .number()
    .typeError("Count must be a number.")
    .required("Number of rooms is required.")
    .min(1, "Must create at least one room."),
  price_per_night: yup
    .number()
    .typeError("Price must be a number.")
    .required("Price is required.")
    .positive("Price must be a positive number."),
  amenity_ids: yup.array().of(yup.string().required()).optional(),
  image_urls: yup
    .string()
    .required("At least one image URL is required.")
    .test("is-valid-urls", "Each line must contain a valid URL.", (value) => {
      if (!value) return false;
      const urls = value
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url);
      return urls.every((url) => yup.string().url().isValidSync(url));
    }),
});

type SingleRoomFormData = yup.InferType<typeof singleRoomSchema>;
type BulkCreateFormShape = yup.InferType<typeof bulkCreateSchema>;

// --- API FUNCTIONS (Unchanged) ---
const createSingleRoom = async (data: SingleRoomFormData) => {
  const response = await hotelClient.post("rooms/", data);
  return response.data;
};

const bulkCreateRooms = async (
  data: Omit<BulkCreateFormShape, "image_urls"> & { image_urls: string[] }
) => {
  const response = await hotelClient.post("/rooms/bulk-create/", data);
  return response.data;
};

// --- MAIN PAGE COMPONENT ---
export default function NewRoomPage() {
  const navigate = useNavigate();

  const { data: roomTypes, isLoading: isLoadingRoomTypes } = useQuery<
    RoomTypeOption[]
  >({
    queryKey: ["allRoomTypes"],
    queryFn: async () => (await hotelClient.get("room-types/")).data.results,
  });
  const { data: allAmenities, isLoading: isLoadingAmenities } = useQuery<
    AmenityOption[]
  >({
    queryKey: ["allAmenities"],
    queryFn: async () => (await hotelClient.get("amenities/")).data.results,
  });

  const formProps = {
    roomTypes: roomTypes ?? [],
    allAmenities: allAmenities ?? [],
    onSuccess: () => navigate("/rooms/available-rooms"),
  };

  type TabId = "single" | "bulk";
  interface Tab {
    id: TabId;
    label: string;
    icon: JSX.Element;
    component: JSX.Element;
  }

  const tabs: Tab[] = [
    {
      id: "single",
      label: "Create Single Room",
      icon: <IoAddOutline size={18} />,
      component: <SingleRoomForm {...formProps} />,
    },
    {
      id: "bulk",
      label: "Create Multiple Rooms",
      icon: <GrMultiple />,
      component: <BulkRoomForm {...formProps} />,
    },
  ];

  if (isLoadingRoomTypes || isLoadingAmenities) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-[#FFF]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Hotel Rooms Management
          </h1>
          <p className="mt-1 text-gray-600">
            Add new (single or multiple) rooms to your hotel.
          </p>
        </header>

        <Tabs defaultValue="single" className="w-full">
          <TabsList className="h-auto px-1.5 py-1.75 bg-gray-100 rounded-lg w-full grid grid-cols-2 max-w-md">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-[#0081FB] data-[state=active]:text-[#FFF] data-[state=active]:shadow-sm text-[#0081FB] bg-[#FFF] shadow flex items-center gap-2 hover:text-[#0081FB] mx-1"
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent className="mt-6" key={tab.id} value={tab.id}>
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

// --- Single Room Form Component ---
function SingleRoomForm({ roomTypes, allAmenities, onSuccess }: any) {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<SingleRoomFormData>({
    resolver: yupResolver(singleRoomSchema),
    mode: "onChange",
    defaultValues: {
      hotel: HOTEL_ID,
      code: "",
      description: "",
      room_type: "",
      max_occupancy: "" as any,
      price_per_night: "" as any,
      availability_status: "Available",
      room_amenities: [],
      image: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createSingleRoom,
    onSuccess: (data) => {
      toast.success(`Room "${data.code}" created successfully!`);
      queryClient.invalidateQueries({ queryKey: ["available-rooms"] });
      reset();
      setTimeout(onSuccess, 1500);
    },
    onError: (error: any) =>
      toast.error(error.response?.data?.detail || "An error occurred."),
  });

  const onSubmit = (data: SingleRoomFormData) => {
    mutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
    >
      <div className="lg:col-span-2 p-6 bg-white border border-gray-200 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <FormField control={control} name="code" label="Room Code" />
          <FormField
            control={control}
            name="room_type"
            label="Room Type"
            type="select"
            placeholder="Select a type..."
            options={roomTypes.map((rt: any) => ({
              value: rt.id,
              label: rt.name,
            }))}
          />
        </div>
        <FormField
          control={control}
          name="description"
          label="Room Description"
          type="textarea"
          placeholder="A detailed description of the room..."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <FormField
            control={control}
            name="max_occupancy"
            label="Max Occupancy"
            type="number"
          />
          <FormField
            control={control}
            name="price_per_night"
            label="Room Price/Night (USD)"
            type="number"
          />
        </div>
        <FormField
          control={control}
          name="availability_status"
          label="Initial Room Status"
          type="select"
          placeholder="Select status..."
          options={[
            { value: "Available", label: "Available" },
            { value: "Booked", label: "Booked" },
            { value: "Maintenance", label: "Maintenance" },
          ]}
        />
        <MultiSelectField
          control={control}
          name="room_amenities"
          label="Room Amenities"
          placeholder="Select amenities..."
          options={allAmenities.map((a: any) => ({
            value: a.id,
            label: a.name,
          }))}
        />
        <FormField
          control={control}
          name="image"
          label="Room Image URL"
          placeholder="https://example.com/image.png"
        />

        <div className="flex justify-end mt-8">
          <Button
            className="bg-[#0081FB] hover:bg-blue-700 text-white font-semibold"
            type="submit"
            disabled={!isValid || mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <FiEdit className="mr-1" />
            )}
            {mutation.isPending ? "Creating..." : "Create Room"}
          </Button>
        </div>
      </div>
      <DetailsPreview
        control={control}
        roomTypes={roomTypes}
        allAmenities={allAmenities}
      />
    </form>
  );
}

// --- Bulk Room Form Component ---
function BulkRoomForm({ roomTypes, allAmenities, onSuccess }: any) {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<BulkCreateFormShape>({
    resolver: yupResolver(bulkCreateSchema),
    mode: "onChange",
    // MODIFICATION: Added description to default values
    defaultValues: {
      hotel_id: HOTEL_ID,
      description: "",
      count: 1,
      amenity_ids: [],
      image_urls: "",
    },
  });

  const mutation = useMutation({
    mutationFn: bulkCreateRooms,
    onSuccess: (data) => {
      toast.success(`${data.count || "Rooms"} Rooms created successfully!`);
      queryClient.invalidateQueries({ queryKey: ["available-rooms"] });
      reset();
      setTimeout(onSuccess, 1500);
    },
    onError: (error: any) =>
      console.error(error.response?.data?.detail || "Failed to create rooms."),
  });

  const onSubmit = (data: BulkCreateFormShape) => {
    const payload = {
      ...data,
      image_urls: data.image_urls
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url),
    };
    mutation.mutate(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
    >
      <div className="lg:col-span-2 p-6 bg-white border border-gray-200 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <FormField
            control={control}
            name="room_type_id"
            label="Room Type (for all rooms)"
            type="select"
            placeholder="Select a room type"
            options={roomTypes.map((rt: any) => ({
              value: rt.id,
              label: rt.name,
            }))}
          />
          <FormField
            control={control}
            name="count"
            label="Number of Rooms"
            type="number"
          />
        </div>
        {/* MODIFICATION: Added optional description field */}
        <FormField
          control={control}
          name="description"
          label="Room Description (Optional)"
          type="textarea"
          placeholder="Enter a common description for all rooms... (Optional)"
        />
        <FormField
          control={control}
          name="price_per_night"
          label="Room Price/Night (USD) for each room"
          type="number"
        />
        <MultiSelectField
          control={control}
          name="amenity_ids"
          label="Room Amenities (for all rooms)"
          placeholder="Select amenities..."
          options={allAmenities.map((a: any) => ({
            value: a.id,
            label: a.name,
          }))}
        />
        <FormField
          control={control}
          name="image_urls"
          label="Room Image URLs (one per line)"
          type="textarea"
          placeholder="https://example.com/image1.png
https://example.com/image2.png"
        />
        <div className="flex justify-end mt-8">
          <Button
            className="bg-[#0081FB] hover:bg-blue-700 text-white font-semibold"
            type="submit"
            disabled={!isValid || mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <FiEdit className="mr-1" />
            )}
            {mutation.isPending ? "Creating Rooms..." : "Create Rooms"}
          </Button>
        </div>
      </div>
      <BulkDetailsPreview
        control={control}
        roomTypes={roomTypes}
        allAmenities={allAmenities}
      />
    </form>
  );
}

// --- Details Preview Component ---
function DetailsPreview({ control, roomTypes, allAmenities }: any) {
  const watchedValues = useWatch({ control });

  const roomTypeName = useMemo(
    () =>
      roomTypes?.find((rt: RoomTypeOption) => rt.id === watchedValues.room_type)
        ?.name,
    [watchedValues.room_type, roomTypes]
  );

  const selectedAmenities = useMemo(
    () =>
      allAmenities?.filter((a: AmenityOption) =>
        watchedValues.room_amenities?.includes(a.id)
      ),
    [watchedValues.room_amenities, allAmenities]
  );

  return (
    <Card className="lg:col-span-1 sticky top-8">
      <CardHeader>
        <CardTitle>Room Form Summary</CardTitle>
        <CardDescription>Review the details before submitting.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {watchedValues.image &&
          yup.string().url().isValidSync(watchedValues.image) && (
            <img
              src={watchedValues.image}
              alt="Room Preview"
              className="rounded-lg object-cover w-full h-40 bg-gray-100"
            />
          )}
        <DetailRow
          label="Room Description"
          value={watchedValues.description}
          isParagraph={true}
        />
        <DetailRow label="Room Code" value={watchedValues.code} />
        <DetailRow label="Room Type" value={roomTypeName} />
        <DetailRow
          label="Room Price/Night (USD)"
          value={
            watchedValues.price_per_night
              ? `$${Number(watchedValues.price_per_night).toFixed(2)}`
              : ""
          }
        />
        <DetailRow label="Max Occupancy" value={watchedValues.max_occupancy} />
        <DetailRow label="Status" value={watchedValues.availability_status} />
        <div>
          <p className="text-sm font-medium text-gray-600">Amenities</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedAmenities && selectedAmenities.length > 0 ? (
              selectedAmenities.map((amenity: AmenityOption) => (
                <Badge key={amenity.id} variant="secondary">
                  {amenity.name}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-gray-400">—</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Bulk Details Preview Component ---
function BulkDetailsPreview({ control, roomTypes, allAmenities }: any) {
  const watchedValues = useWatch({ control });

  const roomTypeName = useMemo(
    () =>
      roomTypes?.find(
        (rt: RoomTypeOption) => rt.id === watchedValues.room_type_id
      )?.name,
    [watchedValues.room_type_id, roomTypes]
  );

  const selectedAmenities = useMemo(
    () =>
      allAmenities?.filter((a: AmenityOption) =>
        watchedValues.amenity_ids?.includes(a.id)
      ),
    [watchedValues.amenity_ids, allAmenities]
  );

  const imageUrlsCount = useMemo(() => {
    if (!watchedValues.image_urls) return 0;
    return watchedValues.image_urls
      .split("\n")
      .map((url: string) => url.trim())
      .filter((url: string) => url).length;
  }, [watchedValues.image_urls]);

  return (
    <Card className="lg:col-span-1 sticky top-8">
      <CardHeader>
        <CardTitle>Rooms Form Summary</CardTitle>
        <CardDescription>Review the details before submitting.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <DetailRow label="Room Type" value={roomTypeName} />
        {/* MODIFICATION: Added description to the preview */}
        <DetailRow
          label="Description"
          value={watchedValues.description}
          isParagraph={true}
        />
        <DetailRow label="Number of Rooms" value={watchedValues.count} />
        <DetailRow
          label="Room Price/Night (USD) Each"
          value={
            watchedValues.price_per_night
              ? `$${Number(watchedValues.price_per_night).toFixed(2)}`
              : ""
          }
        />
        <DetailRow label="Images Provided" value={imageUrlsCount} />
        <div>
          <p className="text-sm font-medium text-gray-600">
            Amenities (for all rooms)
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedAmenities && selectedAmenities.length > 0 ? (
              selectedAmenities.map((amenity: AmenityOption) => (
                <Badge key={amenity.id} variant="secondary">
                  {amenity.name}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-gray-400">—</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Reusable Helper Components ---
const DetailRow = ({
  label,
  value,
  isParagraph = false,
}: {
  label: string;
  value: string | number | undefined;
  isParagraph?: boolean;
}) => (
  <div>
    <p className="text-sm font-medium text-gray-600">{label}</p>
    {isParagraph ? (
      <p className="text-sm text-gray-800 break-words">{value || "—"}</p>
    ) : (
      <p className="text-md font-semibold text-gray-900">{value || "—"}</p>
    )}
  </div>
);

const FormField = ({
  control,
  name,
  label,
  type = "text",
  placeholder,
  options,
}: any) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const commonClasses =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100";

  return (
    <div className="mb-6">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={name}
          {...field}
          placeholder={placeholder}
          rows={4}
          className={`resize-none ${commonClasses} ${
            error ? "border-red-500" : ""
          }`}
        />
      ) : type === "select" ? (
        <select
          id={name}
          {...field}
          className={`${commonClasses} ${error ? "border-red-500" : ""}`}
        >
          <option value="" disabled>
            {placeholder || "Select an option"}
          </option>
          {options?.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          {...field}
          placeholder={placeholder}
          className={`${commonClasses} ${error ? "border-red-500" : ""}`}
        />
      )}
      {error && <p className="text-xs text-red-600 mt-1">{error.message}</p>}
    </div>
  );
};

const MultiSelectField = ({
  control,
  name,
  label,
  options,
  placeholder,
}: any) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const handleRemoveItem = (itemValue: string) => {
    const newValue = field.value.filter((v: string) => v !== itemValue);
    field.onChange(newValue);
  };

  const handleAddItem = (itemValue: string) => {
    if (!field.value.includes(itemValue)) {
      field.onChange([...field.value, itemValue]);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <Select
        onValueChange={(value) => {
          if (value) handleAddItem(value);
        }}
      >
        <SelectTrigger className="h-auto min-h-[42px] items-start justify-start p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
          <div className="flex flex-wrap gap-1.5">
            {field.value.length > 0 ? (
              field.value.map((itemValue: string) => {
                const item = options.find(
                  (opt: any) => opt.value === itemValue
                );
                return (
                  <LocalBadge
                    key={itemValue}
                    onRemove={() => handleRemoveItem(itemValue)}
                  >
                    {item?.label || itemValue}
                  </LocalBadge>
                );
              })
            ) : (
              <span className="text-sm text-gray-500 py-0.5 px-1">
                {placeholder}
              </span>
            )}
          </div>
        </SelectTrigger>
        <SelectContent>
          {options
            .filter((opt: any) => !field.value.includes(opt.value))
            .map((option: any) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-red-600 mt-1">{error.message}</p>}
    </div>
  );
};

const LocalBadge = ({ children, onRemove }: any) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      {children}
      <button
        type="button"
        onClick={onRemove}
        className="ml-1 p-0.5 rounded-full hover:bg-blue-200 focus:outline-none"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
};
