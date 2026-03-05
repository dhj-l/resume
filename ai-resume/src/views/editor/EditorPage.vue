<script setup lang="ts">
import { Layout } from "ant-design-vue";
import EditorHeader from "./components/EditorHeader.vue";
import ResumePreview from "./components/ResumePreview.vue";
import EditDrawer from "./components/EditDrawer.vue";

import { storeToRefs } from "pinia";
import { useResumeStore } from "@/stores/resumeStore";
import { provide } from "vue";
const { resumeData } = storeToRefs(useResumeStore());

provide("resumeData", resumeData);
</script>

<template>
  <Layout class="min-h-screen bg-gray-100 flex flex-col overflow-hidden">
    <!-- 顶部导航 -->
    <EditorHeader :resume-title="resumeData.title" />

    <!-- 中间内容区 -->
    <Layout.Content
      class="flex-1 overflow-y-auto mt-16 relative custom-scrollbar"
    >
      <div class="min-h-full py-8 px-4 flex justify-center pb-[35vh]">
        <!-- 简历预览区域 -->
        <ResumePreview />
      </div>
    </Layout.Content>

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
