import { message } from "ant-design-vue";
import axios from "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    /** 请求失败时不弹出全局错误提示（由调用方自行处理） */
    silent?: boolean;
  }
}

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
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
    //如果response.data为Blob类型，直接返回
    if (response.data instanceof Blob) {
      return response.data;
    }
    if (code >= 200 && code < 300) {
      return response.data;
    } else {
      if (!response.config.silent) {
        message.error(msg || "请求失败");
      }
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
        if (!error.config?.silent) {
          message.error(data?.message || "网络请求错误");
        }
      }
    } else {
      if (!error.config?.silent) {
        message.error("网络连接异常，请检查网络设置");
      }
    }
    return Promise.reject(error);
  },
);
