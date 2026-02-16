import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { loginAPI, registerAPI } from "@/api/auth/auth";
import { getUserProfileAPI, updateUserProfileAPI } from "@/api/user/user";
import type { LoginParams, RegisterParams } from "@/api/auth/type";
import type { UserProfile, UpdateProfileParams } from "@/api/user/type";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const token = ref<string | null>(null);
    const userInfo = ref<UserProfile | null>(null);

    const isLoggedIn = computed(() => !!token.value);

    async function login(params: LoginParams) {
      try {
        const { data } = await loginAPI(params);
        token.value = data.token;
        // The login API returns a User object, which is compatible with UserProfile base fields
        // We cast it or fetch the full profile immediately
        userInfo.value = data.user as unknown as UserProfile;

        // Fetch full profile to get extra fields like name/avatar if login response is minimal
        await fetchProfile();

        return true;
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    }

    async function fetchProfile() {
      try {
        const { data } = await getUserProfileAPI();
        userInfo.value = data;
        return data;
      } catch (error) {
        console.error("Fetch profile failed:", error);
        throw error;
      }
    }

    async function updateProfile(params: UpdateProfileParams) {
      try {
        const { data } = await updateUserProfileAPI(params);
        userInfo.value = data;
        return data;
      } catch (error) {
        console.error("Update profile failed:", error);
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

    return {
      token,
      userInfo,
      isLoggedIn,
      login,
      register,
      logout,
      fetchProfile,
      updateProfile,
    };
  },
  {
    persist: true,
  },
);
