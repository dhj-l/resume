<script setup lang="ts">
import { computed } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { RadarChart as ERadarChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import VChart from "vue-echarts";

import type { DimensionScore } from "./types";

use([CanvasRenderer, ERadarChart, TooltipComponent]);

const props = defineProps<{
  dimensions: DimensionScore[];
}>();

const option = computed(() => ({
  radar: {
    indicator: props.dimensions.map((d) => ({
      name: d.name,
      max: d.max,
    })),
    shape: "polygon" as const,
    splitNumber: 5,
    center: ["50%", "50%"],
    radius: "65%",
    axisName: {
      color: "#595959",
      fontSize: 12,
      fontFamily: "Inter, PingFang SC, Microsoft YaHei, sans-serif",
    },
    splitArea: {
      areaStyle: {
        color: ["#f5f5f7", "#ffffff"],
      },
    },
    splitLine: {
      lineStyle: { color: "#d9d9d9" },
    },
    axisLine: {
      lineStyle: { color: "#d9d9d9" },
    },
  },
  tooltip: {
    trigger: "item" as const,
  },
  series: [
    {
      type: "radar" as const,
      data: [
        {
          value: props.dimensions.map((d) => d.score),
          name: "简历评分",
          areaStyle: {
            color: "rgba(22, 119, 255, 0.15)",
          },
          lineStyle: {
            color: "#1677ff",
            width: 2,
          },
          itemStyle: {
            color: "#1677ff",
            borderColor: "#fff",
            borderWidth: 2,
          },
        },
      ],
      animationDuration: 1000,
      animationEasing: "cubicOut" as const,
    },
  ],
}));
</script>

<template>
  <div class="w-full">
    <v-chart :option="option" autoresize class="w-full aspect-square max-w-[400px] mx-auto" />
  </div>
</template>
