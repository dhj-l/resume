<script setup lang="ts">
import { computed } from "vue";

import { RadarChart as ERadarChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import VChart from "vue-echarts";

use([CanvasRenderer, ERadarChart, TooltipComponent]);

const props = defineProps<{
  topics: {
    name: string;
    score: number;
  }[];
}>();

/** 长维度名每 7 个字符换一行，避免溢出雷达容器 */
const wrapName = (name: string) => (name.length <= 7 ? name : name.replace(/(.{7})/g, "$1\n"));

const option = computed(() => ({
  radar: {
    indicator: props.topics.map((t) => ({
      name: wrapName(t.name),
      max: 100,
    })),
    shape: "polygon" as const,
    splitNumber: 4,
    center: ["50%", "52%"],
    radius: "62%",
    axisName: {
      color: "#64748b",
      fontSize: 11,
      fontFamily: "Inter, PingFang SC, Microsoft YaHei, sans-serif",
    },
    splitArea: {
      areaStyle: {
        color: ["#fafafa", "#ffffff"],
      },
    },
    splitLine: {
      lineStyle: { color: "#e2e8f0" },
    },
    axisLine: {
      lineStyle: { color: "#e2e8f0" },
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
          value: props.topics.map((t) => Math.min(100, Math.max(0, t.score))),
          name: "主题得分",
          areaStyle: {
            color: "rgba(139, 92, 246, 0.15)",
          },
          lineStyle: {
            color: "#8b5cf6",
            width: 2,
          },
          itemStyle: {
            color: "#8b5cf6",
            borderColor: "#fff",
            borderWidth: 2,
          },
        },
      ],
      animationDuration: 900,
      animationEasing: "cubicOut" as const,
    },
  ],
}));
</script>

<template>
  <div class="w-full">
    <v-chart :option="option" autoresize class="mx-auto aspect-square w-full max-w-[340px]" />
  </div>
</template>
