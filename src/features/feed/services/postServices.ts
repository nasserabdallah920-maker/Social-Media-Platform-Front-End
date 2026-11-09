import { useAxios } from "@/lib/axios/axios";

export const postsService = {
  // جلب المنشورات (Feed)
  getPosts: async ({ page }: { page: number }) => {
    const res = await useAxios.get(`/feed/posts?page=${page}`);
    return res.data;
  },

  // إنشاء منشور جديد
  createPost: async ({
    text,
    post_files,
  }: {
    text: string;
    post_files?: File[];
  }) => {
    const formData = new FormData();
    formData.append("text", text);
    if (post_files) {
      post_files.forEach((file) => {
        formData.append("post_files", file);
      });
    }
    const res = await useAxios.post("/posts/create", formData);
    return res.data;
  },

  // التعليقات
  makeComment: async ({
    post_id,
    data,
  }: {
    post_id: number;
    data: FormData;
  }) => {
    const res = await useAxios.post(`/comments/create/${post_id}`, data);
    return res.data;
  },

  editComment: async ({
    comment_id,
    text,
  }: {
    comment_id: number;
    text: string;
  }) => {
    const res = await useAxios.patch(`/comments/update/${comment_id}`, {
      text,
    });
    return res.data;
  },

  removeComment: async (comment_id: number) => {
    const res = await useAxios.delete(`/comments/delete/${comment_id}`);
    return res.data;
  },

  createReply: async ({
    comment_id,
    data,
  }: {
    comment_id: number;
    data: FormData;
  }) => {
    const res = await useAxios.post(`/replies/create/${comment_id}`, data);
    return res.data;
  },
  
    updateReply: async ({
      reply_id,
      text,
    }: {
      reply_id: number;
      text: string;
    }) => {
      const res = await useAxios.patch(`/replies/update/${reply_id}`, { text });
      return res.data;
    },
  // الإعجابات
  toggleLike: async (post_id: number) => {
    const res = await useAxios.post(`/likes/toggle/${post_id}`);
    return res.data;
  },
};
