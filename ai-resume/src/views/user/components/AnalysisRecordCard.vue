<template>
  <div
    class="group relative bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-[#f0f0f0] flex flex-col h-full"
  >
    <div class="p-5 flex flex-col flex-1 justify-between gap-4">
      <div>
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="flex items-center gap-2 min-w-0">
            <FileSearchOutlined class="text-[#8c8c8c] shrink-0" />
            <h3
              class="text-[15px] font-[600] text-[#1a1a1a] leading-tight truncate"
              :title="jobTitle"
            >
              {{ jobTitle }}
            </h3>
          </div>
          <a-tag :color="statusColor" class="shrink-0">{{ statusLabel }}</a-tag>
        </div>

        <div class="flex flex-wrap gap-2 mb-3">
          <a-tag v-if="overallScore !== null">综合评分 {{ overallScore }}</a-tag>
          <a-tag>AI 分析</a-tag>
        </div>

        <p v-if="jobDescription" class="text-[13px] text-[#8c8c8c] leading-relaxed line-clamp-3">
          {{ jobDescription }}
        </p>
      </div>

      <div class="flex items-center justify-between pt-3 border-t border-[#f0f0f0] gap-3">
        <div class="text-[13px] text-[#8c8c8c] flex items-center gap-1.5">
          <CalendarOutlined />
          <span>{{ formattedTime }}</span>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <a-button
            size="small"
            class="flex items-center whitespace-nowrap"
            @click="emit('openResume', record)"
          >
            <template #icon><FileTextOutlined /></template>
            打开简历
          </a-button>
          <a-popconfirm
            title="确定删除该记录吗？"
            ok-text="删除"
            cancel-text="取消"
            :ok-button-props="{ danger: true }"
            @confirm="emit('delete', record)"
          >
            <a-button
              type="text"
              size="small"
              danger
              class="flex items-center"
              :loading="deleting"
              title="删除"
            >
              <template #icon><DeleteOutlined /></template>
            </a-button>
          </a-popconfirm>
          <a-button
            type="primary"
            size="small"
            class="flex items-center whitespace-nowrap"
            @click="$emit('view', record)"
          >
            <template #icon><EyeOutlined /></template>
            查看详情
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import {
  CalendarOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileSearchOutlined,
  FileTextOutlined,
} from "@ant-design/icons-vue";

import type { AnalysisDetailResult } from "@/api/resume-ai/type";
import { formatDate } from "@/utils/day";

const props = defineProps<{
  record: AnalysisDetailResult;
  deleting?: boolean;
}>();

const emit = defineEmits<{
  (e: "view", record: AnalysisDetailResult): void;
  (e: "openResume", record: AnalysisDetailResult): void;
  (e: "delete", record: AnalysisDetailResult): void;
}>();

const jobTitle = computed(() => {
  const firstLine = props.record.jobDescription?.split("\n")[0];
  return firstLine || "未知职位";
});

const jobDescription = computed(() => {
  const lines = props.record.jobDescription?.split("\n");
  if (!lines || lines.length <= 1) return "";
  return lines.slice(1).join("\n").trim();
});

const statusColor = computed(() => {
  const map: Record<string, string> = {
    completed: "success",
    analyzing: "processing",
    failed: "error",
  };
  return map[props.record.status] || "default";
});

const statusLabel = computed(() => {
  const map: Record<string, string> = {
    completed: "已完成",
    analyzing: "分析中",
    failed: "失败",
  };
  return map[props.record.status] || props.record.status;
});

const overallScore = computed(() => {
  const score = props.record.analysisResult?.overall_score;
  return typeof score === "number" ? score : null;
});

const formattedTime = computed(() => {
  return props.record.createdAt ? formatDate(props.record.createdAt, "YYYY-MM-DD HH:mm") : "-";
});
</script>
