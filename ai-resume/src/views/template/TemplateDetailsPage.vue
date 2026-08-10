<template>
  <div class="container mx-auto max-w-6xl px-4 pt-28 pb-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500 mb-4">{{ error }}</p>
      <button class="text-primary-600 hover:underline" @click="router.push('/templates')">
        返回列表
      </button>
    </div>

    <!-- Content -->
    <div v-else-if="template" class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
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
            <span class="text-slate-400 text-xs"> ID: {{ template._id.slice(-6) }} </span>
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
        <div class="prose prose-slate prose-sm mb-8 text-slate-600 leading-relaxed">
          <p>
            这是一款专业的{{ template.category }}简历模板，设计简洁大方，重点突出。
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
            <template v-if="!isImporting" #icon>
              <Sparkles class="w-4 h-4" />
            </template>
            AI 帮我写
          </a-button>

          <a-button
            type="primary"
            size="large"
            block
            :loading="isCreating"
            class="flex items-center justify-center gap-2 h-12"
            @click="handleUseTemplate"
          >
            <template v-if="!isCreating" #icon>
              <Edit3 class="w-4 h-4" />
            </template>
            {{ isCreating ? "正在创建..." : "立即使用该模板" }}
          </a-button>

          <a-button
            size="large"
            block
            :loading="isImportingResume"
            class="flex items-center justify-center gap-2 h-12"
            @click="handleImportResume"
          >
            <template v-if="!isImportingResume" #icon>
              <Upload class="w-4 h-4" />
            </template>
            导入已有简历
          </a-button>

          <a-button
            size="large"
            block
            class="flex items-center justify-center gap-2 h-12"
            @click="router.push('/templates')"
          >
            返回列表
          </a-button>
        </div>
      </div>
    </div>
    <AiCreateDialog v-model:open="aiDialogOpen" :loading="isAiCreating" @submit="handleAiSubmit" />
    <CreateModeDialog v-model:open="createModeOpen" @select="handleModeSelect" />
    <SelectResumeDialog
      v-model:open="selectResumeOpen"
      :submitting="isImporting"
      @submit="handleSelectResumeSubmit"
      @create-new="handleCreateNew"
    />
    <UploadResumeDialog
      v-model:open="uploadResumeOpen"
      :submitting="isImporting"
      @submit="handleUploadResumeSubmit"
    />
    <ImportResumeDialog
      v-model:open="importResumeOpen"
      :submitting="isImportingResume"
      @submit="handleImportResumeSubmit"
    />
    <FullScreenLoading v-model:loading="isGlobalLoading" :progress="aiProgress" :timeout="600000" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

import { message } from "ant-design-vue";
import { Calendar, Users, Edit3, Sparkles, Upload } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";

import { createResumeAPI, importResumeAPI } from "@/api/resume/resume";
import type { AiResumeParams } from "@/api/resume/type";
import { getTemplateByIdAPI } from "@/api/templates/templates";
import type { TemplateDetails } from "@/api/templates/type";
import FullScreenLoading from "@/components/common/FullScreenLoading.vue";
import { useAiGenerateStore } from "@/stores/aiGenerateStore";
import { formatDate } from "@/utils/day";
import { getFullImageUrl } from "@/utils/image";

import AiCreateDialog from "./components/AiCreateDialog.vue";
import CreateModeDialog from "./components/CreateModeDialog.vue";
import ImportResumeDialog from "./components/ImportResumeDialog.vue";
import SelectResumeDialog from "./components/SelectResumeDialog.vue";
import UploadResumeDialog from "./components/UploadResumeDialog.vue";

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const isCreating = ref(false);
const isAiCreating = ref(false);
const isImporting = ref(false);
const isImportingResume = ref(false);
const isGlobalLoading = ref(false);
const aiGenerateStore = useAiGenerateStore();

const createModeOpen = ref(false);
const aiDialogOpen = ref(false);
const selectResumeOpen = ref(false);
const uploadResumeOpen = ref(false);
const importResumeOpen = ref(false);

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

const pushToEditor = (resumeId: string) => {
  router.push({
    path: "/editor",
    query: { id: resumeId },
  });
};

const aiProgress = ref<{ current: number; total: number; label: string } | null>(null);

interface RunAiGenerateOptions {
  successText?: string;
  onComplete?: () => void;
  onFinally?: () => void;
}

/**
 * 统一处理 AI 生成：收到 init（草稿已创建）后立即跳转编辑页，
 * 生成在后台继续并由 aiGenerateStore 维护，编辑页实时渲染。
 */
