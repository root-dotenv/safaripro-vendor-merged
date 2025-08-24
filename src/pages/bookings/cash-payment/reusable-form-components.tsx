// src/components/forms/reusable-form-components.tsx
"use client";
import { useController } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { X } from "lucide-react";
import type { Control } from "react-hook-form";

// --- FormField Component ---
interface FormFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  type?: "text" | "number" | "email" | "tel" | "textarea" | "select";
  placeholder?: string;
  options?: { value: string; label: string }[];
  disabled?: boolean;
}

export const FormField = ({
  control,
  name,
  label,
  type = "text",
  placeholder,
  options,
  disabled = false,
}: FormFieldProps) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const commonClasses =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed";

  return (
    <div className="mb-6">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={name}
          {...field}
          placeholder={placeholder}
          rows={4}
          disabled={disabled}
          className={`resize-none ${commonClasses} ${
            error ? "border-red-500" : ""
          }`}
        />
      ) : type === "select" ? (
        <select
          id={name}
          {...field}
          disabled={disabled}
          className={`${commonClasses} ${error ? "border-red-500" : ""}`}
        >
          <option value="" disabled>
            {placeholder || "Select an option"}
          </option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          {...field}
          value={field.value ?? ""} // Ensure value is not undefined
          placeholder={placeholder}
          disabled={disabled}
          className={`${commonClasses} ${error ? "border-red-500" : ""}`}
        />
      )}
      {error && <p className="text-xs text-red-600 mt-1">{error.message}</p>}
    </div>
  );
};

// --- MultiSelectField and LocalBadge Components ---
const LocalBadge = ({ children, onRemove }: any) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      {children}
      <button
        type="button"
        onClick={onRemove}
        className="ml-1 p-0.5 rounded-full hover:bg-blue-200 focus:outline-none"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
};

interface MultiSelectFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
}

export const MultiSelectField = ({
  control,
  name,
  label,
  options,
  placeholder,
  disabled = false,
}: MultiSelectFieldProps) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const handleRemoveItem = (itemValue: string) => {
    const newValue = field.value.filter((v: string) => v !== itemValue);
    field.onChange(newValue);
  };

  const handleAddItem = (itemValue: string) => {
    if (!field.value.includes(itemValue)) {
      field.onChange([...field.value, itemValue]);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <Select
        onValueChange={(value) => {
          if (value) handleAddItem(value);
        }}
        disabled={disabled}
      >
        <SelectTrigger className="h-auto min-h-[42px] items-start justify-start p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
          <div className="flex flex-wrap gap-1.5">
            {field.value?.length > 0 ? (
              field.value.map((itemValue: string) => {
                const item = options.find((opt) => opt.value === itemValue);
                return (
                  <LocalBadge
                    key={itemValue}
                    onRemove={() => handleRemoveItem(itemValue)}
                  >
                    {item?.label || itemValue}
                  </LocalBadge>
                );
              })
            ) : (
              <span className="text-sm text-gray-500 py-0.5 px-1">
                {placeholder}
              </span>
            )}
          </div>
        </SelectTrigger>
        <SelectContent>
          {options
            .filter((opt) => !field.value?.includes(opt.value))
            .map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-red-600 mt-1">{error.message}</p>}
    </div>
  );
};
