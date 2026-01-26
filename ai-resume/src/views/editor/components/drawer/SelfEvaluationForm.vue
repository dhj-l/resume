<script setup lang="ts">
import BasicEditor from "@/components/basic-editor/basic-editor.vue";
import { useResumeStore } from "@/stores/resumeStore";
import { computed } from "vue";

const store = useResumeStore();

// 使用 computed 的 getter/setter 来实现双向绑定到 store
const content = computed({
  get: () => store.resumeData.selfEvaluation || "",
  set: (val: string) => {
    store.resumeData.selfEvaluation = val;
  },
});
</script>

<template>
  <div class="space-y-4">
    <div
      class="border border-gray-300 rounded min-h-[300px] bg-gray-50 text-gray-400 flex flex-col"
    >
      <BasicEditor class="w-full flex-1" v-model="content" />
    </div>
  </div>
</template>
