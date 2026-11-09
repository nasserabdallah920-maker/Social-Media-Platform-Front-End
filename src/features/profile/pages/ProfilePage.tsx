"use client";
import { Grid } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/RTK/store";
import { UserProfile } from "../interfaces/profileInterfaces";
import UserInfo from "./UserInfo";
import UserPosts from "./UserPosts";

export default function ProfilePage({ user }: { user: UserProfile }) {
  const currentUserId = useSelector(
    (state: RootState) => state.user.user.user_id,
  );
  const isOwner = currentUserId === user.id;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-6">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <UserInfo user={user} isOwner={isOwner} />
        <div className="mt-4 border-t border-gray-200">
          <div className="flex justify-center gap-12 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            <button
              type="button"
              className="flex items-center gap-2 py-4 text-gray-900 border-t-2 border-gray-900 -mt-px"
            >
              <Grid className="h-4 w-4" /> Posts
            </button>
          </div>
          <UserPosts user={user} isOwner={isOwner} />
        </div>
      </div>
    </div>
  );
}
