<script setup lang="ts">
import BasicEditor from "@/components/basic-editor/basic-editor.vue";
import { useResumeStore } from "@/stores/resumeStore";

defineProps<{
  data: string;
}>();
const { setResumeDataString } = useResumeStore();

const update = (val: string) => {
  setResumeDataString("selfEvaluation", val);
};
</script>

<template>
  <div class="space-y-4">
    <div
      class="border border-gray-300 rounded min-h-[300px] bg-gray-50 text-gray-400 flex flex-col"
    >
      <BasicEditor
        class="w-full flex-1"
        :modelValue="data"
        @update:modelValue="update"
      />
    </div>
  </div>
</template>
