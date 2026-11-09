import { useAxios } from "@/lib/axios/axios";

export const profileService = {
  // Relations
  followUser: async (id: number) => {
    const res = await useAxios.post(`/relations/follow/${id}`);
    return res.data;
  },

  unfollowUser: async (id: number) => {
    const res = await useAxios.post(`/relations/unfollow/${id}`);
    return res.data;
  },

  blockUser: async (id: number) => {
    const res = await useAxios.post(`/relations/block/${id}`);
    return res.data;
  },

  // Profile Updates
  updateAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await useAxios.put("/profiles/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  updateBio: async (bio: string) => {
    const res = await useAxios.put("/profiles/bio", { bio });
    return res.data;
  },

  // User Posts
  getUserPosts: async (userId: number) => {
    const res = await useAxios.get(`/posts/user/${userId}`);
    return res.data;
  },
};
