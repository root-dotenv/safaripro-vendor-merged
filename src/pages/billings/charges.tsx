// src/pages/Charges.tsx
"use client";
import { useState, useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// Icons
import {
  FileText,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import axios from "axios";

// --- Type Definition ---
type ChargeType = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  is_deduction: boolean;
  is_taxable: boolean;
  is_payroll_relevant: boolean;
};

type ChargesApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ChargeType[];
};

// --- Helper Function ---
// Formats a SNAKE_CASE_NAME to a more readable "Title Case Name"
const formatName = (name: string): string => {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// --- Skeleton Component for Loading State ---
const ChargeCardSkeleton = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-6 w-48" />
      </CardTitle>
      <CardDescription>
        <Skeleton className="h-4 w-full" />
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        <li className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </li>
        <li className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </li>
        <li className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </li>
      </ul>
    </CardContent>
  </Card>
);

export default function Charges() {
  const apiClient = axios.create({
    baseURL: "http://192.168.1.193:8030/api/v1",
  });

  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<ChargesApiResponse>({
    queryKey: ["chargeTypes", page],
    queryFn: () =>
      apiClient.get(`/charge-types?page=${page}`).then((res) => res.data),
    placeholderData: keepPreviousData,
  });

  const charges = useMemo(() => data?.results ?? [], [data]);
  const pageCount = useMemo(() => {
    return data ? Math.ceil(data.count / 10) : 0; // Assuming 10 items per page
  }, [data]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      {/* --- Page Header --- */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Charges & Commissions
        </h1>
        <p className="text-muted-foreground mt-2">
          This is a read-only list of all charges, taxes, and commissions
          applied to transactions.
        </p>
      </div>

      {/* --- Charges List --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          // Show skeleton loaders while fetching
          Array.from({ length: 3 }).map((_, i) => (
            <ChargeCardSkeleton key={i} />
          ))}

        {!isLoading &&
          charges.map((charge) => (
            <Card key={charge.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  {formatName(charge.name)}
                </CardTitle>
                <CardDescription>{charge.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <h4 className="mb-2 font-semibold text-sm">Properties</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    {charge.is_deduction ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span
                      className={
                        !charge.is_deduction ? "text-muted-foreground" : ""
                      }
                    >
                      Is a Deduction
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    {charge.is_taxable ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span
                      className={
                        !charge.is_taxable ? "text-muted-foreground" : ""
                      }
                    >
                      Is Taxable
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    {charge.is_payroll_relevant ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span
                      className={
                        !charge.is_payroll_relevant
                          ? "text-muted-foreground"
                          : ""
                      }
                    >
                      Is Payroll Relevant
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* --- Empty State --- */}
      {!isLoading && charges.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-24 text-center">
          <Info className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Charges Found</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            There are currently no charge types configured by the system
            administrator.
          </p>
        </div>
      )}

      {/* --- Pagination Controls --- */}
      {pageCount > 1 && (
        <div className="flex items-center justify-end gap-4 pt-4">
          <span className="text-sm text-muted-foreground">
            Page {page} of {pageCount}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={!data?.previous}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={!data?.next}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
