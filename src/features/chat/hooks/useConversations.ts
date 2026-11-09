import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "../services/chatService";

export const useConversations = () => {
  const queryClient = useQueryClient();

  const {
    data: conversationsData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
    refetch
  } = useInfiniteQuery({
    queryFn: async ({ pageParam }) => chatService.getConversations(pageParam),
    queryKey: ["conversations"],
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });

  const conversations =
    conversationsData?.pages.flatMap((page) =>
      Array.isArray(page) ? page : page.data ?? []
    ) ?? [];

  const deleteConversationMutation = useMutation({
    mutationFn: async (conversationId: number) => {
      return await chatService.deleteConversation(conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  });

  const createGroupMutation = useMutation({
    mutationFn: chatService.createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const updateConversationMutation = useMutation({
    mutationFn: chatService.updateConversation,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["group-details", variables.conversation_id] });
    },
  });

  const addMembersMutation = useMutation({
    mutationFn: chatService.addMembers,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["group-details", variables.conversation_id] });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: chatService.removeMember,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["group-details", variables.conversation_id] });
    },
  });

  return {
    conversations,
    conversationsData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
    refetch,
    deleteConversation: deleteConversationMutation.mutate,
    deleteConversationAsync: deleteConversationMutation.mutateAsync,
    isDeleting: deleteConversationMutation.isPending,
    deleteError: deleteConversationMutation.error,
    createGroup: createGroupMutation.mutate,
    createGroupAsync: createGroupMutation.mutateAsync,
    isCreatingGroup: createGroupMutation.isPending,
    createGroupError: createGroupMutation.error,
    updateConversation: updateConversationMutation.mutate,
    updateConversationAsync: updateConversationMutation.mutateAsync,
    isUpdatingConversation: updateConversationMutation.isPending,
    updateConversationError: updateConversationMutation.error,
    addMembers: addMembersMutation.mutate,
    addMembersAsync: addMembersMutation.mutateAsync,
    isAddingMembers: addMembersMutation.isPending,
    addMembersError: addMembersMutation.error,
    removeMember: removeMemberMutation.mutate,
    removeMemberAsync: removeMemberMutation.mutateAsync,
    isRemovingMember: removeMemberMutation.isPending,
    removeMemberError: removeMemberMutation.error,
  };
};