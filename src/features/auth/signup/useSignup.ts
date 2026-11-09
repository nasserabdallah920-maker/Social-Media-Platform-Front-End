import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/RTK/userSlice";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import { authServices } from "../services/authSerivces";

const cookies = new Cookies();

export const useSignup = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const body = {
    first_name: firstName,
    last_name: lastName,
    user_name: userName,
    email,
    password,
  };

  const dispatch = useDispatch();



  const mutation = useMutation({
    mutationFn:()=> authServices.postSignup({body}),
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

  const handleSignup = () => {
    mutation.mutate();
  };

  return {
    setFirstName,
    setLastName,
    setUserName,
    setEmail,
    setPassword,
    mutation,
    handleSignup,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
