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
const contentArray = computed(() => {
  return [
    {
      label: "期望职位",
      value: props.data?.jobIntention,
    },
    {
      label: "意向城市",
      value: props.data?.intentionCity,
    },
    {
      label: "期望薪资",
      value: props.data?.expectationSalary,
    },
    {
      label: "入职时间",
      value: props.data?.entryTime,
    },
  ];
});
//控制当前组件是否显示
const isVisible = computed(() => {
  return (
    props.data?.jobIntention ||
    props.data?.intentionCity ||
    props.data?.expectationSalary ||
    props.data?.entryTime
  );
});
</script>

<template>
  <div :class="styles.container" @click="handleClick" v-if="isVisible">
    <h3 :class="styles.title">
      {{ label || "求职意向" }}
    </h3>
    <div :class="styles.contentWrapper" v-if="data">
      <template v-for="item in contentArray" :key="item.label">
        <div :class="styles.item" v-if="item.value">
          <span :class="styles.label">{{ item.label }}：</span>
          <span :class="styles.value">{{ item.value }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
