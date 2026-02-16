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
      {
        name: "templates",
        path: "/templates",
        component: () => import("@/views/template/TemplateListPage.vue"),
        meta: { title: "模板列表" },
      },
      {
        name: "template-details",
        path: "/templates/:id",
        component: () => import("@/views/template/TemplateDetailsPage.vue"),
        meta: { title: "模板详情" },
      },
      {
        name: "MyResumes",
        path: "/user/resumes",
        component: () => import("@/views/user/MyResumes.vue"),
        meta: { title: "我的简历", requiresAuth: true },
      },
      {
        name: "UserProfile",
        path: "/user/profile",
        component: () => import("@/views/user/UserProfile.vue"),
        meta: { title: "个人中心", requiresAuth: true },
      },
    ],
  },
  {
    path: "/editor",
    name: "Editor",
    component: () => import("@/views/editor/EditorPage.vue"),
    meta: { title: "简历编辑" },
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
