// - - - src/pages/authentication/user-account.tsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  CreditCard,
  Eye,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  Building,
  Phone,
  Mail,
  Globe,
  FileCheck,
  Percent,
  BadgeAlert,
  Wrench,
  Tag,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Users } from "lucide-react";
import { Hash, MapPin, User, FileText, Upload, Loader2 } from "lucide-react";
import { RxDashboard } from "react-icons/rx";
import { FiEdit } from "react-icons/fi";
import { useOnboardingStore } from "@/store/onboarding.store";

// --- Type Definitions ---
interface Document {
  id: string;
  vendor: string;
  document_type: string;
  document_type_name: string;
  description: string;
  number: string;
  issue_date: string | null;
  expiry_date: string | null;
  issue_place: string;
  file_path: string;
  file_size: number;
  file_type: string;
  issued_by: string;
  is_verified: boolean;
  verification_date: string | null;
  verification_notes: string;
  rejection_reason: string;
  is_expired: boolean | null;
  uploaded_at: string;
}

interface BankingDetails {
  id: string;
  vendor: string;
  bank_name: string;
  account_name: string;
  account_number?: string;
  swift_code: string;
  bank_branch: string;
  routing_number: string;
  preferred_currency: string;
  is_verified: boolean;
  verification_date: string | null;
  created_at: string;
  updated_at: string;
}

interface SocialMedia {
  id: string;
  vendor: string;
  platform: string;
  platform_display: string;
  url: string;
  handle: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface VendorDetails {
  id: string;
  business_name: string;
  trading_name: string;
  logo: string;
  business_description: string;
  service_type: string;
  email: string;
  phone_number: string;
  alternative_phone: string;
  website: string;
  contact_person_name: string;
  contact_person_title: string;
  contact_person_email: string;
  contact_person_phone: string;
  address: string;
  address_line2: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  region: string;
  country: string;
  postal_code: string;
  registration_number: string;
  tax_id: string;
  business_license: string;
  year_established: number;
  number_of_employees: number;
  latitude: number | null;
  longitude: number | null;
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  status_display: string;
  documents: Document[];
  banking_details: BankingDetails | null;
  social_media: SocialMedia[];
  onboarding_progress: {
    progress_percentage: number;
    status: string;
    steps: {
      profile_completion: { status: string; completed: boolean };
      document_verification: { status: string; completed: boolean };
      banking_details: { status: string; completed: boolean };
    };
  };
  created_at: string;
  updated_at: string;
}

// --- Helper Components ---
const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "APPROVED":
      return "bg-green-100 text-green-800 border-green-200";
    case "PENDING_REVIEW":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "REJECTED":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const Badge = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}
  >
    {children}
  </span>
);

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    outline:
      "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500",
  };
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${
        sizeClasses[size]
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
};

