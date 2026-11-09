import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { postService } from "../services/postService";

export const usePost = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // تعديل نص البوست
  const updatePostText = useMutation({
    mutationFn: (data: { id: number; text: string }) => postService.updatePostText(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // حذف البوست بالكامل
  const deletePost = useMutation({
    mutationFn: (id: number) => postService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.back();
    },
  });

  // حذف صورة معينة من البوست
  const deletePostFile = useMutation({
    mutationFn: (data: { postId: number; file_url: string }) => postService.deletePostFile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // تحديث/إضافة صور للبوست
  const updatePostFiles = useMutation({
    mutationFn: (data: { id: number; files: File[] }) => postService.updatePostFiles(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return {
    updatePostText,
    deletePost,
    deletePostFile,
    updatePostFiles,
  };
};