import { useAxios } from "@/lib/axios/axios";

export const settingsService = {
  // Account
  getUser: async (userId: number) => {
    const res = await useAxios.get(`/users/get/${userId}`);
    return res.data;
  },

  updateInfo: async (body: {
    first_name: string;
    last_name: string;
    user_name: string;
  }) => {
    const res = await useAxios.patch("/users/update/info", body);
    return res.data;
  },

  changePassword: async (body: {
    old_password: string;
    new_password: string;
  }) => {
    const res = await useAxios.post("/auth/change/password", body);
    return res.data;
  },

  deleteAccount: async () => {
    const res = await useAxios.delete("/users/delete");
    return res.data;
  },

  // Privacy
  togglePrivacy: async () => {
    const res = await useAxios.patch("/profiles/privacy");
    return res.data;
  },

  // Blocked Users
  getBlockedUsers: async (page: number) => {
    const res = await useAxios.get(`/relations/blocked?page=${page}`);
    return res.data;
  },

  unblockUser: async (userId: number) => {
    const res = await useAxios.post(`/relations/unblock/${userId}`);
    return res.data;
  },
};
