<script setup lang="ts">
import { useResumeStore } from "@/stores/resumeStore";
import type { InternshipExperience } from "@/stores/type";
import type { templateType } from "./type";
import { getInternshipExperienceStyles } from "./InternshipExperienceSection";
import { computed } from "vue";

const props = defineProps<{
  data?: InternshipExperience[];
  label?: string;
  templateType: templateType;
}>();

const { setCurrentModel, setIsExpanded } = useResumeStore();

const styles = computed(() => getInternshipExperienceStyles(props.templateType));

const handleClick = () => {
  setCurrentModel("internshipExperience");
  setIsExpanded(true);
};
</script>

<template>
  <div :class="styles.container" @click="handleClick">
    <h3 :class="styles.title">
      {{ label || "实习经历" }}
    </h3>
    <div :class="styles.listWrapper">
      <template v-if="data && data.length">
        <div
          v-for="(internship, index) in data"
          :key="index"
          :class="styles.itemWrapper"
        >
          <div :class="styles.headerWrapper">
            <h4 :class="styles.companyName">{{ internship.companyName }}</h4>
            <div :class="styles.position">
              {{ internship.position }}
            </div>
            <span :class="styles.timeRange">
              {{ internship.startTime }}
              <span v-if="internship.endTime">- {{ internship.endTime }}</span>
            </span>
          </div>

          <p :class="styles.description" v-html="internship.description"></p>
        </div>
      </template>
      <div v-else :class="styles.empty">暂无实习经历信息</div>
    </div>
  </div>
</template>
