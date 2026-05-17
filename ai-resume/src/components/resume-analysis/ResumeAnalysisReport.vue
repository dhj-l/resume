<script setup lang="ts">
import { computed } from "vue";
import type { ResumeAnalysisData } from "./types";
import { getScoreLevel } from "./types";
import { Spin } from "ant-design-vue";
import { FileTextOutlined } from "@ant-design/icons-vue";

import AnalysisScoreRing from "./AnalysisScoreRing.vue";
import DimensionScoresSection from "./DimensionScoresSection.vue";
import RadarChart from "./RadarChart.vue";
import StrengthCard from "./StrengthCard.vue";
import WeaknessCard from "./WeaknessCard.vue";
import SuggestionItem from "./SuggestionItem.vue";

interface Props {
  data: ResumeAnalysisData;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const scoreLevel = computed(() => getScoreLevel(props.data.overall_score));

const percentileText = computed(() => {
  const score = props.data.overall_score;
  const percentile = Math.min(Math.round(score * 0.8 + 10), 99);
  return `超越 ${percentile}% 的同类简历`;
});

const today = computed(() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-6 md:px-8 animate-fade-in">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <Spin size="large" tip="AI 正在分析简历..." />
    </div>

    <template v-else>
      <!-- ==================== MOBILE LAYOUT ==================== -->
      <div class="md:hidden space-y-6">
        <!-- Mobile Header -->
        <div>
          <h1 class="text-xl font-bold text-neutral-700">AI简历分析</h1>
          <p class="text-sm text-neutral-400 mt-1">基于多维度 AI 分析，助你打造更优秀的简历</p>
        </div>

        <!-- Score Ring -->
        <div class="rounded-xl bg-white p-5 shadow-card">
          <h3 class="text-sm font-medium text-neutral-500 mb-4">分析得分</h3>
          <AnalysisScoreRing
            :score="data.overall_score"
            :label="scoreLevel"
            :description="percentileText"
          />
        </div>

        <!-- Dimension Scores -->
        <div class="rounded-xl bg-white p-5 shadow-card">
          <DimensionScoresSection :dimensions="data.dimension_scores" />
        </div>

        <!-- Suggestions -->
        <div class="rounded-xl bg-white p-5 shadow-card">
          <h3 class="text-base font-semibold text-neutral-700 mb-3">优化建议</h3>
          <div class="divide-y divide-neutral-100">
            <SuggestionItem
              v-for="(suggestion, index) in data.suggestions"
              :key="index"
              :item="suggestion"
            />
          </div>
        </div>
      </div>

      <!-- ==================== DESKTOP LAYOUT ==================== -->
      <div class="hidden md:block">
        <!-- Desktop Header -->
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-2xl font-bold text-neutral-700">简历分析报告</h1>
              <span
                class="text-xs font-medium px-2.5 py-1 rounded-full bg-primary-50 text-primary-500"
              >
                AI 分析
              </span>
            </div>
            <div class="flex items-center gap-4 text-sm text-neutral-400">
              <span v-if="data.meta.candidate_name" class="flex items-center gap-1">
                <FileTextOutlined />
                {{ data.meta.candidate_name }}
              </span>
              <span v-if="data.meta.target_position">
                目标职位：{{ data.meta.target_position }}
              </span>
            </div>
          </div>
          <div class="text-sm text-neutral-400">{{ today }}</div>
        </div>

        <!-- Two Column Layout -->
        <div class="grid grid-cols-5 gap-6 mt-6">
          <!-- Left Column: Radar Chart + Weaknesses -->
          <div class="col-span-3 space-y-6">
            <RadarChart :dimensions="data.dimension_scores" />

            <!-- Weaknesses Section -->
            <div v-if="data.weaknesses.length" class="space-y-3">
              <h3 class="text-base font-semibold text-neutral-700 flex items-center gap-2">
                <span class="w-1 h-5 bg-red-500 rounded-full" />
                待改进点
              </h3>
              <WeaknessCard
                v-for="(weakness, index) in data.weaknesses"
                :key="index"
                :item="weakness"
              />
            </div>
          </div>

          <!-- Right Column: Score + Strengths + Suggestions -->
          <div class="col-span-2 space-y-6">
            <!-- Score Card -->
            <div class="rounded-xl bg-white p-5 shadow-card">
              <h3 class="text-sm font-medium text-neutral-500 mb-3">总体评分</h3>
              <AnalysisScoreRing
                :score="data.overall_score"
                :label="scoreLevel"
                :description="percentileText"
              />
              <p class="text-sm text-neutral-400 leading-relaxed mt-4">{{ data.summary }}</p>
            </div>

            <!-- Strengths Section -->
            <div v-if="data.strengths.length" class="space-y-3">
              <h3 class="text-base font-semibold text-neutral-700 flex items-center gap-2">
                <span class="w-1 h-5 bg-green-500 rounded-full" />
                优势亮点
              </h3>
              <StrengthCard
                v-for="(strength, index) in data.strengths"
                :key="index"
                :item="strength"
                :index="index"
              />
            </div>

            <!-- Suggestions Section -->
            <div v-if="data.suggestions.length" class="rounded-xl bg-white p-5 shadow-card">
              <h3 class="text-base font-semibold text-neutral-700 flex items-center gap-2 mb-3">
                <span class="w-1 h-5 bg-primary-500 rounded-full" />
                优化建议（行动清单）
              </h3>
              <div class="divide-y divide-neutral-100">
                <SuggestionItem
                  v-for="(suggestion, index) in data.suggestions"
                  :key="index"
                  :item="suggestion"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
