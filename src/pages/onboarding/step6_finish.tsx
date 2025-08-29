import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useOnboardingStore } from "@/store/onboarding.store";
import { useAuthStore } from "@/store/auth.store";
import {
  Loader,
  AlertCircleIcon,
  CheckCircle,
  Hourglass,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import type { VendorDetails } from "./vendor";

const API_BASE_URL = import.meta.env.VITE_VENDOR_BASE_URL;

const StatusItem: React.FC<{ title: string; status: string }> = ({
  title,
  status,
}) => {
  const isCompleted = status === "completed";
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
      {isCompleted ? (
        <CheckCircle className="h-6 w-6 text-green-500" />
      ) : (
        <Hourglass className="h-6 w-6 text-yellow-500" />
      )}
      <div className="flex-1 text-left">
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-sm capitalize text-gray-500">
          {status.replace("_", " ")}
        </p>
      </div>
    </div>
  );
};

export const Step6_Finish = () => {
  const navigate = useNavigate();
  const { vendorId, hotelId, resetOnboarding } = useOnboardingStore();
  const { completeOnboarding } = useAuthStore();

  const { data, isLoading, error, refetch, isRefetching } =
    useQuery<VendorDetails>({
      queryKey: ["vendorOnboardingStatus", vendorId],
      queryFn: () =>
        axios.get(`${API_BASE_URL}vendors/${vendorId}`).then((res) => res.data),
      enabled: !!vendorId,
      refetchInterval: 30000, // Poll every 30 seconds
    });

  const handleFinish = () => {
    if (hotelId) {
      completeOnboarding(hotelId);
      resetOnboarding();
      toast.success("Setup complete! Welcome to your dashboard.");
      navigate("/");
    } else {
      toast.error("Cannot proceed to dashboard: Hotel ID is missing.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 space-y-4 min-h-[400px]">
        <Loader className="animate-spin text-blue-600" size={40} />
        <span className="text-lg text-slate-600">
          Loading Your Onboarding Status...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Failed to Load Status</AlertTitle>
        <AlertDescription>
          We couldn't retrieve your status. Please try refreshing.
        </AlertDescription>
      </Alert>
    );
  }

  const progress = data?.onboarding_progress;
  const isApproved = data?.status === "APPROVED";

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 space-y-8 min-h-[400px]">
      <div className="w-full max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 text-left">
            Application Under Review
          </h1>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            disabled={isRefetching}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </header>
        <p className="text-lg text-gray-600 mb-8 text-left">
          Your submission is being processed by our team. You can view your
          profile to check on the status. Once fully approved, you can proceed
          to your dashboard.
        </p>

        <div className="text-left space-y-2 mb-8">
          <div className="flex justify-between font-semibold">
            <span>Overall Progress</span>
            <span>{progress?.progress_percentage ?? 0}%</span>
          </div>
          <Progress
            value={progress?.progress_percentage ?? 0}
            className="w-full h-3"
          />
        </div>

        {progress && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatusItem
              title="Company Profile"
              status={progress.steps.profile_completion.status}
            />
            <StatusItem
              title="Document Verification"
              status={progress.steps.document_verification.status}
            />
            <StatusItem
              title="Banking Details"
              status={progress.steps.banking_details.status}
            />
          </div>
        )}

        <div className="flex justify-center gap-4 mt-12">
          <Button asChild variant="outline" size="lg">
            <Link to="/user-account">View Your Profile</Link>
          </Button>
          <Button size="lg" disabled={!isApproved} onClick={handleFinish}>
            Go to Your Dashboard
          </Button>
        </div>
        {!isApproved && (
          <p className="text-sm text-gray-500 mt-4">
            The "Go to Dashboard" button will be enabled once your account is
            approved.
          </p>
        )}
      </div>
    </div>
  );
};
