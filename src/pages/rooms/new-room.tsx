// "use client";

// import { useMemo, useId } from "react";
// import { useForm, Controller, useController, useWatch } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { IoCreateOutline } from "react-icons/io5";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import MultipleSelector, { type Option } from "@/components/ui/multiselect";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import hotelClient from "../../api/hotel-client";

// // --- Icon Imports ---
// import { Loader2 } from "lucide-react";

// // --- TYPE DEFINITIONS ---
// interface RoomTypeOption {
//   id: string;
//   name: string;
// }
// interface AmenityOption {
//   id: string;
//   name: string;
// }
// const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;

// // --- FORM SCHEMAS ---
// const singleRoomSchema = yup.object({
//   hotel: yup.string().required(),
//   code: yup.string().required("Room code is required."),
//   description: yup.string().required("Description is required."),
//   room_type: yup.string().required("A room type is required."),
//   max_occupancy: yup
//     .number()
//     .typeError("Max occupancy must be a number")
//     .required("Max occupancy is required")
//     .min(1, "Occupancy must be at least 1."),
//   price_per_night: yup
//     .number()
//     .typeError("Price must be a number")
//     .required("Price per night is required")
//     .positive("Price must be a positive number."),
//   availability_status: yup
//     .string()
//     .oneOf(["Available", "Booked", "Maintenance"], "Invalid status")
//     .required("Availability status is required."),
//   room_amenities: yup.array().of(yup.string().required()).optional(),
//   image: yup
//     .string()
//     .url("Must be a valid image URL.")
//     .required("A primary image URL is required."),
// });

// const bulkCreateSchema = yup.object({
//   hotel_id: yup.string().required(),
//   room_type_id: yup.string().required("A room type is required."),
//   count: yup
//     .number()
//     .typeError("Count must be a number.")
//     .required("Number of rooms is required.")
//     .min(1, "Must create at least one room."),
//   price_per_night: yup
//     .number()
//     .typeError("Price must be a number.")
//     .required("Price is required.")
//     .positive("Price must be a positive number."),
//   amenity_ids: yup.array().of(yup.string().required()).optional(),
// });

// type SingleRoomFormData = yup.InferType<typeof singleRoomSchema>;
// type BulkCreateFormData = yup.InferType<typeof bulkCreateSchema>;

// // --- API FUNCTIONS ---
// const createSingleRoom = async (data: SingleRoomFormData) => {
//   const response = await hotelClient.post("rooms/", data);
//   return response.data;
// };

// const bulkCreateRooms = async (data: BulkCreateFormData) => {
//   const response = await hotelClient.post("/rooms/bulk-create/", data);
//   return response.data;
// };

// // --- MAIN COMPONENT ---
// export default function NewRoom() {
//   const navigate = useNavigate();

//   // --- Data Fetching (for both forms) ---
//   const { data: roomTypes, isLoading: isLoadingRoomTypes } = useQuery<
//     RoomTypeOption[]
//   >({
//     queryKey: ["allRoomTypes"],
//     queryFn: async () => (await hotelClient.get("room-types/")).data.results,
//   });
//   const { data: allAmenities, isLoading: isLoadingAmenities } = useQuery<
//     AmenityOption[]
//   >({
//     queryKey: ["allAmenities"],
//     queryFn: async () => (await hotelClient.get("amenities/")).data.results,
//   });

//   if (isLoadingRoomTypes || isLoadingAmenities) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin" />
//         <span className="ml-2">Loading Form Data...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 bg-white min-h-screen">
//       <Tabs defaultValue="single" className="max-w-7xl mx-auto">
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="single">Create Single Room</TabsTrigger>
//           <TabsTrigger value="bulk">Create Multiple Rooms</TabsTrigger>
//         </TabsList>
//         <TabsContent value="single">
//           <SingleRoomForm
//             roomTypes={roomTypes ?? []}
//             allAmenities={allAmenities ?? []}
//             onSuccess={() => navigate("/rooms/available-rooms")}
//           />
//         </TabsContent>
//         <TabsContent value="bulk">
//           <BulkRoomForm
//             roomTypes={roomTypes ?? []}
//             allAmenities={allAmenities ?? []}
//             onSuccess={() => navigate("/rooms/available-rooms")}
//           />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

