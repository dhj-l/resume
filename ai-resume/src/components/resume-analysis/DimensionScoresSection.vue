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
  <div class="space-y-4">
    <h3 class="text-base font-semibold text-neutral-700">维度评分</h3>
    <div class="space-y-3.5">
      <DimensionScoreBar
        v-for="(dim, index) in dimensions"
        :key="dim.name"
        :name="dim.name"
        :score="dim.score"
        :max="dim.max"
        :color="getColor(index)"
      />
    </div>
  </div>
</template>
