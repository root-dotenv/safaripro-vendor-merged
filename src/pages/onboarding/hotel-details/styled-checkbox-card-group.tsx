// // - - - src/pages/onboarding/hotel-details/styled-checkbox-card-group.tsx
// import React, { useId } from "react";
// import { Loader } from "lucide-react";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import type { FeatureOption } from "../vendor";

// interface StyledCheckboxCardGroupProps {
//   title: string;
//   items: FeatureOption[] | undefined;
//   selectedItems: string[];
//   onChange: (id: string) => void;
// }

// export const StyledCheckboxCardGroup: React.FC<
//   StyledCheckboxCardGroupProps
// > = ({ title, items, selectedItems, onChange }) => {
//   const id = useId();

//   if (!items) {
//     return (
//       <div className="flex items-center gap-2 text-slate-500">
//         <Loader className="h-4 w-4 animate-spin" />
//         <span>Loading {title}...</span>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h4 className="font-semibold text-slate-700 mb-3">{title}</h4>
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
//         {items.map((item) => {
//           const isChecked = selectedItems.includes(item.id);
//           return (
//             <div key={item.id}>
//               <Label
//                 htmlFor={`${id}-${item.id}`}
//                 className={`border has-[:checked]:border-blue-500 has-[:checked]:bg-[#DADCE0] relative flex flex-col gap-4 rounded-[6px] p-4 shadow-sm transition-all cursor-pointer ${
//                   isChecked ? "border-[#DADCE0] bg-none" : "border-slate-200"
//                 }`}
//               >
//                 <Checkbox
//                   id={`${id}-${item.id}`}
//                   checked={isChecked}
//                   onCheckedChange={() => onChange(item.id)}
//                   className="border-[#DADCE0] border-[1.5px] data-[state=checked]:bg-[#0081FB] data-[state=checked]:text-[#FFF]"
//                 />
//                 <span className="font-medium text-slate-800 pr-4">
//                   {item.name || item.language}
//                 </span>
//               </Label>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// src/pages/onboarding/hotel-details/styled-checkbox-card-group.tsx
import React from "react";
import { Loader } from "lucide-react";
import type { FeatureOption } from "../vendor";
import { cn } from "@/lib/utils";

interface StyledCheckboxCardGroupProps {
  title: string;
  items: FeatureOption[] | undefined;
  selectedItems: string[];
  onChange: (id: string) => void;
}

export const StyledCheckboxCardGroup: React.FC<
  StyledCheckboxCardGroupProps
> = ({ title, items, selectedItems, onChange }) => {
  if (!items) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Loader className="h-4 w-4 animate-spin" />
        <span>Loading {title}...</span>
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-semibold text-gray-800 mb-3">{title}</h4>
      {/* --- MODIFIED: Switched from grid to a wrapping flexbox for a "pill" layout --- */}
      <div className="flex flex-wrap gap-3">
        {items.map((item) => {
          const isChecked = selectedItems.includes(item.id);
          return (
            // --- MODIFIED: Replaced Label and Checkbox with a single Button ---
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                "px-4 cursor-pointer py-2 rounded-full font-medium inter transition-colors text-[0.9375rem] border-[1.375px] shadow",
                isChecked
                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                  : "bg-white text-gray-800 border-[#DADCE0] hover:bg-gray-100"
              )}
            >
              {item.name || item.language}
            </button>
          );
        })}
      </div>
    </div>
  );
};