// // --- Single Room Form Component ---
// function SingleRoomForm({ roomTypes, allAmenities, onSuccess }: any) {
//   const queryClient = useQueryClient();
//   const {
//     control,
//     handleSubmit,
//     formState: { isValid },
//     reset,
//   } = useForm<SingleRoomFormData>({
//     resolver: yupResolver(singleRoomSchema),
//     mode: "onChange",
//     defaultValues: {
//       hotel: HOTEL_ID,
//       code: "",
//       description: "",
//       room_type: "",
//       max_occupancy: "" as any,
//       price_per_night: "" as any,
//       availability_status: "Available",
//       room_amenities: [],
//       image: "",
//     },
//   });

//   const mutation = useMutation({
//     mutationFn: createSingleRoom,
//     onSuccess: (data) => {
//       toast.success(`Room "${data.code}" created successfully!`);
//       queryClient.invalidateQueries({ queryKey: ["available-rooms"] });
//       reset();
//       setTimeout(onSuccess, 1500);
//     },
//     onError: (error: any) =>
//       toast.error(error.response?.data?.detail || "An error occurred."),
//   });

//   const onSubmit = (data: SingleRoomFormData) => {
//     mutation.mutate(data);
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-4"
//     >
//       <Card className="lg:col-span-2">
//         <CardHeader>
//           <CardTitle className="text-3xl">Create a New Room</CardTitle>
//           <CardDescription>
//             Fill out the details below to add a new room to the system.
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-8 pt-6">
//           <div className="space-y-6">
//             <AnimatedInput control={control} name="code" label="Room Code *" />
//             <FormSelect
//               control={control}
//               name="room_type"
//               label="Room Type *"
//               placeholder="Select a type..."
//               options={
//                 roomTypes?.map((rt: any) => ({
//                   value: rt.id,
//                   label: rt.name,
//                 })) ?? []
//               }
//             />
//             <FormTextArea
//               control={control}
//               name="description"
//               label="Description *"
//               placeholder="A detailed description of the room..."
//             />
//             <AnimatedInput
//               control={control}
//               name="max_occupancy"
//               label="Max Occupancy *"
//               type="number"
//             />
//             <AnimatedInput
//               control={control}
//               name="price_per_night"
//               label="Price/Night *"
//               type="number"
//               step="0.01"
//             />
//             <FormSelect
//               control={control}
//               name="availability_status"
//               label="Status *"
//               placeholder="Select status..."
//               options={[
//                 { value: "Available", label: "Available" },
//                 { value: "Booked", label: "Booked" },
//                 { value: "Maintenance", label: "Maintenance" },
//               ]}
//             />
//             <Controller
//               control={control}
//               name="room_amenities"
//               render={({ field }) => (
//                 <div className="space-y-1.5">
//                   <Label>Amenities</Label>
//                   <MultipleSelector
//                     value={allAmenities
//                       ?.filter((opt: any) => field.value?.includes(opt.id))
//                       .map((a: any) => ({ value: a.id, label: a.name }))}
//                     onChange={(options: any) =>
//                       field.onChange(options.map((opt: any) => opt.value))
//                     }
//                     defaultOptions={allAmenities?.map((a: any) => ({
//                       value: a.id,
//                       label: a.name,
//                     }))}
//                     placeholder="Select amenities..."
//                   />
//                 </div>
//               )}
//             />
//             <AnimatedInput
//               control={control}
//               name="image"
//               label="Primary Image URL *"
//               placeholder="https://example.com/image.png"
//             />
//           </div>
//         </CardContent>
//         <CardFooter className="flex justify-end pt-8">
//           <Button type="submit" disabled={!isValid || mutation.isPending}>
//             {mutation.isPending ? (
//               <Loader2 className="animate-spin mr-2" />
//             ) : (
//               <IoCreateOutline className="mr-2" />
//             )}
//             {mutation.isPending ? "Creating..." : "Create Room"}
//           </Button>
//         </CardFooter>
//       </Card>
//       <DetailsPreview
//         control={control}
//         roomTypes={roomTypes}
//         allAmenities={allAmenities}
//       />
//     </form>
//   );
// }

