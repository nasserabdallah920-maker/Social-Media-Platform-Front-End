import axios from "axios";
import { cookies } from "next/headers";

export async function serverAxios() {
  const cookieStore = await cookies();

  const token = cookieStore.get("access_token")?.value;

  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...(cookieHeader && {
        Cookie: cookieHeader,
      }),
    },
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        originalRequest.url !== "/auth/refresh"
      ) {
        originalRequest._retry = true;

        try {
          const refreshResponse = await api.post("/auth/refresh");

          const newToken = refreshResponse.data.access_token;

          cookieStore.set('access_token',newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}