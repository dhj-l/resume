<script setup lang="ts">
import BasicEditor from "@/components/basic-editor/basic-editor.vue";
import { useResumeStore } from "@/stores/resumeStore";
import { ref, watch } from "vue";

const props = defineProps<{
  data: string;
}>();
const { setResumeDataString } = useResumeStore();
const content = ref(props.data);
watch(content, (newVal) => {
  setResumeDataString("selfEvaluation", newVal);
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
