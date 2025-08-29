import { CheckCircle } from "lucide-react";

export const Step6_Finish = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 space-y-6 min-h-[400px]">
      <CheckCircle className="h-24 w-24 text-green-500" strokeWidth={1.5} />
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">
          Setup is Complete!
        </h2>
        <p className="text-lg text-slate-500 max-w-md mx-auto">
          All your initial information has been saved. Click the button below to
          proceed to your new dashboard.
        </p>
      </div>
    </div>
  );
};
