"use client";
import { useState } from "react";
import Image from "next/image";
import { Send, User, Check, X } from "lucide-react";
import { Reply } from "../interfaces/postInterfaces";
import { useReplies } from "../hooks/useReplies";
import { getMediaUrl } from "@/utils/getMediaUrl";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/RTK/store";

interface ReplySectionProps {
  comment_id: number;
  to_user_id: number;
  initialReplies?: Reply[];
}

export default function ReplySection({
  comment_id,
  to_user_id,
  initialReplies = [],
}: ReplySectionProps) {
  const {
    createReply,
    updateReply,
    deleteReply,
    isCreating,
    isUpdating,
    isDeleting,
  } = useReplies();
  const currentUserId = useSelector(
    (state: RootState) => state.user.user.user_id
  );

  const [replies, setReplies] = useState<Reply[]>(initialReplies);
  const [replyText, setReplyText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [showInput, setShowInput] = useState(true);

  const handleCreate = () => {
    if (!replyText.trim()) return;
    const formData = new FormData();
    formData.append("text", replyText.trim());
    formData.append("to_user_id", String(to_user_id));

    createReply(
      { comment_id, data: formData },
      {
        onSuccess: (res) => {
          const created = res?.data || res;
          if (created) {
            setReplies((prev) => [...prev, created]);
          }
        },
      }
    );
    setReplyText("");
  };

  const handleStartEdit = (reply: Reply) => {
    setEditingId(reply.id);
    setEditText(reply.text);
  };

  const handleUpdate = (reply_id: number) => {
    if (!editText.trim() || isUpdating) return;
    const text = editText.trim();

    updateReply(
      { reply_id, text },
      {
        onSuccess: () => {
          setReplies((prev) =>
            prev.map((r) => (r.id === reply_id ? { ...r, text } : r))
          );
          setEditingId(null);
        },
      }
    );
  };

  const handleDelete = (reply_id: number) => {
    if (isDeleting) return;
    deleteReply(reply_id, {
      onSuccess: () => {
        setReplies((prev) => prev.filter((r) => r.id !== reply_id));
        if (editingId === reply_id) setEditingId(null);
      },
    });
  };

  const isReplyOwner = (reply: Reply) =>
    Number(currentUserId) === Number(reply.user_id ?? reply.from_user_id);

  return (
    <div className="mt-1 ml-5 space-y-1">
      {/* Replies list */}
      {replies.map((reply) => (
        <div key={reply.id} className="group/reply">
          <div className="flex gap-2">
            {/* Avatar — smaller for replies */}
            <div className="relative w-6 h-6 shrink-0 rounded-full overflow-hidden bg-gray-200 mt-0.5">
              {reply.avatar ? (
                <Image
                  fill
                  unoptimized
                  src={getMediaUrl(reply.avatar)}
                  alt={reply.user_name}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <User className="w-3 h-3" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {/* Bubble */}
              <div className="inline-block bg-[#f0f2f5] rounded-2xl px-3 py-1.5 max-w-full">
                <span className="block text-[12px] font-semibold text-gray-900 leading-tight">
                  {reply.user_name}
                </span>

                {/* Edit mode */}
                {editingId === reply.id ? (
                  <div className="flex items-center gap-1 mt-0.5">
                    <input
                      autoFocus
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdate(reply.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="flex-1 px-2 py-0.5 text-[12px] bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition-all"
                    />
                    <button
                      onClick={() => handleUpdate(reply.id)}
                      disabled={isUpdating}
                      className="text-green-500 hover:text-green-600 transition-colors disabled:opacity-50"
                      title="Save"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                      title="Cancel"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <p className="text-[12px] text-gray-800 leading-snug break-words">
                    {reply.text}
                  </p>
                )}

                {/* Reply image */}
                {reply.image_url && (
                  <div className="relative mt-1.5 h-28 w-full overflow-hidden rounded-xl">
                    <Image
                      fill
                      unoptimized
                      src={getMediaUrl(reply.image_url)}
                      alt="Reply attachment"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Action row below bubble */}
              <div className="flex items-center gap-3 ml-3 mt-0.5 text-[11px] font-medium">
                <span className="text-gray-400">
                  {new Date(reply.created_at).toLocaleDateString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {/* Edit / Delete — owner only, on hover */}
                {isReplyOwner(reply) && (
                  <div className="flex items-center gap-2 opacity-0 group-hover/reply:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleStartEdit(reply)}
                      className="text-gray-400 hover:text-blue-500 hover:underline transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(reply.id)}
                      className="text-gray-400 hover:text-red-500 hover:underline transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Reply input — compact, Facebook-style */}
      {showInput && (
        <div className="flex gap-2 mt-1">
          <div className="relative w-6 h-6 shrink-0 rounded-full overflow-hidden bg-gray-200 mt-0.5">
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <User className="w-3 h-3" />
            </div>
          </div>
          <div className="relative flex-1">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
              }}
              placeholder="Write a reply..."
              className="w-full pl-3 pr-9 py-1.5 text-[12px] bg-[#f0f2f5] rounded-full focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 transition-all placeholder:text-gray-400"
            />
            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              title="Send reply"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
