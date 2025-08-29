import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useOnboardingStore } from "@/store/onboarding.store";
import {
  Loader,
  AlertCircleIcon,
  Building,
  FileText,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  User,
  MapPin,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { VendorDetails, VendorDocument } from "../onboarding/vendor";

const API_BASE_URL = import.meta.env.VITE_VENDOR_BASE_URL;

const DetailItem: React.FC<{
  label: string;
  value: React.ReactNode;
}> = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-800 mt-1 break-words">
      {value || <span className="text-gray-400">Not provided</span>}
    </p>
  </div>
);

export default function UserAccountPage() {
  const { vendorId } = useOnboardingStore();

  const {
    data: vendor,
    isLoading,
    error,
  } = useQuery<VendorDetails>({
    queryKey: ["vendorProfileDetails", vendorId],
    queryFn: () =>
      axios.get(`${API_BASE_URL}vendors/${vendorId}`).then((res) => res.data),
    enabled: !!vendorId,
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-16">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Error Loading Profile</AlertTitle>
        <AlertDescription>
          We could not load your vendor profile. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  const progress = vendor.onboarding_progress;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={vendor.logo}
                alt={vendor.business_name}
                className="h-20 w-20 rounded-full object-cover bg-gray-100 border"
              />
              <div>
                <CardTitle className="text-3xl">
                  {vendor.business_name}
                </CardTitle>
                <p className="text-gray-500 text-lg">{vendor.trading_name}</p>
              </div>
            </div>
            <Badge
              variant={vendor.status === "APPROVED" ? "default" : "secondary"}
              className={`text-base px-4 py-1 ${
                vendor.status === "APPROVED"
                  ? "bg-green-500"
                  : vendor.status === "REJECTED"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            >
              {vendor.status_display}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">
                Onboarding Progress
              </span>
              <span className="text-sm font-medium text-blue-600">
                {progress.progress_percentage}%
              </span>
            </div>
            <Progress value={progress.progress_percentage} />
          </div>
        </CardContent>
      </Card>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building size={20} /> Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="md:col-span-2">
                <DetailItem
                  label="Description"
                  value={vendor.business_description}
                />
              </div>
              <DetailItem label="Service Type" value={vendor.service_type} />
              <DetailItem
                label="Year Established"
                value={vendor.year_established}
              />
              <DetailItem
                label="Number of Employees"
                value={vendor.number_of_employees}
              />
              <DetailItem
                label="Registration Number"
                value={vendor.registration_number}
              />
              <DetailItem label="Tax ID (TIN)" value={vendor.tax_id} />
              <DetailItem
                label="Business License"
                value={vendor.business_license}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} /> Submitted Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {vendor.documents.length > 0 ? (
                <ul className="space-y-3">
                  {vendor.documents.map((doc: VendorDocument) => (
                    <li
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md border"
                    >
                      <div>
                        <span className="font-medium text-gray-800">
                          {doc.document_type_name}
                        </span>
                        <p className="text-xs text-gray-500">
                          No: {doc.number}
                        </p>
                      </div>
                      <Badge
                        variant={
                          doc.is_verified
                            ? "default"
                            : doc.rejection_reason
                            ? "destructive"
                            : "secondary"
                        }
                        className={doc.is_verified ? "bg-green-500" : ""}
                      >
                        {doc.is_verified ? (
                          <CheckCircle className="mr-2 h-4 w-4" />
                        ) : doc.rejection_reason ? (
                          <XCircle className="mr-2 h-4 w-4" />
                        ) : (
                          <Clock className="mr-2 h-4 w-4" />
                        )}
                        {doc.is_verified
                          ? "Verified"
                          : doc.rejection_reason
                          ? "Rejected"
                          : "Pending"}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No documents submitted yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={20} /> Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailItem
                label="Primary Contact"
                value={vendor.contact_person_name}
              />
              <DetailItem label="Role" value={vendor.contact_person_title} />
              <DetailItem
                label="Email"
                value={
                  <a
                    href={`mailto:${vendor.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {vendor.email}
                  </a>
                }
              />
              <DetailItem
                label="Phone"
                value={
                  <a
                    href={`tel:${vendor.phone_number}`}
                    className="text-blue-600 hover:underline"
                  >
                    {vendor.phone_number}
                  </a>
                }
              />
              <DetailItem
                label="Website"
                value={
                  <a
                    href={vendor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {vendor.website}
                  </a>
                }
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin size={20} /> Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <DetailItem
                label="Address"
                value={`${vendor.address}, ${vendor.city}`}
              />
              <DetailItem label="Region" value={vendor.region} />
              <DetailItem label="Country" value={vendor.country} />
              <DetailItem label="Postal Code" value={vendor.postal_code} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard size={20} /> Banking Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {vendor.banking_details ? (
                <div className="space-y-2">
                  <p className="font-medium text-gray-800">
                    {vendor.banking_details.bank_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {vendor.banking_details.account_name}
                  </p>
                  {vendor.banking_details.is_verified ? (
                    <Badge className="bg-green-500">Verified</Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No banking details submitted.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
