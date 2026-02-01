<script setup lang="ts">
import { ref, watch } from "vue";
import { Slider } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { useResumeStore } from "@/stores/resumeStore";

const resumeStore = useResumeStore();
const { resumeData } = storeToRefs(resumeStore);
const { setGlobalStyle } = resumeStore;

// Helper to parse value from string (e.g., "14px" -> 14, "1.5" -> 1.5)
const parseValue = (val: string) => {
  return parseFloat(val) || 0;
};

// Local state for sliders
const fontSize = ref(parseValue(resumeData.value.globalStyle.fontSize));
const moduleMargin = ref(parseValue(resumeData.value.globalStyle.moduleMargin));
const pageMargin = ref(parseValue(resumeData.value.globalStyle.pageMargin));
const lineHeight = ref(parseValue(resumeData.value.globalStyle.lineHeight));

// Watchers to update store
watch(fontSize, (val) => {
  setGlobalStyle({ fontSize: `${val}px` });
});

watch(moduleMargin, (val) => {
  setGlobalStyle({ moduleMargin: `${val}px` });
});

watch(pageMargin, (val) => {
  setGlobalStyle({ pageMargin: `${val}px` });
});

watch(lineHeight, (val) => {
  setGlobalStyle({ lineHeight: `${val}` });
});

// Watch store to update local state (in case of reset or other changes)
watch(
  () => resumeData.value.globalStyle,
  (newStyle) => {
    if (parseValue(newStyle.fontSize) !== fontSize.value) {
      fontSize.value = parseValue(newStyle.fontSize);
    }
    if (parseValue(newStyle.moduleMargin) !== moduleMargin.value) {
      moduleMargin.value = parseValue(newStyle.moduleMargin);
    }
    if (parseValue(newStyle.pageMargin) !== pageMargin.value) {
      pageMargin.value = parseValue(newStyle.pageMargin);
    }
    if (parseValue(newStyle.lineHeight) !== lineHeight.value) {
      lineHeight.value = parseValue(newStyle.lineHeight);
    }
  },
  { deep: true }
);
</script>

<template>
  <div class="w-72 p-2">
    <div class="mb-4">
      <div class="flex justify-between mb-1 text-sm text-gray-700">
        <span>字体大小</span>
        <span>{{ fontSize }}px</span>
      </div>
      <Slider v-model:value="fontSize" :min="12" :max="24" :step="1" />
    </div>

    <div class="mb-4">
      <div class="flex justify-between mb-1 text-sm text-gray-700">
        <span>模块间距</span>
        <span>{{ moduleMargin }}px</span>
      </div>
      <Slider v-model:value="moduleMargin" :min="0" :max="60" :step="2" />
    </div>

    <div class="mb-4">
      <div class="flex justify-between mb-1 text-sm text-gray-700">
        <span>页面边距</span>
        <span>{{ pageMargin }}px</span>
      </div>
      <Slider v-model:value="pageMargin" :min="0" :max="60" :step="4" />
    </div>

    <div class="mb-0">
      <div class="flex justify-between mb-1 text-sm text-gray-700">
        <span>行高</span>
        <span>{{ lineHeight }}</span>
      </div>
      <Slider v-model:value="lineHeight" :min="1.0" :max="3.0" :step="0.1" />
    </div>
  </div>
</template>

<style scoped>
:deep(.ant-slider) {
  margin-bottom: 0;
}
</style>
