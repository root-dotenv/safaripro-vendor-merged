import { InfoIcon } from "lucide-react";
import { type ReactNode } from "react";

interface InputNoteProps {
  message: string | ReactNode; // Allows for both string and JSX content
}

export default function InputNote({ message }: InputNoteProps) {
  return (
    <div className="rounded-md border-[1.125px] shadow border-[#DADCE0] bg-[#FFF] px-4 py-3 text-blue-700">
      <p className="text-sm">
        <InfoIcon
          className="me-3 -mt-0.5 inline-flex opacity-60"
          size={16}
          aria-hidden="true"
        />
        {message}
      </p>
    </div>
  );
}
