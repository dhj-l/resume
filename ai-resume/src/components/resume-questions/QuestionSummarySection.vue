<script setup lang="ts">
import {
  AimOutlined,
  CheckCircleFilled,
  FileTextOutlined,
  FireFilled,
} from "@ant-design/icons-vue";

import type { QuestionFocusArea } from "@/api/resume-ai/type";

interface Props {
  overview?: string;
  focusAreas?: QuestionFocusArea[];
  hotTopics?: string[];
  interviewTips?: string[];
}

defineProps<Props>();
</script>

<template>
  <div class="space-y-6">
    <!-- 综合押题说明 -->
    <section v-if="overview" class="bg-blue-50/60 rounded-xl p-5">
      <h3 class="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
        <FileTextOutlined class="text-primary-500" />
        综合押题说明
      </h3>
      <p class="text-sm text-gray-600 leading-relaxed">{{ overview }}</p>
    </section>

    <!-- 重点准备方向 -->
    <section v-if="focusAreas?.length" class="bg-white rounded-xl border border-gray-200 p-5">
      <h3 class="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
        <AimOutlined class="text-primary-500" />
        重点准备方向
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div v-for="(item, index) in focusAreas" :key="index" class="bg-gray-50 rounded-lg p-3">
          <p class="text-sm font-medium text-gray-800 mb-1">{{ item.area }}</p>
          <p class="text-xs text-gray-500 leading-relaxed">{{ item.reason }}</p>
        </div>
      </div>
    </section>

    <!-- 行业高频考点 -->
    <section v-if="hotTopics?.length" class="bg-white rounded-xl border border-gray-200 p-5">
      <h3 class="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
        <FireFilled class="text-orange-500" />
        行业高频考点
      </h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(topic, index) in hotTopics"
          :key="index"
          class="text-xs px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100"
        >
          {{ topic }}
        </span>
      </div>
    </section>

    <!-- 备战建议 -->
    <section v-if="interviewTips?.length" class="bg-white rounded-xl border border-gray-200 p-5">
      <h3 class="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
        <CheckCircleFilled class="text-green-500" />
        备战建议
      </h3>
      <ul class="space-y-2">
        <li v-for="(tip, index) in interviewTips" :key="index" class="flex items-start gap-2">
          <CheckCircleFilled class="text-green-400 mt-0.5 shrink-0" />
          <span class="text-sm text-gray-600 leading-relaxed">{{ tip }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
