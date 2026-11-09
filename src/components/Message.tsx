import { incrementBadge } from "@/lib/RTK/badgeSlice";
import { getMediaUrl } from "@/utils/getMediaUrl";
import { User } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

export interface MessageData {
  avatar: string | null;
  conversation_id: string | null;
  file_name: string | null;
  file_size: number | null;
  file_url: string | null;
  media_type: string | null;
  message_id: number;
  sender_avatar: string | null;
  sender_id: number;
  sender_name: string;
  sent_at: string;
  text: string;
  user_name: string;
  id: number;
}

interface MessageCardProps {
  message: MessageData;
  setMess?: () => void;
  fn?: (message: MessageData) => void;
}

const playSound = () => {
  const audio = new Audio(
    "/sounds/IPHONE NOTIFICATION SOUND EFFECT (PING_DING) - SoundsAreUs.mp3",
  );
  audio.play();
};

export default function MessageCard({
  message,
  fn,
}: MessageCardProps) {
  const avatarSrc = message.sender_avatar;

  const formattedTime = new Date(message.sent_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    playSound();
    dispatch(incrementBadge("Messages"));

    const timer = setTimeout(() => {
      fn?.(message);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-gray-50 cursor-pointer"
      onClick={() => {
        fn?.(message);
      }}
    >
      {/* الـ Avatar */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-sm font-medium text-white">
        {avatarSrc ? (
          <Image
            src={getMediaUrl(avatarSrc)}
            alt={message.sender_name}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <User className="h-5 w-5 text-gray-300" />
        )}
      </div>

      {/* تفاصيل الرسالة */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs text-gray-900">
            {message.sender_name}
          </span>
          <span className="text-[10px] text-gray-400">{formattedTime}</span>
        </div>

        <div className="mt-1 bg-gray-100 px-3 py-2 rounded-lg text-xs leading-snug text-gray-800 wrap-break-word">
          {message.text}
        </div>
      </div>
    </div>
  );
}
