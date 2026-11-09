"use client";
import { handleScroll } from "@/utils/handleScroll";
import { useHeader } from "../hooks/useHeader";
import Image from "next/image";
import RenderNotificationText from "./RenderNotificationText";
import { Loader2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Notification } from "../interfaces/headerInterfaces";

export default function NotificationsDropdown({
  open,
  setOpen,
}: {
  open: string|null;
  setOpen: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const {
    hasNextNotifications,
    handleNotificationClick,
    isFetchingNextNotifications,
    fetchNextNotifications,
    readAllNotificationsMutate,
    userNotifications,
  } = useHeader();
  const router = useRouter();
  const notificationsScrollRef = useRef<HTMLDivElement>(null);
  const onNotificationItemClick = async (notif: Notification) => {
    const route = await handleNotificationClick(notif);
    if (route) {
      setOpen(null);
      router.push(route);
    }
  };
  return (
    <div>
      {open === "Notifications" && (
        <div
          ref={notificationsScrollRef}
          onScroll={(e) =>
            handleScroll(
              e,
              hasNextNotifications,
              isFetchingNextNotifications,
              fetchNextNotifications,
            )
          }
          className="fixed inset-x-2 top-16 sm:absolute sm:inset-x-auto sm:top-full sm:left-1/2 z-50 mt-1 sm:mt-3 flex max-h-[80vh] w-auto sm:w-96 sm:-translate-x-1/2 flex-col gap-3 overflow-y-auto rounded-2xl border border-gray-100 bg-white/95 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-md transition-all duration-200"
        >
          <div className="border-b flex justify-between border-gray-100 pb-2 text-xs font-semibold text-gray-400">
            <span>Notifications</span>
            <button
              onClick={() => readAllNotificationsMutate.mutate()}
              className="cursor-pointer hover:text-gray-500 transition-all"
            >
              Read All
            </button>
          </div>

          {userNotifications && userNotifications.length > 0 ? (
            <>
              {userNotifications.map((notif: Notification) => (
                <div
                  key={notif.id}
                  onClick={() => onNotificationItemClick(notif)}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-gray-50 ${
                    notif.is_read === 0 ? "bg-gray-50/80" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-sm font-medium text-white">
                    {notif.avatar ? (
                      <Image
                        alt={notif.user_name || "User avatar"}
                        src={`${process.env.NEXT_PUBLIC_API_URL}${notif.avatar}`}
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
                      <span className="font-semibold text-gray-900">
                        {notif.user_name}
                      </span>{" "}
                      <RenderNotificationText notif={notif} />
                    </p>
                    <span className="mt-1 block text-[10px] text-gray-400">
                      {new Date(notif.created_at).toLocaleDateString()} -{" "}
                      {new Date(notif.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {notif.is_read === 0 && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                  )}
                </div>
              ))}

              {isFetchingNextNotifications && (
                <div className="flex justify-center py-2">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              )}
            </>
          ) : (
            <p className="py-2 text-center text-xs text-gray-400">
              No notifications yet
            </p>
          )}
        </div>
      )}
    </div>
  );
}
