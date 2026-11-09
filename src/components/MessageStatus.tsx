import React from "react";
import { Check, CheckCheck } from "lucide-react";

interface MessageStatusProps {
  status?: string | null;
  className?: string;
}

export default function MessageStatus({ status, className = "" }: MessageStatusProps) {
  const normalized = (status || "").toLowerCase();

  switch (normalized) {
    case "seen":
    case "read":
      // صحين زرق
      return (
        <span title="Seen" className={`inline-flex items-center text-cyan-300 ${className}`}>
          <CheckCheck className="w-3.5 h-3.5 stroke-[2.5]" />
        </span>
      );

    case "delivered":
      // صحين رمادي / أبيض
      return (
        <span title="Delivered" className={`inline-flex items-center text-blue-200/90 ${className}`}>
          <CheckCheck className="w-3.5 h-3.5 stroke-[2.2]" />
        </span>
      );

    case "sent":
    default:
      // صح واحد
      return (
        <span title="Sent" className={`inline-flex items-center text-blue-200/80 ${className}`}>
          <Check className="w-3 h-3 stroke-[2.5]" />
        </span>
      );
  }
}

