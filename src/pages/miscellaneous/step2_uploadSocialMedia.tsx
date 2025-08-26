// - - - src/pages/miscellaneous/step2_uploadSocialMedia.tsx (FIXED)
import { useEffect } from "react";
import type { JSX } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFormPersistence } from "@/hooks/useFormPersistence";

// --- UI Components & Icons ---
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Share2 } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLink,
  FaLinkedinIn,
  FaPinterest,
  FaRegLightbulb,
  FaTiktok,
  FaTripadvisor,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

// --- Types & API Client ---
import type { SocialMedia, Vendor } from "./walkthrough";
import { getSocialAccounts, addSocialAccount } from "@/api/apiClient";

// --- Schema & Constants ---
const socialMediaSchema = z.object({
  platform: z.string().min(1, "Please select a platform.").default(""),
  url: z.string().url("Please enter a valid URL.").or(z.literal("")),
  handle: z
    .string()
    .min(1, "A handle or username is required.")
    .or(z.literal("")),
});
type SocialMediaFormValues = z.infer<typeof socialMediaSchema>;

const socialPlatforms = [
  "Facebook",
  "Instagram",
  "Twitter",
  "LinkedIn",
  "Youtube",
  "TikTok",
  "Pinterest",
  "TripAdvisor",
  "Other",
];
const SOCIAL_FORM_KEY = "walkthrough_step2_social";

const getSocialIcon = (platform: string): JSX.Element => {
  const iconProps = { className: "h-5 w-5 text-slate-500 flex-shrink-0" };
  const normalizedPlatform = platform.toLowerCase();
  const iconMap: { [key: string]: JSX.Element } = {
    facebook: <FaFacebook {...iconProps} />,
    instagram: <FaInstagram {...iconProps} />,
    twitter: <FaTwitter {...iconProps} />,
    linkedin: <FaLinkedinIn {...iconProps} />,
    youtube: <FaYoutube {...iconProps} />,
    tiktok: <FaTiktok {...iconProps} />,
    pinterest: <FaPinterest {...iconProps} />,
    tripadvisor: <FaTripadvisor {...iconProps} />,
    other: <FaLink {...iconProps} />,
  };
  const matchedKey = Object.keys(iconMap).find((key) =>
    normalizedPlatform.includes(key)
  );
  return matchedKey ? iconMap[matchedKey] : <Share2 {...iconProps} />;
};

// --- Main Component (FIXED: Now returns JSX directly) ---
export function Step2_UploadSocialMedia({
  vendor,
  onStepComplete,
}: {
  vendor: Vendor;
  onStepComplete: (isComplete: boolean) => void;
}) {
  const queryClient = useQueryClient();
  useEffect(() => {
    onStepComplete(true);
  }, [onStepComplete]);

  const { data: socialAccounts, isLoading } = useQuery<{
    results: SocialMedia[];
  }>({
    queryKey: ["socialMedia", vendor.id],
    queryFn: async () => (await getSocialAccounts(vendor.id)).data,
    enabled: !!vendor.id,
  });

  const form = useForm<SocialMediaFormValues>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: { platform: "", url: "", handle: "" },
  });
  useFormPersistence(SOCIAL_FORM_KEY, form);

  const mutation = useMutation({
    mutationFn: (newAccount: SocialMediaFormValues) =>
      addSocialAccount(vendor.id, newAccount),
    onSuccess: () => {
      toast.success("Social media account added!");
      queryClient.invalidateQueries({ queryKey: ["socialMedia", vendor.id] });
      form.reset({ platform: "", url: "", handle: "" });
    },
    onError: (err: AxiosError) => {
      toast.error("Failed to add account", {
        description:
          (err.response?.data as any)?.detail || "Please check the details.",
      });
    },
  });
  const onSubmit = (data: SocialMediaFormValues) => mutation.mutate(data);

  // FIXED: Return JSX directly instead of an object
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pl-8">
        {/* Form Section */}
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Connect Your Social Accounts
            </h1>
            <p className="text-gray-500 mt-2">
              This step is optional. Add links to your social media profiles, or
              click "Continue" to proceed.
            </p>
          </div>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 max-w-md"
          >
            <div>
              <Label>Platform</Label>
              <Controller
                name="platform"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {socialPlatforms.map((p) => (
                        <SelectItem key={p} value={p.toLowerCase()}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.platform && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.platform.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="url">Profile URL(Account Link)</Label>
              <Input
                id="url"
                {...form.register("url")}
                placeholder="https://..."
              />
              {form.formState.errors.url && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.url.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="handle">Username</Label>
              <Input
                id="handle"
                {...form.register("handle")}
                placeholder="@username"
              />
              {form.formState.errors.handle && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.handle.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-[#0081FB] rounded-[6px] hover:bg-blue-600 transition-all"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-1 h-4 w-4" />
              )}
              Add Account
            </Button>
          </form>
        </div>

        {/* Added Accounts List Section */}
        <div>
          <Card className="border-none rounded-none shadow-none">
            <CardHeader>
              <CardTitle>Your Added & Existing Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="animate-spin text-blue-500" />
                </div>
              ) : socialAccounts?.results &&
                socialAccounts.results.length > 0 ? (
                <div className="space-y-2">
                  {socialAccounts.results.map((acc) => (
                    <div
                      key={acc.id}
                      className="flex items-center gap-3 p-3 bg-gray-10/50 border border-[#DADCE0] rounded-md shadow"
                    >
                      {getSocialIcon(acc.platform_display)}
                      <div>
                        <p className="font-medium text-sm text-slate-800">
                          {acc.platform_display}
                        </p>
                        <p className="text-xs text-slate-500">{acc.handle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed rounded-lg h-full">
                  <p className="text-sm text-slate-500">
                    No accounts added yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* - - - - Notes Summary */}
      <div className="w-[calc(100%-3rem)] mx-auto my-4 p-6 flex gap-x-4 items-start bg-gray-100/30 mt-4 shadow rounded-md border border-[#DADCE0]">
        {/*  - - - Bulb */}
        <div>
          <FaRegLightbulb color="#000" size={20} />
        </div>
        {/* - - - Notes Contents */}
        <div>
          <h2 className="text-[1rem] font-bold">
            How many social accounts I can add?
          </h2>
          <p className="text-[0.9375rem]">
            SafariPro Allows you to add social accounts from any social media.
          </p>
        </div>
      </div>
      {/* - - - -  */}
    </>
  );
}
