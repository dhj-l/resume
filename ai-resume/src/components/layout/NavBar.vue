<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="[isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6']"
  >
    <div class="container mx-auto px-4 flex items-center justify-between">
      <!-- Left: Logo -->
      <router-link to="/" class="flex items-center gap-2 group">
        <div
          class="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform"
        >
          <FileTextOutlined class="text-xl" />
        </div>
        <span class="text-xl font-bold text-gray-900 tracking-tight">大学生简历</span>
      </router-link>

      <!-- Center: Navigation -->
      <div class="hidden md:flex items-center gap-8">
        <a
          v-for="item in navItems"
          :key="item.name"
          href="#"
          class="text-sm font-medium text-gray-600 hover:text-primary-600 relative py-2 group transition-colors"
          @click.prevent="handleNavClick(item)"
        >
          {{ item.name }}
          <span
            class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"
          ></span>
        </a>
      </div>

      <!-- Right: Actions -->
      <div class="flex items-center gap-4">
        <template v-if="authStore.isLoggedIn">
          <!-- User Dropdown -->
          <a-dropdown placement="bottomRight">
            <div
              class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors"
            >
              <a-avatar class="bg-primary-100 text-primary-600">
                {{ authStore.userInfo?.username?.[0]?.toUpperCase() || "U" }}
              </a-avatar>
              <span class="text-sm font-medium text-gray-700">{{
                authStore.userInfo?.username || "用户"
              }}</span>
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item key="change-password" @click="handleChangePasswordClick">
                  <LockOutlined /> 修改密码
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout">
                  <LogoutOutlined /> 退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
        <template v-else>
          <router-link
            to="/auth/login"
            class="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
          >
            登录 / 注册
          </router-link>
        </template>

        <button
          class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0"
          @click="handleStartCreating"
        >
          开始制作
        </button>
      </div>
    </div>
  </nav>

  <ChangePasswordModal
    v-model:open="changePasswordModalVisible"
    @success="handleChangePasswordSuccess"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

import { FileTextOutlined, LockOutlined, LogoutOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

import { logoutAPI } from "@/api/user/user";
import ChangePasswordModal from "@/components/common/ChangePasswordModal.vue";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const isScrolled = ref(false);

const changePasswordModalVisible = ref(false);

const navItems = [
  { name: "首页", path: "/" },
  { name: "模板", path: "/templates" },
  { name: "我的简历", path: "/user/resumes", requiresAuth: true },
  { name: "生成记录", path: "/user/generations", requiresAuth: true },
];

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const handleNavClick = (item: any) => {
  if (item.requiresAuth && !authStore.isLoggedIn) {
    router.push("/auth/login");
  } else {
    router.push(item.path);
  }
};

const handleStartCreating = () => {
  router.push("/templates");
};

const handleLogout = async () => {
  await logoutAPI();
  authStore.logout();
  message.success("已退出登录");
  router.push("/auth/login");
};

const handleChangePasswordClick = () => {
  changePasswordModalVisible.value = true;
};

const handleChangePasswordSuccess = () => {
  authStore.logout();
  router.push("/auth/login");
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
