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
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Use dynamic imports to avoid circular dependencies
      const { useAuthStore } = await import("@/stores/auth");
      const { default: router } = await import("@/router");

      const authStore = useAuthStore();
      authStore.logout();
      message.error("登录已过期，请重新登录");
      router.push({ name: "Login" });
    }
    return Promise.reject(error);
  },
);
