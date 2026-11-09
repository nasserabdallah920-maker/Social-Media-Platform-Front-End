import { useAxios } from "@/lib/axios/axios";

export const headerService = {
  // User Profile
  getUser: async (user_id: number) => {
    const res = await useAxios.get(`/users/get/${user_id}`);
    return res.data;
  },

  // Requests & Relations
  getUserRequests: async ({ page }: { page: number }) => {
    const res = await useAxios.get(`/relations/requests/pending?page=${page}`);
    return res.data;
  },

  acceptRequest: async (from_user_id: number) => {
    return await useAxios.post(`/relations/request/accept/${from_user_id}`);
  },

  rejectRequest: async (from_user_id: number) => {
    return await useAxios.post(`/relations/request/reject/${from_user_id}`);
  },

  // Notifications
  getUserNotifications: async ({ page }: { page: number }) => {
    const res = await useAxios.get(`/notifications?page=${page}`);
    return res.data;
  },

  readAllNotifications: async () => {
    const res = await useAxios.patch("/notifications/read-all");
    return res.data;
  },

  readSingleNotification: async (id: number) => {
    const res = await useAxios.patch(`/notifications/${id}/read`);
    return res.data;
  },

  // --- الـ APIs الجديدة المضافة ---
  getUnreadNotificationsCount: async () => {
    const res = await useAxios.get("/notifications/unread-count");
    return res.data;
  },

  getUnreadMessagesCount: async () => {
    const res = await useAxios.get("/messages/unread/count");
    return res.data;
  },

  getPendingRequestsCount: async () => {
    const res = await useAxios.get("/relations/requests/pending/count");
    return res.data;
  },
  // -----------------------------

  // Auth / Logout
  logOut: async () => {
    return await useAxios.post("/auth/logout");
  },
};