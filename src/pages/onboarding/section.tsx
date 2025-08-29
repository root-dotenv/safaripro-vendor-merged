import React from "react";

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, icon, children }) => (
  <div className="bg-white p-6 border border-slate-200 rounded-xl">
    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
      <span className="flex items-center justify-center bg-blue-100 rounded-full w-10 h-10">
        {icon}
      </span>
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
);
