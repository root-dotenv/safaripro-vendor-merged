// src/pages/Payouts.tsx
"use client";

import { useState, useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";

// UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Landmark,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Receipt,
} from "lucide-react";
import { DualCurrencyDisplay } from "./DualCurrencyDisplay";

// --- Type Definition ---
type Payout = {
  id: string;
  created_at: string;
  updated_at: string;
  vendor_id: string;
  total_gross_revenue: string;
  total_commissions_deducted: string;
  total_refunds_deducted: string;
  total_other_deductions: string;
  net_amount_payable: string;
  currency: string;
  status: "CALCULATED" | "PENDING" | "PAID" | "FAILED";
  payroll_cycle: string;
};

type PayoutsApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Payout[];
};

// --- Helper Functions ---
const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
};

const getStatusBadgeVariant = (status: Payout["status"]) => {
  switch (status) {
    case "PAID":
      return "success";
    case "CALCULATED":
      return "default";
    case "PENDING":
      return "outline";
    case "FAILED":
      return "destructive";
    default:
      return "secondary";
  }
};

// Define client outside the component for best practice
const payoutClient = axios.create({
  baseURL: import.meta.env.VITE_BILLING_BASE_URL,
});

export default function Payouts() {
  const [page, setPage] = useState(1);
  const VENDOR_ID = "2019ab69-ad9d-4a63-864a-1ae101ed3264";

  const { data, isLoading } = useQuery<PayoutsApiResponse>({
    queryKey: ["vendorPayouts", VENDOR_ID, page],
    queryFn: () =>
      payoutClient
        .get(`/vendor-payouts?vendor_id=${VENDOR_ID}&page=${page}`)
        .then((res) => res.data),
    placeholderData: keepPreviousData,
  });

  const payouts = useMemo(() => data?.results ?? [], [data]);
  const latestPayout = useMemo(() => payouts[0] ?? null, [payouts]);
  const pageCount = useMemo(() => {
    return data ? Math.ceil(data.count / 10) : 0;
  }, [data]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Payouts</h1>
      </div>

      {/* --- Summary Cards --- */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Latest Payout Amount
            </CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-3/4" />
            ) : latestPayout ? (
              <div className="text-2xl font-bold">
                <DualCurrencyDisplay
                  amount={latestPayout.net_amount_payable}
                  currency={latestPayout.currency}
                />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data</p>
            )}
            <p className="text-xs text-muted-foreground">
              Net amount for the most recent cycle
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Latest Payout Status
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : latestPayout ? (
              <div className="text-2xl font-bold capitalize">
                <Badge variant={getStatusBadgeVariant(latestPayout.status)}>
                  {latestPayout.status.toLowerCase()}
                </Badge>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data</p>
            )}
            <p className="text-xs text-muted-foreground">
              Current status of the latest payout
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Calculation Date
            </CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-3/4" />
            ) : latestPayout ? (
              <div className="text-2xl font-bold">
                {formatDate(latestPayout.created_at).split(",")[0]}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data</p>
            )}
            <p className="text-xs text-muted-foreground">
              When the latest payout was generated
            </p>
          </CardContent>
        </Card>
      </div>

      {/* --- Payouts Table --- */}
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
          <CardDescription>
            A detailed log of all your past and current payouts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payout ID</TableHead>
                <TableHead>Date Calculated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Gross Revenue</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-10 w-28 ml-auto" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-10 w-28 ml-auto" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-10 w-28 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading && payouts.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Inbox className="h-8 w-8" />
                      No payouts found.
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                payouts.map((payout) => {
                  const totalDeductions =
                    parseFloat(payout.total_commissions_deducted) +
                    parseFloat(payout.total_refunds_deducted) +
                    parseFloat(payout.total_other_deductions);

                  return (
                    <TableRow key={payout.id}>
                      <TableCell className="font-mono text-xs">
                        {payout.id}
                      </TableCell>
                      <TableCell>{formatDate(payout.created_at)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(payout.status)}>
                          {payout.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DualCurrencyDisplay
                          amount={payout.total_gross_revenue}
                          currency={payout.currency}
                        />
                      </TableCell>
                      <TableCell className="text-right text-destructive">
                        <DualCurrencyDisplay
                          amount={totalDeductions}
                          currency={payout.currency}
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <DualCurrencyDisplay
                          amount={payout.net_amount_payable}
                          currency={payout.currency}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Page {page} of {pageCount}
          </div>
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
        </CardFooter>
      </Card>
    </div>
  );
}
