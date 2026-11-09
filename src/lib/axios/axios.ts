import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const useAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// ✅ قراءة التوكن من الكوكي مع كل طلب
useAxios.interceptors.request.use((config) => {
  const token = cookies.get("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ عند انتهاء صلاحية التوكن — refresh تلقائي
useAxios.interceptors.response.use(
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
        const response = await useAxios.post("/auth/refresh");
        const data = response.data;

        
        cookies.set("access_token", data.access_token, {
          path: "/",
          sameSite: "lax",
        });

        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return useAxios(originalRequest);
      } catch {
        // ✅ حذف التوكن من الكوكي عند فشل الـ refresh
        cookies.remove("access_token", { path: "/" });
      }
    }
    return Promise.reject(error);
  },
);
