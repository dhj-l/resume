<script setup lang="ts">
import { watch } from "vue";

import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

import { useResumeStore } from "@/stores/resumeStore";
import { templateList } from "@/views/editor/templates/index";

const { resumeData, globalLineHeight } = storeToRefs(useResumeStore());
const { getResumeDetail } = useResumeStore();

const route = useRoute();
const id = route.query.id;
watch(
  () => id,
  (newVal) => {
    if (newVal) {
      getResumeDetail(newVal as string);
    }
  },
  {
    immediate: true,
  },
);
</script>
<!-- 
  这里只展示模板，不涉及复杂的逻辑。
-->
<template>
  <div
    ref="currentTemplateRef"
    class="resume-preview-wrapper"
    :style="{ lineHeight: globalLineHeight }"
  >
    <template v-for="item in templateList" :key="item.value">
      <component :is="item.component" v-if="item.value === resumeData.type" />
    </template>
  </div>
</template>

<style>
.resume-preview-wrapper {
  ul {
    list-style-type: disc;
    padding-left: 20px;
    margin: 8px 0;
    line-height: inherit;
  }

  ol {
    list-style-type: decimal;
    padding-left: 20px;
    margin: 8px 0;
    line-height: inherit;
  }

  :deep(li) {
    line-height: inherit;
    margin-bottom: 4px;

    p {
      margin: 0;
    }
  }
}
</style>