// --- Main Component ---
export default function UserAccount() {
  const API_BASE_URL = "http://vendor.safaripro.net/api/v1";
  const queryClient = useQueryClient();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [bankingModalOpen, setBankingModalOpen] = useState(false);
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [isCreateBanking, setIsCreateBanking] = useState(false);
  const [isCreateSocial, setIsCreateSocial] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [selectedBanking, setSelectedBanking] = useState<BankingDetails | null>(
    null
  );
  const [selectedSocial, setSelectedSocial] = useState<SocialMedia | null>(
    null
  );
  const [profileForm, setProfileForm] = useState<Partial<VendorDetails>>({});
  const [documentForm, setDocumentForm] = useState<Partial<Document>>({});
  const [bankingForm, setBankingForm] = useState<Partial<BankingDetails>>({});
  const [socialForm, setSocialForm] = useState<Partial<SocialMedia>>({});
  const [file, setFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const { vendorId } = useOnboardingStore();

  const { data: vendor, isLoading: vendorLoading } = useQuery<VendorDetails>({
    queryKey: ["vendor", vendorId],
    queryFn: () =>
      axios.get(`${API_BASE_URL}/vendors/${vendorId}`).then((res) => res.data),
    enabled: !!vendorId,
  });

  const { data: documentsResponse, isLoading: docsLoading } = useQuery<{
    results: Document[];
  }>({
    queryKey: ["documents", vendorId],
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}/vendor-documents?vendor=${vendorId}`)
        .then((res) => res.data),
    enabled: !!vendorId,
  });

  const documents = documentsResponse?.results || [];

  const { data: bankingResponse, isLoading: bankingLoading } = useQuery<{
    results: BankingDetails[];
  }>({
    queryKey: ["banking", vendorId],
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}/banking-details?vendor=${vendorId}`)
        .then((res) => res.data),
    enabled: !!vendorId,
  });

  const bankingDetails = bankingResponse?.results || [];

  const { data: socialResponse, isLoading: socialLoading } = useQuery<{
    results: SocialMedia[];
  }>({
    queryKey: ["social", vendorId],
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}/social-media?vendor=${vendorId}`)
        .then((res) => res.data),
    enabled: !!vendorId,
  });

  const socialMedia = socialResponse?.results || [];

  // --- Mutations ---
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<VendorDetails>) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });
      if (logoFile) formData.append("logo", logoFile);
      return axios.patch(`${API_BASE_URL}/vendors/${vendorId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["vendor", vendorId] });
      setProfileModalOpen(false);
      setLogoFile(null);
    },
    onError: () => toast.error("Failed to update profile."),
  });

  const updateDocumentMutation = useMutation({
    mutationFn: async (docId: string) => {
      const formData = new FormData();
      Object.entries(documentForm).forEach(([key, value]) => {
        if (value) formData.append(key, value as string);
      });
      if (file) formData.append("file_path", file);
      return axios.patch(
        `${API_BASE_URL}/vendor-documents/${docId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    },
    onSuccess: () => {
      toast.success("Document updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["documents", vendorId] });
      setDocumentModalOpen(false);
      setFile(null);
      setDocumentForm({});
    },
    onError: (error: any) => {
      toast.error(
        `Failed to update document: ${error.message || "Unknown error"}`
      );
    },
  });

  const updateBankingMutation = useMutation({
    mutationFn: (bankId: string) =>
      axios.patch(`${API_BASE_URL}/banking-details/${bankId}`, bankingForm),
    onSuccess: () => {
      toast.success("Banking details updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["banking", vendorId] });
      setBankingModalOpen(false);
    },
    onError: () => toast.error("Failed to update banking details."),
  });

  const createBankingMutation = useMutation({
    mutationFn: () =>
      axios.post(`${API_BASE_URL}/banking-details`, {
        ...bankingForm,
        vendor: vendorId,
      }),
    onSuccess: () => {
      toast.success("Banking details created successfully!");
      queryClient.invalidateQueries({ queryKey: ["banking", vendorId] });
      setBankingModalOpen(false);
    },
    onError: () => toast.error("Failed to create banking details."),
  });

  const deleteBankingMutation = useMutation({
    mutationFn: (bankId: string) =>
      axios.delete(`${API_BASE_URL}/banking-details/${bankId}`),
    onSuccess: () => {
      toast.success("Banking details deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["banking", vendorId] });
    },
    onError: () => toast.error("Failed to delete banking details."),
  });

  const createSocialMutation = useMutation({
    mutationFn: () =>
      axios.post(`${API_BASE_URL}/social-media`, {
        ...socialForm,
        vendor: vendorId,
      }),
    onSuccess: () => {
      toast.success("Social media account created successfully!");
      queryClient.invalidateQueries({ queryKey: ["social", vendorId] });
      setSocialModalOpen(false);
    },
    onError: () => toast.error("Failed to create social media account."),
  });

  const updateSocialMutation = useMutation({
    mutationFn: (socialId: string) =>
      axios.patch(`${API_BASE_URL}/social-media/${socialId}`, socialForm),
    onSuccess: () => {
      toast.success("Social media account updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["social", vendorId] });
      setSocialModalOpen(false);
    },
    onError: () => toast.error("Failed to update social media account."),
  });

  const deleteSocialMutation = useMutation({
    mutationFn: (socialId: string) =>
      axios.delete(`${API_BASE_URL}/social-media/${socialId}`),
    onSuccess: () => {
      toast.success("Social media account deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["social", vendorId] });
    },
    onError: () => toast.error("Failed to delete social media account."),
  });

  // --- Handlers ---
  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleDocumentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDocumentForm({ ...documentForm, [e.target.name]: e.target.value });
  };

  const handleBankingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setBankingForm({ ...bankingForm, [e.target.name]: e.target.value });
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSocialForm({ ...socialForm, [e.target.name]: e.target.value });
  };

  const openProfileModal = () => {
    setProfileForm({
      business_name: vendor?.business_name,
      trading_name: vendor?.trading_name,
      business_description: vendor?.business_description,
      service_type: vendor?.service_type,
      email: vendor?.email,
      phone_number: vendor?.phone_number,
      alternative_phone: vendor?.alternative_phone,
      website: vendor?.website,
      contact_person_name: vendor?.contact_person_name,
      contact_person_title: vendor?.contact_person_title,
      contact_person_email: vendor?.contact_person_email,
      contact_person_phone: vendor?.contact_person_phone,
      address: vendor?.address,
      city: vendor?.city,
      region: vendor?.region,
      country: vendor?.country,
      postal_code: vendor?.postal_code,
      registration_number: vendor?.registration_number,
      tax_id: vendor?.tax_id,
      business_license: vendor?.business_license,
      year_established: vendor?.year_established,
      number_of_employees: vendor?.number_of_employees,
      ward: vendor?.ward,
      district: vendor?.district,
    });
    setLogoFile(null);
    setProfileModalOpen(true);
  };

  const openDocumentModal = (doc: Document) => {
    setSelectedDocument(doc);
    setDocumentForm({
      number: doc.number,
      issue_date: doc.issue_date || "",
      expiry_date: doc.expiry_date || "",
      issue_place: doc.issue_place,
      issued_by: doc.issued_by,
      description: doc.description,
    });
    setFile(null);
    setDocumentModalOpen(true);
  };

  const openBankingModal = (bank?: BankingDetails, isCreate = false) => {
    setIsCreateBanking(isCreate);
    if (isCreate) {
      setBankingForm({
        bank_name: "",
        account_name: "",
        account_number: "",
        swift_code: "",
        bank_branch: "",
        routing_number: "",
        preferred_currency: "USD",
      });
    } else {
      setSelectedBanking(bank || null);
      setBankingForm({
        bank_name: bank?.bank_name,
        account_name: bank?.account_name,
        account_number: bank?.account_number,
        swift_code: bank?.swift_code,
        bank_branch: bank?.bank_branch,
        routing_number: bank?.routing_number,
        preferred_currency: bank?.preferred_currency,
      });
    }
    setBankingModalOpen(true);
  };

  const openSocialModal = (social?: SocialMedia, isCreate = false) => {
    setIsCreateSocial(isCreate);
    if (isCreate) {
      setSocialForm({
        platform: "instagram",
        url: "",
        handle: "",
        is_active: true,
      });
    } else {
      setSelectedSocial(social || null);
      setSocialForm({
        platform: social?.platform,
        url: social?.url,
        handle: social?.handle,
        is_active: social?.is_active,
      });
    }
    setSocialModalOpen(true);
  };

  const handleUpdateProfile = () => {
    updateProfileMutation.mutate(profileForm);
  };

  const handleUpdateDocument = () => {
    if (selectedDocument) {
      updateDocumentMutation.mutate(selectedDocument.id);
    }
  };

  const handleUpdateOrCreateBanking = () => {
    if (isCreateBanking) {
      createBankingMutation.mutate();
    } else if (selectedBanking) {
      updateBankingMutation.mutate(selectedBanking.id);
    }
  };

  const handleUpdateOrCreateSocial = () => {
    if (isCreateSocial) {
      createSocialMutation.mutate();
    } else if (selectedSocial) {
      updateSocialMutation.mutate(selectedSocial.id);
    }
  };

  const handleDeleteBanking = (bankId: string) => {
    if (confirm("Are you sure you want to delete this banking detail?")) {
      deleteBankingMutation.mutate(bankId);
    }
  };

  const handleDeleteSocial = (socialId: string) => {
    if (confirm("Are you sure you want to delete this social media account?")) {
      deleteSocialMutation.mutate(socialId);
    }
  };

  if (
    vendorLoading ||
    docsLoading ||
    bankingLoading ||
    socialLoading ||
    !vendorId
  ) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* <div> Common Navigation Bar</div> */}
        <main className="flex-grow flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-lg text-gray-700">
              Loading Account Details...
            </span>
          </div>
        </main>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* <div> Navigation Bar Component </div> */}
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Account
            </h2>
            <p className="text-gray-600">
              Could not find vendor details. Please try logging in again.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const footerLinks = [
    {
      name: "Terms",
      href: "https://web.safaripro.net/privacy-policy/terms",
    },
    {
      name: "Privacy",
      href: "https://web.safaripro.net/privacy-policy",
    },
    {
      name: "Cookies",
      href: "https://web.safaripro.net/privacy-policy/cookies",
    },
    {
      name: "Support",
      href: "https://web.safaripro.net/privacy-policy/support",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      {/* Navigation */}
      {/* <div>Navigation Bar</div> */}

      {/* Main Content */}
      <main className="max-w-[1200px] flex-grow container mx-auto p-4 md:p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-[#FFF] border-[1px] shadow-none border-[#DADCE0] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {vendor.logo ? (
                  <img
                    src={vendor.logo}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {vendor.business_name}
                </h1>
                <p className="text-gray-600">{vendor.trading_name}</p>
                <Badge className={getStatusColor(vendor.status)}>
                  {vendor.status_display}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-x-3">
              <Button onClick={openProfileModal} variant="outline">
                <FiEdit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                onClick={() => (window.location.href = "http://localhost:5174")}
                variant="outline"
              >
                <RxDashboard className="w-4 h-4 mr-2" />
                Go to your Dashboard
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Onboarding Progress
              </span>
              <span className="text-sm text-gray-500">
                {vendor.onboarding_progress.progress_percentage}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-green-600 h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${vendor.onboarding_progress.progress_percentage}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Information */}
            <div className="bg-[#FFF] border-[1px] shadow-none border-[#DADCE0] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#3C4043] flex items-center">
                  <Building className="w-5 h-5 mr-2 text-blue-600" />
                  Business Information
                </h2>
                <Button onClick={openProfileModal} variant="outline" size="sm">
                  <FiEdit className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Business Description</p>
                  <p className="font-normal text-[#3C4043] mt-1">
                    {vendor.business_description}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Service Type</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {vendor.service_type}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Year Established</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {vendor.year_established}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Number of Employees</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {vendor.number_of_employees}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Registration Number</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {vendor.registration_number}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Tax ID</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {vendor.tax_id}
                  </p>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-[#FFF] border-[1px] shadow-none border-[#DADCE0] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Documents
              </h2>
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {doc.document_type_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Number: {doc.number}
                        </p>
                        <p className="text-sm text-gray-500">
                          Issue Date:{" "}
                          {doc.issue_date
                            ? format(new Date(doc.issue_date), "P")
                            : "N/A"}
                        </p>
                        <div className="mt-2">
                          <Badge
                            className={
                              doc.is_verified
                                ? "bg-green-100 text-green-800 border-green-200"
                                : doc.rejection_reason
                                ? "bg-red-100 text-red-800 border-red-200"
                                : "bg-yellow-100 text-yellow-800 border-yellow-200"
                            }
                          >
                            {doc.is_verified
                              ? "Verified"
                              : doc.rejection_reason
                              ? "Rejected"
                              : "Pending"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => window.open(doc.file_path, "_blank")}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => openDocumentModal(doc)}
                          variant="outline"
                          size="sm"
                        >
                          <FiEdit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {doc.rejection_reason && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm text-red-800">
                          <strong>Rejection Reason:</strong>{" "}
                          {doc.rejection_reason}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Banking Details Section */}
            <div className="bg-[#FFF] border-[1px] shadow-none border-[#DADCE0] rounded-lg  p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#3C4043] flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                  Banking Details
                </h2>
                <Button
                  onClick={() => openBankingModal(undefined, true)}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Banking
                </Button>
              </div>
              <div className="space-y-4">
                {bankingDetails.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No banking details found</p>
                    <Button
                      onClick={() => openBankingModal(undefined, true)}
                      variant="primary"
                      size="sm"
                      className="mt-3 rounded-none"
                    >
                      Add Your First Banking Details
                    </Button>
                  </div>
                ) : (
                  bankingDetails.map((banking) => (
                    <div
                      key={banking.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {banking.bank_name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Account: {banking.account_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Branch: {banking.bank_branch}
                          </p>
                          <p className="text-sm text-gray-500">
                            Currency: {banking.preferred_currency}
                          </p>
                          <div className="mt-2">
                            <Badge
                              className={
                                banking.is_verified
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-yellow-100 text-yellow-800 border-yellow-200"
                              }
                            >
                              {banking.is_verified
                                ? "Verified"
                                : "Pending Verification"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => openBankingModal(banking)}
                            variant="outline"
                            size="sm"
                          >
                            <FiEdit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteBanking(banking.id)}
                            variant="outline"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Social Media Section */}
            <div className="bg-[#FFF] border-[1px] shadow-none border-[#DADCE0] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#3C4043] flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-blue-600" />
                  Social Media Accounts
                </h2>
                <Button
                  onClick={() => openSocialModal(undefined, true)}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Social Media
                </Button>
              </div>
              <div className="space-y-4">
                {socialMedia.length === 0 ? (
                  <div className="text-center py-8">
                    <Globe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">
                      No social media accounts found
                    </p>
                    <Button
                      onClick={() => openSocialModal(undefined, true)}
                      variant="primary"
                      size="sm"
                      className="mt-3"
                    >
                      Add Your First Social Media Account
                    </Button>
                  </div>
                ) : (
                  socialMedia.map((social) => (
                    <div
                      key={social.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {social.platform_display}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Username: {social.handle}
                          </p>
                          <p className="text-sm text-gray-500">
                            URL:{" "}
                            <a
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {social.url}
                            </a>
                          </p>
                          <div className="mt-2">
                            <Badge
                              className={
                                social.is_active
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-red-100 text-red-800 border-red-200"
                              }
                            >
                              {social.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => openSocialModal(social)}
                            variant="outline"
                            size="sm"
                          >
                            <FiEdit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteSocial(social.id)}
                            variant="outline"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-[#FFF] border-[1px] shadow-none border-[#DADCE0] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#3C4043] mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Contact Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-3" />
                  <span>{vendor.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-400 mr-3" />
                  <span>{vendor.phone_number}</span>
                </div>
                {vendor.website && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-gray-400 mr-3" />
                    <a
                      href={vendor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {vendor.website}
                    </a>
                  </div>
                )}
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p>{vendor.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-[#FFF] border-[1px] shadow-none border-[#DADCE0] rounded-lg p-6">
              <div>
                <h3 className="text-lg font-semibold text-[#3C4043] mb-4">
                  Company Location
                </h3>
                <ul className="flex flex-col gap-y-1.5 text-sm">
                  <li>
                    <span className="text-gray-500">Ward:</span> {vendor.ward}
                  </li>
                  <li>
                    <span className="text-gray-500">District:</span>{" "}
                    {vendor.district}
                  </li>
                  <li>
                    <span className="text-gray-500">Region:</span>{" "}
                    {vendor.region}
                  </li>
                  <li>
                    <span className="text-gray-500">City:</span> {vendor.city}
                  </li>
                  <li>
                    <span className="text-gray-500">Country:</span>{" "}
                    {vendor.country}
                  </li>
                  <li>
                    <span className="text-gray-500">Postal Code:</span>{" "}
                    {vendor.postal_code}
                  </li>
                  <li>
                    <span className="text-gray-500">Latitude:</span>{" "}
                    {vendor.latitude}
                  </li>
                  <li>
                    <span className="text-gray-500">Longitude:</span>{" "}
                    {vendor.longitude}
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Person */}
            <div className="bg-[#FFF] border-[1px] shadow-none border-[#DADCE0] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#3C4043] mb-4">
                Contact Person
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-500">Name:</span>{" "}
                  {vendor.contact_person_name}
                </p>
                <p>
                  <span className="text-gray-500">Title:</span>{" "}
                  {vendor.contact_person_title}
                </p>
                <p>
                  <span className="text-gray-500">Email:</span>{" "}
                  {vendor.contact_person_email}
                </p>
                <p>
                  <span className="text-gray-500">Phone:</span>{" "}
                  {vendor.contact_person_phone}
                </p>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-[#FFF] border-[1px] shadow-none border-[#DADCE0] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#3C4043] mb-4">
                Account Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profile</span>
                  {vendor.onboarding_progress.steps.profile_completion
                    .completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#3C4043]">Documents</span>
                  {vendor.onboarding_progress.steps.document_verification
                    .completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Banking</span>
                  {vendor.onboarding_progress.steps.banking_details
                    .completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Update Modal */}
        <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="uppercase text-[#3c4c43]">
                Update Profile
              </DialogTitle>
              <DialogDescription>
                Update your vendor profile details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="business_name">Business Name</Label>
                <div className="relative mt-1">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="business_name"
                    name="business_name"
                    value={profileForm.business_name || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="trading_name">Trading Name</Label>
                <div className="relative mt-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="trading_name"
                    name="trading_name"
                    value={profileForm.trading_name || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <Label htmlFor="business_description">
                  Business Description
                </Label>
                <div className="relative mt-1">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="business_description"
                    name="business_description"
                    value={profileForm.business_description || ""}
                    onChange={handleProfileChange}
                    className="pl-10 pt-2"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="service_type">Service Type</Label>
                <div className="relative mt-1">
                  <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="service_type"
                    name="service_type"
                    value={profileForm.service_type || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    value={profileForm.email || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone_number"
                    name="phone_number"
                    value={profileForm.phone_number || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="alternative_phone">Alternative Phone</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="alternative_phone"
                    name="alternative_phone"
                    value={profileForm.alternative_phone || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <div className="relative mt-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    name="website"
                    value={profileForm.website || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="contact_person_name">Contact Person Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contact_person_name"
                    name="contact_person_name"
                    value={profileForm.contact_person_name || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="contact_person_title">
                  Contact Person Title
                </Label>
                <div className="relative mt-1">
                  <BadgeAlert className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contact_person_title"
                    name="contact_person_title"
                    value={profileForm.contact_person_title || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="contact_person_email">
                  Contact Person Email
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contact_person_email"
                    name="contact_person_email"
                    value={profileForm.contact_person_email || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="contact_person_phone">
                  Contact Person Phone
                </Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contact_person_phone"
                    name="contact_person_phone"
                    value={profileForm.contact_person_phone || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    name="address"
                    value={profileForm.address || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="city"
                    name="city"
                    value={profileForm.city || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="region">Region</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="region"
                    name="region"
                    value={profileForm.region || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <div className="relative mt-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="country"
                    name="country"
                    value={profileForm.country || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="postal_code">Postal Code</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="postal_code"
                    name="postal_code"
                    value={profileForm.postal_code || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="ward">Ward</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="ward"
                    name="ward"
                    value={profileForm.ward || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="district">District</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="district"
                    name="district"
                    value={profileForm.district || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="latitude"
                    name="latitude"
                    value={profileForm.latitude || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="longitude"
                    name="longitude"
                    value={profileForm.longitude || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="registration_number">Registration #</Label>
                <div className="relative mt-1">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="registration_number"
                    name="registration_number"
                    value={profileForm.registration_number || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="tax_id">Tax ID</Label>
                <div className="relative mt-1">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="tax_id"
                    name="tax_id"
                    value={profileForm.tax_id || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="business_license">Business License #</Label>
                <div className="relative mt-1">
                  <FileCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="business_license"
                    name="business_license"
                    value={profileForm.business_license || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="year_established">Year Established</Label>
                <div className="relative mt-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="year_established"
                    name="year_established"
                    type="number"
                    value={profileForm.year_established || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="number_of_employees">Number of Employees</Label>
                <div className="relative mt-1">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="number_of_employees"
                    name="number_of_employees"
                    type="number"
                    value={profileForm.number_of_employees || ""}
                    onChange={handleProfileChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <Label>Upload Logo</Label>
                <Label
                  htmlFor="logo"
                  className="border-2 block border-dashed border-gray-300 rounded-lg p-6 text-center"
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    Image files (JPG, PNG) up to 10MB
                  </p>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      if (
                        selectedFile &&
                        selectedFile.size <= 10 * 1024 * 1024
                      ) {
                        setLogoFile(selectedFile);
                      } else if (selectedFile) {
                        toast.error("File size exceeds 10MB limit.");
                      }
                    }}
                  />
                </Label>
                {logoFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {logoFile.name}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateProfile}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* - - - - - - -  */}

        {/* Document Update Modal */}
        <Dialog open={documentModalOpen} onOpenChange={setDocumentModalOpen}>
          <DialogContent className="w-[540px]">
            <DialogHeader>
              <DialogTitle>Update Document</DialogTitle>
              <DialogDescription>Update document details.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="number">Document Number</Label>
                <Input
                  id="number"
                  name="number"
                  value={documentForm.number || ""}
                  onChange={handleDocumentChange}
                  placeholder="Enter document number"
                />
              </div>
              <div>
                <Label htmlFor="issue_date">Issue Date</Label>
                <Input
                  id="issue_date"
                  name="issue_date"
                  type="date"
                  value={documentForm.issue_date || ""}
                  onChange={handleDocumentChange}
                />
              </div>
              <div>
                <Label htmlFor="expiry_date">Expiry Date</Label>
                <Input
                  id="expiry_date"
                  name="expiry_date"
                  type="date"
                  value={documentForm.expiry_date || ""}
                  onChange={handleDocumentChange}
                />
              </div>
              <div>
                <Label htmlFor="issue_place">Issue Place</Label>
                <Input
                  id="issue_place"
                  name="issue_place"
                  value={documentForm.issue_place || ""}
                  onChange={handleDocumentChange}
                  placeholder="Enter issue place"
                />
              </div>
              <div>
                <Label htmlFor="issued_by">Issued By</Label>
                <Input
                  id="issued_by"
                  name="issued_by"
                  value={documentForm.issued_by || ""}
                  onChange={handleDocumentChange}
                  placeholder="Enter issuing authority"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={documentForm.description || ""}
                  onChange={handleDocumentChange}
                  placeholder="Enter document description"
                />
              </div>
              <div>
                <Label>Upload New File</Label>
                <Label
                  htmlFor="file_path"
                  className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX up to 10MB
                  </p>
                  <Input
                    id="file_path"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      if (
                        selectedFile &&
                        selectedFile.size <= 10 * 1024 * 1024
                      ) {
                        setFile(selectedFile);
                      } else if (selectedFile) {
                        toast.error("File size exceeds 10MB limit.");
                      }
                    }}
                  />
                </Label>
                {file && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {file.name}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleUpdateDocument}
                disabled={updateDocumentMutation.isLoading}
              >
                {updateDocumentMutation.isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* - - - - - - - */}

        {/* Banking Update/Create Modal */}
        <Dialog open={bankingModalOpen} onOpenChange={setBankingModalOpen}>
          <DialogContent className="w-[480px]">
            <DialogHeader>
              <DialogTitle>
                {isCreateBanking ? "Create" : "Update"} Banking Details
              </DialogTitle>
              <DialogDescription>
                {isCreateBanking ? "Add new" : "Update"} banking information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bank_name">Bank Name</Label>
                <Input
                  id="bank_name"
                  name="bank_name"
                  value={bankingForm.bank_name || ""}
                  onChange={handleBankingChange}
                />
              </div>
              <div>
                <Label htmlFor="account_name">Account Name</Label>
                <Input
                  id="account_name"
                  name="account_name"
                  value={bankingForm.account_name || ""}
                  onChange={handleBankingChange}
                />
              </div>
              <div>
                <Label htmlFor="account_number">Account Number</Label>
                <Input
                  id="account_number"
                  name="account_number"
                  value={bankingForm.account_number || ""}
                  onChange={handleBankingChange}
                />
              </div>
              <div>
                <Label htmlFor="swift_code">SWIFT Code</Label>
                <Input
                  id="swift_code"
                  name="swift_code"
                  value={bankingForm.swift_code || ""}
                  onChange={handleBankingChange}
                />
              </div>
              <div>
                <Label htmlFor="bank_branch">Bank Branch</Label>
                <Input
                  id="bank_branch"
                  name="bank_branch"
                  value={bankingForm.bank_branch || ""}
                  onChange={handleBankingChange}
                />
              </div>
              <div>
                <Label htmlFor="routing_number">Routing Number</Label>
                <Input
                  id="routing_number"
                  name="routing_number"
                  value={bankingForm.routing_number || ""}
                  onChange={handleBankingChange}
                />
              </div>
              <div>
                <Label htmlFor="preferred_currency">Preferred Currency</Label>
                <Select
                  value={bankingForm.preferred_currency || "USD"}
                  onValueChange={(value) =>
                    setBankingForm({
                      ...bankingForm,
                      preferred_currency: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="TZS">TZS</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="KSH">KSH</SelectItem>
                    <SelectItem value="UGX">UGX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateOrCreateBanking}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Social Media Update/Create Modal */}
        <Dialog open={socialModalOpen} onOpenChange={setSocialModalOpen}>
          <DialogContent className="w-[360px]">
            <DialogHeader>
              <DialogTitle>
                {isCreateSocial ? "Create" : "Update"} Social Media Account
              </DialogTitle>
              <DialogDescription>
                {isCreateSocial ? "Add new" : "Update"} social media
                information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select
                  value={socialForm.platform || "instagram"}
                  onValueChange={(value) =>
                    setSocialForm({
                      ...socialForm,
                      platform: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="pinterest">Pinterest</SelectItem>
                    <SelectItem value="tripadvisor">TripAdvisor</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  name="url"
                  value={socialForm.url || ""}
                  onChange={handleSocialChange}
                />
              </div>
              <div>
                <Label htmlFor="handle">Username</Label>
                <Input
                  id="handle"
                  name="handle"
                  value={socialForm.handle || ""}
                  onChange={handleSocialChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={socialForm.is_active ?? true}
                  onCheckedChange={(checked) =>
                    setSocialForm({ ...socialForm, is_active: checked })
                  }
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateOrCreateSocial}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      {/* Footer */}
      <footer className="bg-[#155DFC] inter dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <span className="text-sm text-[#FFF] sm:text-center dark:text-gray-400">
            &copy; {new Date().getFullYear()}{" "}
            <a
              href="https://web.safaripro.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              SafariPro™
            </a>
            . All Rights Reserved.
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-sm text-[#FFF] dark:text-gray-400 sm:mt-0">
            {footerLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline me-4 md:me-6"
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li>
              <a
                href="https://web.safaripro.net/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Do not share my personal information
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
