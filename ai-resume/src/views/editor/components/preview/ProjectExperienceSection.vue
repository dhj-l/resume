<script setup lang="ts">
import { useResumeStore } from "@/stores/resumeStore";
import type { ProjectExperience } from "@/stores/type";
import type { templateType } from "./type";
import { getProjectExperienceStyles } from "./ProjectExperienceSection";
import { computed } from "vue";

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
  <div :class="styles.container" @click="handleClick">
    <h3 :class="styles.title">
      {{ label || "项目经历" }}
    </h3>
    <div :class="styles.listWrapper">
      <template v-if="data && data.length">
        <div
          v-for="(project, index) in data"
          :key="index"
          :class="styles.itemWrapper"
        >
          <div :class="styles.headerWrapper">
            <h4 :class="styles.projectName">{{ project.title }}</h4>
            <span :class="styles.timeRange">
              {{ project.startTime }}
              <span v-if="project.endTime">- {{ project.endTime }}</span>
            </span>
          </div>
          <div :class="styles.role">
            {{ project.description }}
          </div>
          <p :class="styles.description">
            {{ project.content }}
          </p>
        </div>
      </template>
      <div v-else :class="styles.empty">暂无项目经历信息</div>
    </div>
  </div>
</template>
