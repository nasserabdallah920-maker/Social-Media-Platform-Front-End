"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { X, Camera, Loader2, AlertCircle, Users, User } from "lucide-react";
import { useConversations } from "../hooks/useConversations";
import { getMediaUrl } from "@/utils/getMediaUrl";
import { Conversation } from "../interfaces/chatInterfaces";
import { useDispatch } from "react-redux";
import { setActiveConversation } from "@/lib/RTK/chatSlice";
import { getConversationDisplayName } from "../utils/chatPreviewHelper";

interface EditConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation;
}

export default function EditConversationModal({
  isOpen,
  onClose,
  conversation,
}: EditConversationModalProps) {
  const dispatch = useDispatch();
  const { updateConversation, isUpdatingConversation } = useConversations();

  const initialName = getConversationDisplayName(conversation);
  const [name, setName] = useState(initialName);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    conversation.avatar ? getMediaUrl(conversation.avatar) : null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(getConversationDisplayName(conversation));
      setAvatarFile(null);
      setAvatarPreview(conversation.avatar ? getMediaUrl(conversation.avatar) : null);
      setErrorMessage(null);
    }
  }, [isOpen, conversation]);

  if (!isOpen) return null;

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Please enter a name");
      return;
    }

    setErrorMessage(null);

    updateConversation(
      {
        conversation_id: conversation.id,
        name: name.trim(),
        avatar: avatarFile || undefined,
      },
      {
        onSuccess: (res) => {
          const updated = res?.data || res?.conversation || {};
          dispatch(
            setActiveConversation({
              ...conversation,
              name: name.trim(),
              user_name: name.trim(),
              avatar: updated?.avatar || (avatarFile ? avatarPreview : conversation.avatar),
            })
          );
          onClose();
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to update conversation. Please try again.";
          setErrorMessage(msg);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {conversation.type === "group" ? "Edit Group" : "Edit Conversation"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 text-xs text-red-600 bg-red-50 rounded-xl border border-red-100">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative group">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 hover:border-blue-500 overflow-hidden cursor-pointer transition-colors"
              >
                {avatarPreview ? (
                  <Image
                    fill
                    unoptimized
                    src={avatarPreview}
                    alt="Conversation Avatar"
                    className="object-cover"
                  />
                ) : conversation.type === "group" ? (
                  <Users className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                ) : (
                  <User className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <span className="text-[11px] text-gray-400">Click to change picture</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="Name..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 bg-gray-50/50 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdatingConversation}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdatingConversation}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              {isUpdatingConversation && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

