import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Loader2, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// --- Type Definitions ---
interface Booking {
  id: string;
  code: string;
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  booking_status: string;
  checkin: string | null;
  checkout: string | null;
  special_requests: string | null;
  service_notes: string | null;
  [key: string]: any;
}

interface EditBookingModalProps {
  booking: Booking;
  onClose: () => void;
}

const schema = yup.object().shape({
  full_name: yup.string().min(3, "Name must be at least 3 characters"),
  email: yup.string().email("Must be a valid email"),
  phone_number: yup.string(),
  address: yup.string(),
  booking_status: yup.string(),
  special_requests: yup.string().nullable(),
  service_notes: yup.string().nullable(),
});

export default function EditBookingModal({
  booking,
  onClose,
}: EditBookingModalProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isCheckoutRequested, setIsCheckoutRequested] = useState(false);

  const form = useForm<Partial<Booking>>({
    resolver: yupResolver(schema),
    defaultValues: {
      full_name: booking.full_name,
      email: booking.email,
      phone_number: booking.phone_number.toString(),
      booking_status: booking.booking_status,
      address: booking.address,
      special_requests: booking.special_requests || "",
      service_notes: booking.service_notes || "",
    },
  });

  const BOOKING_BASE_URL = import.meta.env.VITE_BOOKING_BASE_URL;

  const updateBookingMutation = useMutation({
    mutationFn: (updatedData: Partial<Booking>) =>
      axios.patch(`${BOOKING_BASE_URL}bookings/${booking.id}`, updatedData),
    onSuccess: () => {
      // UPDATED: New toast on success
      toast({
        title: "Success!",
        description: "Booking details have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["allBookings"] });
      queryClient.invalidateQueries({
        queryKey: ["bookingDetails", booking.id],
      });
      onClose();
    },
    onError: (error) =>
      // UPDATED: New toast on error
      toast({
        variant: "destructive",
        title: "Update Failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
      }),
  });

  const checkOutMutation = useMutation({
    mutationFn: () =>
      axios.post(`${BOOKING_BASE_URL}bookings/${booking.id}/check_out`),
    onSuccess: () => {
      // UPDATED: New toast on success
      toast({
        title: "Success!",
        description: "Guest has been checked out successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["allBookings"] });
      queryClient.invalidateQueries({
        queryKey: ["bookingDetails", booking.id],
      });
      onClose();
    },
    onError: (error) =>
      // UPDATED: New toast on error
      toast({
        variant: "destructive",
        title: "Check-out Failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
      }),
  });

  const onUpdateSubmit = (data: Partial<Booking>) => {
    const changedData: { [key: string]: any } = {};
    Object.keys(data).forEach((keyStr) => {
      const key = keyStr as keyof Partial<Booking>;
      const originalValue = booking[key] === null ? "" : booking[key];
      const formValue = data[key] === null ? "" : data[key];

      if (String(originalValue) !== String(formValue)) {
        changedData[key] = data[key];
      }
    });

    if (Object.keys(changedData).length === 0) {
      // UPDATED: New toast for info
      toast({
        title: "No Changes",
        description: "No details were modified.",
      });
      onClose();
      return;
    }

    console.log("Data being sent to the backend:", changedData);
    updateBookingMutation.mutate(changedData);
  };

  const handleCheckout = () => {
    if (isCheckoutRequested) {
      checkOutMutation.mutate();
    }
  };

  const isProcessing =
    updateBookingMutation.isPending || checkOutMutation.isPending;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-3xl sm:max-h-[90vh]">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Edit Booking with ID : {booking.code}</DialogTitle>
          <DialogDescription>
            Make changes to the booking details or perform a check-out.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto px-6 py-4">
          <Form {...form}>
            <form
              id="edit-booking-form"
              onSubmit={form.handleSubmit(onUpdateSubmit)}
              className="space-y-6"
            >
              {/* ... form fields are unchanged ... */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="booking_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booking Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Confirmed">Confirmed</SelectItem>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="Checked In">Checked In</SelectItem>
                          <SelectItem value="Checked Out">
                            Checked Out
                          </SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="special_requests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guest's Special Requests</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Notes about the guest's specific requests..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="service_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Internal Service Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Internal notes for staff..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>

          {booking.checkin && !booking.checkout && (
            <>
              <Separator className="my-6" />
              <div className="space-y-4">
                <h3 className="font-semibold">Guest Check-out</h3>
                <Alert>
                  <LogOut className="h-4 w-4" />
                  <AlertTitle>Perform Check-out</AlertTitle>
                  <AlertDescription>
                    Checking out this guest will record the current time as
                    their official departure time. This action cannot be undone.
                  </AlertDescription>
                </Alert>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="confirm-checkout"
                    checked={isCheckoutRequested}
                    onCheckedChange={(checked) =>
                      setIsCheckoutRequested(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="confirm-checkout"
                    className="text-sm font-medium leading-none"
                  >
                    I confirm I want to check this guest out now.
                  </label>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={!isCheckoutRequested || isProcessing}
                  className="w-full bg-red-600 text-white hover:bg-red-700"
                >
                  {checkOutMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Check Out Now
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-booking-form"
            disabled={isProcessing}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            {updateBookingMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Update Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
