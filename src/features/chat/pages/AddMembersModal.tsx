"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Search, Check, Loader2, UserPlus, AlertCircle } from "lucide-react";
import { useUserConnections } from "../hooks/useUserConnections";
import { useConversations } from "../hooks/useConversations";
import { getMediaUrl } from "@/utils/getMediaUrl";
import { FollowingUser } from "@/features/show user following/interfaces/followingInterfaces";

interface AddMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: number;
}

export default function AddMembersModal({
  isOpen,
  onClose,
  conversationId,
}: AddMembersModalProps) {
  const { connections, isLoading: isConnectionsLoading } = useUserConnections();
  const { addMembers, isAddingMembers } = useConversations();

  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

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

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserIds.length === 0) {
      setErrorMessage("Please select at least one user to add.");
      return;
    }

    setErrorMessage(null);
    addMembers(
      {
        conversation_id: conversationId,
        users: selectedUserIds,
      },
      {
        onSuccess: () => {
          setSelectedUserIds([]);
          onClose();
        },
        onError: (err: any) => {
          const resData = err?.response?.data;
          let msg = resData?.message;

          if (Array.isArray(resData?.error) && resData.error.length > 0) {
            msg = resData.error.map((e: any) => e.message).join(", ");
          }

          setErrorMessage(
            msg || err?.message || "Failed to add members."
          );
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-sm max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">Add Members</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleAdd} className="flex flex-col flex-1 overflow-hidden p-5">
          {errorMessage && (
            <div className="flex items-center gap-2 p-2.5 mb-3 text-xs text-red-600 bg-red-50 rounded-xl border border-red-100">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search followers / following..."
              className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 border border-gray-100 rounded-xl mb-4 max-h-56">
            {isConnectionsLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              </div>
            ) : filteredConnections.length > 0 ? (
              filteredConnections.map((user: FollowingUser) => {
                const isSelected = selectedUserIds.includes(user.id);
                const displayName =
                  `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                  user.user_name;

                return (
                  <div
                    key={user.id}
                    onClick={() => toggleSelectUser(user.id)}
                    className={`flex items-center justify-between p-2.5 transition-colors cursor-pointer hover:bg-gray-50 ${
                      isSelected ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-white text-xs font-semibold overflow-hidden shrink-0">
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
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {displayName}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">
                          @{user.user_name}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center justify-center w-4 h-4 rounded border transition-colors ${
                        isSelected
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-2" />}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-gray-400">
                No users found
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isAddingMembers}
              className="px-3.5 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAddingMembers}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer disabled:opacity-50"
            >
              {isAddingMembers && <Loader2 className="w-3 h-3 animate-spin" />}
              <span>Add Selected ({selectedUserIds.length})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

