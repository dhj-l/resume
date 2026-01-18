<template>
  <div class="editor-page min-h-screen bg-gray-50 flex flex-col">
    <!-- 顶部导航栏 -->
    <EditorHeader :resumeTitle="resumeData.title" />

    <!-- 内容区域 (Header高度补偿) -->
    <div class="flex-1 pt-16 pb-12"> <!-- pb-12 为底部抽屉收起状态留白 -->
      <ResumePreview :resumeData="resumeData" />
    </div>

    <!-- 底部编辑抽屉 -->
    <EditDrawer :resumeData="resumeData" />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { mockResumeData } from '@/constants/mockResumeData';
import EditorHeader from '@/components/editor/header/EditorHeader.vue';
import ResumePreview from '@/components/editor/preview/ResumePreview.vue';
import EditDrawer from '@/components/editor/drawer/EditDrawer.vue';

// 使用 mock 数据初始化响应式状态
const resumeData = reactive({ ...mockResumeData });

</script>

<style scoped>
.editor-page {
  /* 防止页面滚动条跳动 */
  overflow-x: hidden;
}
</style>
