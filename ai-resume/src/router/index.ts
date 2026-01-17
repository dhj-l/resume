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
  {
    path: "/dashboard",
    component: () => import("@/layouts/DashboardLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "DashboardHome",
        component: () => import("@/views/dashboard/ResumeList.vue"),
      },
      {
        path: "templates",
        name: "TemplateSelection",
        component: () => import("@/views/template/TemplateLibrary.vue"),
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
