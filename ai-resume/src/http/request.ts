import axios from "axios";
import { message } from "ant-design-vue";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

http.interceptors.request.use(
  (config) => {
    try {
      const authStoreStr = localStorage.getItem("auth");
      if (authStoreStr) {
        const authStore = JSON.parse(authStoreStr);
        if (authStore.token) {
          config.headers.Authorization = "Bearer " + authStore.token;
        }
      }
    } catch (e) {
      console.warn("Failed to retrieve auth token", e);
    }
    return config;
  },
  (error) => {
    message.error("请求发送失败");
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response) => {
    const { code, message: msg } = response.data;
    if (code === 200) {
      return response.data;
    } else {
      message.error(msg || "请求失败");
      return Promise.reject(new Error(msg || "请求失败"));
    }
  },
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        const { useAuthStore } = await import("@/stores/auth");
        const { default: router } = await import("@/router");

        const authStore = useAuthStore();
        authStore.logout();
        message.error("登录已过期，请重新登录");
        router.push({ path: "/auth/login" });
      } else {
        message.error(data?.message || "网络请求错误");
      }
    } else {
      message.error("网络连接异常，请检查网络设置");
    }
    return Promise.reject(error);
  },
);
