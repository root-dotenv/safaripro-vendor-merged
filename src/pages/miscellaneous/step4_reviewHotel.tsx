// - - - src/pages/miscellaneous/step4_reviewHotel.tsx (COMPLETE)
import { useState, type FC } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import type { Hotel } from "./walkthrough";
import { InputGroup } from "./InputGroup";
import { updateHotelDetails } from "@/api/apiClient";
import { FaRegLightbulb } from "react-icons/fa";

const REVIEW_FORM_KEY = "walkthrough_step4_review";

const reviewSchema = z.object({
  name: z.string().min(3, "Hotel name is too short."),
  description: z.string().min(10, "Description is too short."),
  star_rating: z.number().min(1).max(5),
  check_in_from: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format."),
  check_out_to: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format."),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});
type ReviewFormValues = z.infer<typeof reviewSchema>;

interface Step4Props {
  hotel: Hotel;
  onStepComplete: (isComplete: boolean) => void;
}

const Step4_ReviewHotel_ManualSave: FC<Step4Props> = ({
  hotel,
  onStepComplete,
}) => {
  const queryClient = useQueryClient();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      name: hotel.name || "",
      description: hotel.description || "",
      star_rating: hotel.star_rating || 3,
      check_in_from: hotel.check_in_from || "14:00",
      check_out_to: hotel.check_out_to || "11:00",
      latitude: hotel.latitude || -6.7924,
      longitude: hotel.longitude || 39.2083,
    },
  });

  useFormPersistence(REVIEW_FORM_KEY, form);

  const mutation = useMutation({
    mutationFn: (updatedData: ReviewFormValues) =>
      updateHotelDetails(hotel.id, updatedData),
    onSuccess: () => {
      toast.success("Hotel details updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["hotelProfile", hotel.id] });
    },
    onError: () => toast.error("Update failed. Please try again."),
  });

  const onSubmit = (data: ReviewFormValues) => mutation.mutate(data);

  const handleConfirmation = (checked: boolean) => {
    setIsConfirmed(checked);
    onStepComplete(checked);
  };

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Final Review</h1>
        <p className="text-gray-500 mt-1">
          Review your hotel's details and click "Save Changes" when you're done.
        </p>
      </div>
      {/* - - - - Notes Summary */}
      <div className="w-[calc(100%-2rem)] mx-auto my-2 p-4 flex gap-x-4 items-start bg-gray-100/30 shadow rounded-md border border-[#DADCE0]">
        {/*  - - - Bulb */}
        <div>
          <FaRegLightbulb color="#000" size={20} />
        </div>
        {/* - - - Notes Contents */}
        <div>
          <h2 className="text-[1rem] font-bold">Is this information final?</h2>
          <p className="text-[0.9375rem]">
            No, you can always update your hotel's details later from your
            dashboard settings.
          </p>
        </div>
      </div>
      {/* - - - -  */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 bg-none"
      >
        <div className="p-6 border rounded-lg bg-none border-none shadow-none space-y-4">
          <InputGroup
            label="Hotel Name"
            error={form.formState.errors.name?.message}
          >
            <Input {...form.register("name")} />
          </InputGroup>
          <InputGroup
            label="Hotel Description"
            error={form.formState.errors.description?.message}
          >
            <Textarea {...form.register("description")} rows={6} />
          </InputGroup>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputGroup
              label="Check-in from"
              error={form.formState.errors.check_in_from?.message}
            >
              <Input type="time" {...form.register("check_in_from")} />
            </InputGroup>
            <InputGroup
              label="Check-out to"
              error={form.formState.errors.check_out_to?.message}
            >
              <Input type="time" {...form.register("check_out_to")} />
            </InputGroup>
            <InputGroup
              label="Star Rating"
              error={form.formState.errors.star_rating?.message}
            >
              <Controller
                name="star_rating"
                control={form.control}
                render={({ field }) => (
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={String(field.value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <SelectItem key={s} value={String(s)}>
                          {s} Star{s > 1 && "s"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </InputGroup>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
            <h2 className="col-span-12 text-[0.9375rem] font-medium">
              Hotel Location
            </h2>
            <InputGroup
              label="Latitude"
              error={form.formState.errors.latitude?.message}
            >
              <Input
                type="number"
                step="any"
                {...form.register("latitude", { valueAsNumber: true })}
              />
            </InputGroup>
            <InputGroup
              label="Longitude"
              error={form.formState.errors.longitude?.message}
            >
              <Input
                type="number"
                step="any"
                {...form.register("longitude", { valueAsNumber: true })}
              />
            </InputGroup>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full rounded-[6px] bg-[#0081FB] hover:bg-blue-600 text-[1rem] transition-all"
          disabled={mutation.isPending}
        >
          {mutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save Changes
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t flex items-center space-x-3">
        <Checkbox
          id="confirmation"
          checked={isConfirmed}
          onCheckedChange={(checked) => handleConfirmation(checked as boolean)}
          className="border-[#DADCE0] border-[1.5px] data-[state=checked]:bg-[#0081FB] data-[state=checked]:text-[#FFF]"
        />
        <Label htmlFor="confirmation" className="font-medium">
          I have reviewed all details and confirm they are correct.
        </Label>
      </div>
    </>
  );
};

export default Step4_ReviewHotel_ManualSave;
