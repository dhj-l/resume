<script setup lang="ts">
import { computed } from "vue";

import { useResumeStore } from "@/stores/resumeStore";
import type { WorkExperience } from "@/stores/type";
import { usePreviewOnly } from "@/views/editor/hooks/usePreviewOnly";

import type { templateType } from "./type";
import { getWorkExperienceStyles } from "./WorkExperienceSection";

const props = defineProps<{
  data?: WorkExperience[];
  label?: string;
  templateType: templateType;
}>();

const { setCurrentModel, setIsExpanded } = useResumeStore();
const previewOnly = usePreviewOnly();

const styles = computed(() => getWorkExperienceStyles(props.templateType));

const handleClick = () => {
  if (previewOnly) return;
  setCurrentModel("workExperience");
  setIsExpanded(true);
};
</script>

<template>
  <!-- 
    v-if="data && data.length > 0": 仅在有工作经验数据时渲染
    数据来源: props.data (WorkExperience 数组)
  -->
  <div v-if="data && data.length > 0" :class="styles.container" @click="handleClick">
    <h3 :class="styles.title">
      {{ label || "工作经验" }}
    </h3>
    <div :class="styles.listWrapper">
      <template v-if="data && data.length">
        <div v-for="(work, index) in data" :key="index" :class="styles.itemWrapper">
          <div :class="styles.headerWrapper">
            <h4 :class="styles.companyName">{{ work.companyName }}</h4>
            <div :class="styles.position">
              {{ work.position }}
            </div>
            <span :class="styles.timeRange">
              {{ work.workTime }}
              <span v-if="work.dismissalTime">- {{ work.dismissalTime }}</span>
            </span>
          </div>

          <p v-safe-html="work.workDescription" :class="styles.description"></p>
        </div>
      </template>
      <div v-else :class="styles.empty">暂无工作经验信息</div>
    </div>
  </div>
</template>
