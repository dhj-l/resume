<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="[
      isScrolled
        ? 'bg-white/80 backdrop-blur-md shadow-sm py-4'
        : 'bg-transparent py-6',
    ]"
  >
    <div class="container mx-auto px-4 flex items-center justify-between">
      <!-- Left: Logo -->
      <router-link to="/" class="flex items-center gap-2 group">
        <div
          class="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
            />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
          </svg>
        </div>
        <span class="text-xl font-bold text-gray-900 tracking-tight"
          >大学牲简历</span
        >
      </router-link>

      <!-- Center: Navigation -->
      <div class="hidden md:flex items-center gap-8">
        <a
          v-for="item in navItems"
          :key="item.name"
          href="#"
          @click.prevent="handleNavClick(item)"
          class="text-sm font-medium text-gray-600 hover:text-primary-600 relative py-2 group transition-colors"
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
                <a-menu-item key="profile">
                  <UserOutlined /> 个人中心
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
          @click="handleStartCreating"
          class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0"
        >
          开始制作
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons-vue";

const router = useRouter();
const authStore = useAuthStore();
const isScrolled = ref(false);

const navItems = [
  { name: "首页", path: "/" },
  { name: "模板", path: "/templates" },
  { name: "定价", path: "/pricing" },
  { name: "我的模板", path: "/dashboard/templates", requiresAuth: true },
  { name: "个人中心", path: "/dashboard/profile", requiresAuth: true },
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
  router.push("/dashboard/templates");
};

const handleLogout = () => {
  authStore.logout();
  router.push("/");
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
