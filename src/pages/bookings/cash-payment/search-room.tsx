import React from "react";
import {
  Calendar as CalendarIcon,
  Search,
  Bed,
  AlertCircle,
  Loader2,
} from "lucide-react";
import type { Room } from "./types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils"; // Assuming you have a utility for classnames

// --- NEW REUSABLE DATE PICKER COMPONENT ---
// This component encapsulates the Popover and Calendar logic.
interface DatePickerProps {
  label: string;
  id: string;
  value: string; // Expects "YYYY-MM-DD"
  onChange: (date: string) => void; // Returns "YYYY-MM-DD"
  disabled?: boolean;
  disabledDays?: any; // Prop to pass to the Calendar for disabling dates
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  id,
  value,
  onChange,
  disabled = false,
  disabledDays,
}) => {
  const [open, setOpen] = React.useState(false);

  // Helper to format Date object to "YYYY-MM-DD" string
  const formatDateToString = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  // The date value for the calendar needs to be a Date object
  const selectedDate = value ? new Date(value) : undefined;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal border-gray-300",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? value : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                onChange(formatDateToString(date)); // Send back as string
              }
              setOpen(false);
            }}
            disabled={disabledDays}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

// --- UPDATED SEARCH ROOM AVAILABILITY COMPONENT ---
interface SearchRoomAvailabilityProps {
  startDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  endDate: string;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  availableRooms: Room[];
  loading: boolean;
  error: string;
  onSearchRooms: () => void;
  onSelectRoom: (room: Room) => void;
}

export const SearchRoomAvailability: React.FC<SearchRoomAvailabilityProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  availableRooms,
  loading,
  error,
  onSearchRooms,
  onSelectRoom,
}) => {
  const isRoomFullyAvailable = (room: Room) => {
    return room.availability.every(
      (day) => day.availability_status === "Available"
    );
  };

  return (
    <>
      {/* Date Selection Form */}
      <Card className="shadow rounded-md mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
            <CalendarIcon className="mr-3 h-6 w-6 text-blue-600" />
            Find Your Perfect Stay
          </CardTitle>
          <CardDescription>
            Select your dates to see what's available.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Replaced Input with the new DatePicker component */}
            <DatePicker
              label="Check-in Date"
              id="startDate"
              value={startDate}
              onChange={setStartDate}
              disabledDays={{ before: new Date() }} // Disable past dates
            />
            {/* Replaced Input with the new DatePicker component */}
            <DatePicker
              label="Check-out Date"
              id="endDate"
              value={endDate}
              onChange={setEndDate}
              disabled={!startDate} // Disable until start date is selected
              disabledDays={{
                before: startDate
                  ? new Date(new Date(startDate).getTime() + 86400000)
                  : new Date(),
              }} // Disable dates before and including start date
            />
            <Button
              onClick={onSearchRooms}
              disabled={loading || !startDate || !endDate}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-3 text-base rounded"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-1 h-5 w-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-1 h-5 w-5" />
                  Search Availability
                </>
              )}
            </Button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md flex items-center gap-3">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Rooms Table (Styling improved for better readability) */}
      {availableRooms.length > 0 && (
        <Card className="border-gray-200 shadow rounded-md">
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
              <Bed className="mr-3 h-6 w-6 text-blue-600" />
              Available Rooms ({availableRooms.length} Available)
            </CardTitle>
            <CardDescription className="text-gray-600 pt-1">
              Showing results for:{" "}
              <span className="font-semibold text-gray-700">{startDate}</span>{" "}
              to <span className="font-semibold text-gray-700">{endDate}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-none hover:bg-gray-100/50">
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bed Type
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room Code
                    </TableHead>
                    <TableHead className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableRooms.map((room) => (
                    <TableRow
                      key={room.room_id}
                      className="hover:bg-gray-50 border-b"
                    >
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {room.room_type_name}
                        </div>
                        {!isRoomFullyAvailable(room) && (
                          <div className="text-xs text-yellow-600 font-medium mt-1">
                            Limited availability
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {room.bed_type}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          ${room.price_per_night.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">per night</div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                        {room.room_code}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-right">
                        <Button
                          onClick={() => onSelectRoom(room)}
                          disabled={!isRoomFullyAvailable(room)}
                          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow rounded text-white text-sm font-semibold"
                        >
                          Select & Book
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results Message (Slightly enhanced UI) */}
      {!loading &&
        availableRooms.length === 0 &&
        startDate &&
        endDate &&
        !error && (
          <Card className="border-gray-200 border-dashed shadow-none text-center">
            <CardContent className="p-10">
              <Bed className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Rooms Available
              </h3>
              <p className="text-gray-500">
                Unfortunately, no rooms match your selected dates. Please try a
                different date range.
              </p>
            </CardContent>
          </Card>
        )}
    </>
  );
};
