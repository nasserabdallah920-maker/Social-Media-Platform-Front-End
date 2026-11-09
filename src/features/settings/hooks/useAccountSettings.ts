import { setUser, clearUser } from "@/lib/RTK/userSlice";
import { RootState } from "@/lib/RTK/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { settingsService } from "../services/settingsServices";

const cookies = new Cookies();

export const useAccountSettings = () => {
  const user_id = useSelector((state: RootState) => state.user.user.user_id);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", { user_id }],
    queryFn: () => settingsService.getUser(user_id),
    enabled: Number(user_id) > 0,
  });

  const updateInfo = useMutation({
    mutationFn: (body: {
      first_name: string;
      last_name: string;
      user_name: string;
    }) => settingsService.updateInfo(body),
    onSuccess: (_res, variables) => {
      dispatch(
        setUser({
          user: {
            user_id,
            user_name: variables.user_name,
          },
        }),
      );
      queryClient.invalidateQueries({ queryKey: ["user", { user_id }] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const changePassword = useMutation({
    mutationFn: (body: { old_password: string; new_password: string }) =>
      settingsService.changePassword(body),
  });

  const deleteAccount = useMutation({
    mutationFn: () => settingsService.deleteAccount(),
    onSuccess: () => {
      cookies.remove("access_token", { path: "/" });
      dispatch(clearUser());
      queryClient.clear();
      router.push("/login");
    },
  });

  return {
    user: data?.data,
    isLoadingUser: Number(user_id) === 0 || isLoading,
    userError: isError,
    updateInfo: updateInfo.mutate,
    isUpdating: updateInfo.isPending,
    updateError: updateInfo.error,
    isUpdateSuccess: updateInfo.isSuccess,
    changePassword: changePassword.mutate,
    isChangingPassword: changePassword.isPending,
    changePasswordError: changePassword.error,
    isPasswordChangeSuccess: changePassword.isSuccess,
    deleteAccount: deleteAccount.mutate,
    isDeleting: deleteAccount.isPending,
    deleteError: deleteAccount.error,
  };
};