<script setup lang="ts">
import { useResumeStore } from "@/stores/resumeStore";
import type { templateType } from "./type";
import { getSkillsStyles } from "./SkillsSection";
import { computed } from "vue";

const props = defineProps<{
  data?: string[];
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
  <div :class="styles.container" @click="handleClick">
    <h3 :class="styles.title">
      {{ label || "技能特长" }}
    </h3>
    <div v-if="data && data.length" :class="styles.listWrapper">
      <span v-for="(skill, index) in data" :key="index" :class="styles.item">
        {{ skill }}
      </span>
    </div>
    <div v-else :class="styles.empty">暂无技能特长信息</div>
  </div>
</template>
