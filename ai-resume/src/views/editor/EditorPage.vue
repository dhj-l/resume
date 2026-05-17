<script setup lang="ts">
import { provide, ref } from "vue";

import { Layout } from "ant-design-vue";
import { storeToRefs } from "pinia";

import { useResumeStore } from "@/stores/resumeStore";

import AiAnalysisDrawer from "./components/AiAnalysisDrawer.vue";
import EditDrawer from "./components/EditDrawer.vue";
import EditorHeader from "./components/EditorHeader.vue";
import ResumePreview from "./components/ResumePreview.vue";

const { resumeData } = storeToRefs(useResumeStore());
const { setResumeDataString } = useResumeStore();

const showAiDrawer = ref(false);

const toggleAiDrawer = () => {
  showAiDrawer.value = !showAiDrawer.value;
};

provide("resumeData", resumeData);

const handleTitleUpdate = (newTitle: string) => {
  setResumeDataString("title", newTitle);
};
</script>

<template>
  <Layout class="min-h-screen bg-gray-100 flex flex-col overflow-hidden">
    <!-- 顶部导航 -->
    <EditorHeader
      :resume-title="resumeData.title"
      @update:resume-title="handleTitleUpdate"
      @toggle-ai-drawer="toggleAiDrawer"
    />

    <!-- 中间内容区 -->
    <Layout.Content class="flex-1 overflow-y-auto mt-16 relative custom-scrollbar">
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
