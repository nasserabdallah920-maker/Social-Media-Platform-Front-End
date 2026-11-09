"use client";

import { useState } from "react";
import Image from "next/image";
import {
  X,
  Users,
  User,
  ShieldCheck,
  UserMinus,
  LogOut,
  UserPlus,
  Loader2,
  AlertCircle,
  Crown,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/RTK/store";
import { Conversation, GroupMember } from "../interfaces/chatInterfaces";
import { useGroupDetails } from "../hooks/useGroupDetails";
import { useConversations } from "../hooks/useConversations";
import { getMediaUrl } from "@/utils/getMediaUrl";
import { getConversationDisplayName } from "../utils/chatPreviewHelper";
import { setActiveConversation } from "@/lib/RTK/chatSlice";
import AddMembersModal from "./AddMembersModal";

interface GroupDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation;
}

export default function GroupDetailsModal({
  isOpen,
  onClose,
  conversation,
}: GroupDetailsModalProps) {
  const dispatch = useDispatch();
  const currentUserId = useSelector((state: RootState) => state.user.user.user_id);
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: details, isLoading, isError, refetch } = useGroupDetails(
    conversation.id,
    isOpen && conversation.type === "group"
  );

  const { removeMember, isRemovingMember } = useConversations();

  if (!isOpen) return null;

  const members: GroupMember[] = details?.members || [];
  const currentMember = members.find((m) => Number(m.user_id) === Number(currentUserId));
  const isCurrentUserAdmin = currentMember?.role === "admin";
  const groupName = details?.name || getConversationDisplayName(conversation);
  const groupAvatar = details?.avatar || conversation.avatar;

  const handleRemoveMember = (member: GroupMember) => {
    const isSelf = Number(member.user_id) === Number(currentUserId);
    const confirmMsg = isSelf
      ? "Are you sure you want to leave this group?"
      : `Are you sure you want to remove ${member.first_name || member.user_name} from the group?`;

    if (!window.confirm(confirmMsg)) return;

    setActionError(null);
    removeMember(
      {
        conversation_id: conversation.id,
        member_id: member.user_id,
      },
      {
        onSuccess: () => {
          if (isSelf) {
            dispatch(setActiveConversation(null));
            onClose();
          } else {
            refetch();
          }
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to remove member.";
          setActionError(msg);
        },
      }
    );
  };

  return (
    <>
      <AddMembersModal
        isOpen={isAddMembersOpen}
        onClose={() => {
          setIsAddMembersOpen(false);
          refetch();
        }}
        conversationId={conversation.id}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="relative flex flex-col w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-h-[85vh]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Group Info</span>
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center p-5 bg-gradient-to-b from-blue-50/50 to-transparent border-b border-gray-100">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 text-blue-600 font-bold text-xl overflow-hidden shadow-xs mb-3">
              {groupAvatar ? (
                <Image
                  fill
                  unoptimized
                  src={getMediaUrl(groupAvatar)}
                  alt={groupName}
                  className="object-cover"
                />
              ) : (
                <Users className="w-9 h-9 text-blue-500" />
              )}
            </div>
            <h3 className="text-base font-bold text-gray-900 text-center px-4">
              {groupName}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {members.length} {members.length === 1 ? "member" : "members"}
            </p>

            {isCurrentUserAdmin && (
              <button
                type="button"
                onClick={() => setIsAddMembersOpen(true)}
                className="mt-3 flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 rounded-xl shadow-2xs transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Members</span>
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="flex items-center justify-between px-2 mb-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Members
              </span>
              <span className="text-xs text-gray-400">
                {members.length} total
              </span>
            </div>

            {actionError && (
              <div className="flex items-center gap-2 p-2.5 text-xs text-red-600 bg-red-50 rounded-xl border border-red-100">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-xs">Loading members...</span>
              </div>
            ) : isError ? (
              <div className="text-center py-8 text-xs text-red-500">
                Failed to load group details.
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-400">
                No members found.
              </div>
            ) : (
              <div className="space-y-1.5">
                {members.map((member) => {
                  const isSelf = Number(member.user_id) === Number(currentUserId);
                  const isAdmin = member.role === "admin";
                  const canRemove = (isCurrentUserAdmin && !isSelf) || isSelf;

                  const displayName =
                    member.first_name || member.last_name
                      ? `${member.first_name || ""} ${member.last_name || ""}`.trim()
                      : member.user_name;

                  return (
                    <div
                      key={member.user_id}
                      className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-gray-50/80 transition-colors border border-transparent hover:border-gray-100"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium text-xs overflow-hidden">
                          {member.avatar ? (
                            <Image
                              fill
                              unoptimized
                              src={getMediaUrl(member.avatar)}
                              alt={displayName}
                              className="object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-gray-400" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-gray-900 truncate">
                              {displayName}
                            </span>
                            {isSelf && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-gray-100 text-gray-600 rounded font-medium">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-400 truncate block">
                            @{member.user_name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                            <Crown className="w-3 h-3 text-amber-500" />
                            Admin
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
                            Member
                          </span>
                        )}

                        {canRemove && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member)}
                            disabled={isRemovingMember}
                            title={isSelf ? "Leave group" : "Remove member"}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isSelf
                                ? "text-gray-400 hover:text-red-600 hover:bg-red-50"
                                : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                            }`}
                          >
                            {isSelf ? (
                              <LogOut className="w-4 h-4" />
                            ) : (
                              <UserMinus className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50/50 border-t border-gray-100">
            {currentMember && (
              <button
                type="button"
                onClick={() => handleRemoveMember(currentMember)}
                disabled={isRemovingMember}
                className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Leave Group</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="ml-auto px-4 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

