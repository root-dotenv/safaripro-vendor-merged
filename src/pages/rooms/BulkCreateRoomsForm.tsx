import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import hotelClient from "../../api/hotel-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultipleSelector, { type Option } from "@/components/ui/multiselect";
import { Loader2 } from "lucide-react";

// --- Type Definitions ---
interface RoomTypeOption {
  id: string;
  name: string;
}
interface AmenityOption {
  id: string;
  name: string;
}
const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;

// --- Form Validation Schema ---
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
});

type BulkCreateFormData = yup.InferType<typeof bulkCreateSchema>;

// --- API Function for Bulk Creation ---
const bulkCreateRooms = async (data: BulkCreateFormData) => {
  const response = await hotelClient.post("/rooms/bulk-create/", data);
  return response.data;
};

// --- The Form Component ---
export function BulkCreateRoomsForm({
  roomTypes,
  amenities,
  onClose,
}: {
  roomTypes: RoomTypeOption[];
  amenities: AmenityOption[];
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  // --- Form Setup ---
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<BulkCreateFormData>({
    resolver: yupResolver(bulkCreateSchema),
    mode: "onChange",
    defaultValues: {
      hotel_id: HOTEL_ID,
      count: 1,
      amenity_ids: [],
      price_per_night: 0,
    },
  });

  // --- Mutation for API Call ---
  const mutation = useMutation({
    mutationFn: bulkCreateRooms,
    onSuccess: (data) => {
      toast.success(`${data.count || "Rooms"} created successfully!`);
      queryClient.invalidateQueries({ queryKey: ["available-rooms"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to create rooms.");
    },
  });

  const onSubmit = (data: BulkCreateFormData) => {
    mutation.mutate(data);
  };

  const amenityOptions: Option[] = amenities.map((a) => ({
    label: a.name,
    value: a.id,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
      {/* Room Type Field */}
      <div className="space-y-1.5">
        <Label htmlFor="room_type_id">Room Type *</Label>
        <Controller
          name="room_type_id"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger
                id="room_type_id"
                className={errors.room_type_id ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select a room type" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((rt) => (
                  <SelectItem key={rt.id} value={rt.id}>
                    {rt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.room_type_id && (
          <p className="text-xs text-red-600">{errors.room_type_id.message}</p>
        )}
      </div>

      {/* Count Field */}
      <div className="space-y-1.5">
        <Label htmlFor="count">Number of Rooms *</Label>
        <Controller
          name="count"
          control={control}
          render={({ field }) => (
            <Input
              id="count"
              type="number"
              {...field}
              className={errors.count ? "border-red-500" : ""}
            />
          )}
        />
        {errors.count && (
          <p className="text-xs text-red-600">{errors.count.message}</p>
        )}
      </div>

      {/* Price Per Night Field */}
      <div className="space-y-1.5">
        <Label htmlFor="price_per_night">Price Per Night *</Label>
        <Controller
          name="price_per_night"
          control={control}
          render={({ field }) => (
            <Input
              id="price_per_night"
              type="number"
              step="0.01"
              {...field}
              className={errors.price_per_night ? "border-red-500" : ""}
            />
          )}
        />
        {errors.price_per_night && (
          <p className="text-xs text-red-600">
            {errors.price_per_night.message}
          </p>
        )}
      </div>

      {/* Amenities Field */}
      <div className="space-y-1.5">
        <Label>Amenities</Label>
        <Controller
          control={control}
          name="amenity_ids"
          render={({ field }) => (
            <MultipleSelector
              value={amenityOptions.filter((opt) =>
                field.value?.includes(opt.value)
              )}
              onChange={(options) =>
                field.onChange(options.map((opt) => opt.value))
              }
              defaultOptions={amenityOptions}
              placeholder="Select amenities..."
            />
          )}
        />
      </div>
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={!isValid || mutation.isPending}>
          {mutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Create Rooms
        </Button>
      </div>
    </form>
  );
}
