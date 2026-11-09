"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/RTK/store";
import { followingService } from "@/features/show user following/services/followingServices";
import { FollowingUser } from "@/features/show user following/interfaces/followingInterfaces";

export const useUserConnections = () => {
  const currentUserId = useSelector(
    (state: RootState) => state.user.user.user_id
  );

  const { data: followingData, isLoading: isFollowingLoading } = useQuery({
    queryKey: ["relations", "following", currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      const res = await followingService.getUserFollowing(currentUserId, "following", 1);
      return (res?.data || []) as FollowingUser[];
    },
    enabled: Boolean(currentUserId),
  });

  const { data: followersData, isLoading: isFollowersLoading } = useQuery({
    queryKey: ["relations", "followers", currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      const res = await followingService.getUserFollowing(currentUserId, "followers", 1);
      return (res?.data || []) as FollowingUser[];
    },
    enabled: Boolean(currentUserId),
  });

  const map = new Map<number, FollowingUser>();
  (followingData || []).forEach((u) => {
    if (u && u.id && u.id !== currentUserId) {
      map.set(u.id, u);
    }
  });
  (followersData || []).forEach((u) => {
    if (u && u.id && u.id !== currentUserId) {
      map.set(u.id, u);
    }
  });

  const connections = Array.from(map.values());

  return {
    connections,
    isLoading: isFollowingLoading || isFollowersLoading,
  };
};

