<script setup lang="ts">
import { onMounted, ref } from "vue";

import { ArrowLeftOutlined } from "@ant-design/icons-vue";
import { Button, Spin, message } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";

import { getQuestionDetailAPI } from "@/api/resume-ai/resume-ai";
import type { QuestionRecordDetail } from "@/api/resume-ai/type";
import InterviewQuestionsReport from "@/components/resume-questions/InterviewQuestionsReport.vue";

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const detail = ref<QuestionRecordDetail | null>(null);

const fetchData = async (id: string) => {
  loading.value = true;
  try {
    const res = await getQuestionDetailAPI(id);
    detail.value = res.data;
  } catch {
    message.error("获取押题详情失败");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const id = route.query.id as string;
  if (id) {
    fetchData(id);
  } else {
    loading.value = false;
    message.error("缺少押题记录 ID");
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div
      class="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 h-14 flex items-center gap-3"
    >
      <Button type="text" class="flex items-center" @click="router.back()">
        <template #icon><ArrowLeftOutlined /></template>
        返回
      </Button>
      <span class="text-sm text-gray-500">AI 押题详情</span>
    </div>

    <!-- Content -->
    <div class="max-w-3xl mx-auto py-4 px-4">
      <Spin :spinning="loading">
        <template v-if="detail && !loading">
          <div class="bg-white rounded-lg p-6 shadow-sm space-y-6">
            <!-- 基本信息 -->
            <div class="space-y-2">
              <div class="flex items-center justify-between gap-3">
                <h2 class="text-lg font-semibold text-gray-800">面试押题</h2>
                <span
                  v-if="detail.targetPosition || detail.workYears"
                  class="text-xs text-gray-400 shrink-0"
                >
                  {{ [detail.targetPosition, detail.workYears].filter(Boolean).join(" · ") }}
                </span>
              </div>
              <div v-if="detail.jobDescription" class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-400 mb-1">目标职位描述</p>
                <p
                  class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap max-h-24 overflow-hidden"
                >
                  {{ detail.jobDescription }}
                </p>
              </div>
            </div>

            <div v-if="detail.status === 'completed' && detail.result?.length">
              <InterviewQuestionsReport :questions="detail.result" />
            </div>
            <div v-else class="py-12 text-center text-gray-400">
              <p>
                {{
                  detail.status === "failed"
                    ? `押题失败：${detail.failReason || "未知原因"}`
                    : "押题尚未完成"
                }}
              </p>
            </div>
          </div>
        </template>
      </Spin>
    </div>
  </div>
</template>
