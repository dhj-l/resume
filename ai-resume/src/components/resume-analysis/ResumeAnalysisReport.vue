<script setup lang="ts">
import { computed } from "vue";
import type { ResumeAnalysisData } from "./types";
import { getScoreLevel } from "./types";
import { Spin } from "ant-design-vue";
import {
  UserOutlined,
  InfoCircleOutlined,
  LikeFilled,
  WarningFilled,
  BulbFilled,
  EditFilled,
} from "@ant-design/icons-vue";

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
  return `超过 ${percentile}% 的同类简历`;
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
      <div class="space-y-6">
        <!-- Mobile Title -->
        <div class="md:hidden">
          <h1 class="text-xl font-bold text-neutral-700">AI简历分析</h1>
        </div>

        <!-- 1. Header Card (Title, Info, Score Ring) -->
        <div
          class="bg-white rounded-xl shadow-card p-5 md:p-6 md:flex md:items-start md:justify-between gap-6"
        >
          <!-- Desktop Title & Meta (Hidden on mobile) -->
          <div class="hidden md:block space-y-4">
            <div class="flex items-center gap-3">
              <h1 class="text-2xl font-bold text-neutral-700">
                简历分析报告
                <span
                  class="text-sm font-normal text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full ml-2"
                  >v{{ data.meta.analysis_version || "1.0" }}</span
                >
              </h1>
            </div>
            <div class="flex items-center gap-4 text-sm text-neutral-500 mt-4">
              <span v-if="data.meta.candidate_name" class="flex items-center gap-1">
                <UserOutlined /> 候选人：{{ data.meta.candidate_name }}
              </span>
              <span class="text-neutral-300">|</span>
              <span v-if="data.meta.target_position">
                目标岗位：{{ data.meta.target_position }}
              </span>
            </div>
            <div class="text-xs text-neutral-400 mt-2">分析时间：{{ today }}</div>
          </div>

          <!-- Score Ring (Visible on both) -->
          <div class="md:min-w-[360px] md:border-l md:border-neutral-100 md:pl-8">
            <h3
              class="text-sm font-medium text-neutral-500 mb-4 md:mb-3 md:font-semibold md:text-neutral-700 md:flex md:items-center md:justify-between"
            >
              <span class="md:hidden">分析得分</span>
              <span class="hidden md:inline"
                >总体评分 <InfoCircleOutlined class="text-neutral-400 font-normal ml-1"
              /></span>
            </h3>
            <AnalysisScoreRing
              :score="data.overall_score"
              :label="scoreLevel"
              :description="percentileText"
            />
            <p class="hidden md:block text-sm text-neutral-500 mt-4 leading-relaxed">
              {{ data.summary }}
            </p>
          </div>
        </div>

        <!-- 2. Main Content Grid -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
          <!-- Left Column -->
          <div class="md:col-span-3 space-y-6">
            <!-- Dimension Scores -->
            <div class="bg-white rounded-xl shadow-card p-5 md:p-6">
              <h3 class="hidden md:block text-base font-semibold text-neutral-700 mb-6">
                各维度评分
              </h3>

              <div class="md:flex md:items-center md:gap-8">
                <!-- Radar Chart (Hidden on mobile) -->
                <div class="hidden md:block w-full md:w-[45%]">
                  <RadarChart :dimensions="data.dimension_scores" />
                </div>

                <!-- Dimension Bars -->
                <div class="w-full md:w-[55%]">
                  <DimensionScoresSection :dimensions="data.dimension_scores" />
                </div>
              </div>
              <div class="hidden md:block text-xs text-neutral-400 mt-4 text-right">
                注：权重用于计算总体评分
              </div>
            </div>

            <!-- Weaknesses -->
            <div v-if="data.weaknesses.length" class="space-y-3">
              <h3 class="text-base font-semibold text-neutral-700 flex items-center gap-2">
                <WarningFilled class="text-red-500" />
                待改进点
              </h3>
              <WeaknessCard
                v-for="(weakness, index) in data.weaknesses"
                :key="index"
                :item="weakness"
              />
            </div>

            <!-- Footer tip (only on PC) -->
            <div class="hidden md:flex bg-blue-50/50 rounded-xl p-4 items-center gap-3">
              <div
                class="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center shrink-0"
              >
                <EditFilled />
              </div>
              <div class="text-sm text-neutral-600">
                <span class="font-bold text-neutral-800">小贴士</span
                ><span class="text-neutral-300 mx-2">|</span
                >一份优秀的简历应当突出你的核心竞争力，用数据和成果说话，让HR在30秒内看到你的价值。
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="md:col-span-2 space-y-6">
            <!-- Strengths Section -->
            <div v-if="data.strengths.length" class="space-y-3">
              <h3 class="text-base font-semibold text-neutral-700 flex items-center gap-2">
                <LikeFilled class="text-green-500" />
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
            <div v-if="data.suggestions.length" class="rounded-xl bg-white p-5 md:p-6 shadow-card">
              <h3 class="text-base font-semibold text-neutral-700 flex items-center gap-2 mb-4">
                <BulbFilled class="text-primary-500" />
                优化建议<span class="hidden md:inline">（行动清单）</span>
              </h3>
              <div class="divide-y divide-neutral-100">
                <SuggestionItem
                  v-for="(suggestion, index) in data.suggestions"
                  :key="index"
                  :item="suggestion"
                  :index="index"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
