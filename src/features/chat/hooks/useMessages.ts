import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { chatService } from "../services/chatService";
import {
  ChatMessage,
  Conversation,
  SendMessagePayload,
} from "../interfaces/chatInterfaces";

export const useMessages = (conversationId?: number | null) => {
  const queryClient = useQueryClient();

  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryFn: async ({ pageParam }) =>
      chatService.getMessages(conversationId!, pageParam),
    queryKey: ["messages", conversationId],
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
    enabled: Boolean(conversationId),
  });

  const messages: ChatMessage[] =
    messagesData?.pages.flatMap((page) => {
      if (Array.isArray(page?.data)) return page.data;
      if (Array.isArray(page)) return page;
      return [];
    }) ?? [];

  const sendMessageMutation = useMutation({
    mutationFn: (payload: SendMessagePayload) =>
      chatService.sendMessage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const editMessageMutation = useMutation({
    mutationFn: ({ message_id, text }: { message_id: number; text: string }) =>
      chatService.editMessage({ message_id, text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: ({
      message_id,
      conversation_id,
    }: {
      message_id: number;
      conversation_id: number;
    }) => chatService.deleteMessage({ message_id, conversation_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
  const query = useQueryClient();

  const handleNewMessage = (
    convId: number,
    text: string,
    sent_at: Date | string,
    messagePayload?: any,
  ) => {
    query.setQueryData(
      ["conversations"],
      (oldData: { page: []; pages: [] }) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: { page: []; data: [] }) => ({
            ...page,
            data: page.data.map((conversation: Conversation) =>
              conversation.id == convId
                ? {
                    ...conversation,
                    text: text ?? conversation.text,
                    sent_at,
                    file_url: messagePayload?.file_url ?? conversation.file_url,
                    media_type: messagePayload?.media_type ?? conversation.media_type,
                    unreaded: conversation.unreaded + 1,
                  }
                : conversation,
            ),
          })),
        };
      },
    );

    if (messagePayload) {
      query.setQueryData(["messages", convId], (oldMessagesData: any) => {
        if (!oldMessagesData?.pages) return oldMessagesData;

        const normalizedMessage: ChatMessage = {
          id: messagePayload.id || messagePayload.message_id || Date.now(),
          conversation_id: convId,
          sender_id: messagePayload.sender_id,
          sender_name: messagePayload.sender_name || null,
          sender_avatar: messagePayload.sender_avatar || null,
          text: messagePayload.text || null,
          status: messagePayload.status || "sent",
          file_url: messagePayload.file_url || null,
          media_type: messagePayload.media_type || null,
          file_name: messagePayload.file_name || null,
          file_size: messagePayload.file_size || null,
          sent_at: messagePayload.sent_at || new Date().toISOString(),
          user_id: messagePayload.user_id || null,
        };

        const pages = [...oldMessagesData.pages];
        if (pages.length > 0) {
          const firstPage = { ...pages[0] };
          const dataList = Array.isArray(firstPage.data)
            ? [...firstPage.data]
            : Array.isArray(firstPage)
            ? [...firstPage]
            : [];

          const exists = dataList.some(
            (m: any) =>
              (m.id && m.id === normalizedMessage.id) ||
              (m.message_id && m.message_id === normalizedMessage.id)
          );

          if (!exists) {
            dataList.push(normalizedMessage);
            if (Array.isArray(firstPage.data)) {
              firstPage.data = dataList;
            } else {
              pages[0] = dataList;
            }
          }
          pages[0] = firstPage;
        }

        return {
          ...oldMessagesData,
          pages,
        };
      });
    }
  };
  return {
    messages,
    messagesData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    editMessage: editMessageMutation.mutate,
    isEditing: editMessageMutation.isPending,
    deleteMessage: deleteMessageMutation.mutate,
    isDeleting: deleteMessageMutation.isPending,
    handleNewMessage,
  };
};
