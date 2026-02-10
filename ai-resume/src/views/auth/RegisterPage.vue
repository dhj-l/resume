<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="text-center lg:text-left">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">创建账号</h2>
      <p class="text-gray-500">加入成千上万的学生，打造你的未来</p>
    </div>

    <!-- Register Form -->
    <a-form
      layout="vertical"
      :model="formState"
      name="register"
      class="mt-8"
      @finish="handleRegister"
    >
      <a-form-item
        name="username"
        label="用户名"
        :rules="[{ required: true, message: '请输入你的用户名！' }]"
      >
        <a-input
          v-model:value="formState.username"
          placeholder="请输入用户名"
          size="large"
          class="!rounded-lg !py-2.5"
        >
          <template #prefix>
            <UserOutlined class="text-gray-400" />
          </template>
        </a-input>
      </a-form-item>

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
        :rules="[
          { required: true, message: '请输入你的密码！' },
          { min: 8, message: '密码至少包含8个字符' },
          {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            message: '密码必须包含字母和数字',
          },
        ]"
      >
        <a-input-password
          v-model:value="formState.password"
          placeholder="创建一个强密码"
          size="large"
          class="!rounded-lg !py-2.5"
        >
          <template #prefix>
            <LockOutlined class="text-gray-400" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item
        name="confirmPassword"
        label="确认密码"
        :rules="[
          { required: true, message: '请确认你的密码！' },
          { validator: validateConfirmPassword },
        ]"
      >
        <a-input-password
          v-model:value="formState.confirmPassword"
          placeholder="确认你的密码"
          size="large"
          class="!rounded-lg !py-2.5"
        >
          <template #prefix>
            <LockOutlined class="text-gray-400" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-button
        type="primary"
        html-type="submit"
        size="large"
        block
        :loading="loading"
        class="!h-12 !rounded-lg !bg-blue-600 !text-lg !font-medium hover:!bg-blue-700 !shadow-lg !shadow-blue-200 mt-2"
      >
        创建账号
      </a-button>
    </a-form>

    <!-- Sign In Link -->
    <div class="text-center mt-8">
      <p class="text-gray-600">
        已经有账号了？
        <router-link
          to="/auth/login"
          replace
          class="text-blue-600 hover:text-blue-700 font-semibold"
          >登录</router-link
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);

const formState = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const validateConfirmPassword = async (_rule: Rule, value: string) => {
  if (value === "") {
    return Promise.reject("请确认你的密码！");
  }
  if (value !== formState.password) {
    return Promise.reject("两次输入的密码不匹配！");
  }
  return Promise.resolve();
};

const handleRegister = async () => {
  loading.value = true;
  try {
    await authStore.register({
      username: formState.username,
      email: formState.email,
      password: formState.password,
    });
    message.success("账号创建成功！请登录。");
    router.push("/auth/login");
  } catch (error) {
    message.error("注册失败，请重试。");
  } finally {
    loading.value = false;
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
