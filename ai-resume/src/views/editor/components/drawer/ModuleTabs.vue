<script setup lang="ts">
import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue";
import { Tabs, TabPane, Button } from "ant-design-vue";
import { storeToRefs } from "pinia";

import { useResumeStore } from "@/stores/resumeStore";
import type { ResumeData } from "@/stores/type";

defineProps<{
  resumeData: ResumeData;
}>();

const { moduleOrder, currentModule } = storeToRefs(useResumeStore());
const resumeStore = useResumeStore();
const { swapModuleOrder } = resumeStore;

const FIXED_MODULES = ["basicInfo", "jobIntention"];

const isFixedModule = (moduleKey: string) => {
  return FIXED_MODULES.includes(moduleKey);
};

const moveModuleLeft = (moduleKey: string) => {
  const currentIndex = moduleOrder.value.findIndex((m) => m.moduleKey === moduleKey);
  if (currentIndex <= 0) return;

  const prevModule = moduleOrder.value[currentIndex - 1];
  if (isFixedModule(prevModule?.moduleKey || "")) return;

  swapModuleOrder(moduleKey, prevModule?.moduleKey || "");
};

const moveModuleRight = (moduleKey: string) => {
  const currentIndex = moduleOrder.value.findIndex((m) => m.moduleKey === moduleKey);
  if (currentIndex < 0 || currentIndex >= moduleOrder.value.length - 1) return;

  const nextModule = moduleOrder.value[currentIndex + 1];
  if (isFixedModule(nextModule?.moduleKey || "")) return;

  swapModuleOrder(moduleKey, nextModule?.moduleKey || "");
};

const canMoveLeft = (moduleKey: string) => {
  const currentIndex = moduleOrder.value.findIndex((m) => m.moduleKey === moduleKey);
  if (currentIndex <= 0) return false;
  const prevModule = moduleOrder.value[currentIndex - 1];
  return !isFixedModule(prevModule?.moduleKey || "");
};

const canMoveRight = (moduleKey: string) => {
  const currentIndex = moduleOrder.value.findIndex((m) => m.moduleKey === moduleKey);
  if (currentIndex < 0 || currentIndex >= moduleOrder.value.length - 1) return false;
  const nextModule = moduleOrder.value[currentIndex + 1];
  return !isFixedModule(nextModule?.moduleKey || "");
};
</script>

<template>
  <div class="h-full flex flex-col bg-gray-50">
    <Tabs
      v-model:active-key="currentModule"
      class="bg-white px-4 border-b border-gray-200"
      centered
    >
      <TabPane v-for="item in moduleOrder" :key="item.moduleKey" :name="item.moduleKey">
        <template #tab>
          <div class="flex items-center gap-1">
            <template v-if="!isFixedModule(item.moduleKey)">
              <Button
                type="text"
                size="small"
                :disabled="!canMoveLeft(item.moduleKey)"
                class="sort-btn flex items-center"
                @click.stop="moveModuleLeft(item.moduleKey)"
              >
                <LeftOutlined />
              </Button>
            </template>
            <span>{{ item.label }}</span>
            <template v-if="!isFixedModule(item.moduleKey)">
              <Button
                type="text"
                size="small"
                :disabled="!canMoveRight(item.moduleKey)"
                class="sort-btn flex items-center"
                @click.stop="moveModuleRight(item.moduleKey)"
              >
                <RightOutlined />
              </Button>
            </template>
          </div>
        </template>
      </TabPane>
    </Tabs>

    <div class="flex-1 overflow-y-auto p-6">
      <div class="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-6 min-h-full">
        <template v-for="item in moduleOrder" :key="item.moduleKey">
          <component
            :is="item.formComponent"
            v-if="currentModule === item.moduleKey"
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

.sort-btn {
  padding: 0 2px !important;
  height: 18px !important;
  min-width: 18px !important;
  font-size: 10px !important;
  opacity: 0;
  transition:
    opacity 0.2s,
    color 0.2s;
  color: rgba(0, 0, 0, 0.45);
}

:deep(.ant-tabs-tab:hover) .sort-btn {
  opacity: 1;
}

.sort-btn:hover:not(:disabled) {
  color: #1890ff !important;
  background-color: rgba(24, 144, 255, 0.1);
}

.sort-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
