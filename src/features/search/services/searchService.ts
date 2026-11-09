import { useAxios } from "@/lib/axios/axios";
import { SearchResponse } from "../interfaces/searchInterfaces";

export const searchService = {
  searchFeed: async (query: string): Promise<SearchResponse["data"]> => {
    const res = await useAxios.get<SearchResponse>(
      `/feed?q=${encodeURIComponent(query)}`
    );
    return res.data?.data ?? { users: [], posts: [] };
  },
};

