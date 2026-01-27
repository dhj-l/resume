<script setup lang="ts">
import { useResumeStore } from "@/stores/resumeStore";
import type { templateType } from "./type";
import { getCertificatesStyles } from "./CertificatesSection";
import { computed } from "vue";

const props = defineProps<{
  data?: string;
  label?: string;
  templateType: templateType;
}>();
const { setCurrentModel, setIsExpanded } = useResumeStore();

const styles = computed(() => getCertificatesStyles(props.templateType));

const handleClick = () => {
  setCurrentModel("certificates");
  setIsExpanded(true);
};
</script>

<template>
  <div :class="styles.container" @click="handleClick">
    <h3 :class="styles.title">
      {{ label || "荣誉证书" }}
    </h3>
    <div v-html="data"></div>
  </div>
</template>
