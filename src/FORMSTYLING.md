This guide provides not just the CSS classes but also the reusable React components you can use to build any new form in your application, guaranteeing a consistent look and feel.

form-stylings.md
Form Styling Guide
Introduction
This document outlines the official design system and implementation guide for all forms within our application. The purpose of this guide is to ensure that every form, from simple inputs to complex multi-select fields, shares a consistent, professional, and user-friendly design.

The styles and components defined here are based on the approved design of the "Hotel Customization" and "Room Creation" pages. By adhering to this guide, we can maintain a predictable user experience and streamline the development process.

1. General Layout & Structure
   All forms should be built on a consistent structural foundation.

Page Background: The page hosting the form should have a light gray background to make the form itself stand out.

Class: bg-gray-50/50

Form Container: The main form content should be enclosed in a container that visually separates it from the rest of the page.

Class: p-6 bg-white border border-gray-200 rounded-lg

Example:

JavaScript

<div className="p-6 bg-white border border-gray-200 rounded-lg">
  {/* Form fields go here */}
</div>
Field Layout: For multiple fields, use a responsive grid to ensure proper alignment and spacing on all screen sizes.

Class: grid grid-cols-1 md:grid-cols-2 gap-x-8

2. Standard Form Fields (FormField)
   To ensure absolute consistency, all standard text inputs, number inputs, textareas, and select dropdowns should be created using the reusable FormField component.

Design Breakdown:
Label: Always positioned above the input.

Styling: block text-sm font-medium text-gray-700 mb-2

Input/Textarea/Select:

Border & Spacing: A standard 1px gray border with comfortable padding. px-3 py-2 border border-gray-300 rounded-md

Focus State: A clear blue ring appears on focus to improve accessibility. focus:outline-none focus:ring-2 focus:ring-blue-500

Error State:

The input border turns red. border-red-500

A small red error message appears directly below the field. text-xs text-red-600 mt-1

Reusable FormField Component:
Copy and use this component for all standard inputs. It is already connected to react-hook-form.

TypeScript

import { useController } from "react-hook-form";

const FormField = ({
control,
name,
label,
type = "text",
placeholder,
options,
}: any) => {
const {
field,
fieldState: { error },
} = useController({ name, control });

const commonClasses =
"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100";

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
className={`resize-none ${commonClasses} ${
            error ? "border-red-500" : ""
          }`}
/>
) : type === "select" ? (
<select
id={name}
{...field}
className={`${commonClasses} ${error ? "border-red-500" : ""}`} >
<option value="" disabled>
{placeholder || "Select an option"}
</option>
{options?.map((option: any) => (
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
placeholder={placeholder}
className={`${commonClasses} ${error ? "border-red-500" : ""}`}
/>
)}
{error && <p className="text-xs text-red-600 mt-1">{error.message}</p>}
</div>
);
}; 3. Multi-Select Fields (MultiSelectField)
For selecting multiple options (like amenities or themes), use the MultiSelectField component.

Design Breakdown:
It presents itself as a standard input field but displays selected items as removable "badges" inside.

Clicking the field opens a dropdown to select new items.

Badge Style: Badges have a light blue background with darker blue text and an 'x' icon to remove.

Reusable MultiSelectField and LocalBadge Components:
Use these two components together for multi-select functionality.

TypeScript

import { useController } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { X } from "lucide-react";

// The Badge component for the MultiSelectField
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

const MultiSelectField = ({
control,
name,
label,
options,
placeholder,
}: any) => {
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
}} >
<SelectTrigger className="h-auto min-h-[42px] items-start justify-start p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
<div className="flex flex-wrap gap-1.5">
{field.value.length > 0 ? (
field.value.map((itemValue: string) => {
const item = options.find((opt: any) => opt.value === itemValue);
return (
<LocalBadge
key={itemValue}
onRemove={() => handleRemoveItem(itemValue)} >
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
.filter((opt: any) => !field.value.includes(opt.value))
.map((option: any) => (
<SelectItem key={option.value} value={option.value}>
{option.label}
</SelectItem>
))}
</SelectContent>
</Select>
{error && <p className="text-xs text-red-600 mt-1">{error.message}</p>}
</div>
);
}; 4. Action Buttons
All primary form submission buttons should be styled consistently and placed predictably.

Placement: Always align to the bottom-right of the form container.

Class: flex justify-end mt-8

Styling:

Colors: Solid blue background with a slightly darker blue on hover.

Class: bg-blue-600 hover:bg-blue-700 text-white

Typography: Use a semi-bold font weight.

Class: font-semibold

Content & States:

The button should always include an icon and text (e.g., "Save Changes," "Create Room").

It must have a loading state that shows a spinner and disables the button to prevent multiple submissions.
