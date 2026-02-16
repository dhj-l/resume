<template>
  <div class="min-h-screen bg-[#f5f5f7] pt-20 pb-20 relative font-sans">
    <!-- Background Decor -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"
      ></div>
    </div>

    <div class="container mx-auto px-4 relative z-10 max-w-6xl">
      <!-- Page Header -->
      <div class="mb-10 animate-slide-up">
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">
          个人中心
        </h1>
        <p class="text-slate-500 mt-2 text-lg">管理您的个人资料与账户安全</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left Sidebar: Profile Card -->
        <div
          class="lg:col-span-4 animate-slide-up"
          style="animation-delay: 100ms"
        >
          <div
            class="bg-white rounded-2xl shadow-card p-8 flex flex-col items-center text-center border border-slate-100/50"
          >
            <div class="relative group cursor-pointer mb-6">
              <a-avatar
                :size="120"
                class="bg-primary-50 text-primary-500 text-4xl border-4 border-white shadow-lg"
                :src="formState.avatar"
              >
                {{
                  formState.name?.[0]?.toUpperCase() ||
                  formState.username?.[0]?.toUpperCase() ||
                  "U"
                }}
              </a-avatar>
              <div
                class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <span class="text-white text-sm font-medium">更换头像</span>
              </div>
            </div>

            <h2 class="text-xl font-bold text-slate-900 mb-1">
              {{ formState.name || formState.username }}
            </h2>
            <p class="text-slate-500 text-sm mb-6">{{ formState.email }}</p>

            <div class="w-full pt-6 border-t border-slate-100">
              <div class="flex justify-between text-sm mb-3">
                <span class="text-slate-500">注册时间</span>
                <span class="text-slate-900 font-medium">2023-10-24</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-500">会员状态</span>
                <span
                  class="text-primary-600 font-medium bg-primary-50 px-2 py-0.5 rounded text-xs"
                  >普通会员</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Right Content: Tabs -->
        <div
          class="lg:col-span-8 animate-slide-up"
          style="animation-delay: 200ms"
        >
          <div
            class="bg-white rounded-2xl shadow-card p-6 border border-slate-100/50 min-h-[500px]"
          >
            <a-tabs
              v-model:activeKey="activeTab"
              class="custom-tabs"
              size="large"
            >
              <!-- Tab 1: 基本信息 -->
              <a-tab-pane key="1" tab="基本信息">
                <div class="pt-4">
                  <div class="flex items-center justify-between mb-8">
                    <h3 class="text-xl font-bold text-slate-900">编辑资料</h3>
                    <a-button size="small" @click="loadData">
                      刷新数据
                    </a-button>
                  </div>

                  <a-form
                    :model="formState"
                    layout="vertical"
                    @finish="onFinish"
                    @finishFailed="onFinishFailed"
                    class="space-y-6"
                  >
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <a-form-item
                        label="用户名"
                        name="username"
                        class="custom-form-item"
                      >
                        <a-input
                          v-model:value="formState.username"
                          disabled
                          class="custom-input"
                        />
                      </a-form-item>

                      <a-form-item
                        label="邮箱地址"
                        name="email"
                        class="custom-form-item"
                      >
                        <a-input
                          v-model:value="formState.email"
                          disabled
                          class="custom-input"
                        />
                      </a-form-item>
                    </div>

                    <a-form-item
                      label="昵称"
                      name="name"
                      :rules="[{ required: true, message: '请输入昵称!' }]"
                      class="custom-form-item"
                    >
                      <a-input
                        v-model:value="formState.name"
                        placeholder="请输入您的昵称"
                        class="custom-input"
                        allow-clear
                      />
                    </a-form-item>

                    <div class="pt-4 flex justify-end">
                      <a-button
                        type="primary"
                        html-type="submit"
                        :loading="loading"
                        size="large"
                        class="w-full md:w-auto"
                      >
                        保存修改
                      </a-button>
                    </div>
                  </a-form>
                </div>
              </a-tab-pane>

              <!-- Tab 2: 账号安全 -->
              <a-tab-pane key="2" tab="账号安全">
                <div class="pt-4">
                  <div class="mb-8">
                    <h3 class="text-xl font-bold text-slate-900">修改密码</h3>
                    <p class="text-slate-500 mt-1 text-sm">
                      为了保障您的账号安全，建议定期更换密码。修改成功后需重新登录。
                    </p>
                  </div>

                  <a-form
                    ref="passwordFormRef"
                    :model="passwordFormState"
                    :rules="passwordRules"
                    layout="vertical"
                    @finish="onChangePassword"
                    class="space-y-6 max-w-lg"
                  >
                    <a-form-item
                      label="当前密码"
                      name="oldPassword"
                      class="custom-form-item"
                    >
                      <a-input-password
                        v-model:value="passwordFormState.oldPassword"
                        placeholder="请输入当前密码"
                        class="custom-input"
                      />
                    </a-form-item>

                    <a-form-item
                      label="新密码"
                      name="newPassword"
                      class="custom-form-item"
                    >
                      <a-input-password
                        v-model:value="passwordFormState.newPassword"
                        placeholder="请输入新密码（至少6位）"
                        class="custom-input"
                      />
                    </a-form-item>

                    <a-form-item
                      label="确认新密码"
                      name="confirmPassword"
                      class="custom-form-item"
                    >
                      <a-input-password
                        v-model:value="passwordFormState.confirmPassword"
                        placeholder="请再次输入新密码"
                        class="custom-input"
                      />
                    </a-form-item>

                    <div class="pt-4">
                      <a-button
                        type="primary"
                        html-type="submit"
                        :loading="passwordLoading"
                        size="large"
                        class="w-full md:w-auto"
                      >
                        确认修改密码
                      </a-button>
                    </div>
                  </a-form>
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { changePasswordAPI } from "@/api/user/user";
import type {
  UpdateProfileParams,
  ChangePasswordParams,
} from "@/api/user/type";
import type { Rule } from "ant-design-vue/es/form";

