"use client";

import { useMemo, useId } from "react";
import { useForm, Controller, useController, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoCreateOutline } from "react-icons/io5";
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

// --- Icon Imports ---
import { FaSpinner } from "react-icons/fa";

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

// --- FORM SCHEMA (Unchanged) ---
const roomSchema = yup.object({
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

const HOTEL_BASE_URL = import.meta.env.VITE_HOTEL_BASE_URL;

type RoomFormData = yup.InferType<typeof roomSchema>;

// --- API FUNCTIONS ---
const apiClient = axios.create({
  baseURL: HOTEL_BASE_URL,
});
const createRoom = async (data: RoomFormData): Promise<any> => {
  const response = await apiClient.post("rooms/", data);
  return response.data;
};

// --- MAIN COMPONENT ---
export default function NewRoom() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<RoomFormData>({
    resolver: yupResolver(roomSchema),
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

  // --- Data Fetching
  const { data: roomTypes, isLoading: isLoadingRoomTypes } = useQuery<
    RoomTypeOption[]
  >({
    queryKey: ["allRoomTypes"],
    queryFn: async () => (await apiClient.get("room-types/")).data.results,
  });
  const { data: allAmenities, isLoading: isLoadingAmenities } = useQuery<
    AmenityOption[]
  >({
    queryKey: ["allAmenities"],
    queryFn: async () => (await apiClient.get("amenities/")).data.results,
  });

  const createRoomMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: (data) => {
      toast.success(`Room "${data.code}" created successfully!`);
      queryClient.invalidateQueries({ queryKey: ["available-rooms"] });
      reset();
      setTimeout(() => navigate("/rooms/available-rooms"), 2000);
    },
    onError: (error: any) =>
      toast.error(error.response?.data?.detail || "An error occurred."),
  });

  const onSubmit = (data: RoomFormData) => {
    createRoomMutation.mutate(data);
  };

  if (isLoadingRoomTypes || isLoadingAmenities)
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading form...
      </div>
    );

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <div className="p-4 sm:p-6 lg:p-8 bg-white min-h-screen">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
        >
          {/* --- Form Card (Left side) --- */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-3xl">Create a New Room</CardTitle>
              <CardDescription>
                Fill out the details below to add a new room to the system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* --- Vertically Aligned Fields --- */}
              <div className="space-y-6">
                <AnimatedInput
                  control={control}
                  name="code"
                  label="Room Code *"
                />
                <FormSelect
                  control={control}
                  name="room_type"
                  label="Room Type *"
                  placeholder="Select a type..."
                  options={
                    roomTypes?.map((rt) => ({
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
                          ?.filter((opt) => field.value?.includes(opt.id))
                          .map((a) => ({ value: a.id, label: a.name }))}
                        onChange={(options) =>
                          field.onChange(options.map((opt) => opt.value))
                        }
                        defaultOptions={allAmenities?.map((a) => ({
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
                type="submit"
                variant="outline"
                disabled={!isValid || createRoomMutation.isPending}
              >
                {createRoomMutation.isPending ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <IoCreateOutline className="mr-2" />
                )}
                {createRoomMutation.isPending ? "Creating..." : "Create Room"}
              </Button>
            </CardFooter>
          </Card>

          {/* --- Details Card (Right side) --- */}
          <DetailsPreview
            control={control}
            roomTypes={roomTypes}
            allAmenities={allAmenities}
          />
        </form>
      </div>
    </>
  );
}

// --- Details Preview Component ---
function DetailsPreview({
  control,
  roomTypes,
  allAmenities,
}: {
  control: any;
  roomTypes: any;
  allAmenities: any;
}) {
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

// Helper for displaying a row in the details card
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

// --- Reusable Form Field Components ---
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
        className={error ? "border-red-500 resize-none" : ""}
      />
      {error && <p className="text-xs text-red-600">{error.message}</p>}
    </div>
  );
}
