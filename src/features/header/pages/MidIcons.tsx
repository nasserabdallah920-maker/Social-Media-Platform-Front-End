"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { items } from "../constants";
import { useHeader } from "../hooks/useHeader";
import NotificationsDropdown from "./NotificationsDropdown";
import RequestsDropdown from "./RequestsDropdown";
import { toggleSidebar } from "@/lib/RTK/chatSlice";
import { toggleOnlineSidebar } from "@/lib/RTK/onlineUsersSlice";
import { RootState } from "@/lib/RTK/store";

export default function MidIcons() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { badge } = useHeader();
  const [open, setOpen] = useState<string | null>(null);

  const currentUserId = useSelector((state: RootState) => state.user.user.user_id);
  const onlineUsers = useSelector((state: RootState) => state.onlineUsers.onlineUsers);
  const onlineCount = onlineUsers.filter((u) => (u.user_id || u.id) !== currentUserId).length;

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = (title: string) => {
    if (title === "Home") {
      router.push("/feed");
      return;
    }
    if (title === "Online") {
      dispatch(toggleOnlineSidebar());
      setOpen(null);
      return;
    }
    if (title === "Messages") {
      dispatch(toggleSidebar());
      setOpen(null);
      return;
    }
    setOpen((prev) => (prev === title ? null : title));
  };

  return (
    <nav
      ref={containerRef}
      className="relative flex items-center gap-1 sm:gap-3"
    >
      {items.map((item, index) => {
        let itemCount = 0;
        if (item.title === "Online") {
          itemCount = onlineCount;
        } else if (item.title in badge) {
          itemCount = badge[item.title as keyof typeof badge];
        }

        return (
          <div
            key={item.title || index}
            onClick={() => handleToggle(item.title)}
            className="group relative flex cursor-pointer items-center gap-1.5 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-gray-500 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
          >
            <div className="relative">
              <item.icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />

              {item.title !== "Home" && itemCount > 0 && (
                <span
                  className={`absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white ring-2 ring-white ${
                    item.title === "Online" ? "bg-emerald-500" : "bg-red-600"
                  }`}
                >
                  {itemCount}
                </span>
              )}
            </div>

            <span className="hidden text-xs font-medium md:inline">
              {item.title}
            </span>
          </div>
        );
      })}

      <RequestsDropdown open={open} />
      <NotificationsDropdown setOpen={setOpen} open={open} />
    </nav>
  );
}
