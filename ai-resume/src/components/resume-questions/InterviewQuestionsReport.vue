<script setup lang="ts">
import { ref } from "vue";

import { DownOutlined, UpOutlined } from "@ant-design/icons-vue";

import type { InterviewQuestionItem } from "@/api/resume-ai/type";

interface Props {
  questions: InterviewQuestionItem[];
  isDesktop?: boolean;
}

withDefaults(defineProps<Props>(), {
  isDesktop: true,
});

const expandedIndexes = ref<number[]>([]);

const difficultyClassMap: Record<string, string> = {
  基础: "bg-green-50 text-green-600 border-green-200",
  进阶: "bg-blue-50 text-blue-600 border-blue-200",
  高阶: "bg-purple-50 text-purple-600 border-purple-200",
};

const getDifficultyClass = (difficulty?: string) =>
  difficultyClassMap[difficulty ?? ""] ?? "bg-gray-50 text-gray-500 border-gray-200";

const isExpanded = (index: number) => expandedIndexes.value.includes(index);

const toggleExpand = (index: number) => {
  if (isExpanded(index)) {
    expandedIndexes.value = expandedIndexes.value.filter((item) => item !== index);
  } else {
    expandedIndexes.value = [...expandedIndexes.value, index];
  }
};
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-semibold text-gray-700">押题清单</h3>
      <span class="text-xs text-gray-400">共 {{ questions.length }} 道</span>
    </div>

    <div class="space-y-3">
      <div
        v-for="(item, index) in questions"
        :key="index"
        class="bg-white rounded-xl border border-gray-200 overflow-hidden"
      >
        <button
          type="button"
          class="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors"
          @click="toggleExpand(index)"
        >
          <span
            class="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center shrink-0 mt-0.5"
          >
            {{ index + 1 }}
          </span>
          <span class="flex-1 min-w-0">
            <span class="block text-sm font-medium text-gray-800 leading-relaxed">
              {{ item.question }}
            </span>
            <span class="flex items-center gap-2 mt-2">
              <span
                v-if="item.category"
                class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500"
              >
                {{ item.category }}
              </span>
              <span
                v-if="item.difficulty"
                class="text-xs px-2 py-0.5 rounded-full border"
                :class="getDifficultyClass(item.difficulty)"
              >
                {{ item.difficulty }}
              </span>
            </span>
          </span>
          <DownOutlined v-if="!isExpanded(index)" class="text-gray-300 text-xs mt-2 shrink-0" />
          <UpOutlined v-else class="text-gray-300 text-xs mt-2 shrink-0" />
        </button>

        <div v-show="isExpanded(index)" class="border-t border-gray-100 px-4 py-3 bg-gray-50/60">
          <p class="text-xs text-gray-400 mb-1">参考解答</p>
          <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {{ item.answer }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
