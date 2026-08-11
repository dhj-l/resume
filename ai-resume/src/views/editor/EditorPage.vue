<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from "vue";

import { Layout, message } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";

import { useAiGenerateStore } from "@/stores/aiGenerateStore";
import { useResumeStore } from "@/stores/resumeStore";
import { playCelebration } from "@/utils/confetti";

import AiAnalysisDrawer from "./components/AiAnalysisDrawer.vue";
import AiGenerateBanner, { type AiBannerStatus } from "./components/AiGenerateBanner.vue";
import EditDrawer from "./components/EditDrawer.vue";
import EditorHeader from "./components/EditorHeader.vue";
import ResumePreview from "./components/ResumePreview.vue";

const { resumeData } = storeToRefs(useResumeStore());
const { setResumeDataString, mergeAiModule } = useResumeStore();
const aiGenerate = useAiGenerateStore();
const route = useRoute();
const router = useRouter();

const showAiDrawer = ref(false);
const interruptedBanner = ref(false);
const dismissedBanner = ref(false);

const currentResumeId = computed(() => route.query.id as string | undefined);

/** 生成中锁定：当前编辑的正是生成中的草稿 */
const isAiGenerating = computed(
  () =>
    aiGenerate.status === "generating" &&
    !!currentResumeId.value &&
    aiGenerate.resumeId === currentResumeId.value,
);

const aiBannerStatus = computed<AiBannerStatus | "none">(() => {
  if (interruptedBanner.value) return "interrupted";
  if (isAiGenerating.value) return "generating";
  if (
    aiGenerate.status === "completed" &&
    aiGenerate.resumeId === currentResumeId.value &&
    !dismissedBanner.value
  ) {
    return "completed";
  }
  if (
    aiGenerate.status === "failed" &&
    aiGenerate.resumeId === currentResumeId.value &&
    !dismissedBanner.value
  ) {
    return "failed";
  }
  return "none";
});

provide("aiGenerating", isAiGenerating);

// 新模块生成完成 -> 合并进当前简历，预览实时更新
watch(
  () => aiGenerate.completedModules,
  (modules) => {
    // 仅当当前编辑的简历正是生成中的草稿时才合并，避免后台 SSE 把其他简历的模块写进来
    if (aiGenerate.resumeId !== currentResumeId.value) return;
    for (const [key, data] of Object.entries(modules)) {
      mergeAiModule(key, data);
    }
  },
  // immediate：页面挂载晚于部分/全部模块帧时，先合并已生成的数据
  { deep: true, immediate: true },
);

// 刷新恢复：store 无活跃会话 + 简历仍标记 generating + sessionStorage 有会话记录
watch(
  () => resumeData.value.aiStatus,
  (aiStatus) => {
    if (
      aiStatus === "generating" &&
      currentResumeId.value &&
      !aiGenerate.isActive() &&
      sessionStorage.getItem(`ai-generate:${currentResumeId.value}`)
    ) {
      interruptedBanner.value = true;
    }
  },
);

// 生成完成庆祝彩带（仅当前编辑的正是生成中的草稿时）
watch(
  () => aiGenerate.status,
  (newStatus, oldStatus) => {
    if (
      oldStatus === "generating" &&
      newStatus === "completed" &&
      aiGenerate.resumeId === currentResumeId.value
    ) {
      playCelebration();
    }
  },
);

const handleInterruptedConfirm = () => {
  if (currentResumeId.value) {
    sessionStorage.removeItem(`ai-generate:${currentResumeId.value}`);
  }
  interruptedBanner.value = false;
};

const handleBannerDismiss = () => {
  dismissedBanner.value = true;
};

const toggleAiDrawer = () => {
  showAiDrawer.value = !showAiDrawer.value;
};

const handleTitleUpdate = (newTitle: string) => {
  setResumeDataString("title", newTitle);
};

onMounted(() => {
  // 编辑器必须从“我的简历/模板详情”等入口携带简历 id 进入
  if (!route.query.id) {
    message.warning("请先创建或选择一份简历");
    router.replace("/user/resumes");
  }
});
</script>

<template>
  <Layout class="min-h-screen bg-gray-100 flex flex-col overflow-hidden">
    <!-- 顶部导航 -->
    <EditorHeader
      :resume-title="resumeData.title"
      :ai-generating="isAiGenerating"
      @update:resume-title="handleTitleUpdate"
      @toggle-ai-drawer="toggleAiDrawer"
    />

    <!-- AI 生成状态横幅 -->
    <AiGenerateBanner
      v-if="aiBannerStatus !== 'none'"
      class="mt-16"
      :status="aiBannerStatus"
      :current="aiGenerate.currentModule"
      :total="aiGenerate.totalModules"
      :label="aiGenerate.moduleLabel"
      :error="aiGenerate.error"
      @dismiss="handleBannerDismiss"
      @confirm-interrupt="handleInterruptedConfirm"
    />

    <!-- 中间内容区：横幅显示时由横幅占用头栏下方空间，内容区不再叠加 mt-16 -->
    <Layout.Content
      class="flex-1 overflow-y-auto relative custom-scrollbar"
      :class="aiBannerStatus === 'none' ? 'mt-16' : ''"
    >
      <div
        class="min-h-full py-8 pl-4 flex justify-center pb-[35vh] transition-[padding-right] duration-300 ease-in-out"
        :class="showAiDrawer ? 'pr-[420px]' : 'pr-4'"
      >
        <!-- 简历预览区域 -->
        <ResumePreview />
      </div>
    </Layout.Content>

    <!-- AI 分析抽屉 -->
    <AiAnalysisDrawer :visible="showAiDrawer" @close="showAiDrawer = false" />

    <!-- 底部编辑抽屉 -->
    <EditDrawer :resume-data="resumeData" />
  </Layout>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
