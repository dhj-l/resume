<template>
  <div
    class="group relative bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-[#f0f0f0] flex flex-col h-full"
  >
    <div class="p-5 flex flex-col flex-1 justify-between gap-4">
      <div>
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="flex items-center gap-2 min-w-0">
            <FileTextOutlined class="text-[#8c8c8c] shrink-0" />
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
          <a-tag>{{ templateTypeLabel }}</a-tag>
          <a-tag>{{ parseTypeLabel }}</a-tag>
        </div>

        <p v-if="jobDescription" class="text-[13px] text-[#8c8c8c] leading-relaxed line-clamp-3">
          {{ jobDescription }}
        </p>
      </div>

      <div class="flex items-center justify-between pt-3 border-t border-[#f0f0f0]">
        <div class="text-[13px] text-[#8c8c8c] flex items-center gap-1.5">
          <CalendarOutlined />
          <span>{{ formattedTime }}</span>
        </div>
        <a-button
          type="primary"
          size="small"
          class="flex items-center"
          @click="$emit('view', record._id)"
        >
          <template #icon><EyeOutlined /></template>
          查看
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { CalendarOutlined, EyeOutlined, FileTextOutlined } from "@ant-design/icons-vue";

import type { GenerationRecord } from "@/api/resume-ai/type";
import { formatDate } from "@/utils/day";
import { templateList } from "@/views/editor/templates";

const props = defineProps<{
  record: GenerationRecord;
}>();

defineEmits<{
  (e: "view", id: string): void;
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
    processing: "processing",
    failed: "error",
  };
  return map[props.record.status] || "default";
});

const statusLabel = computed(() => {
  const map: Record<string, string> = {
    completed: "已完成",
    processing: "生成中",
    failed: "失败",
  };
  return map[props.record.status] || props.record.status;
});

const parseTypeLabel = computed(() => {
  const map: Record<string, string> = {
    upload: "上传简历",
    select: "选择模板",
    manual: "手动填写",
  };
  return map[props.record.parseType] || props.record.parseType;
});

const formattedTime = computed(() => {
  return props.record.createdAt ? formatDate(props.record.createdAt, "YYYY-MM-DD HH:mm") : "-";
});
const templateTypeLabel = computed(() => {
  const label =
    templateList.find((item) => item.value === props.record.templateType)?.label ||
    props.record.templateType;
  return label;
});
</script>
