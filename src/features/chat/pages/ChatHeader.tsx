import { useState } from "react";
import Image from "next/image";
import { User, Users, ArrowLeft, X, Settings2, UserPlus, Info } from "lucide-react";
import { getMediaUrl } from "@/utils/getMediaUrl";
import { Conversation } from "../interfaces/chatInterfaces";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/RTK/store";
import EditConversationModal from "./EditConversationModal";
import AddMembersModal from "./AddMembersModal";
import GroupDetailsModal from "./GroupDetailsModal";
import { getConversationDisplayName } from "../utils/chatPreviewHelper";

interface ChatHeaderProps {
  conversation: Conversation;
  onClose?: () => void;
}

export default function ChatHeader({ conversation, onClose }: ChatHeaderProps) {
  const router = useRouter();
  const currentUserId = useSelector((state: RootState) => state.user.user.user_id);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const displayName = getConversationDisplayName(conversation);
  const isGroup = conversation.type === "group";

  const targetUserId =
    conversation.user_id ||
    (conversation.sender_id && conversation.sender_id !== currentUserId
      ? conversation.sender_id
      : null);

  const handleProfileNavigation = () => {
    if (targetUserId && !isGroup) {
      router.push(`/profile/${targetUserId}`);
    }
  };

  return (
    <>
      <EditConversationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        conversation={conversation}
      />

      <AddMembersModal
        isOpen={isAddMembersOpen}
        onClose={() => setIsAddMembersOpen(false)}
        conversationId={conversation.id}
      />

      <GroupDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        conversation={conversation}
      />

      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 min-w-0">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div
            onClick={handleProfileNavigation}
            className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white font-medium text-sm overflow-hidden ${
              targetUserId && !isGroup
                ? "cursor-pointer hover:opacity-90 transition-opacity"
                : ""
            }`}
          >
            {conversation.avatar ? (
              <Image
                fill
                unoptimized
                className="object-cover"
                src={getMediaUrl(conversation.avatar)}
                alt={displayName}
              />
            ) : isGroup ? (
              <Users className="w-5 h-5 text-gray-300" />
            ) : (
              <User className="w-5 h-5 text-gray-300" />
            )}
          </div>

          <div
            onClick={handleProfileNavigation}
            className={`min-w-0 ${
              targetUserId && !isGroup
                ? "cursor-pointer group"
                : ""
            }`}
          >
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:underline">
                {displayName}
              </h3>
              {isGroup && (
                <span className="text-[10px] px-1.5 py-0.2 bg-blue-50 text-blue-600 font-medium rounded shrink-0">
                  Group
                </span>
              )}
            </div>
            <span className="text-[11px] text-gray-400 capitalize">
              {isGroup ? "Group Conversation" : "Direct Message"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {isGroup && Boolean(conversation.id && conversation.id > 0 && !conversation.isNew) && (
            <>
              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(true)}
                title="Group Details & Members"
                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <Info className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsAddMembersOpen(true)}
                title="Add Members"
                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                title="Edit Group Info"
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            </>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}