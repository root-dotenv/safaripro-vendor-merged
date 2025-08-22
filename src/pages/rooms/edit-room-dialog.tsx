import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import hotelClient from "../../api/hotel-client";
import InputNote from "@/components/custom/input-note";

// --- TYPE DEFINITIONS ---
interface EditRoomFormData {
  code: string;
  description: string;
  image: string;
  max_occupancy: number;
  price_per_night: number;
  availability_status: string;
  room_type_id: string;
  room_amenities: string[];
}
interface RoomDetails extends EditRoomFormData {
  id: string;
}
interface RoomType {
  id: string;
  name: string;
}
interface Amenity {
  id: string;
  name: string;
}
interface EditRoomDialogProps {
  room: RoomDetails;
}

// --- VALIDATION SCHEMA ---
const editRoomSchema = yup.object().shape({
  code: yup.string().required("Room code is required."),
  description: yup.string().required("Description is required."),
  price_per_night: yup
    .number()
    .typeError("Price must be a number.")
    .positive("Price must be positive.")
    .required("Price is required."),
  max_occupancy: yup
    .number()
    .typeError("Max occupancy must be a number.")
    .integer()
    .min(1)
    .required("Max occupancy is required."),
  availability_status: yup
    .string()
    .oneOf(["Available", "Booked", "Maintenance"])
    .required("Status is required."),
  room_type_id: yup.string().required("Room type is required."),
  image: yup.string().url("Must be a valid URL.").nullable(),
  room_amenities: yup
    .array()
    .of(yup.string().required())
    .min(1, "At least one amenity must be selected."),
});

export default function EditRoomDialog({ room }: EditRoomDialogProps) {
  const queryClient = useQueryClient();

  const { data: roomTypes, isLoading: isLoadingTypes } = useQuery<RoomType[]>({
    queryKey: ["roomTypes"],
    queryFn: async () => (await hotelClient.get("/room-types/")).data.results,
  });

  const { data: allAmenities, isLoading: isLoadingAmenities } = useQuery<
    Amenity[]
  >({
    queryKey: ["amenities"],
    queryFn: async () => (await hotelClient.get("/amenities/")).data.results,
  });

  const form = useForm<EditRoomFormData>({
    resolver: yupResolver(editRoomSchema),
    defaultValues: {
      code: room.code,
      description: room.description,
      image: room.image,
      max_occupancy: room.max_occupancy,
      price_per_night: Number(room.price_per_night),
      availability_status: room.availability_status,
      room_type_id: room.room_type_id,
      room_amenities: room.room_amenities || [],
    },
    mode: "onChange",
  });

  const updateRoomMutation = useMutation({
    mutationFn: (updatedData: Partial<EditRoomFormData>) =>
      hotelClient.patch(`/rooms/${room.id}/`, updatedData),
    onSuccess: () => {
      toast.success("Room updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["roomDetails", room.id] });
      queryClient.invalidateQueries({
        queryKey: ["available-rooms", "booked-rooms", "maintenance-rooms"],
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message;
      console.error(`Error: ${errorMessage}`);
    },
  });

  // Maintained Functionality: Only sends fields that have been changed
  const onFormSubmit = (data: EditRoomFormData) => {
    const { dirtyFields } = form.formState;
    const payload: Partial<EditRoomFormData> = {};

    (Object.keys(dirtyFields) as Array<keyof EditRoomFormData>).forEach(
      (key) => {
        payload[key] = data[key];
      }
    );

    if (Object.keys(payload).length === 0) {
      toast.info("No changes were made.");
      return;
    }

    updateRoomMutation.mutate(payload);
  };

  return (
    <>
      <DialogHeader className="p-6 pb-0">
        <DialogTitle>Edit Room: {room.code}</DialogTitle>
        <DialogDescription>
          Make changes to the room details below. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)}>
          <div className="overflow-y-auto max-h-[65vh] p-6 space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>Room Code</FormLabel>{" "}
                  <FormControl>
                    <Input {...field} />
                  </FormControl>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>Description</FormLabel>{" "}
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>Primary Image URL</FormLabel>{" "}
                  <FormControl>
                    <Input {...field} />
                  </FormControl>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price_per_night"
                render={({ field }) => (
                  <FormItem>
                    {" "}
                    <FormLabel>Price/Night (in USD)</FormLabel>{" "}
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>{" "}
                    <FormMessage />{" "}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_occupancy"
                render={({ field }) => (
                  <FormItem>
                    {" "}
                    <FormLabel>Max Occupancy</FormLabel>{" "}
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>{" "}
                    <FormMessage />{" "}
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="room_type_id"
                render={({ field }) => (
                  <FormItem>
                    {" "}
                    <FormLabel>Room Type</FormLabel>{" "}
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingTypes}
                    >
                      {" "}
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>{" "}
                      <SelectContent>
                        {" "}
                        {roomTypes?.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}{" "}
                      </SelectContent>{" "}
                    </Select>{" "}
                    <FormMessage />{" "}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availability_status"
                render={({ field }) => (
                  <FormItem>
                    {" "}
                    <FormLabel>Availability</FormLabel>{" "}
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {" "}
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>{" "}
                      <SelectContent>
                        {" "}
                        <SelectItem value="Available">
                          Available
                        </SelectItem>{" "}
                        <SelectItem value="Booked">Booked</SelectItem>{" "}
                        <SelectItem value="Maintenance">Maintenance</SelectItem>{" "}
                      </SelectContent>{" "}
                    </Select>{" "}
                    <FormMessage />{" "}
                  </FormItem>
                )}
              />
            </div>

            {/* ✨ Restored UI: Using the exact design for amenity checkboxes from your original code */}
            <FormField
              control={form.control}
              name="room_amenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amenities</FormLabel>
                  <InputNote
                    message={"A room should have at least one amenity"}
                  />
                  {isLoadingAmenities ? (
                    <p className="text-sm text-muted-foreground">
                      Loading amenities...
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                      {allAmenities?.map((amenity) => (
                        <FormItem
                          key={amenity.id}
                          className="has-data-[state=checked]:border-[#DADCE0] border-input relative flex cursor-pointer flex-col justify-center gap-4 rounded-md border p-4 shadow-sm transition-colors"
                        >
                          <FormControl>
                            <Checkbox
                              id={amenity.id} // Add ID for the label's htmlFor to work
                              className="border-[#DADCE0] border-[1.5px] data-[state=checked]:bg-[#0081FB] data-[state=checked]:text-[#FFF]"
                              checked={field.value?.includes(amenity.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, amenity.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (id) => id !== amenity.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel
                            htmlFor={amenity.id}
                            className="font-medium cursor-pointer"
                          >
                            {amenity.name}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Restored UI: Footer buttons are correctly aligned */}
          <DialogFooter className="p-4 border-t">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              type="submit"
              disabled={updateRoomMutation.isPending || !form.formState.isDirty}
            >
              {updateRoomMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
