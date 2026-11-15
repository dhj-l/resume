<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 顶部操作栏 -->
    <header class="sticky top-0 z-30 bg-white shadow-sm border-b border-slate-200">
      <div class="max-w-[1600px] mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
        <a-button size="small" @click="goBack">返回</a-button>
        <h1 class="text-lg font-semibold text-slate-800">AI 生成对比</h1>
        <div class="flex-1" />
        <a-tag v-if="isGenerating" color="processing">生成中</a-tag>
        <a-tag v-else-if="generationStatus === 'failed'" color="error">生成失败</a-tag>
        <a-tag v-else color="success">生成完成</a-tag>
        <a-button :disabled="isGenerating" @click="useOriginalVersion">使用原版</a-button>
        <a-button type="primary" :disabled="isGenerating" @click="useAiVersion">
          使用 AI 版
        </a-button>
      </div>
    </header>

    <!-- 加载 / 错误 -->
    <div v-if="loading" class="flex justify-center items-center min-h-[60vh]">
      <a-spin size="large" tip="正在加载简历..." />
    </div>
    <div v-else-if="loadError" class="flex flex-col items-center gap-4 py-24 text-center">
      <div class="text-red-500">{{ loadError }}</div>
      <a-button @click="router.push('/user/resumes')">返回我的简历</a-button>
    </div>

    <div v-else class="max-w-[1600px] mx-auto px-4 py-4 space-y-4">
      <!-- 生成状态横幅 -->
      <AiGenerateBanner
        v-if="bannerStatus !== 'none'"
        :status="bannerStatus"
        :current="current"
        :total="total"
        :label="label"
        :error="aiError"
        @dismiss="bannerDismissed = true"
      />

      <!-- 模块状态 -->
      <div class="flex flex-wrap gap-2">
        <a-tag v-for="[key, labelText] in moduleOptions" :key="key" :color="moduleMeta(key).color">
          {{ labelText }} · {{ moduleMeta(key).text }}
        </a-tag>
      </div>

      <!-- 双预览 -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-12">
        <!-- 原版 -->
        <section class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="px-4 py-3 border-b border-slate-100 flex items-center gap-3 bg-slate-50/60">
            <span class="text-sm font-semibold text-slate-700">原版简历</span>
            <span class="text-xs text-slate-400 truncate">{{ originalData?.title }}</span>
          </div>
          <div class="p-6 lg:p-8 bg-slate-50">
            <ResumePreview
              v-if="originalData"
              :data="originalData"
              :preview-only="true"
              :show-generating-badge="false"
              fluid
            />
          </div>
        </section>

        <!-- AI 生成版 -->
        <section class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="px-4 py-3 border-b border-slate-100 flex items-center gap-3 bg-slate-50/60">
            <span class="text-sm font-semibold text-slate-700">AI 生成版</span>
            <span class="text-xs text-slate-400 truncate">{{ aiData?.title }}</span>
            <a-tag v-if="isGenerating" color="processing">生成中</a-tag>
            <a-tag v-else-if="generationStatus === 'failed'" color="error">生成失败</a-tag>
            <a-tag v-else color="success">已完成</a-tag>
          </div>
          <div class="p-6 lg:p-8 bg-slate-50">
            <AiGeneratingOverlay
              v-if="isGenerating"
              status="generating"
              class="mb-5"
              :current="current"
              :total="total"
              :label="label"
              :sticky="false"
            />
            <ResumePreview
              v-if="aiData"
              :data="aiData"
              :preview-only="true"
              :show-generating-badge="false"
              fluid
            />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

import { Modal, message } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";

import { deleteResumeAPI, getResumeDetailAPI } from "@/api/resume/resume";
import type { AiResumeParams } from "@/api/resume/type";
import { SSE_MODULE_KEYS, SSE_MODULE_LABEL_MAP } from "@/api/resume-ai/type";
import AiGeneratingOverlay from "@/components/common/AiGeneratingOverlay.vue";
import { useAiGenerateStore } from "@/stores/aiGenerateStore";
import { mergeAiModuleData, MODULE_DEFAULT_SORT } from "@/stores/resumeStore";
import type { ResumeData } from "@/stores/type";
import { playCelebration } from "@/utils/confetti";
import AiGenerateBanner from "@/views/editor/components/AiGenerateBanner.vue";
import ResumePreview from "@/views/editor/components/ResumePreview.vue";

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 10 * 60 * 1000;

