"use client";
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Loader2, BedDouble, Ruler, DollarSign, Info } from "lucide-react";
import { LuSquareChevronDown, LuSquareChevronRight } from "react-icons/lu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PaginatedRoomTypes } from "./types";

// --- TYPE DEFINITIONS ---
interface FilterState {
  priceSort: "none" | "low-to-high" | "high-to-low";
  availabilitySort: "none" | "low-to-high" | "high-to-low";
  capacitySort: "none" | "low-to-high" | "high-to-low";
  availabilityFilter: "all" | "available" | "full";
}

// --- API CLIENT ---
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_HOTEL_BASE_URL,
});

/*
 * Displays all room types from the SafariPro system in a filterable and
 * sortable table with expandable rows to show detailed information.
 */
export default function SafariProRoomTypes() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    priceSort: "none",
    availabilitySort: "none",
    capacitySort: "none",
    availabilityFilter: "all",
  });

  const { data: paginatedData, isLoading: isListLoading } =
    useQuery<PaginatedRoomTypes>({
      queryKey: ["allRoomTypesList"],
      queryFn: async () => (await apiClient.get("room-types/")).data,
    });

  const allRoomTypes = paginatedData?.results;

  const filteredRooms = useMemo(() => {
    if (!allRoomTypes) return [];
    let filtered = [...allRoomTypes];

    if (searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (room) =>
          room.name.toLowerCase().includes(lowerCaseQuery) ||
          room.description.toLowerCase().includes(lowerCaseQuery) ||
          room.bed_type.toLowerCase().includes(lowerCaseQuery)
      );
    }

    if (filters.availabilityFilter !== "all") {
      filtered = filtered.filter((room) => {
        const isAvailable = room.is_active && room.room_availability > 0;
        if (filters.availabilityFilter === "available") return isAvailable;
        if (filters.availabilityFilter === "full") return !isAvailable;
        return true;
      });
    }

    // Sorting logic
    if (filters.priceSort !== "none") {
      filtered.sort((a, b) => {
        const priceA = parseFloat(a.base_price);
        const priceB = parseFloat(b.base_price);
        return filters.priceSort === "low-to-high"
          ? priceA - priceB
          : priceB - priceA;
      });
    } else if (filters.availabilitySort !== "none") {
      filtered.sort((a, b) => {
        return filters.availabilitySort === "low-to-high"
          ? a.room_availability - b.room_availability
          : b.room_availability - a.room_availability;
      });
    } else if (filters.capacitySort !== "none") {
      filtered.sort((a, b) => {
        return filters.capacitySort === "low-to-high"
          ? a.max_occupancy - b.max_occupancy
          : b.max_occupancy - a.max_occupancy;
      });
    }
    return filtered;
  }, [allRoomTypes, searchQuery, filters]);

  const toggleRow = (id: string) => {
    const newRows = new Set(expandedRows);
    if (newRows.has(id)) {
      newRows.delete(id);
    } else {
      newRows.add(id);
    }
    setExpandedRows(newRows);
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Filter & Search All Room Types</CardTitle>
          <CardDescription>
            Use the controls below to sort and filter the list of all available
            room types in the system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Filter by name, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery("")}
              >
                <FaTimes />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              onValueChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  priceSort: v as any,
                  availabilitySort: "none",
                  capacitySort: "none",
                }))
              }
              value={filters.priceSort}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sort by Price</SelectItem>
                <SelectItem value="low-to-high">Low to High</SelectItem>
                <SelectItem value="high-to-low">High to Low</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  availabilitySort: v as any,
                  priceSort: "none",
                  capacitySort: "none",
                }))
              }
              value={filters.availabilitySort}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sort by Availability</SelectItem>
                <SelectItem value="low-to-high">Low to High</SelectItem>
                <SelectItem value="high-to-low">High to Low</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  capacitySort: v as any,
                  priceSort: "none",
                  availabilitySort: "none",
                }))
              }
              value={filters.capacitySort}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by Capacity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sort by Capacity</SelectItem>
                <SelectItem value="low-to-high">Low to High</SelectItem>
                <SelectItem value="high-to-low">High to Low</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(v) =>
                setFilters((f) => ({ ...f, availabilityFilter: v as any }))
              }
              value={filters.availabilityFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available Only</SelectItem>
                <SelectItem value="full">Full Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Room Types</CardTitle>
          <CardDescription>
            A total of {filteredRooms?.length || 0} room types found matching
            your criteria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted">
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Room Type</TableHead>
                  <TableHead className="text-center">Max Guests</TableHead>
                  <TableHead className="text-center">Available</TableHead>
                  <TableHead className="text-right">Price/Night</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isListLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    </TableCell>
                  </TableRow>
                ) : filteredRooms?.length ? (
                  filteredRooms.map((room) => (
                    <React.Fragment key={room.id}>
                      <TableRow
                        className="cursor-pointer"
                        onClick={() => toggleRow(room.id)}
                      >
                        <TableCell>
                          {expandedRows.has(room.id) ? (
                            <LuSquareChevronDown size={18} color="#525252" />
                          ) : (
                            <LuSquareChevronRight size={18} color="#525252" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {room.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {room.max_occupancy}
                        </TableCell>
                        <TableCell
                          className={`text-center font-semibold ${
                            room.room_availability > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {room.room_availability}
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          ${parseFloat(room.base_price).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      {expandedRows.has(room.id) && (
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableCell colSpan={5} className="p-0">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4">
                              <div className="md:col-span-4">
                                <img
                                  src={
                                    room.image || "https://placehold.co/600x400"
                                  }
                                  alt={room.name}
                                  className="rounded-md object-cover aspect-video w-full"
                                />
                              </div>
                              <div className="md:col-span-4 space-y-3">
                                <h4 className="font-semibold">Details</h4>
                                <div className="flex items-start text-sm">
                                  <Info className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                                  <p className="text-muted-foreground">
                                    {room.description}
                                  </p>
                                </div>
                                <div className="flex items-center text-sm">
                                  <BedDouble className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="font-medium w-24">
                                    Bed Type:
                                  </span>
                                  <span className="text-muted-foreground">
                                    {room.bed_type}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <Ruler className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="font-medium w-24">
                                    Size:
                                  </span>
                                  <span className="text-muted-foreground">
                                    {room.size_sqm
                                      ? `${room.size_sqm} sqm`
                                      : "N/A"}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="font-medium w-24">
                                    Base Price:
                                  </span>
                                  <span className="text-muted-foreground">
                                    ${parseFloat(room.base_price).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                              <div className="md:col-span-4 space-y-3">
                                <h4 className="font-semibold">
                                  Features & Amenities
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {(room.features_list?.length ?? 0) > 0 &&
                                    room.features_list?.map((f) => (
                                      <Badge key={f.id} variant="secondary">
                                        {f.name}
                                      </Badge>
                                    ))}
                                  {(room.amenities_details?.length ?? 0) > 0 &&
                                    room.amenities_details?.map((a) => (
                                      <Badge key={a.id} variant="secondary">
                                        {a.name}
                                      </Badge>
                                    ))}
                                  {!room.features_list?.length &&
                                    !room.amenities_details?.length && (
                                      <span className="text-sm text-muted-foreground">
                                        None listed.
                                      </span>
                                    )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No room types match your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
