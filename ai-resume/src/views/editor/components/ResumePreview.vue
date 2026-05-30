<script setup lang="ts">
import { watch } from "vue";

import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

import { useResumeStore } from "@/stores/resumeStore";
import { templateList } from "@/views/editor/templates/index";

const { resumeData, globalFontSize, globalLineHeight } = storeToRefs(useResumeStore());
const { getResumeDetail } = useResumeStore();

const route = useRoute();
watch(
  () => route.query.id,
  (newVal) => {
    if (newVal) {
      getResumeDetail(newVal as string);
    }
  },
  {
    immediate: true,
  },
);
</script>
<!-- 
  这里只展示模板，不涉及复杂的逻辑。
-->
<template>
  <div
    class="resume-preview-wrapper w-[210mm]"
    :style="{
      lineHeight: globalLineHeight,
      '--resume-fs': globalFontSize,
      '--resume-lh': globalLineHeight,
    }"
  >
    <template v-for="item in templateList" :key="item.value">
      <component :is="item.component" v-if="item.value === resumeData.type" />
    </template>
  </div>
</template>

<style>
.resume-preview-wrapper {
  ul {
    list-style-type: disc;
    padding-left: 20px;
    margin: 8px 0;
    line-height: inherit;
  }

  ol {
    list-style-type: decimal;
    padding-left: 20px;
    margin: 8px 0;
    line-height: inherit;
  }

  :deep(li) {
    line-height: inherit;
    margin-bottom: 4px;

    p {
      margin: 0;
    }
  }

  /* 覆盖子组件 Tailwind 固定字号，使用 globalStyle */
  .text-xs, .text-sm, .text-base, .text-lg,
  .text-xl, .text-2xl, .text-3xl, .text-4xl {
    font-size: var(--resume-fs) !important;
  }
  .leading-relaxed, .leading-\[1\.7\], .leading-\[1\.8\] {
    line-height: var(--resume-lh) !important;
  }

  /* 覆盖富文本 (v-safe-html) 中的内联 font-size / line-height */
  p[style], span[style], li[style], strong[style], em[style],
  h1[style], h2[style], h3[style], h4[style], h5[style] {
    font-size: inherit !important;
    line-height: inherit !important;
  }
}
</style>
