<script setup lang="ts">
import BasicEditor from "@/components/basic-editor/basic-editor.vue";
import { useResumeStore } from "@/stores/resumeStore";
const { setResumeDataString } = useResumeStore();
defineProps<{
  data: string;
}>();

const update = (val: string) => {
  setResumeDataString("certificates", val);
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
          <div
            class="border border-gray-300 rounded min-h-[100px] bg-gray-50 text-gray-400 flex flex-col items-center justify-center space-y-2"
          >
            <BasicEditor :modelValue="data" @update:modelValue="update" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
