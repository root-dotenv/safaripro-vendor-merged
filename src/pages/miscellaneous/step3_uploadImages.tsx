import { useState, type FC, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Image as ImageIcon, Camera } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { HotelImage } from "./walkthrough";

const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;
const HOTEL_IMAGES_API_URL = `http://hotel.safaripro.net/api/v1/hotel-images/?hotel_id=${HOTEL_ID}`;
const IMAGE_CATEGORY_ID = import.meta.env.VITE_IMAGE_CATEGORY;
const MIN_IMAGES_REQUIRED = 4;
const IMAGES_FORM_KEY = "walkthrough_step3_images";

const imageFormSchema = z.object({
  original: z.string().url("Please enter a valid image URL.").or(z.literal("")),
});
type ImageFormValues = z.infer<typeof imageFormSchema>;

interface Step3Props {
  onStepComplete: (isComplete: boolean) => void;
}

const Step3_UploadImages: FC<Step3Props> = ({ onStepComplete }) => {
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const { data: uploadedImages, isLoading } = useQuery<{
    results: HotelImage[];
  }>({
    queryKey: ["hotelImages", HOTEL_ID],
    queryFn: () => axios.get(HOTEL_IMAGES_API_URL).then((res) => res.data),
    enabled: !!HOTEL_ID,
  });

  const form = useForm<ImageFormValues>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      original: "",
    },
  });

  useFormPersistence(IMAGES_FORM_KEY, form);

  const mutation = useMutation({
    mutationFn: (newImage: ImageFormValues) =>
      axios.post(HOTEL_IMAGES_API_URL, {
        tag: "hotel-images",
        original: newImage.original,
        category: IMAGE_CATEGORY_ID,
        hotel: HOTEL_ID,
      }),
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

  const onSubmit = (data: ImageFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Showcase Your Property
        </h1>
        <p className="text-gray-500 mt-2">
          High-quality images attract more guests. Please add at least{" "}
          {MIN_IMAGES_REQUIRED} photos.
        </p>
      </div>

      <div className="p-6 border rounded-lg bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              className="w-full bg-blue-500 hover:bg-blue-600 rounded"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
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
                  <ImageIcon className="h-10 w-10" />
                  <p className="text-sm mt-2">URL Preview</p>
                </div>
              )}
            </AspectRatio>
          </form>
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Uploaded Photos</h3>
              <p className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                {uploadedCount} / {MIN_IMAGES_REQUIRED} Added
              </p>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 animate-pulse rounded-md aspect-square"
                  ></div>
                ))}
              </div>
            ) : uploadedCount > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3_UploadImages;
