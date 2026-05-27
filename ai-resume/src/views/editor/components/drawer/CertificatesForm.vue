<script setup lang="ts">
import AiPolishButton from "@/components/ai-polish-button/AiPolishButton.vue";
import BasicEditor from "@/components/basic-editor/basic-editor.vue";
import { useResumeStore } from "@/stores/resumeStore";
import type { SortableModule } from "@/stores/type";

const { setCertificates } = useResumeStore();
defineProps<{
  data: SortableModule;
}>();

const update = (val: string) => {
  setCertificates({ content: val });
};
</script>

<template>
  <div class="space-y-4">
    <div
      class="group relative bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
    >
      <div class="flex gap-4 items-center">
        <!-- 主体内容 -->
        <div class="flex-1">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs text-gray-400">证书描述</span>
            <AiPolishButton module-key="certificates" content-field="content" />
          </div>
          <div
            class="border border-gray-300 rounded min-h-[100px] bg-gray-50 text-gray-400 flex flex-col items-center justify-center space-y-2"
          >
            <BasicEditor class="w-full" :model-value="data.content" @update:model-value="update" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