// // --- Bulk Room Form Component ---
// function BulkRoomForm({ roomTypes, allAmenities, onSuccess }: any) {
//   const queryClient = useQueryClient();
//   const {
//     control,
//     handleSubmit,
//     formState: { isValid },
//     reset,
//   } = useForm<BulkCreateFormData>({
//     resolver: yupResolver(bulkCreateSchema),
//     mode: "onChange",
//     defaultValues: {
//       hotel_id: HOTEL_ID,
//       count: 1,
//       amenity_ids: [],
//     },
//   });

//   const mutation = useMutation({
//     mutationFn: bulkCreateRooms,
//     onSuccess: (data) => {
//       toast.success(`${data.count || "Rooms"} created successfully!`);
//       queryClient.invalidateQueries({ queryKey: ["available-rooms"] });
//       reset();
//       setTimeout(onSuccess, 1500);
//     },
//     onError: (error: any) =>
//       toast.error(error.response?.data?.detail || "Failed to create rooms."),
//   });

//   const onSubmit = (data: BulkCreateFormData) => {
//     mutation.mutate(data);
//   };

//   return (
//     <Card className="mt-4">
//       <CardHeader>
//         <CardTitle className="text-3xl">Create Multiple Rooms</CardTitle>
//         <CardDescription>
//           Quickly generate multiple rooms with the same type, price, and
//           amenities.
//         </CardDescription>
//       </CardHeader>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <CardContent className="space-y-6 pt-6">
//           <FormSelect
//             control={control}
//             name="room_type_id"
//             label="Room Type *"
//             placeholder="Select a room type"
//             options={
//               roomTypes?.map((rt: any) => ({ value: rt.id, label: rt.name })) ??
//               []
//             }
//           />
//           <AnimatedInput
//             control={control}
//             name="count"
//             label="Number of Rooms to Create *"
//             type="number"
//           />
//           <AnimatedInput
//             control={control}
//             name="price_per_night"
//             label="Price Per Night (for each room) *"
//             type="number"
//             step="0.01"
//           />
//           <Controller
//             control={control}
//             name="amenity_ids"
//             render={({ field }) => (
//               <div className="space-y-1.5">
//                 <Label>Amenities (for all rooms)</Label>
//                 <MultipleSelector
//                   value={allAmenities
//                     ?.filter((opt: any) => field.value?.includes(opt.id))
//                     .map((a: any) => ({ value: a.id, label: a.name }))}
//                   onChange={(options: any) =>
//                     field.onChange(options.map((opt: any) => opt.value))
//                   }
//                   defaultOptions={allAmenities?.map((a: any) => ({
//                     value: a.id,
//                     label: a.name,
//                   }))}
//                   placeholder="Select amenities..."
//                 />
//               </div>
//             )}
//           />
//         </CardContent>
//         <CardFooter className="flex justify-end pt-8">
//           <Button type="submit" disabled={!isValid || mutation.isPending}>
//             {mutation.isPending ? (
//               <Loader2 className="animate-spin mr-2" />
//             ) : (
//               <IoCreateOutline className="mr-2" />
//             )}
//             {mutation.isPending ? "Creating Rooms..." : "Create Rooms"}
//           </Button>
//         </CardFooter>
//       </form>
//     </Card>
//   );
// }

// // --- Details Preview Component (for single room form) ---
// function DetailsPreview({ control, roomTypes, allAmenities }: any) {
//   const watchedValues = useWatch({ control });

//   const roomTypeName = useMemo(
//     () =>
//       roomTypes?.find((rt: RoomTypeOption) => rt.id === watchedValues.room_type)
//         ?.name,
//     [watchedValues.room_type, roomTypes]
//   );

//   const selectedAmenities = useMemo(
//     () =>
//       allAmenities?.filter((a: AmenityOption) =>
//         watchedValues.room_amenities?.includes(a.id)
//       ),
//     [watchedValues.room_amenities, allAmenities]
//   );

