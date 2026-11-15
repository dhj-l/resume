<template>
  <RecordListPage
    title="押题记录"
    subtitle="查看你的 AI 面试押题历史记录"
    search-placeholder="搜索职位 / JD / 候选人关键词"
    :status-options="statusOptions"
    :fetch-records="getQuestionRecordsAPI"
    :delete-record="deleteQuestionRecordAPI"
    :empty-icon="QuestionCircleOutlined"
    empty-title="暂无押题记录"
    empty-description="去编辑简历体验 AI 押题吧"
    empty-action-text="查看我的简历"
    empty-action-path="/user/resumes"
  >
    <template #card="{ item, remove, deleting }">
      <QuestionRecordCard
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
import { QuestionCircleOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

import { deleteQuestionRecordAPI, getQuestionRecordsAPI } from "@/api/resume-ai/resume-ai";
import type { QuestionRecordDetail } from "@/api/resume-ai/type";
import QuestionRecordCard from "@/views/user/components/QuestionRecordCard.vue";
import RecordListPage from "@/views/user/components/RecordListPage.vue";

const router = useRouter();

const statusOptions = [
  { label: "生成中", value: "generating" },
  { label: "已完成", value: "completed" },
  { label: "失败", value: "failed" },
];

const handleView = (record: QuestionRecordDetail) => {
  router.push({ path: "/question-detail", query: { id: record._id } });
};

const handleOpenResume = (record: QuestionRecordDetail) => {
  if (!record.resumeId) {
    message.warning("该记录暂无关联简历，无法打开");
    return;
  }
  router.push({ path: "/editor", query: { id: record.resumeId } });
};
</script>
