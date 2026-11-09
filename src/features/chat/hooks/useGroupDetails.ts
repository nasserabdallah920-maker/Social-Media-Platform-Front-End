import { useQuery } from "@tanstack/react-query";
import { chatService } from "../services/chatService";
import { GroupDetails } from "../interfaces/chatInterfaces";

export const useGroupDetails = (conversationId?: number | null, enabled: boolean = true) => {
  return useQuery<GroupDetails>({
    queryKey: ["group-details", conversationId],
    queryFn: async () => {
      if (!conversationId) throw new Error("Conversation ID is required");
      const res = await chatService.getGroupDetails(conversationId);
      return res?.data ?? res;
    },
    enabled: Boolean(conversationId && conversationId > 0 && enabled),
    staleTime: 1000 * 60 * 2,
  });
};