const runAiGenerate = async (payload: AiResumeParams, options: RunAiGenerateOptions = {}) => {
  const { successText = "AI 简历生成成功", onComplete, onFinally } = options;
  // startGeneration 返回本次调用是否仍是最近一代；被新调用取代时为 false
  let isCurrent = true;

  isGlobalLoading.value = true;
  aiProgress.value = null;

  try {
    isCurrent = await aiGenerateStore.startGeneration(payload, (resumeId) => {
      // 持久化 payload，供刷新后检测生成中断
      sessionStorage.setItem(
        `ai-generate:${resumeId}`,
        JSON.stringify({
          payload,
          startedAt: Date.now(),
          totalModules: aiGenerateStore.totalModules,
        }),
      );
      if (payload.parseType === "select") {
        // 选择已有简历：进入对比页，原版 vs AI 版实时对比，完成后再选择版本
        router.push({
          path: "/compare",
          query: { originalId: payload.resumeId, draftId: resumeId },
        });
      } else {
        pushToEditor(resumeId);
      }
    });

    // startGeneration 在 complete / error 后返回；已被新调用取代则不再处理本次收尾
    if (!isCurrent) return;

    if (aiGenerateStore.status === "completed") {
      message.success(successText);
      onComplete?.();
    } else if (aiGenerateStore.status === "failed") {
      message.error(aiGenerateStore.error || "AI 生成失败");
    }
  } finally {
    // 仅当前代次负责收尾，避免旧调用清掉新调用的 isGlobalLoading
    if (isCurrent) {
      aiProgress.value = null;
      isGlobalLoading.value = false;
      onFinally?.();
    }
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
      pushToEditor(data._id);
    }
  } catch {
    // 错误提示已由请求拦截器统一处理
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
  if (!template.value || isGlobalLoading.value) return;

  isAiCreating.value = true;
  await runAiGenerate(
    {
      parseType: "manual",
      jobDescription: data.jd,
      detailInfo: { ...data.userInfo, supplementary: data.supplementary },
      templateType: template.value.resume.type,
      modules: data.modules,
    },
    {
      successText: "AI 简历生成成功",
      onComplete: () => {
        aiDialogOpen.value = false;
      },
      onFinally: () => {
        isAiCreating.value = false;
      },
    },
  );
};

const handleSelectResumeSubmit = async (payload: {
  jd: string;
  resumeId: string;
  modules: string[];
}) => {
  if (!template.value || isGlobalLoading.value) return;

  isImporting.value = true;
  await runAiGenerate(
    {
      parseType: "select",
      jobDescription: payload.jd,
      resumeId: payload.resumeId,
      templateType: template.value.resume.type,
      modules: payload.modules,
    },
    {
      successText: "基于已有简历生成成功",
      onComplete: () => {
        selectResumeOpen.value = false;
      },
      onFinally: () => {
        isImporting.value = false;
      },
    },
  );
};

const handleUploadResumeSubmit = async (payload: {
  resumeText: string;
  jdText: string;
  modules: string[];
}) => {
  if (!template.value || isGlobalLoading.value) return;

  isImporting.value = true;
  await runAiGenerate(
    {
      parseType: "upload",
      jobDescription: payload.jdText,
      resumeContent: payload.resumeText,
      templateType: template.value.resume.type,
      modules: payload.modules,
    },
    {
      successText: "生成成功",
      onComplete: () => {
        uploadResumeOpen.value = false;
      },
      onFinally: () => {
        isImporting.value = false;
      },
    },
  );
};

const handleCreateNew = () => {
  selectResumeOpen.value = false;
  aiDialogOpen.value = true;
};

const handleImportResume = () => {
  importResumeOpen.value = true;
};

const handleImportResumeSubmit = async (payload: { resumeText: string }) => {
  if (!template.value || isGlobalLoading.value) return;
  isImportingResume.value = true;
  isGlobalLoading.value = true;

  try {
    const { data: resData } = await importResumeAPI({
      templateType: template.value.resume.type,
      templateId: template.value._id,
      resumeContent: payload.resumeText,
    });

    if (resData && resData._id) {
      message.success("简历导入成功");
      pushToEditor(resData._id);
      importResumeOpen.value = false;
    }
  } catch {
    // 错误提示已由请求拦截器统一处理
  } finally {
    isImportingResume.value = false;
    isGlobalLoading.value = false;
  }
};

onMounted(() => {
  fetchTemplate();
});
</script>
