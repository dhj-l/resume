<script setup lang="ts">
import { templateList } from "@/views/editor/templates/index";
import { useResumeStore } from "@/stores/resumeStore";
import { storeToRefs } from "pinia";

const { currentTemplate } = storeToRefs(useResumeStore());
</script>
<!-- 
  这里只展示模板，不涉及其余的逻辑。
-->
<template>
  <div>
    {{ currentTemplate }}
    <template v-for="item in templateList" :key="item.value">
      <component :is="item.component" v-if="item.value === currentTemplate" />
    </template>
  </div>
</template>

<style scoped></style>
