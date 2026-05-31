<script setup lang="ts">
import { inject } from "vue";

import { CloseCircleFilled } from "@ant-design/icons-vue";

import { ContainerWidthKey, SEVERITY_LABELS, SEVERITY_COLORS, SEVERITY_BG_COLORS } from "./types";
import type { WeaknessItem } from "./types";

defineProps<{
  item: WeaknessItem;
}>();

const isDesktop = inject(ContainerWidthKey);

const tagColors: Record<string, string> = {
  岗位匹配度: "bg-blue-50 text-blue-600",
  技术栈竞争力: "bg-green-50 text-green-600",
  教育背景与学习能力: "bg-purple-50 text-purple-600",
  项目经验深度: "bg-orange-50 text-orange-600",
  简历呈现质量: "bg-cyan-50 text-cyan-600",
  职业发展潜力: "bg-pink-50 text-pink-600",
};

function getTagClass(category: string): string {
  return tagColors[category] || "bg-gray-50 text-gray-600";
}

function getSeverityStyle(severity: string): Record<string, string> {
  return {
    backgroundColor: SEVERITY_BG_COLORS[severity] || "#f5f5f5",
    color: SEVERITY_COLORS[severity] || "#999",
  };
}
</script>

<template>
  <div class="rounded-xl bg-red-50/50 border border-red-100 p-4">
    <div class="flex items-start gap-3">
      <div
        class="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 mt-0.5"
      >
        <CloseCircleFilled />
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2 flex-wrap mb-1">
          <span class="text-sm font-semibold text-neutral-800">{{ item.title }}</span>
          <span
            class="text-xs font-medium px-2 py-0.5 rounded-full"
            :class="getTagClass(item.category)"
          >
            {{ item.category }}
          </span>
          <span
            v-if="item.severity"
            class="text-xs font-medium px-2 py-0.5 rounded-full"
            :style="getSeverityStyle(item.severity)"
          >
            {{ SEVERITY_LABELS[item.severity] }}
          </span>
        </div>
        <p class="text-sm text-neutral-500 leading-relaxed mb-3" :class="!isDesktop && 'truncate'">
          {{ item.description }}
        </p>
        <div v-if="item.suggestion" class="flex items-start gap-2">
          <span class="text-sm text-red-500 font-medium shrink-0">改进建议</span>
          <span class="text-sm text-neutral-600 leading-relaxed" :class="!isDesktop && 'truncate'">
            {{ item.suggestion }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
