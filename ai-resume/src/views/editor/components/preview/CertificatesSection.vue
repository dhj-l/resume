<script setup lang="ts">
import { computed } from "vue";

import { useResumeStore } from "@/stores/resumeStore";
import type { SortableModule } from "@/stores/type";
import { usePreviewOnly } from "@/views/editor/hooks/usePreviewOnly";

import { getCertificatesStyles } from "./CertificatesSection";
import type { templateType } from "./type";

const props = defineProps<{
  data?: SortableModule;
  label?: string;
  templateType: templateType;
}>();
const { setCurrentModel, setIsExpanded } = useResumeStore();
const previewOnly = usePreviewOnly();

const styles = computed(() => getCertificatesStyles(props.templateType));

const handleClick = () => {
  if (previewOnly) return;
  setCurrentModel("certificates");
  setIsExpanded(true);
};

// 判断内容是否可见（过滤空标签和纯空白字符）
const isVisible = computed(() => {
  if (!props.data) return false;
  // 1. 移除所有 HTML 标签
  let content = props.data.content?.replace(/<[^>]+>/g, "");
  // 2. 移除常见 HTML 实体空格 (&nbsp;) 和普通空白字符
  content = content?.replace(/&nbsp;/g, "").replace(/\s/g, "");
  // 3. 检查剩余内容是否为空
  return content!.trim().length > 0;
});
</script>

<template>
  <!-- 
    v-if="isVisible": 仅在有实质性内容时渲染（过滤掉空标签如 <p></p>）
    数据来源: props.data (HTML 字符串)
  -->
  <div v-if="isVisible" :class="styles.container" @click="handleClick">
    <h3 :class="styles.title">
      {{ label || "荣誉证书" }}
    </h3>
    <div v-safe-html="data?.content"></div>
  </div>
</template>
