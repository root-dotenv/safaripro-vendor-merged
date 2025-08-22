"use client";
import { useMemo, useId, type JSX } from "react";
import { useForm, Controller, useController, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultipleSelector, { type Option } from "@/components/ui/multiselect";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import hotelClient from "../../api/hotel-client";

// --- Icon Imports ---
import { IoAddOutline, IoCreateOutline } from "react-icons/io5";
import { FaLayerGroup } from "react-icons/fa";
import { Loader2 } from "lucide-react";

// --- TYPE DEFINITIONS ---
interface RoomTypeOption {
  id: string;
  name: string;
}
interface AmenityOption {
  id: string;
  name: string;
}
const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;

// --- FORM SCHEMAS (Unchanged) ---
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

const bulkCreateSchema = yup.object({
  hotel_id: yup.string().required(),
  room_type_id: yup.string().required("A room type is required."),
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

// --- MAIN PAGE COMPONENT (Redesigned) ---
export default function NewRoomPage() {
  const navigate = useNavigate();

  // --- Data Fetching (for both forms) ---
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

  // Common props for both form components
  const formProps = {
    roomTypes: roomTypes ?? [],
    allAmenities: allAmenities ?? [],
    onSuccess: () => navigate("/rooms/available-rooms"),
  };

  // --- Tab Configuration ---
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
      icon: <FaLayerGroup />,
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
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Room Management
          </h1>
          <p className="mt-1 text-gray-600">
            Add new single or multiple rooms to your hotel.
          </p>
        </header>

        <Tabs defaultValue="single" className="w-full">
          <TabsList className="h-auto p-1.5 bg-gray-100 rounded-lg w-full grid grid-cols-2">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-background data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-muted-foreground flex items-center gap-2 py-2"
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

// --- Single Room Form Component (Unchanged) ---
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
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-2xl">Room Details</CardTitle>
          <CardDescription>
            Fill out the details below to add a new room to the system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <div className="space-y-6">
            <AnimatedInput control={control} name="code" label="Room Code *" />
            <FormSelect
              control={control}
              name="room_type"
              label="Room Type *"
              placeholder="Select a type..."
              options={
                roomTypes?.map((rt: any) => ({
                  value: rt.id,
                  label: rt.name,
                })) ?? []
              }
            />
            <FormTextArea
              control={control}
              name="description"
              label="Description *"
              placeholder="A detailed description of the room..."
            />
            <AnimatedInput
              control={control}
              name="max_occupancy"
              label="Max Occupancy *"
              type="number"
            />
            <AnimatedInput
              control={control}
              name="price_per_night"
              label="Price/Night *"
              type="number"
              step="0.01"
            />
            <FormSelect
              control={control}
              name="availability_status"
              label="Status *"
              placeholder="Select status..."
              options={[
                { value: "Available", label: "Available" },
                { value: "Booked", label: "Booked" },
                { value: "Maintenance", label: "Maintenance" },
              ]}
            />
            <Controller
              control={control}
              name="room_amenities"
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label>Amenities</Label>
                  <MultipleSelector
                    value={allAmenities
                      ?.filter((opt: any) => field.value?.includes(opt.id))
                      .map((a: any) => ({ value: a.id, label: a.name }))}
                    onChange={(options: any) =>
                      field.onChange(options.map((opt: any) => opt.value))
                    }
                    defaultOptions={allAmenities?.map((a: any) => ({
                      value: a.id,
                      label: a.name,
                    }))}
                    placeholder="Select amenities..."
                  />
                </div>
              )}
            />
            <AnimatedInput
              control={control}
              name="image"
              label="Primary Image URL *"
              placeholder="https://example.com/image.png"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-8">
          <Button
            className="bg-blue-600 hover:bg-blue-700 transition-all text-white"
            type="submit"
            disabled={!isValid || mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <IoCreateOutline className="mr-2" />
            )}
            {mutation.isPending ? "Creating..." : "Create Room"}
          </Button>
        </CardFooter>
      </Card>
      <DetailsPreview
        control={control}
        roomTypes={roomTypes}
        allAmenities={allAmenities}
      />
    </form>
  );
}

