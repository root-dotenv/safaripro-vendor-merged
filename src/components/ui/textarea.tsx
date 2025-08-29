import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // --- BASE STYLES (Unchanged) ---
        "border-input placeholder:text-muted-foreground dark:bg-input/30 flex field-sizing-content min-h-26 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none",

        // --- NEW: Custom focus styles applied from your Input component ---
        "focus:border-[#0081FB] focus:ring-1 focus:ring-[#0081FB]",

        // --- INVALID STYLES (Unchanged) ---
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",

        className
      )}
      {...props}
    />
  );
}

export { Textarea };
