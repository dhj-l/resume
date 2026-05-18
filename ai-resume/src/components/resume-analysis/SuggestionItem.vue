<script setup lang="ts">
import type { SuggestionItem } from "./types";
import { PRIORITY_LABELS } from "./types";

const props = defineProps<{
  item: SuggestionItem;
  index: number;
}>();

const badgeStyles: Record<string, string> = {
  high: "bg-red-50 text-red-600 border border-red-200",
  medium: "bg-amber-50 text-amber-600 border border-amber-200",
  low: "bg-blue-50 text-blue-600 border border-blue-200",
};

const numberStyles: Record<string, string> = {
  high: "bg-red-50 text-red-500",
  medium: "bg-amber-50 text-amber-500",
  low: "bg-blue-50 text-blue-500",
};

function getBadgeClass(priority: string): string {
  return (badgeStyles[priority] ?? badgeStyles.low) as string;
}

function getNumberClass(priority: string): string {
  return (numberStyles[priority] ?? numberStyles.low) as string;
}
</script>

<template>
  <div class="flex items-start gap-3 py-4">
    <span
      class="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full mt-0.5"
      :class="getBadgeClass(item.priority)"
    >
      {{ PRIORITY_LABELS[item.priority as string] || item.priority }}
    </span>
    <span 
      class="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
      :class="getNumberClass(item.priority)"
    >
      {{ String(index + 1).padStart(2, '0') }}
    </span>
    <span class="text-sm text-neutral-600 leading-relaxed mt-0.5">{{ item.action }}</span>
  </div>
</template>
