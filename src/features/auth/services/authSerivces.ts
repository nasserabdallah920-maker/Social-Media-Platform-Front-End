import { useAxios } from "@/lib/axios/axios";
import { LoginInterface,SigupInterface } from "../interfaces/authInterfaces";

export const authServices = {
  forgotPassword: async (email: string) => {
    const response = await useAxios.post("/auth/reset/email", { email });
    return response.data;
  },
  postLogin: async ({
    body,
  }: {
    body: LoginInterface
  }) => {
    const res = await useAxios.post("/auth/login", body);
    return res.data;
  },
  postSignup: async ({
    body
  }: {
    body: SigupInterface
  }) => {
    const res = await useAxios.post("/auth/register", body);
    return res.data;
  },
};
