<script setup lang="ts">
import type { SuggestionItem } from "./types";
import { PRIORITY_LABELS } from "./types";

const props = defineProps<{
  item: SuggestionItem;
}>();

const badgeStyles: Record<string, string> = {
  high: "bg-red-50 text-red-600 border border-red-200",
  medium: "bg-amber-50 text-amber-600 border border-amber-200",
  low: "bg-blue-50 text-blue-600 border border-blue-200",
};

function getBadgeClass(priority: string): string {
  return (badgeStyles[priority] ?? badgeStyles.low) as string;
}
</script>

<template>
  <div class="flex items-start gap-3 py-3">
    <span
      class="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full mt-0.5"
      :class="getBadgeClass(item.priority)"
    >
      {{ PRIORITY_LABELS[item.priority as string] || item.priority }}
    </span>
    <span class="text-sm text-neutral-600 leading-relaxed">{{ item.action }}</span>
  </div>
</template>
