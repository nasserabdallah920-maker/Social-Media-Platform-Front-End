import { useAxios } from "@/lib/axios/axios";
import { useMutation } from "@tanstack/react-query";
import { postsService } from "../services/postServices";

export const useReplies = () => {
  // POST /replies/create/:comment_id
  const createReplyMutation = useMutation({
    mutationFn: postsService.createReply
  });

  // PATCH /replies/update/:reply_id
  const updateReplyMutation = useMutation({
    mutationFn: postsService.updateReply
  });

  // DELETE /replies/delete/:reply_id
  const deleteReplyMutation = useMutation({
    mutationFn: async (reply_id: number) => {
      const res = await useAxios.delete(`/replies/delete/${reply_id}`);
      return res.data;
    },
  });

  return {
    createReply: createReplyMutation.mutate,
    updateReply: updateReplyMutation.mutate,
    deleteReply: deleteReplyMutation.mutate,
    isCreating: createReplyMutation.isPending,
    isUpdating: updateReplyMutation.isPending,
    isDeleting: deleteReplyMutation.isPending,
  };
};
