<script setup lang="ts">
import { computed } from "vue";

import { useResumeStore } from "@/stores/resumeStore";
import type { JobIntention } from "@/stores/type";
import { usePreviewOnly } from "@/views/editor/hooks/usePreviewOnly";

import { getJobIntentionStyles } from "./JobIntentionSection";
import type { templateType } from "./type";

const props = defineProps<{
  data?: JobIntention;
  label?: string;
  templateType: templateType;
}>();

const { setCurrentModel, setIsExpanded } = useResumeStore();
const previewOnly = usePreviewOnly();

const styles = computed(() => getJobIntentionStyles(props.templateType));

const handleClick = () => {
  if (previewOnly) return;
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
  <!-- 
    v-if="isVisible": 仅在至少有一个求职意向字段有值时渲染
    数据来源: props.data (JobIntention 对象)
  -->
  <div v-if="isVisible" :class="styles.container" @click="handleClick">
    <h3 :class="styles.title">
      <component :is="styles.titleIcon" v-if="styles.titleIcon" :class="styles.titleIconClass" />
      {{ label || "求职意向" }}
    </h3>
    <div v-if="data" :class="styles.contentWrapper">
      <template v-for="(item, index) in contentArray" :key="item.label">
        <div v-if="item.value" :class="styles.item">
          <component
            :is="styles.itemIcons[index]"
            v-if="styles.itemIcons?.[index]"
            :class="styles.itemIconClass"
          />
          <span :class="styles.label">{{ item.label }}：</span>
          <span :class="styles.value">{{ item.value }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
