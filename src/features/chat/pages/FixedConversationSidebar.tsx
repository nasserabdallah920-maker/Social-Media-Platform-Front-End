"use client";

import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  Loader2,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { RootState } from "@/lib/RTK/store";
import { toggleSidebar, setActiveConversation } from "@/lib/RTK/chatSlice";
import { useConversations } from "../hooks/useConversations";
import { Conversation } from "../interfaces/chatInterfaces";
import { handleScroll } from "@/utils/handleScroll";
import { getMediaUrl } from "@/utils/getMediaUrl";
import { formatLastMessagePreview, getConversationDisplayName } from "../utils/chatPreviewHelper";
import ChatWindow from "./ChatWindow";
import { useEffect, useState } from "react";
import socket from "@/socket/socketConfig";
import { useMessages } from "../hooks/useMessages";
import ConfirmationModal from "@/components/ConfirmationModal";
import CreateGroupModal from "./CreateGroupModal";

export default function FixedConversationSidebar() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.chat.isSidebarOpen);
  const activeConversation = useSelector(
    (state: RootState) => state.chat.activeConversation,
  );

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const [typingArr, setTypingArr] = useState<number[]>([]);
  useEffect(() => {
    const onTyping = (data: any) => {
      if (data.is_typing) {
        setTypingArr((prev) =>
          prev.includes(data.conversation_id) ? prev : [...prev, data.conversation_id]
        );
      } else {
        setTypingArr((prev) => prev.filter((e) => e !== data.conversation_id));
      }
    };

    socket.on("typing", onTyping);
    return () => {
      socket.off("typing", onTyping);
    };
  }, []);

  const {
    conversations,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    deleteConversation,
    isDeleting,
  } = useConversations();

  const { handleNewMessage } = useMessages();

  useEffect(() => {
    const onNewMessage = (data: any) => {
      const conversation_id = data.conversation_id;
      const text = data.text;
      const time = data.sent_at
        ? new Date(data.sent_at).toISOString()
        : new Date().toISOString();
      handleNewMessage(conversation_id, text, time, data);
    };

    socket.on("new-message", onNewMessage);
    return () => {
      socket.off("new-message", onNewMessage);
    };
  }, [handleNewMessage]);

  conversations.sort((a, b) => {
    const timeA = a.sent_at ? new Date(a.sent_at).getTime() : 0;
    const timeB = b.sent_at ? new Date(b.sent_at).getTime() : 0;
    return timeB - timeA;
  });
  const [convDeleteId, setConvDeleteId] = useState<number | null>();
  const [openConfimation, setOpenConfimation] = useState<boolean>(false);
  const handleDeleteConversation = (
    e: React.MouseEvent,
    conversationId: number,
  ) => {
    setConvDeleteId(conversationId);
    setOpenConfimation(true);
  };

  return (
    <>
      <ConfirmationModal
        handleConfirm={() => {
          if (convDeleteId) deleteConversation(convDeleteId);
        }}
        isPending={isDeleting}
        isModalOpen={openConfimation}
        title={`Delete conversation`}
        message="Are you sure you want to delete this conversation?"
        setIsModalOpen={setOpenConfimation}
      />

      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />

      {isOpen && (
        <div
          onClick={() => dispatch(toggleSidebar())}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-16 right-0 z-40 flex flex-col h-[calc(100vh-4rem)] w-72 sm:w-80 xl:w-80 border-l border-gray-100 bg-white shadow-xl lg:shadow-sm transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={() => dispatch(toggleSidebar())}
          title={isOpen ? "Hide Messages" : "Show Messages"}
          aria-label={isOpen ? "Hide Messages" : "Show Messages"}
          className="absolute -left-9 top-1/2 -translate-y-1/2 flex h-14 w-9 items-center justify-center rounded-l-2xl border-y border-l border-gray-200 bg-white text-gray-600 shadow-md transition-colors hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
        >
          {isOpen ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <ChevronLeft className="h-4 w-4" />
            </div>
          )}
        </button>
        <div className="flex items-center justify-between border-b border-gray-100 p-4 text-xs font-semibold text-gray-500">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-gray-700" />
            <span>Messages</span>
            {conversations.length > 0 && (
              <span className="text-[11px] text-gray-400">
                ({conversations.length})
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsGroupModalOpen(true)}
              title="New Group"
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 rounded-lg transition-colors cursor-pointer"
            >
              <Users className="h-3.5 w-3.5" />
              <span>New Group</span>
            </button>

            <button
              type="button"
              onClick={() => dispatch(toggleSidebar())}
              className="lg:hidden p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div
          onScroll={(e) =>
            handleScroll(e, hasNextPage, isFetching, fetchNextPage)
          }
          className="flex-1 overflow-y-auto"
        >
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : isError ? (
            <p className="py-6 text-center text-xs text-red-500">
              Error loading messages
            </p>
          ) : conversations.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {conversations.map((conv: Conversation) => {
                const preview = formatLastMessagePreview(conv);
                const displayName = getConversationDisplayName(conv);
                const isGroup = conv.type === "group";

                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      dispatch(setActiveConversation(conv));
                      if (typeof window !== "undefined" && window.innerWidth < 1024) {
                        dispatch(toggleSidebar());
                      }
                    }}
                    className={`group relative flex items-center gap-3 p-3 transition-colors hover:bg-gray-50 cursor-pointer ${
                      activeConversation?.id === conv.id
                        ? "bg-blue-50/70 border-r-2 border-blue-600"
                        : conv.unreaded > 0
                          ? "bg-gray-50/80"
                          : ""
                    }`}
                  >
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-sm font-medium text-white">
                      {conv.avatar ? (
                        <Image
                          alt={displayName}
                          src={getMediaUrl(conv.avatar)}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : isGroup ? (
                        <Users className="h-5 w-5 text-gray-300" />
                      ) : (
                        <User className="h-5 w-5 text-gray-300" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <p className="truncate text-xs font-semibold text-gray-900">
                            {displayName}
                          </p>
                          {isGroup && (
                            <span className="shrink-0 text-[9px] px-1.5 py-0.2 bg-blue-50 text-blue-600 font-medium rounded">
                              Group
                            </span>
                          )}
                        </div>
                        {conv.sent_at && (
                          <span className="text-[10px] text-gray-400">
                            {new Date(conv.sent_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>

                      <p
                        className={`truncate text-xs ${
                          preview.isMedia
                            ? "text-blue-600 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        {typingArr.includes(conv.id) ? (
                          <span className="text-green-500 animate-pulse">
                            typing
                          </span>
                        ) : (
                          preview.label
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {conv.unreaded > 0 && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleDeleteConversation(e, conv.id)}
                        title="Delete conversation"
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {isFetching && (
                <div className="flex justify-center py-2">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              )}
            </div>
          ) : (
            <p className="py-8 text-center text-xs text-gray-400">
              No messages yet
            </p>
          )}
        </div>
      </aside>
      {activeConversation && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white sm:inset-auto sm:bottom-0 sm:right-4 lg:right-[20.5rem] sm:w-[24rem] sm:h-[30rem] sm:rounded-t-2xl sm:shadow-2xl sm:border sm:border-gray-200 overflow-hidden">
          <ChatWindow
            conversation={activeConversation}
            onClose={() => dispatch(setActiveConversation(null))}
          />
        </div>
      )}
    </>
  );
}
