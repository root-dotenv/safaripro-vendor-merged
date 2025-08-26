// // - - - src/pages/miscellaneous/step1_uploadLogo.tsx
// import { useState, type FC, useEffect } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import axios, { type AxiosError } from "axios";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import { Loader2, UploadCloud, CheckCircle } from "lucide-react";
// import { type Vendor } from "./walkthrough";

// const LOGO_PREVIEW_KEY = "walkthrough_logo_preview";

// interface Step1Props {
//   vendor: Vendor;
//   onStepComplete: (isComplete: boolean) => void;
// }

// const Step1_UploadLogo: FC<Step1Props> = ({ vendor, onStepComplete }) => {
//   const queryClient = useQueryClient();
//   const [logoFile, setLogoFile] = useState<File | null>(null);

//   // --- SESSION PERSISTENCE FOR PREVIEW ---
//   const [preview, setPreview] = useState<string | null>(() => {
//     return sessionStorage.getItem(LOGO_PREVIEW_KEY) || null;
//   });

//   useEffect(() => {
//     if (preview) {
//       sessionStorage.setItem(LOGO_PREVIEW_KEY, preview);
//     } else {
//       sessionStorage.removeItem(LOGO_PREVIEW_KEY);
//     }
//   }, [preview]);
//   // --- END OF PERSISTENCE LOGIC ---

//   const VENDOR_API_URL = `http://vendor.safaripro.net/api/v1/vendors/${vendor.id}`;

//   useEffect(() => {
//     onStepComplete(!!vendor.logo || !!preview);
//   }, [vendor.logo, preview, onStepComplete]);

//   const mutation = useMutation({
//     mutationFn: (formData: FormData) =>
//       axios.patch(VENDOR_API_URL, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       }),
//     onSuccess: () => {
//       toast.success("Logo updated successfully!");
//       queryClient.invalidateQueries({ queryKey: ["vendorProfile", vendor.id] });
//       onStepComplete(true);
//       setLogoFile(null);
//       setPreview(null);
//     },
//     onError: (err: AxiosError) => {
//       toast.error("Upload Failed", {
//         description:
//           (err.response?.data as any)?.detail ||
//           "An unexpected error occurred.",
//       });
//       onStepComplete(false);
//     },
//   });

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("File size cannot exceed 5MB.");
//         return;
//       }
//       setLogoFile(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!logoFile) {
//       toast.warning(
//         "Please select a logo file to upload. If you refreshed the page, you must re-select the file.",
//         { duration: 5000 }
//       );
//       return;
//     }
//     const formData = new FormData();
//     formData.append("logo", logoFile);
//     mutation.mutate(formData);
//   };

//   return (
//     <div className="w-full max-w-2xl mx-auto">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Hotel Branding</h1>
//         <p className="text-gray-500 mt-2">
//           A great logo helps you stand out. Upload your hotel's logo to get
//           started.
//         </p>
//       </div>
//       <Card>
//         <CardContent className="p-8">
//           <form
//             onSubmit={handleSubmit}
//             className="flex flex-col md:flex-row items-center gap-8"
//           >
//             <div className="flex-shrink-0">
//               <img
//                 src={preview || vendor.logo || undefined}
//                 alt={vendor.business_name}
//                 className="h-32 w-32 rounded-full object-cover border-4 border-gray-100 bg-gray-100"
//                 onError={(e) =>
//                   (e.currentTarget.src = "https://via.placeholder.com/128")
//                 }
//               />
//             </div>
//             <div className="w-full space-y-4 text-center md:text-left">
//               <Label
//                 htmlFor="logo-upload"
//                 className="cursor-pointer block w-full p-6 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-gray-50 transition-colors"
//               >
//                 <div className="flex flex-col items-center justify-center gap-2">
//                   <UploadCloud className="h-8 w-8 text-gray-400" />
//                   <span className="font-medium text-gray-700">
//                     Click to upload or drag & drop
//                   </span>
//                   <p className="text-xs text-gray-500">PNG or JPG (max. 5MB)</p>
//                 </div>
//               </Label>
//               <Input
//                 id="logo-upload"
//                 type="file"
//                 className="hidden"
//                 accept=".png, .jpg, .jpeg"
//                 onChange={handleFileChange}
//               />
//               {preview && !logoFile && (
//                 <div className="text-sm text-amber-600 font-medium flex items-center justify-center md:justify-start gap-2">
//                   <span>Preview loaded. Re-select file to upload.</span>
//                 </div>
//               )}
//               {logoFile && (
//                 <div className="text-sm text-green-600 font-medium flex items-center justify-center md:justify-start gap-2">
//                   <CheckCircle className="h-4 w-4" />
//                   <span>{logoFile.name} selected</span>
//                 </div>
//               )}
//               <Button
//                 type="submit"
//                 disabled={!preview || mutation.isPending}
//                 className="w-full bg-blue-500 rounded-md hover:bg-blue-600 transition-all"
//               >
//                 {mutation.isPending ? (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 ) : (
//                   <UploadCloud className="mr-2 h-4 w-4" />
//                 )}
//                 {vendor.logo ? "Change Logo" : "Upload Logo"}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Step1_UploadLogo;

