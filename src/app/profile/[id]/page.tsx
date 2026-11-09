import BlockedUserFallback from "@/features/profile/pages/BlockedUserFallback";
import ProfilePage from "@/features/profile/pages/ProfilePage";

import { serverAxios } from "@/lib/axios/serverAxios";
import axios from "axios";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const api = await serverAxios();
  let user;
  try {
    const userRes = await api.get(`/users/get/${id}`);
    user = userRes.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.status) {
      return <BlockedUserFallback />;
    } else {
      throw error
    }
  }
  return <ProfilePage user={user} />;
}
