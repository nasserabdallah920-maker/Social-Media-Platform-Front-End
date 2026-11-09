"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Maximize2,
  MoreVertical,
  Pencil,
  Trash2,
  Check,
  X,
  User,
} from "lucide-react";
import { getMediaUrl } from "@/utils/getMediaUrl";
import { getMediaType } from "@/utils/mediaHelper";
import { ChatMessage, Conversation } from "../interfaces/chatInterfaces";
import MessageStatus from "../../../components/MessageStatus";
import { getUserColor } from "../utils/userColorHelper";

interface ChatMessageItemProps {
  msg: ChatMessage;
  conversation?: Conversation;
  currentUserId: number | null;
  onEdit: (message_id: number, newText: string) => void;
  onDelete: (message_id: number) => void;
  isDeleting: boolean;
  isEditing: boolean;
  openMediaModal: (msg: ChatMessage) => void;
}

export default function ChatMessageItem({
  msg,
  conversation,
  currentUserId,
  onEdit,
  onDelete,
  isDeleting,
  isEditing: isApiEditing,
  openMediaModal,
}: ChatMessageItemProps) {
  const isMe = msg.sender_id === currentUserId;
  const isGroup = conversation?.type === "group";

  const senderDisplayName =
    msg.sender_name ||
    msg.user_name ||
    (isMe
      ? "You"
      : conversation?.user_name || `User #${msg.sender_id}`);

  const userColor = getUserColor(msg.sender_id);

  const [isEditingThis, setIsEditingThis] = useState(false);
  const [editingText, setEditingText] = useState(msg.text || "");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mediaType = getMediaType({
    media_type: msg.media_type || undefined,
    url: msg.file_url || undefined,
    file_name: msg.file_name || undefined,
  });

  const handleSave = () => {
    if (!editingText.trim()) return;
    onEdit(msg.id, editingText.trim());
    setIsEditingThis(false);
  };

  return (
    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} group/msg`}>
      <div className={`relative flex items-end gap-2 max-w-[85%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
        {!isMe && isGroup && (
          <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-800 text-white text-[11px] font-semibold overflow-hidden shadow-xs mb-0.5">
            {msg.sender_avatar ? (
              <Image
                src={getMediaUrl(msg.sender_avatar)}
                alt={senderDisplayName}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <User className="w-3.5 h-3.5 text-gray-300" />
            )}
          </div>
        )}

        {isMe && !isEditingThis && (
          <div className="relative opacity-0 group-hover/msg:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 cursor-pointer"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 bottom-full mb-1 w-28 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-30 text-xs">
                {msg.text && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingThis(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-50 text-left cursor-pointer"
                  >
                    <Pencil className="w-3 h-3 text-blue-500" />
                    <span>Edit</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onDelete(msg.id)}
                  disabled={isDeleting}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 text-left cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        )}

        <div
          className={`rounded-2xl px-3.5 py-2.5 shadow-xs transition-all ${
            isMe
              ? "bg-blue-600 text-white rounded-br-xs"
              : isGroup
                ? `${userColor.bg} ${userColor.border} text-gray-900 border rounded-bl-xs`
                : "bg-white text-gray-900 border border-gray-100 rounded-bl-xs"
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className={`text-[11px] font-semibold tracking-wide ${
                isMe
                  ? "text-blue-100"
                  : userColor.text
              }`}
            >
              {senderDisplayName}
            </span>
          </div>

          {msg.file_url && (
            <div className="mb-2 overflow-hidden rounded-xl">
              {mediaType === "image" && (
                <div onClick={() => openMediaModal(msg)} className="relative w-56 h-40 group cursor-pointer overflow-hidden rounded-lg">
                  <Image src={getMediaUrl(msg.file_url)} alt="Attachment" fill unoptimized className="object-cover transition-transform group-hover:scale-105 duration-200" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              )}
            </div>
          )}

          {isEditingThis ? (
            <div className="flex flex-col gap-2 min-w-50">
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="w-full bg-white text-gray-900 px-2.5 py-1.5 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-300"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") setIsEditingThis(false);
                }}
              />
              <div className="flex items-center justify-end gap-1.5">
                <button type="button" onClick={() => setIsEditingThis(false)} className="p-1 rounded text-white/80 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={handleSave} disabled={isApiEditing} className="p-1 rounded bg-white text-blue-600 hover:bg-blue-50">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          ) : (
            msg.text && <p className="text-xs leading-relaxed whitespace-pre-wrap wrap-break-word">{msg.text}</p>
          )}

          <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${isMe ? "text-blue-100" : "text-gray-400"}`}>
            <span>{new Date(msg.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            {isMe && <MessageStatus status={msg.status} />}
          </div>
        </div>
      </div>
        
    </div>
  );
}