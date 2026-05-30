<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center space-y-4">
      <!-- 加载中 -->
      <template v-if="status === 'loading'">
        <a-spin size="large" />
        <p class="text-gray-500 text-lg">正在通过 Gitee 登录，请稍候…</p>
      </template>

      <!-- 成功（短暂闪现后自动跳转） -->
      <template v-else-if="status === 'success'">
        <CheckCircleOutlined class="text-5xl text-green-500" />
        <p class="text-gray-700 text-lg">登录成功，即将跳转…</p>
      </template>

      <!-- 失败 -->
      <template v-else-if="status === 'error'">
        <CloseCircleOutlined class="text-5xl text-red-400" />
        <p class="text-gray-700 text-lg">{{ errorMsg }}</p>
        <p class="text-gray-400 text-sm">即将返回登录页…</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

type PageStatus = "loading" | "success" | "error";
const status = ref<PageStatus>("loading");
const errorMsg = ref("");

onMounted(async () => {
  // 后端 302 重定向到 /auth/gitee/callback#token=eyJ...&state=xxx
  const hash = window.location.hash.substring(1); // 去掉开头的 #
  const params = new URLSearchParams(hash);
  const token = params.get("token");
  const returnedState = params.get("state");

  // 验证 state 参数 — 防御 CSRF 攻击
  const savedState = sessionStorage.getItem("gitee_oauth_state");
  if (!returnedState || returnedState !== savedState) {
    sessionStorage.removeItem("gitee_oauth_state");
    status.value = "error";
    errorMsg.value = "授权验证失败（state 不匹配），请重新登录。";
    setTimeout(() => router.replace({ name: "Login" }), 2500);
    return;
  }

  if (!token) {
    sessionStorage.removeItem("gitee_oauth_state");
    status.value = "error";
    errorMsg.value = "授权回调缺少 Token，请重新登录。";
    setTimeout(() => router.replace({ name: "Login" }), 2500);
    return;
  }

  try {
    // 写入 token（Pinia persist 自动同步到 localStorage）
    authStore.token = token;

    // 拉取用户完整信息（name / avatar 等扩展字段）
    await authStore.fetchProfile();

    sessionStorage.removeItem("gitee_oauth_state");
    status.value = "success";
    message.success("Gitee 登录成功！");
    setTimeout(() => router.replace({ path: "/home" }), 800);
  } catch (err: unknown) {
    // 拉取用户信息失败，清除已写入的 token
    authStore.logout();
    sessionStorage.removeItem("gitee_oauth_state");

    status.value = "error";
    const msg = err instanceof Error ? err.message : "获取用户信息失败，请重试。";
    errorMsg.value = msg;
    message.error(msg);
    setTimeout(() => router.replace({ name: "Login" }), 2500);
  }
});
</script>
