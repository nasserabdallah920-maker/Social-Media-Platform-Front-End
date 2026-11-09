import { AlertCircle } from "lucide-react";

export default function ErrorMessage({ message = "Something went wrong" }) {
  return (
    <div className="flex w-full items-center gap-3 rounded-2xl border border-red-100 bg-red-50/50 p-4 text-red-600">
      <AlertCircle className="h-5 w-5 shrink-0" />
      <span className="text-xs font-medium tracking-wide">
        {message}
      </span>
    </div>
  );
}