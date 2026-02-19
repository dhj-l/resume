<script setup lang="ts">
import { useResumeStore } from "@/stores/resumeStore";
import type { CampusExperience } from "@/stores/type";
import type { templateType } from "./type";
import { getCampusExperienceStyles } from "./CampusExperienceSection";
import { computed } from "vue";

const props = defineProps<{
  data?: CampusExperience[];
  label?: string;
  templateType: templateType;
}>();

const { setCurrentModel, setIsExpanded } = useResumeStore();

const styles = computed(() => getCampusExperienceStyles(props.templateType));

const handleClick = () => {
  setCurrentModel("campusExperience");
  setIsExpanded(true);
};
</script>

<template>
  <div :class="styles.container" @click="handleClick">
    <h3 :class="styles.title">
      {{ label || "校园经历" }}
    </h3>
    <div :class="styles.listWrapper">
      <template v-if="data && data.length">
        <div
          v-for="(experience, index) in data"
          :key="index"
          :class="styles.itemWrapper"
        >
          <div :class="styles.headerWrapper">
            <h4 :class="styles.projectName">{{ experience.title }}</h4>
            <div :class="styles.role">
              {{ experience.description }}
            </div>
            <span :class="styles.timeRange">
              {{ experience.startTime }}
              <span v-if="experience.endTime">- {{ experience.endTime }}</span>
            </span>
          </div>

          <p :class="styles.description" v-html="experience.content"></p>
        </div>
      </template>
      <div v-else :class="styles.empty">暂无校园经历信息</div>
    </div>
  </div>
</template>
