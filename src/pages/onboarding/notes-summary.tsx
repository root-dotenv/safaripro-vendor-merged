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
    <div className="p-4 flex gap-x-4 items-start bg-gray-50/70 mt-4 shadow rounded-md border border-[#DADCE0]">
      <div>
        <FaRegLightbulb color="#000" size={20} />
      </div>
      <div>
        <h2 className="text-[1rem] font-bold text-gray-900">{title}</h2>
        <div className="text-[0.9375rem] text-gray-700">{children}</div>
      </div>
    </div>
  );
};
