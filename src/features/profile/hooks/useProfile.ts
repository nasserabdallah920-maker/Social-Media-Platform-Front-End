import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profileServices";

export const useProfile = () => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: (id: number) => profileService.followUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const unFollowmutate = useMutation({
    mutationFn: (id: number) => profileService.unfollowUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const blockMutation = useMutation({
    mutationFn: (id: number) => profileService.blockUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: (file: File) => profileService.updateAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const updateBioMutation = useMutation({
    mutationFn: (bio: string) => profileService.updateBio(bio),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    mutate,
    unFollowmutate,
    followMutation: mutate,
    unfollowMutation: unFollowmutate,
    blockMutation,
    updateAvatarMutation,
    updateBioMutation,
  };
};
