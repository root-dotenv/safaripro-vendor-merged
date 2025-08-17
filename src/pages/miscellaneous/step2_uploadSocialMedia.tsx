import { type FC, useEffect } from "react";
import type { JSX } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFormPersistence } from "@/hooks/useFormPersistence";

// UI Components & Icons
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
  FaTiktok,
  FaTripadvisor,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import type { SocialMedia, Vendor } from "./walkthrough";

// Schema & Constants
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
const SOCIAL_API_URL = `http://vendor.safaripro.net/api/v1/social-media`;
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

interface Step2Props {
  vendor: Vendor;
  onStepComplete: (isComplete: boolean) => void;
}

const Step2_UploadSocialMedia: FC<Step2Props> = ({
  vendor,
  onStepComplete,
}) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    onStepComplete(true);
  }, [onStepComplete]);

  const { data: socialAccounts, isLoading } = useQuery<{
    results: SocialMedia[];
  }>({
    queryKey: ["socialMedia", vendor.id],
    queryFn: () =>
      axios
        .get(`${SOCIAL_API_URL}?vendor=${vendor.id}`)
        .then((res) => res.data),
    enabled: !!vendor.id,
  });

  const form = useForm<SocialMediaFormValues>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      platform: "",
      url: "",
      handle: "",
    },
  });

  useFormPersistence(SOCIAL_FORM_KEY, form);

  const mutation = useMutation({
    mutationFn: (newAccount: SocialMediaFormValues) =>
      axios.post(SOCIAL_API_URL, {
        ...newAccount,
        vendor: vendor.id,
        is_active: true,
      }),
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

  return (
    <div className="text-left">
      <h2 className="text-2xl font-bold text-slate-800 text-center">
        Connect Your Social Accounts
      </h2>
      <p className="text-slate-500 mt-2 text-center mb-8">
        This step is optional. Add links to your social media profiles, or click
        "Next Step" to continue.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-[#FFF] border-[#DADCE0] rounded-md">
          <CardHeader>
            <CardTitle className="text-lg">Add a New Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <Label htmlFor="url">Profile URL</Label>
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
                className="w-full bg-blue-500 hover:bg-blue-600 rounded-md transition-all"
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
          </CardContent>
        </Card>
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-700">Added Accounts</h3>
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin text-blue-500" />
            </div>
          ) : socialAccounts?.results && socialAccounts.results.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {socialAccounts.results.map((acc) => (
                <div
                  key={acc.id}
                  className="flex items-center gap-3 p-3 bg-slate-100 rounded-md"
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
              <p className="text-sm text-slate-500">No accounts added yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2_UploadSocialMedia;
