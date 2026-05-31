<script setup lang="ts">
import { COMPETITIVENESS_LABELS, COMPETITIVENESS_COLORS, COMPETITIVENESS_BG_COLORS } from "./types";

defineProps<{
  level: string;
}>();

function getStyle(level: string): Record<string, string> {
  return {
    backgroundColor: COMPETITIVENESS_BG_COLORS[level] || "#f5f5f5",
    color: COMPETITIVENESS_COLORS[level] || "#999",
    borderColor: COMPETITIVENESS_COLORS[level] || "#d9d9d9",
  };
}
</script>

<template>
  <span class="text-xs font-medium px-2.5 py-0.5 rounded-full border" :style="getStyle(level)">
    {{ COMPETITIVENESS_LABELS[level] || level }}
  </span>
</template>
