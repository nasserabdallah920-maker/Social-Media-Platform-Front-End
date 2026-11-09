import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/RTK/userSlice";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import { authServices } from "../services/authSerivces";

const cookies = new Cookies();

export const useLogin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const body = { email, password };
  const dispatch = useDispatch();


  const mutation = useMutation({
    mutationFn: ()=>authServices.postLogin({body}),
    onSuccess: (data) => {
      if (data?.access_token) {
        
        cookies.set("access_token", data.access_token, {
          path: "/",
          sameSite: "lax",
        });

       
        dispatch(
          setUser({
            user: {
              user_id: data.user?.user_id,
              user_name: data.user?.user_name,
            },
          }),
        );
        router.push("/");
      }
    },
  });

  const handleLogin = () => {
    mutation.mutate();
  };

  return {
    setEmail,
    setPassword,
    mutation,
    handleLogin,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