//   return (
//     <Card className="lg:col-span-1 sticky top-8">
//       <CardHeader>
//         <CardTitle>Form Summary</CardTitle>
//         <CardDescription>Review the details before submitting.</CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {watchedValues.image &&
//           yup.string().url().isValidSync(watchedValues.image) && (
//             <img
//               src={watchedValues.image}
//               alt="Room Preview"
//               className="rounded-lg object-cover w-full h-40 bg-gray-100"
//             />
//           )}
//         <DetailRow
//           label="Description"
//           value={watchedValues.description}
//           isParagraph={true}
//         />
//         <DetailRow label="Room Code" value={watchedValues.code} />
//         <DetailRow label="Room Type" value={roomTypeName} />
//         <DetailRow
//           label="Price/Night"
//           value={
//             watchedValues.price_per_night
//               ? `$${Number(watchedValues.price_per_night).toFixed(2)}`
//               : ""
//           }
//         />
//         <DetailRow label="Max Occupancy" value={watchedValues.max_occupancy} />
//         <DetailRow label="Status" value={watchedValues.availability_status} />
//         <div>
//           <p className="text-sm font-medium text-gray-600">Amenities</p>
//           <div className="flex flex-wrap gap-2 mt-2">
//             {selectedAmenities && selectedAmenities.length > 0 ? (
//               selectedAmenities.map((amenity: AmenityOption) => (
//                 <Badge key={amenity.id} variant="secondary">
//                   {amenity.name}
//                 </Badge>
//               ))
//             ) : (
//               <p className="text-sm text-gray-400">—</p>
//             )}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// // Helper for displaying a row in the details card
// const DetailRow = ({
//   label,
//   value,
//   isParagraph = false,
// }: {
//   label: string;
//   value: string | number | undefined;
//   isParagraph?: boolean;
// }) => (
//   <div>
//     <p className="text-sm font-medium text-gray-600">{label}</p>
//     {isParagraph ? (
//       <p className="text-sm text-gray-800 break-words">{value || "—"}</p>
//     ) : (
//       <p className="text-md font-semibold text-gray-900">{value || "—"}</p>
//     )}
//   </div>
// );

// // --- Reusable Form Field Components ---
// function AnimatedInput({ control, name, label, type = "text", ...props }: any) {
//   const id = useId();
//   const {
//     field,
//     fieldState: { error },
//   } = useController({ name, control });
//   return (
//     <div className="space-y-1.5">
//       <div className="group relative">
//         <Label
//           htmlFor={id}
//           className="origin-start text-muted-foreground/70 group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium"
//         >
//           <span className="bg-background inline-flex px-2">{label}</span>
//         </Label>
//         <Input
//           id={id}
//           {...field}
//           {...props}
//           type={type}
//           placeholder=" "
//           className={error ? "border-red-500" : ""}
//         />
//       </div>
//       {error && <p className="text-xs text-red-600">{error.message}</p>}
//     </div>
//   );
// }

// function FormSelect({ control, name, label, options, placeholder }: any) {
//   const {
//     field,
//     fieldState: { error },
//   } = useController({ name, control });
//   return (
//     <div className="space-y-1.5">
//       <Label>{label}</Label>
//       <Select onValueChange={field.onChange} value={field.value || ""}>
//         <SelectTrigger className={error ? "border-red-500" : ""}>
//           <SelectValue placeholder={placeholder} />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectGroup>
//             {options.map((opt: Option) => (
//               <SelectItem key={opt.value} value={opt.value}>
//                 {opt.label}
//               </SelectItem>
//             ))}
//           </SelectGroup>
//         </SelectContent>
//       </Select>
//       {error && <p className="text-xs text-red-600">{error.message}</p>}
//     </div>
//   );
// }

