"use client";
import { Grid } from "lucide-react";
import { UserProfile } from "../interfaces/profileInterfaces";
import { useEffect, useState } from "react";
import { ImageItem } from "@/features/feed/interfaces/postInterfaces";
import ShowPosts from "@/features/feed/pages/ShowPosts";
import ShowImages from "@/features/feed/pages/ShowImages";
import CreatePostForm from "@/features/feed/pages/CreatePostForm";
import { profileService } from "../services/profileServices";

export default function UserPosts({
  user,
  isOwner,
}: {
  user: UserProfile;
  isOwner?: boolean;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<number>(0);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const res = await profileService.getUserPosts(user.id);
        setPosts(res.data);
      } catch {
        // Handled silently
      }
    };

    // جلب المنشورات إذا كان الحساب عاماً، أو إذا كنت تتابعه، أو إذا كان حسابك الشخصي
    if (!user.is_private || user.is_following === 1 || isOwner) {
      fetchUserPosts();
    }
  }, [user.id, user.is_private, user.is_following, isOwner]);

  // إظهار رسالة "حساب خاص" إذا كان الحساب خاصاً ولم تقم بمتابعته ولست المالك
  if (user.is_private && user.is_following !== 1 && !isOwner) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm mt-2">
        <h3 className="text-lg font-semibold text-gray-900">This Account is Private</h3>
        <p className="text-sm text-gray-500 mt-1">
          Follow this account to see their photos and videos.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      {isOwner && (
        <div className="mb-4">
          <CreatePostForm />
        </div>
      )}

      {posts.length > 0 ? (
        <>
          {open && (
            <ShowImages
              images={images}
              currentId={currentId}
              onClose={() => setOpen(false)}
            />
          )}

          <ShowPosts
            setCurrentId={setCurrentId}
            setImages={setImages}
            setOpen={setOpen}
            userPosts={posts}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-900 text-gray-900 mb-3">
            <Grid className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No Posts Yet</h3>
          <p className="text-sm text-gray-500 mt-1">
            When {user.user_name} shares photos or videos, they&apos;ll appear
            here.
          </p>
        </div>
      )}
    </div>
  );
}