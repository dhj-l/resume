<script setup lang="ts">
import { computed } from "vue";

import { useResumeStore } from "@/stores/resumeStore";
import type { ProjectExperience } from "@/stores/type";

import { getProjectExperienceStyles } from "./ProjectExperienceSection";
import type { templateType } from "./type";

const props = defineProps<{
  data?: ProjectExperience[];
  label?: string;
  templateType: templateType;
}>();

const { setCurrentModel, setIsExpanded } = useResumeStore();

const styles = computed(() => getProjectExperienceStyles(props.templateType));

const handleClick = () => {
  setCurrentModel("projectExperience");
  setIsExpanded(true);
};
</script>

<template>
  <!-- 
    v-if="data && data.length > 0": 仅在有项目经历数据时渲染
    数据来源: props.data (ProjectExperience 数组)
  -->
  <div v-if="data && data.length > 0" :class="styles.container" @click="handleClick">
    <h3 :class="styles.title">
      {{ label || "项目经历" }}
    </h3>
    <div :class="styles.listWrapper">
      <template v-if="data && data.length">
        <div v-for="(project, index) in data" :key="index" :class="styles.itemWrapper">
          <div :class="styles.headerWrapper">
            <h4 :class="styles.projectName">{{ project.title }}</h4>
            <div :class="styles.role">
              {{ project.description }}
            </div>
            <span :class="styles.timeRange">
              {{ project.startTime }}
              <span v-if="project.endTime">- {{ project.endTime }}</span>
            </span>
          </div>

          <p :class="styles.description" v-html="project.content"></p>
        </div>
      </template>
      <div v-else :class="styles.empty">暂无项目经历信息</div>
    </div>
  </div>
</template>
