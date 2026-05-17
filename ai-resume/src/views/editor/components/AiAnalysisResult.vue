<script setup lang="ts">
import { computed } from "vue";

import { CheckCircleOutlined, CloseCircleOutlined, BulbOutlined } from "@ant-design/icons-vue";

import type { AnalysisResult } from "@/api/resume-ai/type";

const props = defineProps<{
  data: AnalysisResult;
}>();

const result = computed(() => props.data.analysisResult);

const scoreColor = computed(() => {
  const score = result.value.overall_score;
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-500";
});

const scoreBarColor = (score: number) => {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-400";
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  high: { label: "高优先级", color: "bg-red-100 text-red-700" },
  medium: { label: "中优先级", color: "bg-orange-100 text-orange-700" },
  low: { label: "低优先级", color: "bg-green-100 text-green-700" },
};
</script>

<template>
  <div class="space-y-4">
    <!-- 总分 -->
    <div class="bg-gray-50 rounded-lg p-4 text-center">
      <p class="text-xs text-gray-500 mb-1">{{ result.meta.target_position }}</p>
      <p :class="['text-4xl font-bold', scoreColor]">{{ result.overall_score }}</p>
      <p class="text-xs text-gray-400 mt-1">综合匹配度</p>
    </div>

    <!-- 维度分数 -->
    <div class="bg-gray-50 rounded-lg p-4">
      <h4 class="text-sm font-medium text-gray-700 mb-3">维度评分</h4>
      <div class="space-y-3">
        <div v-for="dim in result.dimension_scores" :key="dim.name">
          <div class="flex justify-between text-xs text-gray-600 mb-1">
            <span>{{ dim.name }}</span>
            <span>{{ dim.score }}/{{ dim.max }}</span>
          </div>
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              :class="scoreBarColor(dim.score)"
              class="h-full rounded-full transition-all duration-500"
              :style="{ width: `${(dim.score / dim.max) * 100}%` }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 优势 -->
    <div v-if="result.strengths.length" class="bg-gray-50 rounded-lg p-4">
      <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1.5">
        <CheckCircleOutlined class="text-green-500" />
        优势
      </h4>
      <div class="space-y-3">
        <div v-for="(item, i) in result.strengths" :key="i" class="bg-white rounded-md p-3">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs px-1.5 py-0.5 bg-green-50 text-green-600 rounded">{{
              item.category
            }}</span>
            <span class="text-sm font-medium text-gray-800">{{ item.title }}</span>
          </div>
          <p class="text-xs text-gray-500 leading-relaxed">{{ item.description }}</p>
        </div>
      </div>
    </div>

    <!-- 待改进 -->
    <div v-if="result.weaknesses.length" class="bg-gray-50 rounded-lg p-4">
      <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1.5">
        <CloseCircleOutlined class="text-red-500" />
        待改进
      </h4>
      <div class="space-y-3">
        <div v-for="(item, i) in result.weaknesses" :key="i" class="bg-white rounded-md p-3">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs px-1.5 py-0.5 bg-red-50 text-red-600 rounded">{{
              item.category
            }}</span>
            <span class="text-sm font-medium text-gray-800">{{ item.title }}</span>
          </div>
          <p class="text-xs text-gray-500 leading-relaxed">{{ item.description }}</p>
          <p v-if="item.suggestion" class="text-xs text-blue-600 mt-2 leading-relaxed">
            建议：{{ item.suggestion }}
          </p>
        </div>
      </div>
    </div>

    <!-- 优化建议 -->
    <div v-if="result.suggestions.length" class="bg-gray-50 rounded-lg p-4">
      <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1.5">
        <BulbOutlined class="text-yellow-500" />
        优化建议
      </h4>
      <div class="space-y-2">
        <div v-for="(item, i) in result.suggestions" :key="i" class="flex items-start gap-2">
          <span
            :class="priorityConfig[item.priority]?.color"
            class="text-xs px-1.5 py-0.5 rounded shrink-0 mt-0.5"
          >
            {{ priorityConfig[item.priority]?.label }}
          </span>
          <p class="text-xs text-gray-600 leading-relaxed">{{ item.action }}</p>
        </div>
      </div>
    </div>

    <!-- 总结 -->
    <div class="bg-gray-50 rounded-lg p-4">
      <h4 class="text-sm font-medium text-gray-700 mb-2">总结</h4>
      <p class="text-xs text-gray-600 leading-relaxed">{{ result.summary }}</p>
    </div>
  </div>
</template>