// --- Bulk Room Form Component (Unchanged) ---
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
    defaultValues: {
      hotel_id: HOTEL_ID,
      count: 1,
      amenity_ids: [],
      image_urls: "",
    },
  });

  const mutation = useMutation({
    mutationFn: bulkCreateRooms,
    onSuccess: (data) => {
      toast.success(`${data.count || "Rooms"} created successfully!`);
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
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Bulk Room Creation</CardTitle>
        <CardDescription>
          Quickly generate multiple rooms with the same type, price, and
          amenities.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 pt-6">
          <FormSelect
            control={control}
            name="room_type_id"
            label="Room Type *"
            placeholder="Select a room type"
            options={
              roomTypes?.map((rt: any) => ({ value: rt.id, label: rt.name })) ??
              []
            }
          />
          <AnimatedInput
            control={control}
            name="count"
            label="Number of Rooms to Create *"
            type="number"
          />
          <AnimatedInput
            control={control}
            name="price_per_night"
            label="Price Per Night (for each room) *"
            type="number"
            step="0.01"
          />
          <Controller
            control={control}
            name="amenity_ids"
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label>Amenities (for all rooms)</Label>
                <MultipleSelector
                  value={allAmenities
                    ?.filter((opt: any) => field.value?.includes(opt.id))
                    .map((a: any) => ({ value: a.id, label: a.name }))}
                  onChange={(options: any) =>
                    field.onChange(options.map((opt: any) => opt.value))
                  }
                  defaultOptions={allAmenities?.map((a: any) => ({
                    value: a.id,
                    label: a.name,
                  }))}
                  placeholder="Select amenities..."
                />
              </div>
            )}
          />
          <FormTextArea
            control={control}
            name="image_urls"
            label="Image URLs *"
            placeholder="Enter one image URL per line..."
            rows={5}
          />
        </CardContent>
        <CardFooter className="flex justify-end pt-8">
          <Button
            className="bg-blue-600 hover:bg-blue-700 transition-all text-white"
            type="submit"
            disabled={!isValid || mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <IoCreateOutline className="mr-1" />
            )}
            {mutation.isPending ? "Creating Rooms..." : "Create Rooms"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

// --- Details Preview Component (Unchanged) ---
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
        <CardTitle>Form Summary</CardTitle>
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
          label="Description"
          value={watchedValues.description}
          isParagraph={true}
        />
        <DetailRow label="Room Code" value={watchedValues.code} />
        <DetailRow label="Room Type" value={roomTypeName} />
        <DetailRow
          label="Price/Night"
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

// --- Reusable Helper Components (Unchanged) ---
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

function AnimatedInput({ control, name, label, type = "text", ...props }: any) {
  const id = useId();
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });
  return (
    <div className="space-y-1.5">
      <div className="group relative">
        <Label
          htmlFor={id}
          className="origin-start text-muted-foreground/70 group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium"
        >
          <span className="bg-background inline-flex px-2">{label}</span>
        </Label>
        <Input
          id={id}
          {...field}
          {...props}
          type={type}
          placeholder=" "
          className={error ? "border-red-500" : ""}
        />
      </div>
      {error && <p className="text-xs text-red-600">{error.message}</p>}
    </div>
  );
}

function FormSelect({ control, name, label, options, placeholder }: any) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select onValueChange={field.onChange} value={field.value || ""}>
        <SelectTrigger className={error ? "border-red-500" : ""}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((opt: Option) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-red-600">{error.message}</p>}
    </div>
  );
}

function FormTextArea({ control, name, label, ...props }: any) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });
  return (
    <div className="space-y-1.5 resize-none">
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        id={name}
        {...field}
        {...props}
        className={error ? "border-red-500 resize-none" : "resize-none"}
      />
      {error && <p className="text-xs text-red-600">{error.message}</p>}
    </div>
  );
}
