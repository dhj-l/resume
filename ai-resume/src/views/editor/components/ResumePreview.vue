<script setup lang="ts">
import { computed, provide, watch } from "vue";

import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

import AiGeneratingOverlay from "@/components/common/AiGeneratingOverlay.vue";
import { useAiGenerateStore } from "@/stores/aiGenerateStore";
import { useResumeStore } from "@/stores/resumeStore";
import type { ResumeData } from "@/stores/type";
import { PREVIEW_ONLY_KEY } from "@/views/editor/hooks/usePreviewOnly";
import { useResumeView } from "@/views/editor/hooks/useResumeView";
import { templateList } from "@/views/editor/templates/index";

const props = withDefaults(
  defineProps<{
    /** 传入独立数据源（对比页双预览）；缺省使用全局简历 store */
    data?: ResumeData;
    /** 预览态：点击模块不触发编辑器选中/展开 */
    previewOnly?: boolean;
    /** 是否显示 AI 生成中悬浮标注（编辑器内为 true） */
    showGeneratingBadge?: boolean;
    /** 自适应面板宽度（对比页双预览使用）；缺省保持 A4 210mm 固定宽度 */
    fluid?: boolean;
  }>(),
  {
    previewOnly: false,
    showGeneratingBadge: true,
    fluid: false,
  },
);

const { resumeData: storeResumeData } = storeToRefs(useResumeStore());
const { getResumeDetail } = useResumeStore();
const aiGenerate = useAiGenerateStore();

const route = useRoute();

const previewData = computed<ResumeData>(() => props.data ?? storeResumeData.value);
provide("resumeData", previewData);
provide(PREVIEW_ONLY_KEY, props.previewOnly);

const { globalFontSize, globalLineHeight } = useResumeView(previewData);

watch(
  () => route.query.id,
  (newVal) => {
    // 仅在编辑器路由内监听：离开编辑页（如跳转 /analysis-detail）时，
    // 该组件仍处于 out-in 过渡的挂载期，query.id 已变成其他页面的 id，
    // 若不限定路由，会把分析记录 ID 误当成简历 ID 请求，触发 404 提示。
    if (route.name === "Editor" && newVal) {
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
  <div class="flex flex-col items-center gap-3">
    <!-- AI 生成中：动画卡片（不遮挡预览） -->
    <AiGeneratingOverlay
      v-if="showGeneratingBadge && aiGenerate.status === 'generating'"
      :status="aiGenerate.status"
      :current="aiGenerate.currentModule"
      :total="aiGenerate.totalModules"
      :label="aiGenerate.moduleLabel"
    />

    <div
      class="resume-preview-wrapper"
      :class="fluid ? 'w-full' : 'w-[210mm]'"
      :style="{
        lineHeight: globalLineHeight,
        '--resume-fs': globalFontSize,
        '--resume-lh': globalLineHeight,
      }"
    >
      <template v-for="item in templateList" :key="item.value">
        <component :is="item.component" v-if="item.value === previewData.type" />
      </template>
    </div>
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
  .text-xs,
  .text-sm,
  .text-base,
  .text-lg,
  .text-xl,
  .text-2xl {
    font-size: var(--resume-fs) !important;
  }
  .leading-relaxed,
  .leading-\[1\.7\],
  .leading-\[1\.8\] {
    line-height: var(--resume-lh) !important;
  }

  /* 覆盖富文本 (v-safe-html) 中的内联 font-size / line-height */
  p[style],
  span[style],
  li[style],
  strong[style],
  em[style],
  h1[style],
  h2[style],
  h3[style],
  h4[style],
  h5[style] {
    font-size: inherit !important;
    line-height: inherit !important;
  }
}
</style>