type ModuleState = "generated" | "generating" | "inherited";

const MODULE_STATE_META: Record<ModuleState, { color: string; text: string }> = {
  generated: { color: "success", text: "已生成" },
  generating: { color: "processing", text: "生成中" },
  inherited: { color: "default", text: "继承原版" },
};

const route = useRoute();
const router = useRouter();
const aiGenerate = useAiGenerateStore();
const {
  totalModules: aiTotalModules,
  currentModule: aiCurrentModule,
  moduleLabel: aiModuleLabel,
  completedModules,
  error: aiError,
} = storeToRefs(aiGenerate);

const originalId = computed(() => route.query.originalId as string | undefined);
const draftId = computed(() => route.query.draftId as string | undefined);
const sessionKey = computed(() => (draftId.value ? `ai-generate:${draftId.value}` : ""));

const loading = ref(true);
const loadError = ref("");
const originalData = ref<ResumeData | null>(null);
const aiData = ref<ResumeData | null>(null);
const draftAiStatus = ref("");
const bannerDismissed = ref(false);

let pollTimer: number | null = null;
let pollStartedAt = 0;

/** 从 sessionStorage 恢复生成会话（刷新恢复用） */
const sessionInfo = computed<{ payload?: AiResumeParams; totalModules?: number } | null>(() => {
  if (!sessionKey.value) return null;
  try {
    const raw = sessionStorage.getItem(sessionKey.value);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
});

const selectedModules = computed<string[]>(() => {
  const modules = sessionInfo.value?.payload?.modules;
  if (Array.isArray(modules) && modules.length > 0) return modules;
  return SSE_MODULE_KEYS;
});

const sessionTotal = computed(() => sessionInfo.value?.totalModules ?? 0);

/** store 是否仍持有本次生成会话（正常流程下为 true，刷新后为 false） */
const storeActive = computed(
  () => aiGenerate.resumeId === draftId.value && aiGenerate.status !== "idle",
);

const generationStatus = computed<"generating" | "completed" | "failed">(() => {
  if (storeActive.value) {
    if (aiGenerate.status === "failed") return "failed";
    if (aiGenerate.status === "generating") return "generating";
    return "completed";
  }
  if (draftAiStatus.value === "generating") return "generating";
  if (draftAiStatus.value === "failed") return "failed";
  return "completed";
});

const isGenerating = computed(() => generationStatus.value === "generating");

const bannerStatus = computed<"generating" | "completed" | "failed" | "none">(() => {
  if (bannerDismissed.value) return "none";
  return generationStatus.value;
});

const total = computed(
  () =>
    (storeActive.value && aiTotalModules.value) ||
    sessionTotal.value ||
    selectedModules.value.length,
);

/** 刷新恢复场景：按“数据与原版不同”估算已生成模块数 */
const moduleStateFromDiff = (key: string): ModuleState => {
  if (!selectedModules.value.includes(key)) return "inherited";
  const orig = (originalData.value as unknown as Record<string, unknown> | null)?.[key];
  const ai = (aiData.value as unknown as Record<string, unknown> | null)?.[key];
  if (ai !== undefined && JSON.stringify(ai) !== JSON.stringify(orig)) return "generated";
  return draftAiStatus.value === "generating" ? "generating" : "inherited";
};

const moduleStatus = (key: string): ModuleState => {
  if (!selectedModules.value.includes(key)) return "inherited";
  if (storeActive.value) {
    return completedModules.value[key] !== undefined ? "generated" : "generating";
  }
  return moduleStateFromDiff(key);
};

const moduleMeta = (key: string) => MODULE_STATE_META[moduleStatus(key)];

const current = computed(() => {
  if (storeActive.value) return aiCurrentModule.value;
  return selectedModules.value.filter((key) => moduleStatus(key) === "generated").length;
});

const label = computed(() => aiModuleLabel.value || "");
const moduleOptions = Object.entries(SSE_MODULE_LABEL_MAP);

/** 将已完成模块数据合并进 AI 版预览数据 */
const applyCompletedModules = () => {
  if (!aiData.value) return;
  for (const [key, data] of Object.entries(completedModules.value)) {
    const current = (aiData.value as unknown as Record<string, unknown>)[key];
    (aiData.value as unknown as Record<string, unknown>)[key] = mergeAiModuleData(
      current,
      data,
      MODULE_DEFAULT_SORT[key],
    );
  }
};

const loadData = async () => {
  if (!originalId.value || !draftId.value) {
    loadError.value = "缺少对比参数，请重新发起 AI 生成";
    loading.value = false;
    return;
  }
  try {
    const [origRes, draftRes] = await Promise.all([
      getResumeDetailAPI(originalId.value),
      getResumeDetailAPI(draftId.value),
    ]);
    originalData.value = origRes.data;
    aiData.value = draftRes.data;
    draftAiStatus.value = draftRes.data.aiStatus ?? "";
    // 页面挂载晚于部分/全部模块帧时，先合并已生成的数据
    applyCompletedModules();
  } catch {
    loadError.value = "加载简历失败，请稍后重试";
  } finally {
    loading.value = false;
  }
};

const refreshDraft = async () => {
  if (!draftId.value) return;
  try {
    const { data } = await getResumeDetailAPI(draftId.value);
    aiData.value = data;
    draftAiStatus.value = data.aiStatus ?? "";
  } catch {
    // 轮询失败时保留当前数据，等待下一次轮询
  }
};

const startPolling = () => {
  if (pollTimer !== null) return;
  pollStartedAt = Date.now();
  pollTimer = window.setInterval(async () => {
    await refreshDraft();
    if (draftAiStatus.value !== "generating" || Date.now() - pollStartedAt > POLL_TIMEOUT_MS) {
      stopPolling();
      if (draftAiStatus.value === "generating") {
        draftAiStatus.value = "failed";
      }
    }
  }, POLL_INTERVAL_MS);
};

const stopPolling = () => {
  if (pollTimer !== null) {
    window.clearInterval(pollTimer);
    pollTimer = null;
  }
};

const clearSession = () => {
  if (sessionKey.value) {
    sessionStorage.removeItem(sessionKey.value);
  }
  aiGenerate.clearSession();
};

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/user/resumes");
  }
};

