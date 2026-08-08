<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="text-center lg:text-left">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h2>
      <p class="text-gray-500">登录以继续制作你的简历</p>
    </div>

    <!-- Login Form -->
    <a-form layout="vertical" :model="formState" name="login" class="mt-8" @finish="handleLogin">
      <a-form-item
        name="email"
        label="邮箱地址"
        :rules="[
          { required: true, message: '请输入你的邮箱！' },
          { type: 'email', message: '请输入有效的邮箱地址！' },
        ]"
      >
        <a-input
          v-model:value="formState.email"
          placeholder="name@example.com"
          size="large"
          class="!rounded-lg !py-2.5"
        >
          <template #prefix>
            <MailOutlined class="text-gray-400" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        name="password"
        label="密码"
        :rules="[{ required: true, message: '请输入你的密码！' }]"
      >
        <a-input-password
          v-model:value="formState.password"
          placeholder="请输入密码"
          size="large"
          class="!rounded-lg !py-2.5"
        >
          <template #prefix>
            <LockOutlined class="text-gray-400" />
          </template>
        </a-input-password>
      </a-form-item>

      <div class="flex items-center justify-between mb-6">
        <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
        <a class="text-blue-600 hover:text-blue-700 font-medium" href="#">忘记密码？</a>
      </div>

      <a-button
        type="primary"
        html-type="submit"
        size="large"
        block
        :loading="loading"
        class="!h-12 !rounded-lg !bg-blue-600 !text-lg !font-medium hover:!bg-blue-700 !shadow-lg !shadow-blue-200"
      >
        登录
      </a-button>
    </a-form>

    <!-- Social Login -->
    <div class="relative my-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-200"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-4 bg-white text-gray-500">社交账号登录</span>
      </div>
    </div>

    <a-button
      block
      size="large"
      class="!h-12 !rounded-lg !border !border-gray-300 !text-gray-700 hover:!border-[#C71D23] hover:!text-[#C71D23] !flex !items-center !justify-center !gap-2.5 !transition-all !duration-300"
      @click="handleOAuthLogin('gitee')"
    >
      <GiteeIcon class="w-5 h-5" />
      Gitee 登录
    </a-button>

    <a-button
      block
      size="large"
      class="!h-12 !rounded-lg !border !border-gray-300 !text-gray-700 hover:!border-gray-900 hover:!text-gray-900 !flex !items-center !justify-center !gap-2.5 !transition-all !duration-300 mt-3"
      @click="handleOAuthLogin('github')"
    >
      <GithubOutlined class="text-lg" />
      GitHub 登录
    </a-button>

    <!-- Guest Access -->

    <!-- Sign Up Link -->
    <div class="text-center mt-8">
      <p class="text-gray-600">
        还没有账号？
        <router-link
          to="/auth/register"
          replace
          class="text-blue-600 hover:text-blue-700 font-semibold"
          >立即注册</router-link
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

import { GithubOutlined, LockOutlined, MailOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

import { getGiteeAuthUrlAPI, getGitHubAuthUrlAPI } from "@/api/auth/auth";
import GiteeIcon from "@/components/icons/GiteeIcon.vue";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);

const formState = reactive({
  email: "",
  password: "",
  remember: true,
});

const handleLogin = async () => {
  loading.value = true;
  try {
    await authStore.login({
      email: formState.email,
      password: formState.password,
    });
    message.success("登录成功！");
    router.push("/home");
  } catch (error) {
    message.error("登录失败，请检查你的凭据。");
  } finally {
    loading.value = false;
  }
};

const handleOAuthLogin = async (provider: "gitee" | "github") => {
  const apiMap = { gitee: getGiteeAuthUrlAPI, github: getGitHubAuthUrlAPI };
  const labelMap = { gitee: "Gitee", github: "GitHub" };

  try {
    const { data } = await apiMap[provider]();
    sessionStorage.setItem(`${provider}_oauth_state`, data.state);
    window.location.href = data.authUrl;
  } catch {
    message.error(`获取 ${labelMap[provider]} 授权链接失败，请重试。`);
  }
};
</script>

<style scoped>
:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #374151;
}

:deep(.ant-input-affix-wrapper:hover),
:deep(.ant-input-affix-wrapper:focus),
:deep(.ant-input-affix-wrapper-focused) {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}
</style>
