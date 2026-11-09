import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "../services/settingsServices";
import { BlockedPage } from "../interfaces/settingsInterfaces";

export const useBlockedUsers = () => {
  const queryClient = useQueryClient();

  const blockedQuery = useInfiniteQuery({
    queryKey: ["blocked-users"],
    queryFn: async ({ pageParam = 1 }) => {
      return (await settingsService.getBlockedUsers(pageParam)) as BlockedPage;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });

  const unblockUser = useMutation({
    mutationFn: (userId: number) => settingsService.unblockUser(userId),
    onSuccess: (_res, userId) => {
      queryClient.setQueryData<InfiniteData<BlockedPage>>(
        ["blocked-users"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.filter((user) => user.id !== userId),
            })),
          };
        }
      );
    },
  });

  const blockedUsers =
    blockedQuery.data?.pages.flatMap((page) => page.data) ?? [];

  return {
    blockedUsers,
    isLoading: blockedQuery.isLoading,
    isError: blockedQuery.isError,
    fetchNextPage: blockedQuery.fetchNextPage,
    hasNextPage: blockedQuery.hasNextPage,
    isFetchingNextPage: blockedQuery.isFetchingNextPage,
    unblockUser: unblockUser.mutate,
    unblockingId: unblockUser.isPending ? (unblockUser.variables as number) : null,
    unblockError: unblockUser.error,
  };
};