import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaBed, FaUsers } from "react-icons/fa";
import { FiKey, FiMoreVertical } from "react-icons/fi";
import { TbFileTypeCsv } from "react-icons/tb";
import { CSVLink } from "react-csv";
import { FaRegEdit } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TbListDetails } from "react-icons/tb";
import { RiCheckboxCircleLine } from "react-icons/ri";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import EditRoomDialog from "./edit-room-dialog";
import hotelClient from "../../api/hotel-client";
import { cn } from "@/lib/utils";
import { IoArrowBack } from "react-icons/io5";
import { BiPrinter } from "react-icons/bi";

// --- UPDATED TYPE DEFINITIONS ---
interface Amenity {
  id: string;
  name: string;
  // Add other amenity fields if needed for display
}
interface GalleryImage {
  id: string;
  url: string;
}
interface RoomDetails {
  id: string;
  code: string;
  description: string;
  image: string; // Primary image URL
  images: GalleryImage[]; // Array of gallery image objects
  max_occupancy: number;
  price_per_night: number;
  availability_status: string;
  room_type_id: string;
  room_type_name: string;
  amenities: Amenity[]; // Array of full amenity objects
  room_amenities: string[]; // Array of amenity IDs, used for editing
}

export default function RoomDetailsPage() {
  const { room_id } = useParams<{ room_id: string }>();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const {
    data: room,
    isLoading,
    isError,
    error,
  } = useQuery<RoomDetails>({
    queryKey: ["roomDetails", room_id],
    queryFn: async () => (await hotelClient.get(`/rooms/${room_id}`)).data,
    enabled: !!room_id,
  });

  const galleryImages = useMemo(() => {
    if (!room) return [];
    const primaryImage = room.image;
    const additionalImages = room.images?.map((img) => img.url) || [];
    return [...new Set([primaryImage, ...additionalImages])].filter(Boolean);
  }, [room]);

  const prepareCSVData = () => {
    if (!room) return [];
    return [
      {
        "Room Code": room.code,
        "Room Type": room.room_type_name,
        "Price/Night": `$${room.price_per_night.toFixed(2)}`,
        "Max Occupancy": room.max_occupancy,
        Status: room.availability_status,
        Amenities: room.amenities.map((a) => a.name).join(", "),
      },
    ];
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading Room Details...</div>;
  }
  if (isError) {
    return (
      <div className="p-8 text-center text-destructive">
        Error: {(error as Error).message}
      </div>
    );
  }
  if (!room) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Room not found.
      </div>
    );
  }

  const statusColorClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800";
      case "booked":
        return "bg-yellow-100 text-yellow-800";
      case "maintenance":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog>
      <div className="bg-muted/20 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          <header className="flex justify-between items-center">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <IoArrowBack className="mr-1 h-4 w-4" /> Back to List
            </Button>
            <div className="flex items-center gap-2">
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <FaRegEdit className="mr-1 h-4 w-4" /> Edit Room
                </Button>
              </DialogTrigger>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <FiMoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => window.print()}>
                    <BiPrinter className="mr-1 h-4 w-4" /> Print
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CSVLink
                      data={prepareCSVData()}
                      filename={`room_${room.code}_details.csv`}
                      className="flex items-center w-full"
                    >
                      <TbFileTypeCsv className="mr-1 h-4 w-4" /> Export CSV
                    </CSVLink>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <div className="space-y-4 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-3">
                  <TbListDetails /> Room Details
                </h2>
                {galleryImages.length > 0 && (
                  <>
                    <img
                      src={galleryImages[activeImageIndex]}
                      alt={`${room.room_type_name} - view ${
                        activeImageIndex + 1
                      }`}
                      className="rounded-xl object-cover w-full aspect-[4/3] transition-all duration-300 shadow"
                    />
                    <div className="grid grid-cols-4 gap-4">
                      {galleryImages.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                        >
                          <img
                            src={img}
                            alt={`thumbnail ${index + 1}`}
                            className={cn(
                              "rounded-lg object-cover w-full aspect-square transition-all duration-200",
                              activeImageIndex === index
                                ? "ring-2 ring-blue-500 ring-offset-2"
                                : "opacity-60 hover:opacity-100"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <Card className="shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-3xl font-bold text-[#364153]">
                      {room.room_type_name}
                    </CardTitle>
                    <Badge
                      className={cn(
                        "text-sm",
                        statusColorClass(room.availability_status)
                      )}
                    >
                      {room.availability_status}
                    </Badge>
                  </div>
                  <CardDescription className="font-mono text-sm pt-1">
                    Room Code: {room.code}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      About this room
                    </p>
                    <p className="text-gray-700">
                      {room.description || "No description available."}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-[#364153]">Occupancy</p>
                      <p className="font-bold text-lg flex items-center justify-center gap-2 text-[#364153]">
                        <FaUsers /> {room.max_occupancy} Guests
                      </p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-[#364153]">Room Code</p>
                      <p className="font-bold text-lg text-[#364153] flex items-center justify-center gap-2">
                        <FiKey /> {room.code}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg text-[#364153] flex items-center gap-2 mb-3">
                      <FaBed /> Amenities
                    </h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                      {room.amenities.map((amenity) => (
                        <div
                          key={amenity.id}
                          className="flex items-center gap-3"
                        >
                          <RiCheckboxCircleLine className="text-blue-500" />
                          <span className="font-medium text-gray-700">
                            {amenity.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 mt-6 bg-none rounded-b-xl">
                  <div className="w-full text-right">
                    <p className="text-sm font-medium text-muted-foreground">
                      Price per Night
                    </p>
                    <p className="text-4xl font-bold text-[#364153]">
                      ${Number(room.price_per_night).toFixed(2)}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </main>
        </div>
      </div>

      <DialogContent className="max-w-4xl">
        {/* Pass the fully loaded room object to the dialog */}
        {room && <EditRoomDialog room={room} />}
      </DialogContent>
    </Dialog>
  );
}
