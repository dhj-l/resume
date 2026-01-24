<script setup lang="ts">
import { Tabs, TabPane } from "ant-design-vue";
import type { ResumeData } from "@/stores/type";
import { storeToRefs } from "pinia";
import { useResumeStore } from "@/stores/resumeStore";

defineProps<{
  resumeData: ResumeData;
}>();
const { moduleOrder, currentModule } = storeToRefs(useResumeStore());
</script>

<template>
  <div class="h-full flex flex-col bg-gray-50">
    <Tabs
      v-model:activeKey="currentModule"
      class="bg-white px-4 border-b border-gray-200"
      centered
    >
      <TabPane
        v-for="item in moduleOrder"
        :key="item.moduleKey"
        :tab="item.label"
        :name="item.moduleKey"
      />
    </Tabs>

    <div class="flex-1 overflow-y-auto p-6">
      <div
        class="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-6 min-h-full"
      >
        <template v-for="item in moduleOrder" :key="item.moduleKey">
          <component
            v-if="currentModule === item.moduleKey"
            :is="item.formComponent"
            :data="resumeData[item.moduleKey]"
          />
          <!-- 其他模块占位
          <div v-else class="text-center py-12 text-gray-400">
            <p>{{ activeKey }} 模块表单开发中...</p>
          </div> -->
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.ant-tabs-nav) {
  margin-bottom: 0;
}
</style>
