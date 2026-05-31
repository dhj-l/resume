<script setup lang="ts">
import { inject } from "vue";

import { IdcardOutlined, WarningFilled } from "@ant-design/icons-vue";

import { ContainerWidthKey, GROWTH_RATE_LABELS } from "./types";
import type { CareerAnalysis } from "./types";

defineProps<{
  data: CareerAnalysis;
}>();

const isDesktop = inject(ContainerWidthKey);

const trajectoryColors: Record<string, { bg: string; text: string }> = {
  上升期: { bg: "#f6ffed", text: "#52c41a" },
  平稳期: { bg: "#e6f4ff", text: "#1677ff" },
  瓶颈期: { bg: "#fff7e6", text: "#fa8c16" },
  波动期: { bg: "#fff1f0", text: "#ff4d4f" },
};

const growthRateColors: Record<string, { bg: string; text: string }> = {
  fast: { bg: "#f6ffed", text: "#52c41a" },
  steady: { bg: "#e6f4ff", text: "#1677ff" },
  slow: { bg: "#fff7e6", text: "#fa8c16" },
  stagnant: { bg: "#fff1f0", text: "#ff4d4f" },
};

function getTrajectoryStyle(trajectory: string): Record<string, string> {
  const colors = trajectoryColors[trajectory] || { bg: "#f5f5f5", text: "#999" };
  return { backgroundColor: colors.bg, color: colors.text };
}

function getGrowthRateStyle(rate: string): Record<string, string> {
  const colors = growthRateColors[rate] || { bg: "#f5f5f5", text: "#999" };
  return { backgroundColor: colors.bg, color: colors.text };
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-card" :class="isDesktop ? 'p-6' : 'p-5'">
    <h3 class="text-base font-semibold text-neutral-700 flex items-center gap-2 mb-4">
      <IdcardOutlined class="text-primary-500" />
      职业分析
    </h3>

    <!-- Badges Row -->
    <div class="flex items-center gap-2 flex-wrap mb-4">
      <span class="text-xs font-medium px-2.5 py-1 rounded-full bg-primary-50 text-primary-600">
        {{ data.career_stage }}
      </span>
      <span
        class="text-xs font-medium px-2.5 py-1 rounded-full"
        :style="getTrajectoryStyle(data.trajectory_assessment)"
      >
        {{ data.trajectory_assessment }}
      </span>
      <span
        class="text-xs font-medium px-2.5 py-1 rounded-full"
        :style="getGrowthRateStyle(data.growth_rate)"
      >
        {{ GROWTH_RATE_LABELS[data.growth_rate] || data.growth_rate }}
      </span>
    </div>

    <!-- Work Years -->
    <div class="mb-4">
      <div class="text-xs font-medium text-neutral-400 mb-1">推算工作年限</div>
      <span class="text-sm font-semibold text-neutral-700">{{ data.estimated_work_years }}</span>
    </div>

    <!-- Red Flags -->
    <div v-if="data.red_flags?.length">
      <div class="text-xs font-medium text-neutral-400 mb-2 flex items-center gap-1">
        <WarningFilled class="text-orange-500" />
        风险提示
      </div>
      <div class="space-y-2">
        <div
          v-for="(flag, index) in data.red_flags"
          :key="index"
          class="flex items-start gap-2 bg-orange-50/50 border border-orange-100 rounded-lg p-3"
        >
          <WarningFilled class="text-orange-400 mt-0.5 shrink-0 text-xs" />
          <span class="text-sm text-neutral-600 leading-relaxed">{{ flag }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
