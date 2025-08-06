import React from "react";
import { Calendar, Search, Bed, AlertCircle, Loader2 } from "lucide-react";
import type { Room } from "./types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
      <Card className="shadow-sm mb-6">
        <CardHeader className="bg-none border-b border-gray-100">
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Select Your Dates
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label
                htmlFor="startDate"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Check-in Date
              </Label>
              <Input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <Label
                htmlFor="endDate"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Check-out Date
              </Label>
              <Input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                min={startDate || new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={onSearchRooms}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Rooms
                  </>
                )}
              </Button>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Rooms Table */}
      {availableRooms.length > 0 && (
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-none border-b">
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
              <Bed className="mr-2 h-5 w-5" />
              Available Rooms ({availableRooms.length} Rooms Found)
            </CardTitle>
            <CardDescription className="text-gray-600">
              From {startDate} to {endDate}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-100">
                    <TableHead className="text-gray-800 font-semibold">
                      Room Type
                    </TableHead>
                    <TableHead className="text-gray-800 font-semibold">
                      Bed Type
                    </TableHead>
                    <TableHead className="text-gray-800 font-semibold">
                      Price Per Night (USD)
                    </TableHead>
                    <TableHead className="text-gray-800 font-semibold">
                      Room Code
                    </TableHead>
                    <TableHead className="text-gray-800 font-semibold">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableRooms.map((room) => (
                    <TableRow key={room.room_id} className="hover:bg-gray-50">
                      <TableCell className="py-3">
                        <div className="text-sm font-medium text-gray-800">
                          {room.room_type_name}
                        </div>
                        {!isRoomFullyAvailable(room) && (
                          <div className="text-xs text-yellow-600">
                            Limited availability
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-3 text-sm text-gray-600">
                        {room.bed_type}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="text-sm font-semibold text-gray-800">
                          ${room.price_per_night.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-600">per night</div>
                      </TableCell>
                      <TableCell className="py-3 text-sm text-gray-600">
                        {room.room_code}
                      </TableCell>
                      <TableCell className="py-3">
                        <Button
                          onClick={() => onSelectRoom(room)}
                          disabled={!isRoomFullyAvailable(room)}
                          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm"
                        >
                          Book Room
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

      {/* No Results Message */}
      {!loading &&
        availableRooms.length === 0 &&
        startDate &&
        endDate &&
        !error && (
          <Card className="border-gray-200 shadow-sm text-center">
            <CardContent className="p-6">
              <Bed className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <CardTitle className="text-lg font-semibold text-gray-800 mb-2">
                No Rooms Available
              </CardTitle>
              <CardDescription className="text-gray-600">
                No rooms are available for the selected dates. Please try
                different dates.
              </CardDescription>
            </CardContent>
          </Card>
        )}
    </>
  );
};
