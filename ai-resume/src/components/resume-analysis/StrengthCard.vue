<script setup lang="ts">
import { inject } from "vue";

import { CheckCircleFilled } from "@ant-design/icons-vue";

import { ContainerWidthKey } from "./types";
import type { StrengthItem } from "./types";

defineProps<{
  item: StrengthItem;
  index?: number;
}>();

const isDesktop = inject(ContainerWidthKey);

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
  <div class="rounded-xl bg-green-50/50 border border-green-100 p-4">
    <div class="flex items-start gap-3">
      <div
        class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 mt-0.5"
      >
        <CheckCircleFilled />
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
        </div>
        <p class="text-sm text-neutral-500 leading-relaxed" :class="!isDesktop && 'truncate'">
          {{ item.description }}
        </p>
      </div>
    </div>
  </div>
</template>
