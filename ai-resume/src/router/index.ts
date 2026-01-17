import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/home/HomePage.vue"),
    meta: { title: "首页" },
    redirect: "/home",
    children: [
      {
        name: "home",
        path: "/home",
        component: () => import("@/views/home/home.vue"),
      },
    ],
  },
  {
    path: "/auth",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("@/views/auth/LoginPage.vue"),
        meta: { title: "登录" },
      },
      {
        path: "register",
        name: "Register",
        component: () => import("@/views/auth/RegisterPage.vue"),
        meta: { title: "注册" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
