// - - - src/pages/miscellaneous/step3_uploadImages.tsx (FIXED)
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFormPersistence } from "@/hooks/useFormPersistence";

// --- UI Components & Icons ---
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Camera } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { LuImages } from "react-icons/lu";

// --- Types & API Client ---
import type { HotelImage } from "./walkthrough";
import { getHotelImages, addHotelImage } from "@/api/apiClient";
import { FaRegLightbulb } from "react-icons/fa";

// --- Constants & Schema ---
const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;
const IMAGE_CATEGORY_ID = import.meta.env.VITE_IMAGE_CATEGORY;
const MIN_IMAGES_REQUIRED = 4;
const IMAGES_FORM_KEY = "walkthrough_step3_images";
const imageFormSchema = z.object({
  original: z.string().url("Please enter a valid image URL.").or(z.literal("")),
});
type ImageFormValues = z.infer<typeof imageFormSchema>;

// --- Main Component (FIXED: Now returns JSX directly) ---
export function Step3_UploadImages({
  onStepComplete,
}: {
  onStepComplete: (isComplete: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const { data: uploadedImages, isLoading } = useQuery<{
    results: HotelImage[];
  }>({
    queryKey: ["hotelImages", HOTEL_ID],
    queryFn: async () => (await getHotelImages(HOTEL_ID)).data,
    enabled: !!HOTEL_ID,
  });

  const form = useForm<ImageFormValues>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: { original: "" },
  });
  useFormPersistence(IMAGES_FORM_KEY, form);

  const mutation = useMutation({
    mutationFn: (newImage: ImageFormValues) =>
      addHotelImage(HOTEL_ID, IMAGE_CATEGORY_ID, newImage),
    onSuccess: () => {
      toast.success("Image added successfully!");
      queryClient.invalidateQueries({ queryKey: ["hotelImages", HOTEL_ID] });
      form.reset();
      setPreviewUrl("");
    },
    onError: (err: AxiosError) => {
      toast.error("Failed to add image", {
        description: (err.response?.data as any)?.detail || "Please try again.",
      });
    },
  });

  const currentUrl = form.watch("original");
  useEffect(() => {
    const handler = setTimeout(() => {
      setPreviewUrl(
        currentUrl && currentUrl.startsWith("http") ? currentUrl : ""
      );
    }, 500);
    return () => clearTimeout(handler);
  }, [currentUrl]);

  const uploadedCount = uploadedImages?.results?.length || 0;
  useEffect(() => {
    onStepComplete(uploadedCount >= MIN_IMAGES_REQUIRED);
  }, [uploadedCount, onStepComplete]);
  const onSubmit = (data: ImageFormValues) => mutation.mutate(data);

  // FIXED: Return JSX directly instead of an object
  return (
    <>
      {/* - - - - Notes Summary */}
      <div className="w-[calc(100%-2rem)] mx-auto my-4 p-6 flex gap-x-4 items-start bg-gray-100/30 mt-4 shadow rounded-md border border-[#DADCE0]">
        {/*  - - - Bulb */}
        <div>
          <FaRegLightbulb color="#000" size={20} />
        </div>
        {/* - - - Notes Contents */}
        <div>
          <h2 className="text-[1rem] font-bold">What are these images for?</h2>
          <p className="text-[0.9375rem]">
            These images will be showing up to SafariPro searches when people
            look up for your hotel, pick the best you have you can always update
            them in your dashboard.
          </p>
        </div>
      </div>
      {/* - - - -  */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pl-8">
        {/* Form Section */}
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Showcase Your Property
            </h1>
            <p className="text-gray-500 mt-2">
              High-quality images attract more guests. Please add at least{" "}
              {MIN_IMAGES_REQUIRED} photos.
            </p>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Add New Image
            </h3>
            <div>
              <Label htmlFor="original">Image URL</Label>
              <Input
                id="original"
                {...form.register("original")}
                placeholder="https://..."
              />
              {form.formState.errors.original && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.original.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-[#0081FB] hover:bg-blue-600 rounded-[6px]"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                ""
              )}
              Add Image
            </Button>
            <AspectRatio
              ratio={16 / 10}
              className="bg-gray-200 rounded-md overflow-hidden"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <LuImages className="h-10 w-10" />
                  <p className="text-sm mt-2">URL Preview</p>
                </div>
              )}
            </AspectRatio>
          </form>
        </div>

        {/* Uploaded Photos Gallery Section */}
        <div>
          <Card className="border-[#DADCEO] border-none shadow-none">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Uploaded Photos</span>
                <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  {uploadedCount} / {MIN_IMAGES_REQUIRED} Added
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-200 animate-pulse rounded-md aspect-square"
                    ></div>
                  ))}
                </div>
              ) : uploadedCount > 0 ? (
                <div className="grid grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-2">
                  {uploadedImages?.results.map((img) => (
                    <AspectRatio
                      key={img.id}
                      ratio={1 / 1}
                      className="rounded-md overflow-hidden border"
                    >
                      <img
                        src={img.original}
                        alt={img.tag}
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed rounded-lg h-full min-h-[200px]">
                  <Camera className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Your uploaded images will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