// function FormTextArea({ control, name, label, ...props }: any) {
//   const {
//     field,
//     fieldState: { error },
//   } = useController({ name, control });
//   return (
//     <div className="space-y-1.5 resize-none">
//       <Label htmlFor={name}>{label}</Label>
//       <Textarea
//         id={name}
//         {...field}
//         {...props}
//         className={error ? "border-red-500 resize-none" : ""}
//       />
//       {error && <p className="text-xs text-red-600">{error.message}</p>}
//     </div>
//   );
// }

"use client";
import { useMemo, useId } from "react";
import { useForm, Controller, useController, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import hotelClient from "../../api/hotel-client";

// --- Icon Imports ---
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
  // UPDATED: Added image_urls validation
  image_urls: yup
    .string()
    .required("At least one image URL is required.")
    .test("is-valid-urls", "Each line must contain a valid URL.", (value) => {
      if (!value) return false;
      // Split by newline, trim whitespace, and filter out empty lines
      const urls = value
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url);
      // Check if every non-empty line is a valid URL
      return urls.every((url) => yup.string().url().isValidSync(url));
    }),
});

type SingleRoomFormData = yup.InferType<typeof singleRoomSchema>;
// This type is for the form state, the actual payload will have image_urls as an array
type BulkCreateFormShape = yup.InferType<typeof bulkCreateSchema>;

// --- API FUNCTIONS ---
const createSingleRoom = async (data: SingleRoomFormData) => {
  const response = await hotelClient.post("rooms/", data);
  return response.data;
};

// The data parameter here expects the final payload structure with image_urls as an array
const bulkCreateRooms = async (
  data: Omit<BulkCreateFormShape, "image_urls"> & { image_urls: string[] }
) => {
  const response = await hotelClient.post("/rooms/bulk-create/", data);
  return response.data;
};

// --- MAIN COMPONENT ---
export default function NewRoom() {
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

  if (isLoadingRoomTypes || isLoadingAmenities) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading Form Data...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white min-h-screen">
      <Tabs defaultValue="single" className="max-w-7xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Create Single Room</TabsTrigger>
          <TabsTrigger value="bulk">Create Multiple Rooms</TabsTrigger>
        </TabsList>
        <TabsContent value="single">
          <SingleRoomForm
            roomTypes={roomTypes ?? []}
            allAmenities={allAmenities ?? []}
            onSuccess={() => navigate("/rooms/available-rooms")}
          />
        </TabsContent>
        <TabsContent value="bulk">
          <BulkRoomForm
            roomTypes={roomTypes ?? []}
            allAmenities={allAmenities ?? []}
            onSuccess={() => navigate("/rooms/available-rooms")}
          />
        </TabsContent>
      </Tabs>
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
      className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-4"
    >
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-3xl">Create a New Room</CardTitle>
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
            className="bg-blue-500 hover:bg-blue-600 transition-all"
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

// --- Bulk Room Form Component (UPDATED) ---
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
      // The success toast now correctly uses the `count` from the API response
      toast.success(`${data.count || "Rooms"} created successfully!`);
      queryClient.invalidateQueries({ queryKey: ["available-rooms"] });
      reset();
      setTimeout(onSuccess, 1500);
    },
    onError: (error: any) =>
      console.error(error.response?.data?.detail || "Failed to create rooms."),
  });

  // This function now transforms the image_urls string into an array before mutation
  const onSubmit = (data: BulkCreateFormShape) => {
    const payload = {
      ...data,
      image_urls: data.image_urls
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url), // Filter out any empty lines
    };
    mutation.mutate(payload);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-3xl">Create Multiple Rooms</CardTitle>
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
          {/* NEW: Textarea for Image URLs */}
          <FormTextArea
            control={control}
            name="image_urls"
            label="Image URLs *"
            placeholder="Enter one image URL per line..."
            rows={5}
          />
        </CardContent>
        <CardFooter className="flex justify-end pt-8">
          <Button type="submit" disabled={!isValid || mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <IoCreateOutline className="mr-2" />
            )}
            {mutation.isPending ? "Creating Rooms..." : "Create Rooms"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

// --- Details Preview Component (for single room form) ---
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
        className={error ? "border-red-500 resize-none" : "resize-none"}
      />
      {error && <p className="text-xs text-red-600">{error.message}</p>}
    </div>
  );
}
