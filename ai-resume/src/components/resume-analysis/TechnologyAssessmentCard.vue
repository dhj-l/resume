<script setup lang="ts">
import { inject } from "vue";

import { CodeOutlined } from "@ant-design/icons-vue";

import { ContainerWidthKey, getScoreColor } from "./types";
import type { TechnologyAssessment } from "./types";

defineProps<{
  data: TechnologyAssessment;
}>();

const isDesktop = inject(ContainerWidthKey);

const skillGroups = [
  { key: "matching_skills", label: "匹配技能", colorClass: "bg-green-50 text-green-600" },
  { key: "missing_critical_skills", label: "缺失关键技能", colorClass: "bg-red-50 text-red-600" },
  {
    key: "trending_skills_advantage",
    label: "趋势技能优势",
    colorClass: "bg-blue-50 text-blue-600",
  },
  {
    key: "outdated_or_risk_skills",
    label: "过时/风险技能",
    colorClass: "bg-orange-50 text-orange-600",
  },
] as const;
</script>

<template>
  <div class="bg-white rounded-xl shadow-card" :class="isDesktop ? 'p-6' : 'p-5'">
    <h3 class="text-base font-semibold text-neutral-700 flex items-center gap-2 mb-4">
      <CodeOutlined class="text-primary-500" />
      技术评估
    </h3>

    <!-- Score and Summary -->
    <div class="flex items-center gap-4 mb-4">
      <div class="flex items-baseline gap-1">
        <span class="text-3xl font-bold" :style="{ color: getScoreColor(data.tech_stack_score) }">
          {{ data.tech_stack_score }}
        </span>
        <span class="text-sm text-neutral-400">/100</span>
      </div>
      <p class="text-sm text-neutral-500 leading-relaxed flex-1">{{ data.tech_stack_summary }}</p>
    </div>

    <!-- Skill Groups -->
    <div class="grid gap-4" :class="isDesktop ? 'grid-cols-2' : 'grid-cols-1'">
      <div v-for="group in skillGroups" :key="group.key">
        <div class="text-xs font-medium text-neutral-400 mb-2">{{ group.label }}</div>
        <div v-if="data[group.key]?.length" class="flex flex-wrap gap-1.5">
          <span
            v-for="skill in data[group.key]"
            :key="skill"
            class="text-xs px-2 py-0.5 rounded-full"
            :class="group.colorClass"
          >
            {{ skill }}
          </span>
        </div>
        <span v-else class="text-xs text-neutral-300">暂无</span>
      </div>
    </div>
  </div>
</template>