// - - - src/pages/miscellaneous/step1_uploadLogo.tsx (COMPLETE)
// import { useState, type FC, useEffect } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { type AxiosError } from "axios";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import { Loader2, UploadCloud, CheckCircle } from "lucide-react";
// import { type Vendor } from "./walkthrough";
// import { uploadVendorLogo } from "@/api/apiClient";

// const LOGO_PREVIEW_KEY = "walkthrough_logo_preview";

// interface Step1Props {
//   vendor: Vendor;
//   onStepComplete: (isComplete: boolean) => void;
// }

// const Step1_UploadLogo: FC<Step1Props> = ({ vendor, onStepComplete }) => {
//   const queryClient = useQueryClient();
//   const [logoFile, setLogoFile] = useState<File | null>(null);

//   const [preview, setPreview] = useState<string | null>(() => {
//     return sessionStorage.getItem(LOGO_PREVIEW_KEY) || null;
//   });

//   useEffect(() => {
//     if (preview) {
//       sessionStorage.setItem(LOGO_PREVIEW_KEY, preview);
//     } else {
//       sessionStorage.removeItem(LOGO_PREVIEW_KEY);
//     }
//   }, [preview]);

//   useEffect(() => {
//     onStepComplete(!!vendor.logo || !!preview);
//   }, [vendor.logo, preview, onStepComplete]);

//   const mutation = useMutation({
//     mutationFn: (formData: FormData) => uploadVendorLogo(vendor.id, formData),
//     onSuccess: () => {
//       toast.success("Logo updated successfully!");
//       queryClient.invalidateQueries({ queryKey: ["vendorProfile", vendor.id] });
//       onStepComplete(true);
//       setLogoFile(null);
//       setPreview(null);
//     },
//     onError: (err: AxiosError) => {
//       toast.error("Upload Failed", {
//         description:
//           (err.response?.data as any)?.detail ||
//           "An unexpected error occurred.",
//       });
//       onStepComplete(false);
//     },
//   });

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("File size cannot exceed 5MB.");
//         return;
//       }
//       setLogoFile(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!logoFile) {
//       toast.warning("Please select a logo file to upload.", { duration: 5000 });
//       return;
//     }
//     const formData = new FormData();
//     formData.append("logo", logoFile);
//     mutation.mutate(formData);
//   };

