"use client";

import {

  MoreHorizontal,

  User,
} from "lucide-react";
import Image from "next/image";
import RenderImageGrid from "./RenderImageGrid";
import { usePosts } from "../hooks/usePost";
import { Post, ImageItem } from "../interfaces/postInterfaces";
import Loading from "@/components/LoadingScreen";
import ErrorMessage from "@/components/ErrorMessage";
import PostActions from "./PostActions";
import { getMediaUrl } from "@/utils/getMediaUrl";
import { useRouter, usePathname } from "next/navigation";
import {  useEffect } from "react";
import CreatePostForm from "./CreatePostForm";

interface ShowPostsProps {
  setCurrentId: (id: number) => void;
  setImages: (images: ImageItem[]) => void;
  setOpen: (open: boolean) => void;
  userPosts?: Post[];
}

export default function ShowPosts({
  setCurrentId,
  setImages,
  setOpen,
  userPosts,
}: ShowPostsProps) {
  const {
    posts,
    postHaveError,
    postsPending,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = usePosts();

  const router = useRouter();
  const pathname = usePathname(); // تم استخدام usePathname بدلاً من window.location لتجنب أخطاء الخادم

  useEffect(() => {
    if (userPosts) return; // skip infinite scroll for profile posts

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      if (
        scrollHeight - scrollTop - clientHeight < 200 &&
        hasNextPage &&
        !isFetching
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetching, fetchNextPage, userPosts]);

  const allPosts: Post[] =
    userPosts && userPosts?.length > 0
      ? userPosts
      : (posts?.pages.flatMap((page) => page.posts) ?? []);

  if (postsPending) return <Loading />;
  if (postHaveError)
    return <ErrorMessage message="something error when get posts" />;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-800">
      {/* فحص المسار باستخدام pathname الآمن للعمل على السيرفر والعميل */}
      {!pathname?.startsWith("/profile") && (
        <div className="mx-auto max-w-xl px-4 pt-8">
          <CreatePostForm />
        </div>
      )}
      <main className="mx-auto max-w-xl px-4 py-8">
        <div className="space-y-6">
          {allPosts?.map((post: Post) => (
            <article
              key={post.id}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all duration-200"
            >
              <div
                onClick={() => {
                  router.push(`/post/${post.id}`);
                }}
                className="flex items-center justify-between mb-4 cursor-pointer"
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation(); // منع تفعيل الحدث الأب (الذهاب للمنشور) عند الضغط على البروفايل
                    router.push(`/profile/${post.user_id}`);
                  }}
                  className="flex items-center gap-3"
                >
                  <div className="relative flex w-8 h-8 items-center justify-center rounded-full bg-gray-900 text-white font-medium text-sm overflow-hidden">
                    {getMediaUrl(post.avatar) ? (
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

                <button
                  aria-label="More options"
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3 mb-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {post.text}
                </p>
              </div>

              {post.images && post.images.length > 0 && (
                <RenderImageGrid
                  images={post.images}
                  setCurrentId={setCurrentId}
                  setImages={setImages}
                  setOpen={setOpen}
                />
              )}

              <PostActions post={post} />
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}