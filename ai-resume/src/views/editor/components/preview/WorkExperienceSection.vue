<script setup lang="ts">
import { useResumeStore } from "@/stores/resumeStore";
import type { WorkExperience } from "@/stores/type";
import type { templateType } from "./type";
import { getWorkExperienceStyles } from "./WorkExperienceSection";
import { computed } from "vue";

const props = defineProps<{
  data?: WorkExperience[];
  label?: string;
  templateType: templateType;
}>();

const { setCurrentModel, setIsExpanded } = useResumeStore();

const styles = computed(() => getWorkExperienceStyles(props.templateType));

const handleClick = () => {
  setCurrentModel("workExperience");
  setIsExpanded(true);
};
</script>

<template>
  <div :class="styles.container" @click="handleClick">
    <h3 :class="styles.title">
      {{ label || "工作经验" }}
    </h3>
    <div :class="styles.listWrapper">
      <template v-if="data && data.length">
        <div
          v-for="(work, index) in data"
          :key="index"
          :class="styles.itemWrapper"
        >
          <div :class="styles.headerWrapper">
            <h4 :class="styles.companyName">{{ work.companyName }}</h4>
            <span :class="styles.timeRange">
              {{ work.workTime }}
              <span v-if="work.dismissalTime">- {{ work.dismissalTime }}</span>
            </span>
          </div>
          <div :class="styles.position">
            {{ work.position }}
          </div>
          <p :class="styles.description">
            {{ work.workDescription }}
          </p>
        </div>
      </template>
      <div v-else :class="styles.empty">暂无工作经验信息</div>
    </div>
  </div>
</template>