//   return (
//     <div className="w-full max-w-2xl mx-auto">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Hotel Branding</h1>
//         <p className="text-gray-500 mt-2">
//           A great logo helps you stand out. Upload your hotel's logo to get
//           started.
//         </p>
//       </div>
//       <Card>
//         <CardContent className="p-8">
//           <form
//             onSubmit={handleSubmit}
//             className="flex flex-col md:flex-row items-center gap-8"
//           >
//             <div className="flex-shrink-0">
//               <img
//                 src={preview || vendor.logo || undefined}
//                 alt={vendor.business_name}
//                 className="h-32 w-32 rounded-full object-cover border-4 border-gray-100 bg-gray-100"
//                 onError={(e) =>
//                   (e.currentTarget.src = "https://via.placeholder.com/128")
//                 }
//               />
//             </div>
//             <div className="w-full space-y-4 text-center md:text-left">
//               <Label
//                 htmlFor="logo-upload"
//                 className="cursor-pointer block w-full p-6 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-gray-50 transition-colors"
//               >
//                 <div className="flex flex-col items-center justify-center gap-2">
//                   <UploadCloud className="h-8 w-8 text-gray-400" />
//                   <span className="font-medium text-gray-700">
//                     Click to upload or drag & drop
//                   </span>
//                   <p className="text-xs text-gray-500">PNG or JPG (max. 5MB)</p>
//                 </div>
//               </Label>
//               <Input
//                 id="logo-upload"
//                 type="file"
//                 className="hidden"
//                 accept=".png, .jpg, .jpeg"
//                 onChange={handleFileChange}
//               />
//               {preview && !logoFile && (
//                 <div className="text-sm text-amber-600 font-medium flex items-center justify-center md:justify-start gap-2">
//                   <span>Preview loaded. Re-select file to upload.</span>
//                 </div>
//               )}
//               {logoFile && (
//                 <div className="text-sm text-green-600 font-medium flex items-center justify-center md:justify-start gap-2">
//                   <CheckCircle className="h-4 w-4" />
//                   <span>{logoFile.name} selected</span>
//                 </div>
//               )}
//               <Button
//                 type="submit"
//                 disabled={!preview || mutation.isPending}
//                 className="w-full bg-blue-500 rounded-md hover:bg-blue-600 transition-all"
//               >
//                 {mutation.isPending ? (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 ) : (
//                   <UploadCloud className="mr-2 h-4 w-4" />
//                 )}
//                 {vendor.logo ? "Change Logo" : "Upload Logo"}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Step1_UploadLogo;

// - - - src/pages/miscellaneous/step1_uploadLogo.tsx (COMPLETE)
// import { useState, type FC, useEffect } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { type AxiosError } from "axios";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import { Loader2, UploadCloud, CheckCircle } from "lucide-react";
// import { type Vendor } from "./walkthrough";
// import { uploadVendorLogo } from "@/api/apiClient";

// const LOGO_PREVIEW_KEY = "walkthrough_logo_preview";

// interface Step1Props {
//   vendor: Vendor;
//   onStepComplete: (isComplete: boolean) => void;
// }

// const Step1_UploadLogo: FC<Step1Props> = ({ vendor, onStepComplete }) => {
//   const queryClient = useQueryClient();
//   const [logoFile, setLogoFile] = useState<File | null>(null);

//   const [preview, setPreview] = useState<string | null>(() => {
//     return sessionStorage.getItem(LOGO_PREVIEW_KEY) || null;
//   });

//   useEffect(() => {
//     if (preview) {
//       sessionStorage.setItem(LOGO_PREVIEW_KEY, preview);
//     } else {
//       sessionStorage.removeItem(LOGO_PREVIEW_KEY);
//     }
//   }, [preview]);

//   useEffect(() => {
//     onStepComplete(!!vendor.logo || !!preview);
//   }, [vendor.logo, preview, onStepComplete]);

//   const mutation = useMutation({
//     mutationFn: (formData: FormData) => uploadVendorLogo(vendor.id, formData),
//     onSuccess: () => {
//       toast.success("Logo updated successfully!");
//       queryClient.invalidateQueries({ queryKey: ["vendorProfile", vendor.id] });
//       onStepComplete(true);
//       setLogoFile(null);
//       setPreview(null);
//     },
//     onError: (err: AxiosError) => {
//       toast.error("Upload Failed", {
//         description:
//           (err.response?.data as any)?.detail ||
//           "An unexpected error occurred.",
//       });
//       onStepComplete(false);
//     },
//   });

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("File size cannot exceed 5MB.");
//         return;
//       }
//       setLogoFile(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!logoFile) {
//       toast.warning("Please select a logo file to upload.", { duration: 5000 });
//       return;
//     }
//     const formData = new FormData();
//     formData.append("logo", logoFile);
//     mutation.mutate(formData);
//   };

