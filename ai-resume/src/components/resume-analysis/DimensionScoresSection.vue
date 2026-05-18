<script setup lang="ts">
import type { DimensionScore } from "./types";
import { DIMENSION_COLORS } from "./types";
import DimensionScoreBar from "./DimensionScoreBar.vue";

const props = defineProps<{
  dimensions: DimensionScore[];
}>();

const colors = DIMENSION_COLORS.palette;

function getColor(index: number): string {
  return colors[index % colors.length] || colors[0];
}
</script>

<template>
  <div class="space-y-4 md:space-y-2">
    <h3 class="text-base font-semibold text-neutral-700 md:hidden">维度评分</h3>
    
    <!-- Desktop Header -->
    <div class="hidden md:grid grid-cols-[1.2fr_1.5fr_1fr] gap-4 py-2 border-b border-neutral-100 mb-2">
      <div class="text-sm font-medium text-neutral-500">维度</div>
      <div class="text-sm font-medium text-neutral-500 text-center">得分</div>
      <div class="text-sm font-medium text-neutral-500 text-right">权重</div>
    </div>

    <div class="space-y-3.5 md:space-y-0">
      <DimensionScoreBar
        v-for="(dim, index) in dimensions"
        :key="dim.name"
        :name="dim.name"
        :score="dim.score"
        :max="dim.max"
        :weight="dim.weight"
        :color="getColor(index)"
      />
    </div>
  </div>
</template>
