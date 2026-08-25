<template>
  <div
    class="group relative bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-[#f0f0f0] flex flex-col h-full"
  >
    <div class="p-5 flex flex-col flex-1 justify-between gap-4">
      <div>
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="flex items-center gap-2 min-w-0">
            <QuestionCircleOutlined class="text-[#8c8c8c] shrink-0" />
            <h3
              class="text-[15px] font-[600] text-[#1a1a1a] leading-tight truncate"
              :title="metaText"
            >
              {{ record.targetPosition || "面试押题" }}
            </h3>
          </div>
          <a-tag :color="statusColor" class="shrink-0">{{ statusLabel }}</a-tag>
        </div>

        <p v-if="metaText" class="text-[13px] text-[#8c8c8c] mb-2 truncate">{{ metaText }}</p>

        <div class="flex flex-wrap gap-2 mb-3">
          <a-tag>共 {{ record.questionCount }} 道</a-tag>
          <a-tag>AI 押题</a-tag>
        </div>

        <p
          v-if="record.jobDescription"
          class="text-[13px] text-[#8c8c8c] leading-relaxed line-clamp-3"
        >
          {{ record.jobDescription }}
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
  FileTextOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons-vue";

import type { QuestionRecordDetail } from "@/api/resume-ai/type";
import { formatDate } from "@/utils/day";

const props = defineProps<{
  record: QuestionRecordDetail;
  deleting?: boolean;
}>();

const emit = defineEmits<{
  (e: "view", record: QuestionRecordDetail): void;
  (e: "openResume", record: QuestionRecordDetail): void;
  (e: "delete", record: QuestionRecordDetail): void;
}>();

const metaText = computed(() =>
  [props.record.candidateName, props.record.targetPosition, props.record.workYears]
    .filter(Boolean)
    .join(" · "),
);

const statusColor = computed(() => {
  const map: Record<string, string> = {
    completed: "success",
    generating: "processing",
    failed: "error",
  };
  return map[props.record.status] || "default";
});

const statusLabel = computed(() => {
  const map: Record<string, string> = {
    completed: "已完成",
    generating: "生成中",
    failed: "失败",
  };
  return map[props.record.status] || props.record.status;
});

const formattedTime = computed(() => {
  return props.record.createdAt ? formatDate(props.record.createdAt, "YYYY-MM-DD HH:mm") : "-";
});
</script>
