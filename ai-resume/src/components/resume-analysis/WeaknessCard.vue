<script setup lang="ts">
import type { WeaknessItem } from "./types";
import { CloseCircleFilled, BulbOutlined } from "@ant-design/icons-vue";

defineProps<{
  item: WeaknessItem;
}>();

const tagColors: Record<string, string> = {
  工作经历: "bg-blue-50 text-blue-600",
  专业技能: "bg-green-50 text-green-600",
  教育背景: "bg-purple-50 text-purple-600",
  项目成果: "bg-orange-50 text-orange-600",
  排版与格式: "bg-cyan-50 text-cyan-600",
};

function getTagClass(category: string): string {
  return tagColors[category] || "bg-gray-50 text-gray-600";
}
</script>

<template>
  <div class="rounded-xl bg-white p-4 shadow-card">
    <div class="flex items-start gap-3">
      <CloseCircleFilled class="text-red-500 text-lg mt-0.5 shrink-0" />
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2 flex-wrap mb-1">
          <span
            class="text-xs font-medium px-2 py-0.5 rounded-full"
            :class="getTagClass(item.category)"
          >
            {{ item.category }}
          </span>
          <span class="text-sm font-semibold text-neutral-700">{{ item.title }}</span>
        </div>
        <p class="text-sm text-neutral-400 leading-relaxed mb-2">{{ item.description }}</p>
        <div v-if="item.suggestion" class="bg-blue-50 rounded-lg px-3 py-2.5">
          <div class="flex items-start gap-2">
            <BulbOutlined class="text-primary-500 mt-0.5 shrink-0" />
            <span class="text-sm text-primary-600 leading-relaxed">{{ item.suggestion }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
