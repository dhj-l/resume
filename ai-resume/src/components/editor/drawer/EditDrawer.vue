<template>
  <div
    class="edit-drawer fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.1)] transition-all duration-300 z-40 flex flex-col"
    :style="{ height: isExpanded ? '30vh' : '40px' }"
  >
    <!-- 拖动手柄区域 -->
    <div
      class="drawer-handle h-10 flex items-center justify-center cursor-pointer hover:bg-gray-50 border-t border-gray-200"
      @click="toggleExpand"
      title="点击展开/收起"
    >
      <div class="w-12 h-1.5 bg-gray-300 rounded-full"></div>
    </div>

    <!-- 内容区域 -->
    <div class="drawer-content flex-1 overflow-hidden" v-show="isExpanded">
      <ModuleTabs :resumeData="resumeData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { ResumeData } from "@/stores/type";
import ModuleTabs from "./ModuleTabs.vue";

interface Props {
  resumeData: ResumeData;
}

const props = defineProps<Props>();

const isExpanded = ref(false);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<style scoped>
.edit-drawer {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
</style>
