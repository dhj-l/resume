<script setup lang="ts">
import { useResumeStore } from "@/stores/resumeStore";
import type { JobIntention } from "@/stores/type";
import type { templateType } from "./type";
import { getJobIntentionStyles } from "./JobIntentionSection";
import { computed } from "vue";

const props = defineProps<{
  data?: JobIntention;
  label?: string;
  templateType: templateType;
}>();

const { setCurrentModel, setIsExpanded } = useResumeStore();

const styles = computed(() => getJobIntentionStyles(props.templateType));

const handleClick = () => {
  setCurrentModel("jobIntention");
  setIsExpanded(true);
};
</script>

<template>
  <div :class="styles.container" @click="handleClick">
    <h3 :class="styles.title">
      {{ label || "求职意向" }}
    </h3>
    <div :class="styles.contentWrapper" v-if="data">
      <div :class="styles.item">
        <span :class="styles.label">期望职位：</span>
        <span :class="styles.value">{{ data.jobIntention }}</span>
      </div>
      <div :class="styles.item">
        <span :class="styles.label">期望城市：</span>
        <span :class="styles.value">{{ data.intentionCity }}</span>
      </div>
    </div>
    <div v-else :class="styles.empty">暂无求职意向信息</div>
  </div>
</template>
