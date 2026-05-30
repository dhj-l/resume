<script setup lang="ts">
import { computed } from "vue";

import { useResumeStore } from "@/stores/resumeStore";
import type { SortableModule } from "@/stores/type";

import { getSkillsStyles } from "./SkillsSection";
import type { templateType } from "./type";

const props = defineProps<{
  data?: SortableModule;
  label?: string;
  templateType: templateType;
}>();

const { setCurrentModel, setIsExpanded } = useResumeStore();

const styles = computed(() => getSkillsStyles(props.templateType));

const handleClick = () => {
  setCurrentModel("skills");
  setIsExpanded(true);
};
</script>

<template>
  <!-- 
    v-if="data": 仅在有技能特长内容时渲染
    数据来源: props.data (HTML 字符串)
  -->
  <div v-if="data?.content" :class="styles.container" @click="handleClick">
    <h3 :class="styles.title">
      {{ label || "技能特长" }}
    </h3>
    <div v-if="data?.content" :class="styles.listWrapper" v-safe-html="data.content"></div>
  </div>
</template>
