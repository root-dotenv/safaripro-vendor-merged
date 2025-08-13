// import type { FC, ReactNode } from "react";
// import { Label } from "@/components/ui/label";

// interface InputGroupProps {
//   label: string;
//   error?: string;
//   children: ReactNode;
// }

// export const InputGroup: FC<InputGroupProps> = ({ label, error, children }) => {
//   return (
//     <div className="space-y-1.5">
//       <Label>{label}</Label>
//       {children}
//       {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
//     </div>
//   );
// };

import type { FC, ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface InputGroupProps {
  label: string;
  error?: string;
  children: ReactNode;
}

export const InputGroup: FC<InputGroupProps> = ({ label, error, children }) => {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
