<template>
  <RecordListPage
    title="生成记录"
    subtitle="查看你的 AI 简历生成历史记录"
    search-placeholder="搜索职位 / JD 关键词"
    :status-options="statusOptions"
    :fetch-records="getGenerationRecordsAPI"
    :delete-record="deleteGenerationRecordAPI"
    :empty-icon="FileOutlined"
    empty-title="暂无生成记录"
    empty-description="去模板市场开始生成你的第一份 AI 简历吧"
    empty-action-text="去选模板"
    empty-action-path="/templates"
  >
    <template #card="{ item, remove, deleting }">
      <GenerationRecordCard
        :record="item"
        :deleting="deleting"
        @view="handleView"
        @delete="remove"
      />
    </template>
  </RecordListPage>
</template>

<script setup lang="ts">
import { FileOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

import { deleteGenerationRecordAPI, getGenerationRecordsAPI } from "@/api/resume-ai/resume-ai";
import type { GenerationRecord } from "@/api/resume-ai/type";
import GenerationRecordCard from "@/views/user/components/GenerationRecordCard.vue";
import RecordListPage from "@/views/user/components/RecordListPage.vue";

const router = useRouter();

const statusOptions = [
  { label: "生成中", value: "creating" },
  { label: "已完成", value: "completed" },
  { label: "失败", value: "failed" },
];

const handleView = (record: GenerationRecord) => {
  // 后端回传的 resumeId 才是可打开的简历 ID（记录自身 _id 不是简历 ID）
  if (!record.resumeId) {
    message.warning("该生成记录暂无关联简历，无法打开");
    return;
  }
  router.push({ path: "/editor", query: { id: record.resumeId } });
};
</script>
