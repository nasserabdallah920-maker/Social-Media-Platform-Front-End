import { useInfiniteQuery } from "@tanstack/react-query";
import { followingService } from "../services/followingServices";

export const useFollowing = (userId: number, type: string) => {
  const {data: followingData, fetchNextPage, hasNextPage, isFetching} = useInfiniteQuery({
    queryFn: async ({ pageParam }) => followingService.getUserFollowing(userId, type, pageParam),
    queryKey: [`user:${userId}:following`],
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
  return {fetchNextPage, followingData, hasNextPage, isFetching}
};
