<script setup lang="ts">
import { inject } from "vue";

import { ShopOutlined, InfoCircleOutlined } from "@ant-design/icons-vue";

import { ContainerWidthKey, COMPETITION_INTENSITY_LABELS } from "./types";
import type { MarketAnalysis } from "./types";

defineProps<{
  data: MarketAnalysis;
}>();

const isDesktop = inject(ContainerWidthKey);

const intensityColors: Record<string, { bg: string; text: string }> = {
  high: { bg: "#fff1f0", text: "#ff4d4f" },
  medium: { bg: "#fffbe6", text: "#faad14" },
  low: { bg: "#f6ffed", text: "#52c41a" },
};

function getIntensityStyle(intensity: string): Record<string, string> {
  const colors = intensityColors[intensity] ?? intensityColors.medium;
  return { backgroundColor: colors!.bg, color: colors!.text };
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-card" :class="isDesktop ? 'p-6' : 'p-5'">
    <h3 class="text-base font-semibold text-neutral-700 flex items-center gap-2 mb-4">
      <ShopOutlined class="text-primary-500" />
      市场分析
    </h3>

    <div class="space-y-4">
      <div>
        <div class="text-xs font-medium text-neutral-400 mb-1">岗位需求</div>
        <p class="text-sm text-neutral-700 leading-relaxed">{{ data.position_demand }}</p>
      </div>

      <div>
        <div class="text-xs font-medium text-neutral-400 mb-1">竞争强度</div>
        <span
          class="text-xs font-medium px-2.5 py-0.5 rounded-full"
          :style="getIntensityStyle(data.competition_intensity)"
        >
          {{
            COMPETITION_INTENSITY_LABELS[data.competition_intensity] || data.competition_intensity
          }}
        </span>
      </div>

      <div>
        <div class="text-xs font-medium text-neutral-400 mb-1">候选人定位</div>
        <p class="text-sm text-neutral-700 leading-relaxed">{{ data.candidate_positioning }}</p>
      </div>

      <div class="flex items-start gap-2 bg-blue-50/50 rounded-lg p-3">
        <InfoCircleOutlined class="text-primary-500 mt-0.5 shrink-0" />
        <div>
          <div class="text-xs font-medium text-neutral-400 mb-0.5">薪资竞争力</div>
          <p class="text-sm text-neutral-600 leading-relaxed">
            {{ data.salary_competitiveness_note }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