const router = useRouter();
const authStore = useAuthStore();
const activeTab = ref("1");

// --- Tab 1: Profile ---
const loading = ref(false);
const formState = reactive({
  username: "",
  email: "",
  name: "",
  avatar: "",
});

const loadData = async () => {
  try {
    if (authStore.userInfo) {
      formState.username = authStore.userInfo.username;
      formState.email = authStore.userInfo.email;
      formState.name = authStore.userInfo.name || "";
      formState.avatar = authStore.userInfo.avatar || "";
    }

    const profile = await authStore.fetchProfile();
    formState.username = profile.username;
    formState.email = profile.email;
    formState.name = profile.name || "";
    formState.avatar = profile.avatar || "";
  } catch (error) {
    console.error(error);
  }
};

const onFinish = async (values: any) => {
  loading.value = true;
  try {
    const params: UpdateProfileParams = {
      name: values.name,
      avatar: formState.avatar,
    };
    await authStore.updateProfile(params);
    message.success("个人信息更新成功");
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

// --- Tab 2: Password ---
const passwordLoading = ref(false);

const passwordFormState = reactive<ChangePasswordParams>({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const validateConfirmPassword = async (_rule: Rule, value: string) => {
  if (value === "") {
    return Promise.reject("请再次输入密码");
  } else if (value !== passwordFormState.newPassword) {
    return Promise.reject("两次输入密码不一致!");
  } else {
    return Promise.resolve();
  }
};

const passwordRules: Record<string, Rule[]> = {
  oldPassword: [{ required: true, message: "请输入当前密码", trigger: "blur" }],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, message: "密码长度不能少于6位", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: "blur" },
  ],
};

const onChangePassword = async (values: ChangePasswordParams) => {
  passwordLoading.value = true;
  try {
    await changePasswordAPI(values);
    message.success("密码修改成功，请重新登录");

    // Clear token and redirect to login
    authStore.logout();
    router.push("/login");
  } finally {
    passwordLoading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* Ant Design Customization to match Home Style */
:deep(.ant-form-item-label > label) {
  @apply text-slate-700 font-medium;
}

:deep(.custom-input) {
  @apply rounded-xl border-slate-200 py-2.5 px-4 shadow-sm hover:border-primary-400 focus:border-primary-500 focus:shadow-none transition-all duration-200;
}

/* Ant Design Password Input Specific */
:deep(.ant-input-password .ant-input) {
  @apply rounded-none border-none p-0 shadow-none;
}
:deep(.ant-input-password) {
  @apply rounded-xl border-slate-200 py-2.5 px-4 shadow-sm hover:border-primary-400 focus-within:border-primary-500 focus-within:shadow-none transition-all duration-200;
}

:deep(.ant-input-disabled) {
  @apply bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed;
}

:deep(.ant-input:focus),
:deep(.ant-input-focused) {
  @apply border-primary-500 shadow-none ring-2 ring-primary-100;
}

/* Tabs Customization */
:deep(.ant-tabs-nav) {
  @apply mb-6;
}
:deep(.ant-tabs-tab) {
  @apply text-slate-500 text-base py-3 px-4 transition-all duration-200 hover:text-primary-500 !important;
}
:deep(.ant-tabs-tab-active) {
  @apply text-primary-600 font-bold !important;
}
:deep(.ant-tabs-ink-bar) {
  @apply bg-primary-500 h-[3px] rounded-full !important;
}

/* Animations */
.animate-slide-up {
  opacity: 0;
  animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
