import { UserX } from "lucide-react";

export default function BlockedUserFallback() {
  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      {/* Container مطابق لنفس مقاسات الـ Feed */}
      <div className="mx-auto max-w-xl w-full flex flex-col gap-4">
        
        {/* Main Card */}
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          
          {/* Icon with Story-style Gradient Ring (نفس تدرج الحلقات في الكود الخاص بك) */}
          <div className="relative p-0.5 rounded-full bg-linear-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-sm mb-5">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-purple-50 text-purple-600">
              <UserX className="h-8 w-8" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-1.5">
            This profile is currently unavailable
          </h2>

          {/* Description */}
          <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
            You can&apos;t view this user&apos;s profile or interact with their content at the moment.
          </p>

        </div>
        
      </div>
    </div>
  );
}