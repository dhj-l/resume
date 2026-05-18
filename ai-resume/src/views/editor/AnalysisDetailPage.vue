<script setup lang="ts">
import { onMounted, ref } from "vue";

import { Button, Spin, message } from "ant-design-vue";
import { ArrowLeftOutlined } from "@ant-design/icons-vue";
import { useRoute, useRouter } from "vue-router";

import { getAnalysisDetailAPI } from "@/api/resume-ai/resume-ai";
import type { AnalysisDetailResult } from "@/api/resume-ai/type";

import ResumeAnalysisReport from "@/components/resume-analysis/ResumeAnalysisReport.vue";

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const detail = ref<AnalysisDetailResult | null>(null);

const fetchData = async (id: string) => {
  loading.value = true;
  try {
    const res = await getAnalysisDetailAPI(id);
    detail.value = res.data;
  } catch {
    message.error("获取分析详情失败");
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
    message.error("缺少分析记录 ID");
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div
      class="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 h-14 flex items-center gap-3"
    >
      <Button type="text" @click="router.back()">
        <template #icon><ArrowLeftOutlined /></template>
        返回
      </Button>
      <span class="text-sm text-gray-500">AI 分析详情</span>
    </div>

    <!-- Content -->
    <div class="w-full mx-auto py-8 px-4">
      <Spin :spinning="loading">
        <template v-if="detail && !loading">
          <div class="bg-white rounded-lg p-6 shadow-sm space-y-6">
            <!-- JD Info -->
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-2">目标职位描述</h3>
              <p class="text-xs text-gray-500 leading-relaxed whitespace-pre-wrap">
                {{ detail.jobDescription }}
              </p>
            </div>

            <div class="border-t border-gray-100" />

            <!-- Analysis Result -->
            <ResumeAnalysisReport :data="detail.analysisResult" />
          </div>
        </template>
      </Spin>
    </div>
  </div>
</template>
