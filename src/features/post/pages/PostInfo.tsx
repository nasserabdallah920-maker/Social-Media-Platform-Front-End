import {
  Comment,
  ImageItem,
  Post,
} from "@/features/feed/interfaces/postInterfaces";
import PostActions from "@/features/feed/pages/PostActions";
import RenderImageGrid from "@/features/feed/pages/RenderImageGrid";
import { RootState } from "@/lib/RTK/store";
import { getMediaUrl } from "@/utils/getMediaUrl";
import { Edit3, MoreHorizontal, Trash2, User } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { useSelector } from "react-redux";

export default function PostInfo({
  post,
  setIsMenuOpen,
  isMenuOpen,
  currentImages,
  comments,setIsEditModalOpen,setIsDeleteModalOpen,setImages,setCurrentId,setOpen
}: {
  post: Post;
  isMenuOpen: boolean;
  currentImages: ImageItem[];
  comments: Comment[];
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;
  setCurrentId: React.Dispatch<React.SetStateAction<number>>;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const viewedUserId = useSelector(
    (state: RootState) => state.user.user.user_id,
  );
  const isOwner = viewedUserId === post.user_id;

  return (
    <div>
      {" "}
      <main className="mx-auto max-w-xl px-4 py-8">
        <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all duration-200 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative flex w-8 h-8 items-center justify-center rounded-full bg-gray-900 text-white font-medium text-sm overflow-hidden">
                {post.avatar ? (
                  <Image
                    fill
                    unoptimized
                    className="object-cover"
                    src={getMediaUrl(post.avatar)}
                    alt={post.user_name}
                  />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {post.user_name}
                </h3>
                <p className="text-[11px] text-gray-400">
                  {new Date(post.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {isOwner && (
              <div className="relative" ref={menuRef}>
                <button
                  aria-label="More options"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>

                {isMenuOpen && (
                  <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Edit3 className="h-4 w-4 text-blue-500" />
                      <span>Edit Post</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsDeleteModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Post</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3 mb-4">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.text}
            </p>
          </div>

          {/* Images Section */}
          {currentImages && currentImages.length > 0 && (
            <RenderImageGrid
              images={currentImages}
              setOpen={setOpen}
              setCurrentId={setCurrentId}
              setImages={setImages}
            />
          )}

          {/* Footer Actions */}
          <PostActions post={post} inPost={true} comments={comments} />
        </article>
      </main>
    </div>
  );
}
