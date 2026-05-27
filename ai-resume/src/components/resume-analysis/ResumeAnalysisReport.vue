<script setup lang="ts">
import { computed, provide } from "vue";

import {
  UserOutlined,
  InfoCircleOutlined,
  LikeFilled,
  WarningFilled,
  BulbFilled,
  EditFilled,
} from "@ant-design/icons-vue";
import { Spin } from "ant-design-vue";

import AnalysisScoreRing from "./AnalysisScoreRing.vue";
import DimensionScoresSection from "./DimensionScoresSection.vue";
import RadarChart from "./RadarChart.vue";
import StrengthCard from "./StrengthCard.vue";
import SuggestionItem from "./SuggestionItem.vue";
import { ContainerWidthKey, getScoreLevel } from "./types";
import type { ResumeAnalysisData } from "./types";
import WeaknessCard from "./WeaknessCard.vue";

interface Props {
  data: ResumeAnalysisData;
  loading?: boolean;
  isDesktop?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  isDesktop: true,
});

provide(
  ContainerWidthKey,
  computed(() => props.isDesktop),
);

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
  <div class="w-full mx-auto py-6 animate-fade-in" :class="isDesktop ? 'px-8' : 'px-4'">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <Spin size="large" tip="AI 正在分析简历..." />
    </div>

    <template v-else>
      <div class="space-y-6">
        <!-- Mobile Title -->
        <div v-if="!isDesktop">
          <h1 class="text-xl font-bold text-neutral-700">AI简历分析</h1>
        </div>

        <!-- 1. Header Card (Title, Info, Score Ring) -->
        <div
          class="bg-white rounded-xl shadow-card gap-6"
          :class="isDesktop ? 'p-6 flex items-start justify-between' : 'p-5'"
        >
          <!-- Desktop Title & Meta (Hidden on mobile) -->
          <div v-if="isDesktop" class="space-y-4 w-[500px]">
            <div class="flex items-center gap-3">
              <h1 class="text-2xl font-bold text-neutral-700">
                简历分析报告
                <span
                  class="text-sm font-normal text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full ml-2"
                  >v{{ data.meta.analysis_version || "1.0" }}</span
                >
              </h1>
            </div>
            <div class="flex items-start flex-col gap-4 text-sm text-neutral-500 mt-4">
              <span v-if="data.meta.candidate_name" class="flex items-center gap-1">
                <UserOutlined /> 候选人：<span class="font-bold">{{
                  data.meta.candidate_name
                }}</span>
              </span>
              <!-- <span class="text-neutral-300">|</span> -->
              <span v-if="data.meta.target_position">
                目标岗位：<span class="font-bold">{{ data.meta.target_position }}</span>
              </span>
            </div>
            <div class="text-xs text-neutral-400 mt-2">分析时间：{{ today }}</div>
          </div>

          <!-- Score Ring (Visible on both) -->
          <div :class="isDesktop ? 'min-w-[360px] border-l border-neutral-100 pl-8' : ''">
            <h3
              class="text-sm"
              :class="
                isDesktop
                  ? 'font-semibold text-neutral-700 mb-3 flex items-center justify-between'
                  : 'font-medium text-neutral-500 mb-4'
              "
            >
              <span v-if="!isDesktop">分析得分</span>
              <span v-if="isDesktop"
                >总体评分 <InfoCircleOutlined class="text-neutral-400 font-normal ml-1"
              /></span>
            </h3>
            <AnalysisScoreRing
              :score="data.overall_score"
              :label="scoreLevel"
              :description="percentileText"
            />
            <p v-if="isDesktop" class="text-sm text-neutral-500 mt-4 leading-relaxed">
              {{ data.summary }}
            </p>
          </div>
        </div>

        <!-- 2. Main Content Grid -->
        <div class="grid gap-6" :class="isDesktop ? 'grid-cols-5' : 'grid-cols-1'">
          <!-- Left Column -->
          <div class="space-y-6" :class="isDesktop ? 'col-span-3' : ''">
            <!-- Dimension Scores -->
            <div class="bg-white rounded-xl shadow-card" :class="isDesktop ? 'p-6' : 'p-5'">
              <h3 v-if="isDesktop" class="text-base font-semibold text-neutral-700 mb-6">
                各维度评分
              </h3>

              <div :class="isDesktop ? 'flex items-center gap-8' : ''">
                <!-- Radar Chart (Hidden on mobile) -->
                <div :class="isDesktop ? 'w-[45%]' : 'hidden'">
                  <RadarChart :dimensions="data.dimension_scores" />
                </div>

                <!-- Dimension Bars -->
                <div :class="isDesktop ? 'w-[55%]' : 'w-full'">
                  <DimensionScoresSection :dimensions="data.dimension_scores" />
                </div>
              </div>
              <div v-if="isDesktop" class="text-xs text-neutral-400 mt-4 text-right">
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
            <div v-if="isDesktop" class="flex bg-blue-50/50 rounded-xl p-4 items-center gap-3">
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
          <div class="space-y-6" :class="isDesktop ? 'col-span-2' : ''">
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
            <div
              v-if="data.suggestions.length"
              class="rounded-xl bg-white shadow-card"
              :class="isDesktop ? 'p-6' : 'p-5'"
            >
              <h3 class="text-base font-semibold text-neutral-700 flex items-center gap-2 mb-4">
                <BulbFilled class="text-primary-500" />
                优化建议<span v-if="isDesktop">（行动清单）</span>
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
