// - - - src/pages/onboarding/step3_banking-details.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { Landmark, AlertCircleIcon, User, Building, Globe } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { BankingDetailsPayload } from "./vendor";
import { FormField } from "./form-field";
import { NotesSummary } from "./notes-summary";
import { FaRegPaperPlane } from "react-icons/fa6";

const API_BASE_URL = import.meta.env.VITE_VENDOR_BASE_URL;

const banks = [
  "National Microfinance Bank (NMB)",
  "CRDB Bank PLC (CRDB)",
  "NBC Bank (NBC)",
  "Standard Chartered Bank Tanzania (SCB)",
  "Equity Bank Tanzania (Equity)",
  "KCB Bank Tanzania (KCB)",
  "Diamond Trust Bank Tanzania (DTB)",
  "Stanbic Bank Tanzania (Stanbic)",
  "Exim Bank Tanzania (Exim)",
  "Azania Bank (Azania)",
  "Citibank Tanzania (Citi)",
  "I&M Bank Tanzania (I&M)",
];

interface BankingDetailsProps {
  vendorId: string;
  onComplete: () => void;
  setStepComplete: (isComplete: boolean) => void;
}

export const Step3_BankingDetails: React.FC<BankingDetailsProps> = ({
  vendorId,
  onComplete,
  setStepComplete,
}) => {
  const [formData, setFormData] = useState<
    Omit<BankingDetailsPayload, "vendor">
  >({
    bank_name: "",
    account_name: "",
    account_number: "",
    swift_code: "",
    bank_branch: "",
    routing_number: "",
    preferred_currency: "",
  });

  const [bankSelection, setBankSelection] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const {
      bank_name,
      bank_branch,
      account_name,
      account_number,
      swift_code,
      preferred_currency,
    } = formData;

    const isFormValid =
      bank_name.trim() !== "" &&
      bank_branch.trim() !== "" &&
      account_name.trim() !== "" &&
      account_number.trim() !== "" &&
      swift_code.trim() !== "" &&
      preferred_currency.trim() !== "";

    setStepComplete(isFormValid && isConfirmed);
  }, [formData, isConfirmed, setStepComplete]);

  const mutation = useMutation({
    mutationFn: (newBankingDetails: BankingDetailsPayload) =>
      axios.post(`${API_BASE_URL}banking-details`, newBankingDetails),
    onSuccess: () => {
      toast.success("Banking Details Saved!", {
        description: "You can now proceed to create your hotel.",
      });
      onComplete();
    },
    onError: (error: any) => {
      const serverError = error.response?.data;
      let errorMsg = "An error occurred. Please review your details.";
      if (typeof serverError === "object" && serverError !== null) {
        errorMsg = Object.entries(serverError)
          .map(([key, value]) => `${key}: ${(value as string[]).join(", ")}`)
          .join("; ");
      }
      setErrorMessage(errorMsg);
    },
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankSelectChange = (value: string) => {
    setBankSelection(value);
    if (value !== "Other") {
      setFormData((prev) => ({ ...prev, bank_name: value }));
    } else {
      setFormData((prev) => ({ ...prev, bank_name: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const payload: BankingDetailsPayload = {
      ...formData,
      vendor: vendorId,
    };

    mutation.mutate(payload);
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-lg border border-gray-200">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Banking Details</h1>
        <p className="mt-2 text-gray-600">
          Provide your bank account details for payments and settlements from
          bookings made through SafariPro.
        </p>
      </header>

      <NotesSummary title="Secure & Encrypted">
        <p>
          Your financial information is transmitted securely and is required to
          process payouts. Ensure the account name matches your registered
          business name.
        </p>
      </NotesSummary>

      <form
        id="banking-details-form"
        onSubmit={handleSubmit}
        className="space-y-6 mt-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="bank_name_select"
            label="Bank Name"
            icon={<Landmark size={16} />}
            required
          >
            <Select
              onValueChange={handleBankSelectChange}
              value={bankSelection}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a bank..." />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem
                    className="inter uppercase"
                    key={bank}
                    value={bank}
                  >
                    {bank}
                  </SelectItem>
                ))}
                <SelectItem value="Other">Other (Please specify)</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          {bankSelection === "Other" && (
            <FormField
              name="bank_name"
              label="Other Bank Name"
              icon={<Landmark size={16} />}
              required
            >
              <Input
                id="bank_name"
                name="bank_name"
                value={formData.bank_name}
                onChange={(e) => handleChange("bank_name", e.target.value)}
                placeholder="Enter the bank name"
                required
              />
            </FormField>
          )}

          <FormField
            name="bank_branch"
            label="Bank Branch"
            icon={<Building size={16} />}
            required
          >
            <Input
              id="bank_branch"
              name="bank_branch"
              value={formData.bank_branch}
              onChange={(e) => handleChange("bank_branch", e.target.value)}
              placeholder="e.g. City Center Branch"
              required
            />
          </FormField>
          <FormField
            name="account_name"
            label="Account Name"
            icon={<User size={16} />}
            required
          >
            <Input
              id="account_name"
              name="account_name"
              value={formData.account_name}
              onChange={(e) => handleChange("account_name", e.target.value)}
              placeholder="The legal name on the account"
              required
            />
          </FormField>
          <FormField
            name="account_number"
            label="Account Number"
            icon={""}
            required
          >
            <Input
              id="account_number"
              name="account_number"
              value={formData.account_number}
              onChange={(e) => handleChange("account_number", e.target.value)}
              placeholder="e.g. 0123456789012"
              required
            />
          </FormField>
          <FormField
            name="swift_code"
            label="SWIFT Code"
            icon={<FaRegPaperPlane size={14} />}
            required
          >
            <Input
              id="swift_code"
              name="swift_code"
              value={formData.swift_code}
              onChange={(e) => handleChange("swift_code", e.target.value)}
              placeholder="e.g. CORUTZTZ"
              required
            />
          </FormField>
          <FormField
            name="routing_number"
            label="Routing Number (Optional)"
            icon={""}
          >
            <Input
              id="routing_number"
              name="routing_number"
              value={formData.routing_number}
              onChange={(e) => handleChange("routing_number", e.target.value)}
              placeholder="If applicable"
            />
          </FormField>
          <div className="md:col-span-2">
            <FormField
              name="preferred_currency"
              label="Preferred Currency"
              icon={<Globe size={16} />}
              required
            >
              <Select
                onValueChange={(value) =>
                  handleChange("preferred_currency", value)
                }
                value={formData.preferred_currency}
              >
                <SelectTrigger id="preferred_currency">
                  <SelectValue placeholder="Select a currency..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="inter" value="TZS">
                    TZS - TANZANIAN SHILLING
                  </SelectItem>
                  <SelectItem className="inter" value="KES">
                    KES - KENYAN SHILLING
                  </SelectItem>
                  <SelectItem className="inter" value="UGX">
                    UGX - UGANDAN SHILLING
                  </SelectItem>
                  <SelectItem className="inter" value="USD">
                    USD - US DOLLAR
                  </SelectItem>
                  <SelectItem className="inter" value="EUR">
                    EUR - EURO
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </div>

        <div className="!mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <Switch
              id="confirmation"
              checked={isConfirmed}
              onCheckedChange={setIsConfirmed}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="confirmation"
                className="font-medium text-gray-800 cursor-pointer inter text-[0.9375rem]"
              >
                I confirm that these banking details are correct.
              </Label>
              <p className="text-sm font-medium text-gray-500">
                NOTE: You can always change thesee details later in your
                vendor's account dashboard.
              </p>
            </div>
          </div>
        </div>

        {errorMessage && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Submission Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  );
};
