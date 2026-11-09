"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  ChevronRight,
  ChevronLeft,
  Circle,
  MessageSquare,
  Users,
  X,
} from "lucide-react";
import { RootState } from "@/lib/RTK/store";
import { OnlineUser } from "@/socket/interfaces/socketInterfaces";
import { getMediaUrl } from "@/utils/getMediaUrl";
import { openChatWithUser, setActiveConversation } from "@/lib/RTK/chatSlice";
import { closeOnlineSidebar, toggleOnlineSidebar } from "@/lib/RTK/onlineUsersSlice";
import { useConversations } from "@/features/chat/hooks/useConversations";

export default function OnlineFriendsSidebar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.onlineUsers.isOnlineSidebarOpen);

  const currentUserId = useSelector(
    (state: RootState) => state.user.user.user_id
  );
  const onlineUsers = useSelector(
    (state: RootState) => state.onlineUsers.onlineUsers
  );

  const { conversations } = useConversations();

  const filteredOnlineUsers = onlineUsers.filter(
    (u) => (u.user_id || u.id) !== currentUserId
  );

  const handleUserClick = (user: OnlineUser) => {
    const targetUserId = user.user_id || user.id;

    const existingConv = conversations.find(
      (c) =>
        c.user_name === (user.user_name || user.username) ||
        c.sender_id === targetUserId ||
        c.user_id === targetUserId
    );

    if (existingConv) {
      dispatch(setActiveConversation(existingConv));
    } else {
      dispatch(
        openChatWithUser({
          conversation_id: null,
          user_id: targetUserId,
          user_name: user.user_name || user.username || "",
          avatar: user.avatar,
        })
      );
    }
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      dispatch(closeOnlineSidebar());
    }
  };

  if (!currentUserId) return null;

  return (
    <>
      {isOpen && (
        <div
          onClick={() => dispatch(closeOnlineSidebar())}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-16 left-0 z-40 flex flex-col h-[calc(100vh-4rem)] w-72 sm:w-80 border-r border-gray-100 bg-white shadow-xl lg:shadow-sm transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={() => dispatch(toggleOnlineSidebar())}
          title={isOpen ? "Hide Online Friends" : "Show Online Friends"}
          aria-label={isOpen ? "Hide Online Friends" : "Show Online Friends"}
          className="absolute -right-9 top-1/2 -translate-y-1/2 flex h-14 w-9 items-center justify-center rounded-r-2xl border-y border-r border-gray-200 bg-white text-gray-600 shadow-md transition-colors hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
        >
          {isOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <div className="relative">
                <Users className="h-4 w-4 text-emerald-600" />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <ChevronRight className="h-4 w-4" />
            </div>
          )}
        </button>

        <div className="flex items-center justify-between border-b border-gray-100 p-4 text-xs font-semibold text-gray-500">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-gray-900 font-bold">Online Friends</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
              {filteredOnlineUsers.length} online
            </span>
            <button
              type="button"
              onClick={() => dispatch(closeOnlineSidebar())}
              className="lg:hidden p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredOnlineUsers.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {filteredOnlineUsers.map((user: OnlineUser) => {
                const displayName = user.user_name || user.username || "User";

                return (
                  <div
                    key={user.user_id || user.id}
                    onClick={() => handleUserClick(user)}
                    className="flex items-center justify-between p-3 transition-colors hover:bg-gray-50 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-sm font-medium text-white">
                        {user.avatar ? (
                          <Image
                            alt={displayName}
                            src={getMediaUrl(user.avatar)}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-gray-300" />
                        )}
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-500/20" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                          {displayName}
                        </p>
                        <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                          <Circle className="h-1.5 w-1.5 fill-current" />
                          Online
                        </p>
                      </div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 mb-2">
                <Users className="h-6 w-6 stroke-1 text-gray-300" />
              </div>
              <p className="text-xs font-medium text-gray-600">No friends online</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                When your friends are active, they will appear here.
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

