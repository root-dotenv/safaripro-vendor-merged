import React, { useId } from "react";
import { Loader } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { FeatureOption } from "../vendor";

interface StyledCheckboxCardGroupProps {
  title: string;
  items: FeatureOption[] | undefined;
  selectedItems: string[];
  onChange: (id: string) => void;
}

export const StyledCheckboxCardGroup: React.FC<
  StyledCheckboxCardGroupProps
> = ({ title, items, selectedItems, onChange }) => {
  const id = useId();

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
      <h4 className="font-semibold text-slate-700 mb-3">{title}</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item) => {
          const isChecked = selectedItems.includes(item.id);
          return (
            <div key={item.id}>
              <Label
                htmlFor={`${id}-${item.id}`}
                className={`border has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 relative flex flex-col gap-4 rounded-lg p-4 shadow-sm transition-all cursor-pointer ${
                  isChecked ? "border-blue-500 bg-blue-50" : "border-slate-200"
                }`}
              >
                <Checkbox
                  id={`${id}-${item.id}`}
                  checked={isChecked}
                  onCheckedChange={() => onChange(item.id)}
                  className="absolute top-3 right-3"
                />
                <span className="font-medium text-slate-800 pr-4">
                  {item.name || item.language}
                </span>
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
