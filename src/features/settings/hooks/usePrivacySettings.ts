import { RootState } from "@/lib/RTK/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { settingsService } from "../services/settingsServices";

const isPrivateValue = (value: unknown) =>
  value === true || value === 1 || value === "1";

export const usePrivacySettings = () => {
  const user_id = useSelector((state: RootState) => state.user.user.user_id);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", { user_id }],
    queryFn: () => settingsService.getUser(user_id),
    enabled: Number(user_id) > 0,
  });

  const togglePrivacy = useMutation({
    mutationFn: () => settingsService.togglePrivacy(),
    onSuccess: (res) => {
      const is_private = isPrivateValue(res?.data?.is_private) ? 1 : 0;
      queryClient.setQueryData(["user", { user_id }], (old: unknown) => {
        if (!old || typeof old !== "object") return old;
        const current = old as { data?: Record<string, unknown> };
        return {
          ...current,
          data: {
            ...current.data,
            is_private,
          },
        };
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    isPrivate: isPrivateValue(data?.data?.is_private),
    isLoadingUser: Number(user_id) === 0 || isLoading,
    userError: isError,
    togglePrivacy: togglePrivacy.mutate,
    isToggling: togglePrivacy.isPending,
    toggleError: togglePrivacy.error,
  };
};
