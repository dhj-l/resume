<script setup lang="ts">
import { computed } from "vue";

import { useResumeStore } from "@/stores/resumeStore";
import type { InternshipExperience } from "@/stores/type";
import { usePreviewOnly } from "@/views/editor/hooks/usePreviewOnly";

import { getInternshipExperienceStyles } from "./InternshipExperienceSection";
import type { templateType } from "./type";

const props = defineProps<{
  data?: InternshipExperience[];
  label?: string;
  templateType: templateType;
}>();

const { setCurrentModel, setIsExpanded } = useResumeStore();
const previewOnly = usePreviewOnly();

const styles = computed(() => getInternshipExperienceStyles(props.templateType));

const handleClick = () => {
  if (previewOnly) return;
  setCurrentModel("internshipExperience");
  setIsExpanded(true);
};
</script>

<template>
  <!-- 
    v-if="data && data.length > 0": 仅在有实习经历数据时渲染
    数据来源: props.data (InternshipExperience 数组)
  -->
  <div v-if="data && data.length > 0" :class="styles.container" @click="handleClick">
    <h3 :class="styles.title">
      <component :is="styles.titleIcon" v-if="styles.titleIcon" :class="styles.titleIconClass" />
      {{ label || "实习经历" }}
    </h3>
    <div :class="styles.listWrapper">
      <template v-if="data && data.length">
        <div v-for="(internship, index) in data" :key="index" :class="styles.itemWrapper">
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

          <p v-safe-html="internship.description" :class="styles.description"></p>
        </div>
      </template>
      <div v-else :class="styles.empty">暂无实习经历信息</div>
    </div>
  </div>
</template>
