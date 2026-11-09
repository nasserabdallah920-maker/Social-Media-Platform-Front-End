import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        {/* أيقونة اللودينج الدوارة */}
        <LoaderCircle className="h-8 w-8 animate-spin text-gray-900" />
        
        {/* كلمة Loading */}
        <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
          Loading
        </span>
      </div>
    </div>
  );
}