// - - - src/pages/onboarding/notes-summary.tsx
import React from "react";
import { FaRegLightbulb } from "react-icons/fa";

interface NotesSummaryProps {
  title: string;
  children: React.ReactNode;
}

export const NotesSummary: React.FC<NotesSummaryProps> = ({
  title,
  children,
}) => {
  return (
    <div className="p-4 flex gap-x-4 items-start bg-[#FFF] mt-4 shadow rounded-md border border-[#DADCE0]">
      <div>
        <FaRegLightbulb color="#186AC9" size={20} />
      </div>
      <div>
        <h2 className="text-[0.9375rem] inter font-semibold text-gray-900">
          {title}
        </h2>
        <div className="text-[0.9375rem] font-semibold text-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
};
