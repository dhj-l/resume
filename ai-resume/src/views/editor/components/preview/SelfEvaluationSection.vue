<script setup lang="ts">
import { computed } from "vue";

import { useResumeStore } from "@/stores/resumeStore";
import type { SortableModule } from "@/stores/type";
import { usePreviewOnly } from "@/views/editor/hooks/usePreviewOnly";

import { getSelfEvaluationStyles } from "./SelfEvaluationSection";
import type { templateType } from "./type";

const props = defineProps<{
  data?: SortableModule;
  label?: string;
  templateType: templateType;
}>();

const { setCurrentModel, setIsExpanded } = useResumeStore();
const previewOnly = usePreviewOnly();

const styles = computed(() => getSelfEvaluationStyles(props.templateType));

const handleClick = () => {
  if (previewOnly) return;
  setCurrentModel("selfEvaluation");
  setIsExpanded(true);
};
</script>

<template>
  <!-- 
    v-if="data": 仅在有自我评价内容时渲染
    数据来源: props.data (HTML 字符串)
  -->
  <div v-if="data?.content" :class="styles.container" @click="handleClick">
    <h3 :class="styles.title">
      <component :is="styles.titleIcon" v-if="styles.titleIcon" :class="styles.titleIconClass" />
      {{ label || "自我评价" }}
    </h3>
    <div v-if="data?.content" v-safe-html="data.content" :class="styles.content"></div>
    <div v-else :class="styles.empty">暂无自我评价信息</div>
  </div>
</template>
