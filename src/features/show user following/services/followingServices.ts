import { useAxios } from "@/lib/axios/axios";

export const followingService = {
  getUserFollowing: async (userId: number, type: string, page: number) => {
    const res = await useAxios.get(
      `/relations/${type}/${userId}?page=${page}`,
    );
    return res.data;
  },
};
