// CurrentDetailsSection.tsx
import React from "react";
import { BarChart3 } from "lucide-react";
import type { Hotel } from "./hotel";
import { AccordionItem } from "./shared";

// --- HELPER COMPONENTS FROM BOTH VERSIONS ---

// For displaying key stats prominently
const InfoDisplay: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="bg-gray-50 p-3 rounded-lg border text-center">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-xl font-bold text-gray-800">{value ?? "N/A"}</p>
  </div>
);

// For grouping related details into cards
const DetailCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-gray-50 p-4 rounded-lg border">
    <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
    <div className="space-y-2 text-sm">{children}</div>
  </div>
);

// For creating a row within a DetailCard
const DetailRow: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium text-right text-gray-800">{children}</span>
  </div>
);

// --- MAIN COMPONENT ---

interface CurrentDetailsProps {
  isOpen: boolean;
  onToggle: () => void;
  hotelData: Hotel;
}

const CurrentDetailsSection: React.FC<CurrentDetailsProps> = ({
  isOpen,
  onToggle,
  hotelData,
}) => {
  // Use the more detailed toLocaleString() for the timestamp
  const lastUpdated = hotelData.updated_at
    ? new Date(hotelData.updated_at).toLocaleString()
    : "N/A";

  return (
    <AccordionItem
      title="Current Details & Stats (Read-Only)"
      icon={BarChart3}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {/* Section 1: Key Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoDisplay
          label="Occupancy Rate"
          value={`${hotelData.availability_stats?.occupancy_rate || 0}%`}
        />
        <InfoDisplay
          label="Available Rooms"
          value={hotelData.availability_stats?.status_counts?.Available || 0}
        />
        <InfoDisplay
          label="Average Rating"
          value={parseFloat(hotelData.average_rating).toFixed(1)}
        />
        <InfoDisplay label="Review Count" value={hotelData.review_count} />
      </div>

      {/* Separator */}
      <div className="mt-6 pt-6 border-t">
        {/* Section 2: Detailed Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DetailCard title="Basic Information">
            <DetailRow label="Name">{hotelData.name}</DetailRow>
            <DetailRow label="Code">{hotelData.code}</DetailRow>
            <DetailRow label="Star Rating">{hotelData.star_rating}/5</DetailRow>
            <DetailRow label="Year Built">
              {hotelData.year_built || "N/A"}
            </DetailRow>
          </DetailCard>

          <DetailCard title="Location">
            <DetailRow label="Address">{hotelData.address}</DetailRow>
            <DetailRow label="Zip Code">{hotelData.zip_code}</DetailRow>
            <DetailRow label="Coordinates">{`${hotelData.latitude}, ${hotelData.longitude}`}</DetailRow>
          </DetailCard>

          <DetailCard title="System Information">
            <DetailRow label="Created">
              {new Date(hotelData.created_at).toLocaleDateString()}
            </DetailRow>
            <DetailRow label="Status">
              <span
                className={
                  hotelData.is_active
                    ? "font-bold text-green-600"
                    : "font-bold text-red-600"
                }
              >
                {hotelData.is_active ? "Active" : "Inactive"}
              </span>
            </DetailRow>
            <DetailRow label="Eco Certified">
              <span
                className={
                  hotelData.is_eco_certified
                    ? "text-green-600"
                    : "text-gray-500"
                }
              >
                {hotelData.is_eco_certified ? "Yes" : "No"}
              </span>
            </DetailRow>
          </DetailCard>
        </div>
      </div>

      {/* Footer with last updated time */}
      <div className="mt-6 text-center">
        <p className="text-[0.9375rem] text-gray-500">
          Last Synced: {lastUpdated}
        </p>
      </div>
    </AccordionItem>
  );
};

export default CurrentDetailsSection;
