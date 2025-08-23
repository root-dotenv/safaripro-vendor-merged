// src/components/invoices/InvoiceTicket.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Loader2,
  Printer,
  Building,
  User,
  Mail,
  Phone,
  Calendar,
  BedDouble,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
// FIXED: Added DialogHeader, DialogTitle, and DialogDescription to imports
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import bookingClient from "@/api/booking-client";
import { DualCurrencyDisplay } from "./DualCurrencyDisplay";
import { TableCell } from "@/components/ui/table";

// --- Type Definitions ---
interface Invoice {
  id: string;
  invoice_number: string;
  booking_id: string;
  issue_date: string;
  total_amount: string;
  currency: string;
  status: string;
  amount_paid: string;
}
interface BookingDetails {
  full_name: string;
  code: string;
  email: string;
  phone_number: string | number;
  start_date: string;
  end_date: string;
  property_item_type: string;
  number_of_guests: number;
  microservice_item_name: string;
  billing_meta_data: {
    line_items: Array<{ amount: string; description: string }>;
  };
}
interface InvoiceTicketProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// --- Main Component ---
export function InvoiceTicket({
  invoice,
  isOpen,
  onOpenChange,
}: InvoiceTicketProps) {
  const {
    data: booking,
    isLoading,
    isError,
  } = useQuery<BookingDetails>({
    queryKey: ["bookingDetailsForInvoice", invoice?.booking_id],
    queryFn: async () => {
      const response = await bookingClient.get(
        `/bookings/${invoice!.booking_id}`
      );
      return response.data;
    },
    enabled: !!invoice,
  });

  const handlePrint = () => {
    const printContents = document.getElementById(
      "printable-invoice-area"
    )?.innerHTML;
    const originalContents = document.body.innerHTML;
    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const amountDue = invoice
    ? parseFloat(invoice.total_amount) - parseFloat(invoice.amount_paid)
    : 0;

  const qrCodeValue = JSON.stringify(
    {
      invoiceNumber: invoice?.invoice_number,
      guestName: booking?.full_name,
      totalAmount: invoice?.total_amount,
      currency: invoice?.currency,
      issueDate: invoice?.issue_date,
    },
    null,
    2
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        {/* ACCESSIBILITY FIX: Added a visually hidden DialogHeader, Title, and Description */}
        <DialogHeader className="sr-only">
          <DialogTitle>Invoice Details</DialogTitle>
          <DialogDescription>
            A detailed view of the invoice for booking number{" "}
            {invoice?.invoice_number}.
          </DialogDescription>
        </DialogHeader>

        <div id="printable-invoice-area" className="p-8">
          <header className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">INVOICE</h1>
              {/* BUG FIX: Changed <p> to <div> to prevent invalid HTML nesting */}
              <div className="text-muted-foreground mt-1">
                {isLoading ? (
                  <Skeleton className="h-4 w-48" />
                ) : (
                  `#${invoice?.invoice_number}`
                )}
              </div>
            </div>
            <div className="text-right">
              {isLoading ? (
                <Skeleton className="h-24 w-24" />
              ) : (
                <QRCodeCanvas
                  value={qrCodeValue}
                  size={96}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="L"
                />
              )}
            </div>
          </header>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-500 mb-2">Billed To</h3>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : booking ? (
                <div className="space-y-1">
                  <p className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <User size={14} /> {booking.full_name}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail size={14} /> {booking.email}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Phone size={14} /> {booking.phone_number}
                  </p>
                </div>
              ) : (
                <p>N/A</p>
              )}
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-gray-500 mb-2">Billed From</h3>
              {isLoading ? (
                <div className="space-y-2 flex flex-col items-end">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : booking ? (
                <div className="space-y-1">
                  <p className="font-bold text-lg text-gray-800 flex items-center justify-end gap-2">
                    <Building size={14} /> {booking.microservice_item_name}
                  </p>
                  <p className="text-muted-foreground">
                    Invoice Date:{" "}
                    {invoice ? format(new Date(invoice.issue_date), "PP") : ""}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold text-gray-500 mb-2">
              Booking Summary
            </h3>
            {isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : booking ? (
              <div className="grid grid-cols-3 gap-4 rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <BedDouble className="text-primary" />
                  <p>
                    <strong>Room:</strong> {booking.property_item_type}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <User className="text-primary" />
                  <p>
                    <strong>Guests:</strong> {booking.number_of_guests}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="text-primary" />
                  <p>
                    <strong>Stay:</strong>{" "}
                    {format(new Date(booking.start_date), "PP")} -{" "}
                    {format(new Date(booking.end_date), "PP")}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left font-semibold text-gray-600 p-3">
                    Description
                  </th>
                  <th className="text-right font-semibold text-gray-600 p-3">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <TableCell colSpan={2}>
                      <Loader2 className="mx-auto my-8 animate-spin" />
                    </TableCell>
                  </tr>
                ) : isError ? (
                  <tr>
                    <TableCell
                      colSpan={2}
                      className="text-center text-red-500 py-8"
                    >
                      Could not load line items.
                    </TableCell>
                  </tr>
                ) : (
                  booking?.billing_meta_data?.line_items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{item.description}</td>
                      <td className="text-right p-3">
                        <DualCurrencyDisplay
                          amount={item.amount}
                          currency={invoice!.currency}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-6">
            <div className="w-full max-w-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <DualCurrencyDisplay
                  amount={invoice!.total_amount}
                  currency={invoice!.currency}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid</span>
                <span>
                  -{" "}
                  <DualCurrencyDisplay
                    amount={invoice!.amount_paid}
                    currency={invoice!.currency}
                  />
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold">
                <span>Amount Due</span>
                <DualCurrencyDisplay
                  amount={amountDue}
                  currency={invoice!.currency}
                />
              </div>
            </div>
          </div>

          <footer className="text-center text-sm text-muted-foreground mt-12">
            <p>Thank you for your business!</p>
          </footer>
        </div>
        <div className="flex justify-end gap-2 p-4 bg-gray-50 border-t print:hidden">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handlePrint} disabled={isLoading}>
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
