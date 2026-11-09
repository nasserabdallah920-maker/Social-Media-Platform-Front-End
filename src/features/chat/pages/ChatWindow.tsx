"use client";

import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";
import { RootState } from "@/lib/RTK/store";
import { setActiveConversation } from "@/lib/RTK/chatSlice";
import { useMessages } from "../hooks/useMessages";
import { Conversation, ChatMessage } from "../interfaces/chatInterfaces";
import ShowImages from "@/features/feed/pages/ShowImages";
import { MediaItem } from "@/features/feed/interfaces/postInterfaces";
import socket from "@/socket/socketConfig";
import { setBadge } from "@/lib/RTK/badgeSlice";
import ChatHeader from "./ChatHeader";
import ChatMessageItem from "./ChatMessageItem";
import ChatInputBar from "./ChatInputBar";

interface ChatWindowProps {
  conversation: Conversation;
  onClose?: () => void;
}

export default function ChatWindow({ conversation, onClose }: ChatWindowProps) {
  const dispatch = useDispatch();
  const currentUserId = useSelector(
    (state: RootState) => state.user.user.user_id,
  );
  const messages_count = useSelector(
    (state: RootState) => state.badge.Messages,
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [activeMediaList, setActiveMediaList] = useState<MediaItem[]>([]);
  const [activeMediaId, setActiveMediaId] = useState<number>(0);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const isExistingConversation = Boolean(
    conversation.id && conversation.id > 0 && !conversation.isNew,
  );

  const {
    messages,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    sendMessage,
    isSending,
    editMessage,
    isEditing,
    deleteMessage,
    isDeleting,
  } = useMessages(isExistingConversation ? conversation.id : null);

  useEffect(() => {
    socket.emit("message-seen", {
      conversation_id: conversation.id,
      conversation_type: conversation.type,
    });

    if (conversation.unreaded > 0) {
      dispatch(
        setBadge([
          {
            title: "Messages",
            count: Math.max(0, messages_count - conversation.unreaded),
          },
        ]),
      );
    }
  }, [conversation.id, conversation.type]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [conversation.id]);

  const handleSendMessage = (text: string, file: File | null) => {
    const targetUserId =
      conversation.user_id ??
      (conversation.sender_id === currentUserId
        ? conversation.user_id || 0
        : conversation.sender_id || 0);

    sendMessage(
      {
        conversation_id: isExistingConversation ? conversation.id : null,
        to_user_id: targetUserId,
        conversation_type: conversation.type || "direct",
        text: text || undefined,
        file: file || undefined,
      },
      {
        onSuccess: (res) => {
          const newConvId =
            res?.data?.conversation_id || res?.conversation_id || res?.data?.id;
          if (newConvId && !isExistingConversation) {
            dispatch(
              setActiveConversation({
                ...conversation,
                id: newConvId,
                isNew: false,
              }),
            );
          }
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        },
      },
    );
  };

  const handleEditMessage = (message_id: number, text: string) => {
    editMessage({ message_id, text });
  };

  const handleDeleteMessage = (message_id: number) => {
    deleteMessage({ message_id, conversation_id: conversation.id });
  };

  const openMediaModal = (msg: ChatMessage) => {
    if (!msg.file_url) return;
    setActiveMediaList([
      {
        id: msg.id,
        url: msg.file_url,
        media_type: msg.media_type || undefined,
      },
    ]);
    setActiveMediaId(msg.id);
    setIsMediaModalOpen(true);
  };

  const [userTyping, setUserTyping] = useState<boolean>(false);
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime(),
  );
  useEffect(() => {
    socket.on("typing", (data) => {
      if (data.conversation_id === conversation.id) {
        if (data.is_typing) {
          setUserTyping(true);
        } else {
          setUserTyping(false);
        }
      }
    });
  }, [conversation]);

  return (
    <div className="flex flex-col h-full bg-[#FBFBFB] border-l border-gray-100 relative">
      {isMediaModalOpen && (
        <ShowImages
          images={activeMediaList}
          currentId={activeMediaId}
          onClose={() => setIsMediaModalOpen(false)}
        />
      )}

      <ChatHeader conversation={conversation} onClose={onClose} />

      <div
        ref={scrollContainerRef}
        onScroll={(e) => {
          const target = e.currentTarget;
          if (target.scrollTop === 0 && hasNextPage && !isFetching) {
            const scrollHeightBefore = target.scrollHeight;

            fetchNextPage().then(() => {
              if (scrollContainerRef.current) {
                const scrollHeightAfter =
                  scrollContainerRef.current.scrollHeight;
                scrollContainerRef.current.scrollTop =
                  scrollHeightAfter - scrollHeightBefore;
              }
            });
          }
        }}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {isFetching && (
          <div className="flex justify-center py-2">
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center h-full text-xs text-red-500">
            Failed to load messages
          </div>
        ) : sortedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <p className="text-xs">No messages yet in this conversation</p>
          </div>
        ) : (
          sortedMessages.map((msg: ChatMessage) => (
            <ChatMessageItem
              key={msg.id}
              msg={msg}
              conversation={conversation}
              currentUserId={currentUserId}
              onEdit={handleEditMessage}
              onDelete={handleDeleteMessage}
              isDeleting={isDeleting}
              isEditing={isEditing}
              openMediaModal={openMediaModal}
            />
          ))
        )}
        <div ref={messagesEndRef} />
        {userTyping && (
          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-100 rounded-2xl rounded-bl-xs w-fit shadow-xs">
            <span className="text-[11px] font-medium text-gray-400">
              typing
            </span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
      </div>

      <ChatInputBar
        onSendMessage={handleSendMessage}
        isSending={isSending}
        conversation_id={conversation.id}
      />
    </div>
  );
}