const useAiVersion = () => {
  if (!draftId.value) return;
  clearSession();
  aiGenerate.reset();
  router.push({ path: "/editor", query: { id: draftId.value } });
};

const useOriginalVersion = () => {
  if (!draftId.value || !originalId.value) return;
  Modal.confirm({
    title: "使用原版简历？",
    content: "原简历将直接进入编辑，本次 AI 生成草稿将被删除。",
    okText: "确认使用原版",
    okType: "danger",
    cancelText: "取消",
    onOk: async () => {
      const id = draftId.value;
      const original = originalId.value;
      if (!id || !original) return;
      try {
        await deleteResumeAPI(id);
        clearSession();
        aiGenerate.reset();
        router.push({ path: "/editor", query: { id: original } });
      } catch {
        message.error("删除 AI 草稿失败，请稍后重试");
      }
    },
  });
};

// 新模块生成完成 -> 增量合并到 AI 版预览
watch(completedModules, applyCompletedModules, { deep: true });

watch(generationStatus, (status, prev) => {
  if (status !== "generating") {
    stopPolling();
  }
  if (prev === "generating" && status === "completed") {
    playCelebration();
  }
});

onMounted(async () => {
  await loadData();
  // 刷新恢复：store 无活跃会话且草稿仍在生成中时轮询草稿详情
  if (!storeActive.value && draftAiStatus.value === "generating") {
    startPolling();
  }
});

onBeforeUnmount(stopPolling);
</script>
