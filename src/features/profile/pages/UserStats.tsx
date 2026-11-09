"use client";
import { useRouter } from "next/navigation";
import { UserProfile } from "../interfaces/profileInterfaces";

interface UserStatsProps {
  user: UserProfile;
  isOwner: boolean;
}

export default function UserStats({ user, isOwner }: UserStatsProps) {
  const router = useRouter();

  const handleNavigateToList = (type: "followers" | "following") => {
    if (isOwner || !user.is_private || user.is_following === 1) {
      router.push(`${window.location.pathname}/${type}`);
    }
  };

  return (
    <div className="flex justify-center sm:justify-start items-center gap-8 text-sm text-gray-800 mb-4">
      <div>
        <span className="font-semibold text-gray-900">{user.posts_count}</span> posts
      </div>

      <div
        className="cursor-pointer hover:opacity-75"
        onClick={() => handleNavigateToList("followers")}
      >
        <span className="font-semibold text-gray-900">{user.followers_count}</span> followers
      </div>

      <div
        className="cursor-pointer hover:opacity-75"
        onClick={() => handleNavigateToList("following")}
      >
        <span className="font-semibold text-gray-900">{user.following_count}</span> following
      </div>
    </div>
  );
}