//   return (
//     <>
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Hotel Branding</h1>
//         <p className="text-gray-500 mt-2">
//           A great logo helps you stand out. Upload your hotel's logo to get
//           started.
//         </p>
//       </div>
//       <Card className="border-none shadow-none">
//         <CardContent className="p-0">
//           <form
//             onSubmit={handleSubmit}
//             className="flex flex-col md:flex-row items-center gap-8"
//           >
//             <div className="flex-shrink-0">
//               <img
//                 src={preview || vendor.logo || undefined}
//                 alt={vendor.business_name}
//                 className="h-32 w-32 rounded-full object-cover border-4 border-gray-100 bg-gray-100"
//                 onError={(e) =>
//                   (e.currentTarget.src = "https://via.placeholder.com/128")
//                 }
//               />
//             </div>
//             <div className="w-full space-y-4 text-center md:text-left">
//               <Label
//                 htmlFor="logo-upload"
//                 className="cursor-pointer block w-full p-6 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-gray-50 transition-colors"
//               >
//                 <div className="flex flex-col items-center justify-center gap-2">
//                   <UploadCloud className="h-8 w-8 text-gray-400" />
//                   <span className="font-medium text-gray-700">
//                     Click to upload or drag & drop
//                   </span>
//                   <p className="text-xs text-gray-500">PNG or JPG (max. 5MB)</p>
//                 </div>
//               </Label>
//               <Input
//                 id="logo-upload"
//                 type="file"
//                 className="hidden"
//                 accept=".png, .jpg, .jpeg"
//                 onChange={handleFileChange}
//               />
//               {preview && !logoFile && (
//                 <div className="text-sm text-amber-600 font-medium flex items-center justify-center md:justify-start gap-2">
//                   <span>Preview loaded. Re-select file to upload.</span>
//                 </div>
//               )}
//               {logoFile && (
//                 <div className="text-sm text-green-600 font-medium flex items-center justify-center md:justify-start gap-2">
//                   <CheckCircle className="h-4 w-4" />
//                   <span>{logoFile.name} selected</span>
//                 </div>
//               )}
//               <Button
//                 type="submit"
//                 disabled={!preview || mutation.isPending}
//                 className="w-full bg-blue-500 rounded-md hover:bg-blue-600 transition-all"
//               >
//                 {mutation.isPending ? (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 ) : (
//                   <UploadCloud className="mr-2 h-4 w-4" />
//                 )}
//                 {vendor.logo ? "Change Logo" : "Upload Logo"}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </>
//   );
// };

// export default Step1_UploadLogo;

// - - - src/pages/miscellaneous/step1_uploadLogo.tsx (RE-ENHANCED UI)
// - - - src/pages/miscellaneous/step1_uploadLogo.tsx (COMPLETE)
import { useState, type FC, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, UploadCloud, CheckCircle } from "lucide-react";
import { type Vendor } from "./walkthrough";
import { uploadVendorLogo } from "@/api/apiClient";
import { type JSX } from "react";
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
        <h1 className="text-3xl font-bold text-gray-900">Hotel Branding</h1>
        <p className="mt-2 text-gray-600">
          A great logo helps you stand out. Upload your hotel's logo to get
          started.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-8 p-6 border rounded-lg">
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
              className="cursor-pointer block w-full p-6 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <UploadCloud className="h-8 w-8 text-gray-400" />
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
              className="w-full bg-blue-500 rounded-md hover:bg-blue-600 transition-all"
            >
              {mutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="mr-2 h-4 w-4" />
              )}
              {vendor.logo ? "Change Logo" : "Upload Logo"}
            </Button>
          </div>
        </div>
      </form>

      {footer}
    </div>
  );
};

export default Step1_UploadLogo;
