<script setup lang="ts">
import { useResumeStore } from "@/stores/resumeStore";
import type { EducationBackground } from "@/stores/type";
import type { templateType } from "./type";
import { getEducationBackgroundStyles } from "./EducationBackgroundSection";
import { computed } from "vue";

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
  <div :class="styles.container" @click="handleClick">
    <h3 :class="styles.title">
      {{ label || "教育背景" }}
    </h3>
    <div :class="styles.listWrapper">
      <div
        v-for="(edu, index) in data"
        :key="index"
        :class="styles.itemWrapper"
      >
        <div :class="styles.contentWrapper">
          <div :class="styles.headerWrapper">
            <h4 :class="styles.schoolName">{{ edu.schoolName }}</h4>
            <span :class="styles.timeRange"
              >{{ edu.enrollmentTime }} - {{ edu.graduationTime }}</span
            >
          </div>
          <div :class="styles.detailsWrapper">
            <span>{{ edu.degree }}</span>
            <span>{{ edu.major }}</span>
            <span v-if="edu.majorScore">成绩：{{ edu.majorScore }}</span>
          </div>
          <div
            v-if="edu.majorCourses && edu.majorCourses.length"
            :class="styles.courses"
          >
            主修课程：{{ edu.majorCourses.join("、") }}
          </div>
        </div>
      </div>
      <div v-if="data.length === 0" :class="styles.empty">暂无教育背景信息</div>
    </div>
  </div>
</template>
