"use client";
import {
  Heart,
  MessageCircle,
  Send,
  User,
  CornerDownRight,
  Check,
  X,
} from "lucide-react";
import { Comment, Post } from "../interfaces/postInterfaces";
import { usePosts } from "../hooks/usePost";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getMediaUrl } from "@/utils/getMediaUrl";
import ReplySection from "./ReplySection";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/RTK/store";

export default function PostActions({
  post,
  inPost,
  comments,
}: {
  post: Post;
  inPost?: boolean;
  comments?: Comment[];
}) {
  const {
    toggleLove,
    createComment,
    updateComment,
    deleteComment,
    isUpdatingComment,
    isDeletingComment,
  } = usePosts();
  const currentUserId = useSelector(
    (state: RootState) => state.user.user.user_id
  );
  const [liked, setLiked] = useState(post.is_liked ? true : false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [commentsShow, setComments] = useState<Comment[]>(comments ?? []);
  const [openReplies, setOpenReplies] = useState<Record<number, boolean>>({});
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

  useEffect(() => {
    if (comments) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setComments(comments);
    }
  }, [comments]);

  const handleSendComment = () => {
    if (!comment.trim()) return;
    const formData = new FormData();
    formData.append("text", comment.trim());

    createComment(
      { post_id: post.id, data: formData },
      {
        onSuccess: (res) => {
          const created = res?.data?.data || res?.data;
          if (created) {
            setComments((prev) => [created, ...prev]);
          }
        },
      }
    );
    setCommentsCount((prev) => prev + 1);
    setComment("");
  };

  const handleStartEditComment = (item: Comment) => {
    setEditingCommentId(item.id);
    setEditCommentText(item.text);
  };

  const handleUpdateComment = (comment_id: number) => {
    if (!editCommentText.trim() || isUpdatingComment) return;
    const text = editCommentText.trim();
    updateComment(
      { comment_id, text },
      {
        onSuccess: () => {
          setComments((prev) =>
            prev.map((c) => (c.id === comment_id ? { ...c, text } : c))
          );
          setEditingCommentId(null);
        },
      }
    );
  };

  const handleDeleteComment = (comment_id: number) => {
    if (isDeletingComment) return;
    deleteComment(comment_id, {
      onSuccess: () => {
        setComments((prev) => prev.filter((c) => c.id !== comment_id));
        setCommentsCount((prev) => Math.max(0, prev - 1));
        if (editingCommentId === comment_id) setEditingCommentId(null);
      },
    });
  };

  const isCommentOwner = (userId: number) =>
    Number(currentUserId) === Number(userId);


  return (
    <>
      <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-gray-500">
        <button
          onClick={() => {
            toggleLove(post.id);
            setLiked(!liked);
            if (liked) {
              setLikesCount(likesCount - 1);
            } else {
              setLikesCount(likesCount + 1);
            }
          }}
          className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-gray-900 group"
        >
          <div className="p-2 rounded-xl transition-colors group-hover:bg-gray-50">
            <Heart
              className={`${liked ? "text-red-600 fill-red-600" : ""} h-4 w-4`}
            />
          </div>
          <span>{likesCount}</span>
        </button>

        <button
          onClick={() => {
            setOpen(!open);
          }}
          className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-gray-900 group"
        >
          <div className="p-2 rounded-xl transition-colors group-hover:bg-gray-50">
            <MessageCircle className="h-4 w-4" />
          </div>
          <span>{commentsCount}</span>
        </button>
      </div>
      {(open || inPost) && (
        <div className="mt-3 relative flex items-center">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendComment();
            }}
            placeholder="Write a comment..."
            className="w-full pl-4 pr-12 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
          />
          <button
            onClick={handleSendComment}
            className="absolute right-3 flex items-center justify-center p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="mt-4 space-y-1">
        {inPost &&
          commentsShow?.map((item: Comment) => (
            <div key={item.id} className="group/comment">
              {/* Main comment row */}
              <div className="flex gap-2">
                {/* Avatar */}
                <div className="relative w-8 h-8 shrink-0 rounded-full overflow-hidden bg-gray-200 mt-0.5">
                  {item.avatar ? (
                    <Image
                      fill
                      unoptimized
                      src={getMediaUrl(item.avatar)}
                      alt={item.user_name}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full text-gray-600 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Bubble */}
                  <div className="inline-block bg-[#f0f2f5] rounded-2xl px-3 py-2 max-w-full">
                    <span className="block text-[13px] font-semibold text-gray-900 leading-tight">
                      {item.user_name}
                    </span>

                    {/* Text or edit input */}
                    {editingCommentId === item.id ? (
                      <div className="flex items-center gap-1 mt-1">
                        <input
                          autoFocus
                          type="text"
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleUpdateComment(item.id);
                            if (e.key === "Escape") setEditingCommentId(null);
                          }}
                          className="flex-1 px-2 py-0.5 text-[13px] bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition-all"
                        />
                        <button
                          onClick={() => handleUpdateComment(item.id)}
                          disabled={isUpdatingComment}
                          className="text-green-500 hover:text-green-600 transition-colors disabled:opacity-50"
                          title="Save"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-[13px] text-gray-800 leading-snug wrap-break-word">
                        {item.text}
                      </p>
                    )}

                    {/* Comment Image */}
                    {item.image_url && (
                      <div className="relative mt-2 h-40 w-full overflow-hidden rounded-xl">
                        <Image
                          fill
                          unoptimized
                          src={getMediaUrl(item.image_url)}
                          alt="Comment attachment"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Action row below bubble — Facebook style */}
                  <div className="flex items-center gap-3 ml-3 mt-0.5 text-[11px] font-medium">
                    <span className="text-gray-400">
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <button
                      onClick={() =>
                        setOpenReplies((prev) => ({
                          ...prev,
                          [item.id]: !prev[item.id],
                        }))
                      }
                      className="text-gray-500 hover:text-gray-800 hover:underline transition-colors"
                    >
                      Reply
                    </button>
                    {/* Edit / Delete — owner only, on hover */}
                    {isCommentOwner(item.user_id) && (
                      <div className="flex items-center gap-2 opacity-0 group-hover/comment:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleStartEditComment(item)}
                          className="text-gray-400 hover:text-blue-500 hover:underline transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(item.id)}
                          className="text-gray-400 hover:text-red-500 hover:underline transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* View replies toggle */}
                  {item.replies_count !== undefined && item.replies_count > 0 && !openReplies[item.id] && (
                    <button
                      onClick={() =>
                        setOpenReplies((prev) => ({ ...prev, [item.id]: true }))
                      }
                      className="flex items-center gap-1 ml-3 mt-1 text-[12px] font-semibold text-gray-500 hover:text-gray-800 hover:underline transition-colors"
                    >
                      <CornerDownRight className="w-3 h-3" />
                      View {item.replies_count} {item.replies_count === 1 ? "reply" : "replies"}
                    </button>
                  )}

                  {/* Replies section — nested like Facebook */}
                  {openReplies[item.id] && (
                    <ReplySection comment_id={item.id} to_user_id={item.user_id} initialReplies={item.replies} />
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
