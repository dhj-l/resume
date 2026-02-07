import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("token"));
  const userInfo = ref<any | null>(null); // Replace 'any' with proper type later

  const isLoggedIn = computed(() => !!token.value);

  function login(newToken: string, user: any) {
    token.value = newToken;
    userInfo.value = user;
    localStorage.setItem("token", newToken);
  }

  function logout() {
    token.value = null;
    userInfo.value = null;
    localStorage.removeItem("token");
  }

  return { token, userInfo, isLoggedIn, login, logout };
});
