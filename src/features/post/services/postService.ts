import { useAxios } from "@/lib/axios/axios";

export const postService = {
  
  updatePostText: async ({ id, text }: { id: number; text: string }) => {
    const res = await useAxios.patch(`/posts/update/${id}`, { text });
    return res.data;
  },

  
  deletePost: async (id: number) => {
    const res = await useAxios.delete(`/posts/delete/${id}`);
    return res.data;
  },

  
  deletePostFile: async ({ postId, file_url }: { postId: number; file_url: string }) => {
    const res = await useAxios.delete(`/posts/delete/${postId}/file?file_url=${file_url}`);
    return res.data;
  },

  updatePostFiles: async ({ id, files }: { id: number; files: File[] }) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("post_files", file);
    });

    const res = await useAxios.patch(`/posts/update/files/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
};