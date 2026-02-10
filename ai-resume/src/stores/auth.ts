import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { loginAPI, registerAPI } from "@/api/auth/auth";
import type { LoginParams, RegisterParams, User } from "@/api/auth/type";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const token = ref<string | null>(null);
    const userInfo = ref<User | null>(null);

    const isLoggedIn = computed(() => !!token.value);

    async function login(params: LoginParams) {
      try {
        const { data } = await loginAPI(params);
        token.value = data.token;
        userInfo.value = data.user;
        return true;
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    }

    async function register(params: RegisterParams) {
      try {
        await registerAPI(params);
        // Optionally auto-login or just return success
        return true;
      } catch (error) {
        console.error("Registration failed:", error);
        throw error;
      }
    }

    function logout() {
      token.value = null;
      userInfo.value = null;
      // Persistence plugin handles localStorage cleanup automatically when state changes
    }

    return { token, userInfo, isLoggedIn, login, register, logout };
  },
  {
    persist: true,
  },
);
