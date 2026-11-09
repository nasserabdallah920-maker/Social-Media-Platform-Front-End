"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import {
  X,
  Camera,
  Users,
  Search,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useConversations } from "../hooks/useConversations";
import { useUserConnections } from "../hooks/useUserConnections";
import { getMediaUrl } from "@/utils/getMediaUrl";
import { FollowingUser } from "@/features/show user following/interfaces/followingInterfaces";
import { useDispatch } from "react-redux";
import { setActiveConversation } from "@/lib/RTK/chatSlice";
import { Conversation } from "../interfaces/chatInterfaces";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateGroupModal({
  isOpen,
  onClose,
}: CreateGroupModalProps) {
  const dispatch = useDispatch();
  const { createGroup, isCreatingGroup } = useConversations();
  const { connections, isLoading: isConnectionsLoading } = useUserConnections();

  const [groupName, setGroupName] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const toggleSelectUser = (userId: number) => {
    setErrorMessage(null);
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredConnections = connections.filter((user) => {
    const query = searchQuery.toLowerCase();
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
    const userName = (user.user_name || "").toLowerCase();
    return fullName.includes(query) || userName.includes(query);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setErrorMessage("Please enter a group name");
      return;
    }
    if (selectedUserIds.length === 0) {
      setErrorMessage("Please select at least one member for the group");
      return;
    }

    setErrorMessage(null);

    createGroup(
      {
        name: groupName.trim(),
        users: selectedUserIds,
        avatar: avatarFile || undefined,
      },
      {
        onSuccess: (data) => {
          const newGroup: Conversation | undefined = data?.data || data?.conversation || data;
          if (newGroup && newGroup.id) {
            dispatch(
              setActiveConversation({
                id: newGroup.id,
                type: "group",
                created_at: newGroup.created_at || new Date().toISOString(),
                avatar: newGroup.avatar || avatarPreview || null,
                user_name: newGroup.user_name || groupName.trim(),
                text: null,
                sent_at: null,
                sender_id: null,
                unreaded: 0,
              })
            );
          }
          setGroupName("");
          setSelectedUserIds([]);
          setAvatarFile(null);
          setAvatarPreview(null);
          onClose();
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to create group. Please try again.";
          setErrorMessage(msg);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-md max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">Create New Group</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {errorMessage && (
              <div className="flex items-center gap-2 p-3 text-xs text-red-600 bg-red-50 rounded-xl border border-red-100">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="relative group">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 hover:border-blue-500 overflow-hidden cursor-pointer transition-colors"
                >
                  {avatarPreview ? (
                    <Image
                      fill
                      unoptimized
                      src={avatarPreview}
                      alt="Group Avatar Preview"
                      className="object-cover"
                    />
                  ) : (
                    <Camera className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
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

              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Group Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => {
                    setGroupName(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="e.g. Study Group, Project Team"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 bg-gray-50/50 focus:bg-white transition-all"
                />
              </div>
            </div>

            {selectedUserIds.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Selected Members ({selectedUserIds.length})
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {selectedUserIds.map((userId) => {
                    const user = connections.find((u) => u.id === userId);
                    if (!user) return null;
                    return (
                      <span
                        key={userId}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full border border-blue-100"
                      >
                        {user.user_name || `${user.first_name} ${user.last_name}`}
                        <button
                          type="button"
                          onClick={() => toggleSelectUser(userId)}
                          className="hover:text-blue-900 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-600">
                  Select Members (Followers & Following) <span className="text-red-500">*</span>
                </label>
              </div>

              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or username..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-gray-300"
                />
              </div>

              <div className="max-h-52 overflow-y-auto divide-y divide-gray-50 border border-gray-100 rounded-2xl">
                {isConnectionsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  </div>
                ) : filteredConnections.length > 0 ? (
                  filteredConnections.map((user: FollowingUser) => {
                    const isSelected = selectedUserIds.includes(user.id);
                    const displayName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.user_name;

                    return (
                      <div
                        key={user.id}
                        onClick={() => toggleSelectUser(user.id)}
                        className={`flex items-center justify-between p-2.5 transition-colors cursor-pointer hover:bg-gray-50 ${
                          isSelected ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gray-900 text-white text-xs font-medium overflow-hidden shrink-0">
                            {user.avatar ? (
                              <Image
                                fill
                                unoptimized
                                src={getMediaUrl(user.avatar)}
                                alt={displayName}
                                className="object-cover"
                              />
                            ) : (
                              displayName[0]?.toUpperCase() || "U"
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">
                              {displayName}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate">
                              @{user.user_name}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`flex items-center justify-center w-5 h-5 rounded-md border transition-colors ${
                            isSelected
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-2" />}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-xs text-gray-400">
                    No users found
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreatingGroup}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingGroup}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              {isCreatingGroup && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Create Group</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

