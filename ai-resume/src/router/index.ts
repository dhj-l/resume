import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

import { useAuthStore } from "@/stores/auth";
import type { TransitionPreset } from "@/utils/transitions";

declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    requiresAuth?: boolean;
    guestOnly?: boolean;
    animation?: TransitionPreset;
    defaultChildAnimation?: TransitionPreset;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/home/HomePage.vue"),
    meta: { title: "首页", defaultChildAnimation: "fade-slide-up" },
    redirect: "/home",
    children: [
      {
        name: "home",
        path: "/home",
        component: () => import("@/views/home/home.vue"),
        meta: { animation: "fade" },
      },
      {
        name: "templates",
        path: "/templates",
        component: () => import("@/views/template/TemplateListPage.vue"),
        meta: { title: "模板列表", animation: "fade-slide-up" },
      },
      {
        name: "template-details",
        path: "/templates/:id",
        component: () => import("@/views/template/TemplateDetailsPage.vue"),
        meta: { title: "模板详情", requiresAuth: true, animation: "fade-slide-up" },
      },
      {
        name: "MyResumes",
        path: "/user/resumes",
        component: () => import("@/views/user/MyResumes.vue"),
        meta: { title: "我的简历", requiresAuth: true, animation: "fade-slide-up" },
      },
      {
        name: "GenerationRecords",
        path: "/user/generations",
        component: () => import("@/views/user/GenerationRecords.vue"),
        meta: { title: "生成记录", requiresAuth: true, animation: "fade-slide-up" },
      },
    ],
  },
  {
    path: "/editor",
    name: "Editor",
    component: () => import("@/views/editor/EditorPage.vue"),
    meta: { title: "简历编辑", requiresAuth: true, animation: "scale-in" },
  },
  {
    path: "/auth/gitee/callback",
    name: "GiteeCallback",
    component: () => import("@/views/auth/GiteeCallbackPage.vue"),
    meta: { title: "Gitee 登录回调", guestOnly: true, animation: "none" },
  },
  {
    path: "/auth/github/callback",
    name: "GitHubCallback",
    component: () => import("@/views/auth/GitHubCallbackPage.vue"),
    meta: { title: "GitHub 登录回调", guestOnly: true, animation: "none" },
  },
  {
    path: "/analysis-detail",
    name: "AnalysisDetail",
    component: () => import("@/views/editor/AnalysisDetailPage.vue"),
    meta: { title: "AI 分析详情", requiresAuth: true, animation: "scale-in" },
  },
  {
    path: "/auth",
    component: () => import("@/layouts/AuthLayout.vue"),
    meta: { defaultChildAnimation: "fade-slide-left" },
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("@/views/auth/LoginPage.vue"),
        meta: { title: "登录", guestOnly: true },
      },
      {
        path: "register",
        name: "Register",
        component: () => import("@/views/auth/RegisterPage.vue"),
        meta: { title: "注册", guestOnly: true },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/error/NotFoundPage.vue"),
    meta: { title: "页面未找到", animation: "fade" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (to.meta.guestOnly && authStore.isLoggedIn) {
    next({ name: "home" });
    return;
  }

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: "Login" });
    return;
  }

  next();
});

export default router;
