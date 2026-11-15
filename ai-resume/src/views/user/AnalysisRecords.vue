<template>
  <RecordListPage
    title="分析记录"
    subtitle="查看你的 AI 简历分析历史记录"
    search-placeholder="搜索职位 / JD / 候选人关键词"
    :status-options="statusOptions"
    :fetch-records="getAnalysisRecordsAPI"
    :delete-record="deleteAnalysisRecordAPI"
    :empty-icon="FileSearchOutlined"
    empty-title="暂无分析记录"
    empty-description="去编辑简历体验 AI 分析吧"
    empty-action-text="查看我的简历"
    empty-action-path="/user/resumes"
  >
    <template #card="{ item, remove, deleting }">
      <AnalysisRecordCard
        :record="item"
        :deleting="deleting"
        @view="handleView"
        @open-resume="handleOpenResume"
        @delete="remove"
      />
    </template>
  </RecordListPage>
</template>

<script setup lang="ts">
import { FileSearchOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

import { deleteAnalysisRecordAPI, getAnalysisRecordsAPI } from "@/api/resume-ai/resume-ai";
import type { AnalysisDetailResult } from "@/api/resume-ai/type";
import AnalysisRecordCard from "@/views/user/components/AnalysisRecordCard.vue";
import RecordListPage from "@/views/user/components/RecordListPage.vue";

const router = useRouter();

const statusOptions = [
  { label: "分析中", value: "analyzing" },
  { label: "已完成", value: "completed" },
  { label: "失败", value: "failed" },
];

const handleView = (record: AnalysisDetailResult) => {
  router.push({ path: "/analysis-detail", query: { id: record._id } });
};

const handleOpenResume = (record: AnalysisDetailResult) => {
  if (!record.resumeId) {
    message.warning("该记录暂无关联简历，无法打开");
    return;
  }
  router.push({ path: "/editor", query: { id: record.resumeId } });
};
</script>
