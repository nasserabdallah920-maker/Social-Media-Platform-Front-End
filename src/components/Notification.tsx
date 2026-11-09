import Image from "next/image";
import { User } from "lucide-react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { incrementBadge } from "@/lib/RTK/badgeSlice";

export interface Notification {
  id: number;
  post?: {
    id: number;
    text: string;
  };
  type:
    | "like"
    | "follow"
    | "comment"
    | "reply"
    | "follow_request"
    | "follow_accept";
  user?: {
    id: number;
    avatar: string;
    created_at: Date;
    first_name: string;
    last_name: string;
  };
}

interface NotificationCardProps {
  notification: Notification;
  setNot?: () => void;
  fn?: (notification: Notification) => void;
}

const playSound = () => {
  const audio = new Audio("/sounds/IPHONE NOTIFICATION SOUND EFFECT (PING_DING) - SoundsAreUs.mp3");
  audio.play();
};

export default function NotificationCard({ notification, fn }: NotificationCardProps) {
  const fullName = notification.user
    ? `${notification.user.first_name} ${notification.user.last_name}`
    : "User";

  const renderText = () => {
    switch (notification.type) {
      case "follow":
        return "started following you.";
      case "like":
        return (
          <>
            liked your post
            {notification.post?.text && (
              <span className="italic text-gray-600"> &quot;{notification.post.text}&quot;</span>
            )}
          </>
        );
      case "comment":
        return (
          <>
            commented on your post
            {notification.post?.text && (
              <span className="italic text-gray-600"> &quot;{notification.post.text}&quot;</span>
            )}
          </>
        );
      case "reply":
        return "replied to your comment.";
      case "follow_request":
        return "sent you a follow request.";
      case "follow_accept":
        return "accepted your follow request.";
      default:
        return "interacted with you.";
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    playSound();
    if (notification.type === "follow_request") {
      dispatch(incrementBadge("Requests"));
    } else {
      dispatch(incrementBadge("Notifications"));
    }

    const timer = setTimeout(() => {
      fn?.(notification);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-gray-50">
      {/* Avatar */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-sm font-medium text-white">
        {notification.user?.avatar ? (
          <Image
            alt={fullName}
            src={`${process.env.NEXT_PUBLIC_API_URL}${notification.user.avatar}`}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <User className="h-5 w-5 text-gray-300" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-xs leading-snug text-gray-800">
          <span className="font-semibold text-gray-900">{fullName}</span>{" "}
          {renderText()}
        </p>
        {notification.user?.created_at && (
          <span className="mt-1 block text-[10px] text-gray-400">
            {new Date(notification.user.created_at).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
