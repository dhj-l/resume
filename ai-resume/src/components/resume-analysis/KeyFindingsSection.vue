<script setup lang="ts">
import {
  CloseCircleFilled,
  WarningFilled,
  InfoCircleFilled,
  CheckCircleFilled,
  ThunderboltFilled,
} from "@ant-design/icons-vue";

import { SEVERITY_COLORS, SEVERITY_BG_COLORS, SEVERITY_LABELS } from "./types";
import type { KeyFinding } from "./types";

defineProps<{
  findings: KeyFinding[];
}>();

const iconMap: Record<string, typeof CloseCircleFilled> = {
  critical: CloseCircleFilled,
  major: WarningFilled,
  minor: InfoCircleFilled,
  positive: CheckCircleFilled,
};

function getIcon(severity: string) {
  return iconMap[severity] || InfoCircleFilled;
}

function getSeverityStyle(severity: string): Record<string, string> {
  return {
    backgroundColor: SEVERITY_BG_COLORS[severity] || "#f5f5f5",
    color: SEVERITY_COLORS[severity] || "#999",
  };
}

function getBorderStyle(severity: string): Record<string, string> {
  return {
    borderLeftColor: SEVERITY_COLORS[severity] || "#d9d9d9",
  };
}
</script>

<template>
  <div v-if="findings.length" class="space-y-3">
    <h3 class="text-base font-semibold text-neutral-700 flex items-center gap-2">
      <ThunderboltFilled class="text-amber-500" />
      核心发现
    </h3>
    <div
      v-for="(item, index) in findings"
      :key="index"
      class="rounded-lg border border-neutral-100 border-l-4 p-4 bg-white"
      :style="getBorderStyle(item.severity)"
    >
      <div class="flex items-start gap-3">
        <component
          :is="getIcon(item.severity)"
          class="text-base mt-0.5 shrink-0"
          :style="{ color: SEVERITY_COLORS[item.severity] }"
        />
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <span class="text-sm font-semibold text-neutral-800">{{ item.finding }}</span>
            <span
              class="text-xs font-medium px-1.5 py-0.5 rounded-full"
              :style="getSeverityStyle(item.severity)"
            >
              {{ SEVERITY_LABELS[item.severity] }}
            </span>
          </div>
          <p class="text-sm text-neutral-500 leading-relaxed">{{ item.detail }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
