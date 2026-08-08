<script setup lang="ts">
import { provide, ref } from "vue";

import { UpOutlined, DownOutlined } from "@ant-design/icons-vue";
import { storeToRefs } from "pinia";

import { useResumeStore } from "@/stores/resumeStore";
import type { ResumeData } from "@/stores/type";
import {
  EDIT_DRAWER_COLLAPSED_HEIGHT,
  EDIT_DRAWER_EXPANDED_HEIGHT,
} from "@/views/editor/constants";

import ModuleTabs from "./drawer/ModuleTabs.vue";

defineProps<{
  resumeData: ResumeData;
}>();
const { isExpanded } = storeToRefs(useResumeStore());
const { setIsExpanded } = useResumeStore();
const drawerHeight = ref(EDIT_DRAWER_EXPANDED_HEIGHT);
const drawerContentRef = ref<HTMLDivElement>();
provide("drawerContentRef", drawerContentRef);

const toggleDrawer = () => {
  setIsExpanded(!isExpanded.value);
};

const handleDragStart = () => {
  // TODO: 实现拖拽调整高度
};
</script>

<template>
  <div
    class="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.08)] transition-all duration-300 z-40 flex flex-col"
    :style="{ height: isExpanded ? drawerHeight : `${EDIT_DRAWER_COLLAPSED_HEIGHT}px` }"
  >
    <!-- 拖拽手柄/标题栏 -->
    <div
      class="h-12 bg-white border-t border-gray-200 flex items-center justify-between px-6 cursor-pointer hover:bg-gray-50 transition-colors shrink-0"
      @click="toggleDrawer"
      @mousedown="handleDragStart"
    >
      <span class="font-medium text-gray-700">简历内容编辑</span>

      <!-- 手柄条 -->
      <div class="w-16 h-1 bg-gray-300 rounded-full absolute left-1/2 -translate-x-1/2"></div>

      <div class="text-gray-400">
        <span class="mr-2 text-xs">{{ isExpanded ? "点击收起" : "点击展开" }}</span>
        <DownOutlined v-if="isExpanded" />
        <UpOutlined v-else />
      </div>
    </div>

    <!-- 内容区域 -->
    <div v-if="isExpanded" ref="drawerContentRef" class="flex-1 overflow-hidden flex flex-col">
      <ModuleTabs :resume-data="resumeData" />
    </div>
  </div>
</template>
