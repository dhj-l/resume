<script setup lang="ts">
import BasicEditor from "@/components/basic-editor/basic-editor.vue";
import { useResumeStore } from "@/stores/resumeStore";
import type { SortableModule } from "@/stores/type";

const { setSelfEvaluation } = useResumeStore();
defineProps<{
  data: SortableModule;
}>();

const update = (val: string) => {
  setSelfEvaluation({ content: val });
};
</script>

<template>
  <div class="space-y-4">
    <div
      class="border border-gray-300 rounded min-h-[300px] bg-gray-50 text-gray-400 flex flex-col"
    >
      <BasicEditor class="w-full flex-1" :model-value="data.content" @update:model-value="update" />
    </div>
  </div>
</template>
