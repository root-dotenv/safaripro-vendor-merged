// - - - src/pages/miscellaneous/step1_uploadLogo.tsx (COMPLETE)
import { useState, type FC, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle } from "lucide-react";
import { type Vendor } from "./walkthrough";
import { uploadVendorLogo } from "@/api/apiClient";
import { type JSX } from "react";
import { FaRegLightbulb } from "react-icons/fa";
import { ImFolderUpload } from "react-icons/im";
import { LuUpload } from "react-icons/lu";

const LOGO_PREVIEW_KEY = "walkthrough_logo_preview";

interface Step1Props {
  vendor: Vendor;
  onStepComplete: (isComplete: boolean) => void;
  footer: JSX.Element;
}

const Step1_UploadLogo: FC<Step1Props> = ({
  vendor,
  onStepComplete,
  footer,
}) => {
  const queryClient = useQueryClient();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    () => sessionStorage.getItem(LOGO_PREVIEW_KEY) || null
  );

  useEffect(() => {
    if (preview) sessionStorage.setItem(LOGO_PREVIEW_KEY, preview);
    else sessionStorage.removeItem(LOGO_PREVIEW_KEY);
  }, [preview]);

  useEffect(() => {
    onStepComplete(!!vendor.logo || !!preview);
  }, [vendor.logo, preview, onStepComplete]);

  const mutation = useMutation({
    mutationFn: (formData: FormData) => uploadVendorLogo(vendor.id, formData),
    onSuccess: () => {
      toast.success("Logo updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["vendorProfile", vendor.id] });
      onStepComplete(true);
      setLogoFile(null);
      setPreview(null);
    },
    onError: (err: AxiosError) => {
      toast.error("Upload Failed", {
        description:
          (err.response?.data as any)?.detail ||
          "An unexpected error occurred.",
      });
      onStepComplete(false);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File size cannot exceed 5MB.");
        return;
      }
      setLogoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoFile) {
      toast.warning("Please select a logo file to upload.", { duration: 5000 });
      return;
    }
    const formData = new FormData();
    formData.append("logo", logoFile);
    mutation.mutate(formData);
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hotel Logo</h1>
        <p className="mt-2 text-gray-600">
          A great logo helps you stand out. Upload your hotel's logo to get
          started.
        </p>
        <p className="text-gray-600 text-[0.9375rem]">
          Or proceed to the next step and use this current logo
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-8 p-6 border-none rounded-lg">
          <div className="flex-shrink-0">
            <img
              src={preview || vendor.logo || undefined}
              alt={vendor.business_name}
              className="h-32 w-32 rounded-full object-cover border-4 border-gray-100 bg-gray-100"
              onError={(e) =>
                (e.currentTarget.src = "https://via.placeholder.com/128")
              }
            />
          </div>
          <div className="w-full space-y-4 text-center md:text-left">
            <Label
              htmlFor="logo-upload"
              className="cursor-pointer block w-full p-6 rounded-md border border-gray-200 hover:border-blue-500 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <ImFolderUpload className="h-8 w-8 text-gray-400" />
                <span className="font-medium text-gray-700">
                  Click to upload or drag & drop
                </span>
                <p className="text-xs text-gray-500">PNG or JPG (max. 5MB)</p>
              </div>
            </Label>
            <Input
              id="logo-upload"
              type="file"
              className="hidden"
              accept=".png, .jpg, .jpeg"
              onChange={handleFileChange}
            />
            {preview && !logoFile && (
              <div className="text-sm text-amber-600 font-medium flex items-center justify-center md:justify-start gap-2">
                <span>Preview loaded. Re-select file to upload.</span>
              </div>
            )}
            {logoFile && (
              <div className="text-sm text-green-600 font-medium flex items-center justify-center md:justify-start gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>{logoFile.name} selected</span>
              </div>
            )}
            <Button
              type="submit"
              disabled={!preview || mutation.isPending}
              className="w-full bg-[#0081FB] rounded-[6px] hover:bg-blue-600 transition-all"
            >
              {mutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LuUpload className="mr-2 h-4 w-4" />
              )}
              {vendor.logo ? "Change Logo" : "Upload Logo"}
            </Button>
          </div>
        </div>
      </form>

      {/* - - - - Notes Summary */}
      <div className="p-4 flex gap-x-4 items-start bg-gray-100/30 mt-4 shadow rounded-md border border-[#DADCE0]">
        {/*  - - - Bulb */}
        <div>
          <FaRegLightbulb color="#000" size={20} />
        </div>
        {/* - - - Notes Contents */}
        <div>
          <div>
            <h2 className="text-[1rem] font-bold">
              What makes a logo look best?
            </h2>
            <p className="text-[0.9375rem]">
              For best results, use a high-resolution, square image. Logos with
              a transparent background (PNG format) often look the most
              professional.
            </p>
          </div>
        </div>
      </div>
      {/* - - - -  */}

      {footer}
    </div>
  );
};

export default Step1_UploadLogo;
