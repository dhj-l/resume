<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { ArrowLeftOutlined, DownloadOutlined } from "@ant-design/icons-vue";
import { useElementSize } from "@vueuse/core";
import { Button, Spin, message } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";

import { exportAnalysisAPI, getAnalysisDetailAPI } from "@/api/resume-ai/resume-ai";
import type { AnalysisDetailResult } from "@/api/resume-ai/type";
import ResumeAnalysisReport from "@/components/resume-analysis/ResumeAnalysisReport.vue";
import { downloadFile } from "@/utils/download";

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const exportLoading = ref(false);
const detail = ref<AnalysisDetailResult | null>(null);

const contentRef = ref<HTMLElement>();
const { width } = useElementSize(contentRef);
const isDesktop = computed(() => width.value >= 768);

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

const handleExport = async () => {
  const id = route.query.id as string;
  if (!id) return;
  exportLoading.value = true;
  try {
    const res = await exportAnalysisAPI(id);
    downloadFile(res, "分析报告.md", "text/markdown");
    message.success("导出成功");
  } catch {
    message.error("导出失败");
  } finally {
    exportLoading.value = false;
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
      <Button type="text" class="flex items-center" @click="router.back()">
        <template #icon><ArrowLeftOutlined /></template>
        返回
      </Button>
      <span class="text-sm text-gray-500">AI 分析详情</span>
      <div class="ml-auto">
        <Button
          type="primary"
          :loading="exportLoading"
          class="flex items-center"
          @click="handleExport"
        >
          <template #icon><DownloadOutlined /></template>
          导出报告
        </Button>
      </div>
    </div>

    <!-- Content -->
    <div ref="contentRef" class="w-full mx-auto py-4 px-2">
      <Spin :spinning="loading">
        <template v-if="detail && !loading">
          <div class="bg-white rounded-lg p-6 shadow-sm space-y-6">
            <!-- JD Info -->
            <!-- <div>
              <h3 class="text-sm font-medium text-gray-700 mb-2">目标职位描述</h3>
              <p class="text-xs text-gray-500 leading-relaxed whitespace-pre-wrap">
                {{ detail.jobDescription }}
              </p>
            </div>

            <div class="border-t border-gray-100" /> -->

            <!-- Analysis Result -->
            <ResumeAnalysisReport :data="detail.analysisResult" :is-desktop="isDesktop" />
          </div>
        </template>
      </Spin>
    </div>
  </div>
</template>
