<script setup lang="ts">
import { templateList } from "@/views/editor/templates/index";
import { useResumeStore } from "@/stores/resumeStore";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

const { currentTemplate } = storeToRefs(useResumeStore());
const { getResumeDetail } = useResumeStore();

//挂载时根据当前id获取数据，这里先写死TODO
onMounted(async () => {
  getResumeDetail("69787013885a54a9f660796a");
});
</script>
<!-- 
  这里只展示模板，不涉及复杂的逻辑。
-->
<template>
  <div class="resume-preview-wrapper" ref="currentTemplateRef">
    <template v-for="item in templateList" :key="item.value">
      <component :is="item.component" v-if="item.value === currentTemplate" />
    </template>
  </div>
</template>

<style>
.resume-preview-wrapper {
  ul {
    list-style-type: disc;
    padding-left: 20px;
    margin: 8px 0;
  }

  ol {
    list-style-type: decimal;
    padding-left: 20px;
    margin: 8px 0;
  }

  :deep(li) {
    line-height: 1.5;
    margin-bottom: 4px;

    p {
      margin: 0;
    }
  }
}
</style>
