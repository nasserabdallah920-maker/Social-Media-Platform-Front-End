import { useQuery } from "@tanstack/react-query";
import { searchService } from "../services/searchService";
import { SearchResponse } from "../interfaces/searchInterfaces";

export const useSearch = (query: string) => {
  const trimmed = query.trim();

  const {
    data = { users: [], posts: [] },
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery<SearchResponse["data"]>({
    queryKey: ["search", trimmed],
    queryFn: () => searchService.searchFeed(trimmed),
    enabled: trimmed.length > 0,
    staleTime: 1000 * 60, // 1 minute
  });

  return {
    users: data.users || [],
    posts: data.posts || [],
    isLoading: isLoading && trimmed.length > 0,
    isFetching,
    isError,
    refetch,
  };
};

