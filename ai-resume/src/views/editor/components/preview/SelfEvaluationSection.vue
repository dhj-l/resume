<script setup lang="ts">
import { useResumeStore } from "@/stores/resumeStore";
import type { templateType } from "./type";
import { getSelfEvaluationStyles } from "./SelfEvaluationSection";
import { computed } from "vue";

const props = defineProps<{
  data?: string;
  label?: string;
  templateType: templateType;
}>();

const { setCurrentModel, setIsExpanded } = useResumeStore();

const styles = computed(() => getSelfEvaluationStyles(props.templateType));

const handleClick = () => {
  setCurrentModel("selfEvaluation");
  setIsExpanded(true);
};
</script>

<template>
  <!-- 
    v-if="data": 仅在有自我评价内容时渲染
    数据来源: props.data (HTML 字符串)
  -->
  <div v-if="data" :class="styles.container" @click="handleClick">
    <h3 :class="styles.title">
      {{ label || "自我评价" }}
    </h3>
    <p v-if="data" :class="styles.content" v-html="data"></p>
    <div v-else :class="styles.empty">暂无自我评价信息</div>
  </div>
</template>
