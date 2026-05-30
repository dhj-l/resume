<script setup lang="ts">
import { computed } from "vue";

import { useResumeStore } from "@/stores/resumeStore";
import type { EducationBackground } from "@/stores/type";

import { getEducationBackgroundStyles } from "./EducationBackgroundSection";
import type { templateType } from "./type";

const props = defineProps<{
  data: EducationBackground[];
  label?: string;
  templateType: templateType;
}>();

const { setCurrentModel, setIsExpanded } = useResumeStore();

const styles = computed(() => getEducationBackgroundStyles(props.templateType));

const handleClick = () => {
  setCurrentModel("educationBackground");
  setIsExpanded(true);
};
</script>

<template>
  <!-- 
    v-if="data && data.length > 0": 仅在有教育背景数据时渲染
    数据来源: props.data (EducationBackground 数组)
  -->
  <div v-if="data && data.length > 0" :class="styles.container" @click="handleClick">
    <h3 :class="styles.title">
      {{ label || "教育背景" }}
    </h3>
    <div :class="styles.listWrapper">
      <div v-for="(edu, index) in data" :key="index" :class="styles.itemWrapper">
        <div :class="styles.contentWrapper">
          <div :class="styles.headerWrapper">
            <h4 :class="styles.schoolName">
              {{ edu.schoolName }}
              <span>{{ edu.degree ? `  (${edu.degree})` : "" }}</span>
            </h4>
            <span>{{ edu.major }}</span>
            <span :class="styles.timeRange"
              >{{ edu.enrollmentTime }} - {{ edu.graduationTime }}</span
            >
          </div>
          <div :class="styles.detailsWrapper">
            <div v-safe-html="edu.content"></div>
          </div>
        </div>
      </div>
      <div v-if="data.length === 0" :class="styles.empty">暂无教育背景信息</div>
    </div>
  </div>
</template>
