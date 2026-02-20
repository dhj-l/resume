<template>
  <div class="container mx-auto max-w-6xl px-4 pt-28 pb-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div
        class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"
      ></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500 mb-4">{{ error }}</p>
      <button
        @click="router.push('/templates')"
        class="text-primary-600 hover:underline"
      >
        返回列表
      </button>
    </div>

    <!-- Content -->
    <div
      v-else-if="template"
      class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
    >
      <!-- Left: Preview -->
      <div
        class="lg:col-span-5 lg:col-start-2 bg-slate-50 rounded-xl overflow-hidden shadow-md border border-slate-200 group"
      >
        <div class="relative overflow-hidden bg-slate-100 aspect-[210/297] p-4">
          <img
            :src="getFullImageUrl(template.previewImage)"
            :alt="template.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02] shadow-sm rounded"
          />
        </div>
      </div>

      <!-- Right: Info -->
      <div class="lg:col-span-5 flex flex-col">
        <div class="mb-6">
          <div class="flex items-center gap-3 mb-3">
            <span
              class="inline-flex items-center px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
            >
              {{ template.category }}
            </span>
            <span class="text-slate-400 text-xs">
              ID: {{ template._id.slice(-6) }}
            </span>
          </div>

          <h1 class="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
            {{ template.name }}
          </h1>

          <div class="flex items-center gap-5 text-slate-500 text-sm">
            <div class="flex items-center gap-1.5">
              <Calendar class="w-4 h-4" />
              <span>{{ formatDate(template.createdAt) }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <Users class="w-4 h-4" />
              <span>{{ template.usedCount }} 使用</span>
            </div>
          </div>
        </div>

        <!-- Author Info -->
        <div
          class="flex items-center gap-3 mb-6 p-3 bg-slate-50/50 rounded-lg border border-slate-100"
        >
          <div
            class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-lg"
          >
            {{ template.user.username.charAt(0).toUpperCase() }}
          </div>
          <div>
            <p class="text-sm font-medium text-slate-900">
              {{ template.user.username }}
            </p>
            <p class="text-xs text-slate-500">{{ template.user.email }}</p>
          </div>
        </div>

        <!-- Description -->
        <div
          class="prose prose-slate prose-sm mb-8 text-slate-600 leading-relaxed"
        >
          <p>
            这是一款专业的{{
              template.category
            }}简历模板，设计简洁大方，重点突出。
            适合各类求职场景，帮助您在众多候选人中脱颖而出。
          </p>
        </div>

        <!-- Actions -->
        <div class="mt-auto flex flex-col gap-3">
          <a-button
            type="primary"
            size="large"
            block
            :loading="isImporting"
            class="flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-violet-600 to-indigo-600 border-none hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20"
            @click="handleAiCreate"
          >
            <template #icon v-if="!isImporting">
              <Sparkles class="w-4 h-4" />
            </template>
            AI 帮我写
          </a-button>

          <a-button
            type="primary"
            size="large"
            block
            :loading="isCreating"
            @click="handleUseTemplate"
            class="flex items-center justify-center gap-2 h-12"
          >
            <template #icon v-if="!isCreating">
              <Edit3 class="w-4 h-4" />
            </template>
            {{ isCreating ? "正在创建..." : "立即使用该模板" }}
          </a-button>

          <a-button
            size="large"
            block
            @click="router.push('/templates')"
            class="flex items-center justify-center gap-2 h-12"
          >
            返回列表
          </a-button>
        </div>
      </div>
    </div>
    <AiCreateDialog
      v-model:open="aiDialogOpen"
      :loading="isAiCreating"
      @submit="handleAiSubmit"
    />
    <CreateModeDialog
      v-model:open="createModeOpen"
      @select="handleModeSelect"
    />
    <SelectResumeDialog
      v-model:open="selectResumeOpen"
      @submit="handleSelectResumeSubmit"
      @create-new="handleCreateNew"
    />
    <UploadResumeDialog
      v-model:open="uploadResumeOpen"
      @submit="handleUploadResumeSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getTemplateByIdAPI } from "@/api/templates/templates";
import { createResumeAPI } from "@/api/resume/resume";
import type { TemplateDetails } from "@/api/templates/type";
import { Calendar, Users, Edit3, Sparkles } from "lucide-vue-next";
import { getFullImageUrl } from "@/utils/image";
import { formatDate } from "@/utils/day";
import AiCreateDialog from "./components/AiCreateDialog.vue";
import CreateModeDialog from "./components/CreateModeDialog.vue";
import SelectResumeDialog from "./components/SelectResumeDialog.vue";
import UploadResumeDialog from "./components/UploadResumeDialog.vue";
import { message } from "ant-design-vue";

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const isCreating = ref(false);
const isAiCreating = ref(false);
const isImporting = ref(false); // For Select/Upload flows

// Dialog states
const createModeOpen = ref(false);
const aiDialogOpen = ref(false);
const selectResumeOpen = ref(false);
const uploadResumeOpen = ref(false);

const error = ref("");
const template = ref<TemplateDetails | null>(null);

const fetchTemplate = async () => {
  try {
    loading.value = true;
    error.value = "";
    const id = route.params.id as string;
    if (!id) throw new Error("Template ID is missing");

    const { data } = await getTemplateByIdAPI(id);
    template.value = data;
  } catch (err) {
    error.value = "获取模板详情失败，请稍后重试";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleUseTemplate = async () => {
  if (!template.value || isCreating.value) return;

  try {
    isCreating.value = true;
    const { data } = await createResumeAPI({
      templateId: template.value._id,
      type: template.value.resume.type,
    });

    if (data && data._id) {
      router.push({
        path: "/editor",
        query: { id: data._id },
      });
    }
  } finally {
    isCreating.value = false;
  }
};

const handleAiCreate = () => {
  createModeOpen.value = true;
};

const handleModeSelect = (mode: "manual" | "select" | "upload") => {
  createModeOpen.value = false;
  if (mode === "manual") {
    aiDialogOpen.value = true;
  } else if (mode === "select") {
    selectResumeOpen.value = true;
  } else if (mode === "upload") {
    uploadResumeOpen.value = true;
  }
};

const handleAiSubmit = async (data: any) => {
  if (!template.value) return;

  try {
    isAiCreating.value = true;
    const { data: resData } = await createResumeAPI({
      templateId: template.value._id,
      aiContext: data,
    });

    if (resData && resData._id) {
      message.success("AI 简历生成成功");
      router.push({
        path: "/editor",
        query: { id: resData._id },
      });
      aiDialogOpen.value = false;
    }
  } catch (err) {
    console.error("Failed to create AI resume:", err);
    message.error("生成失败，请重试");
  } finally {
    isAiCreating.value = false;
  }
};

const handleSelectResumeSubmit = async (resumeId: string) => {
  console.log("resumeId", resumeId);
};

const handleUploadResumeSubmit = async (data: any) => {
  if (!template.value) return;

  uploadResumeOpen.value = false; // Close dialog immediately
  isImporting.value = true;

  try {
    const { data: newResume } = await createResumeAPI({
      templateId: template.value._id,
      ...data,
    });

    if (newResume && newResume._id) {
      message.success("导入并创建成功");
      router.push({
        path: "/editor",
        query: { id: newResume._id },
      });
    }
  } catch (err) {
    console.error("Failed to create from upload:", err);
    message.error("创建失败，请重试");
  } finally {
    isImporting.value = false;
  }
};

const handleCreateNew = () => {
  selectResumeOpen.value = false;
  aiDialogOpen.value = true; // Redirect to manual input
};

onMounted(() => {
  fetchTemplate();
});
</script>
