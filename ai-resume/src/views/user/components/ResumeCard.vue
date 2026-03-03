<template>
  <div
    class="group relative bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-[#f0f0f0] flex flex-col h-full"
  >
    <div
      class="relative w-full aspect-[210/297] overflow-hidden bg-gray-100 p-2"
    >
      <img
        v-if="resume.cover"
        :src="coverUrl"
        :alt="resume.title || '简历封面'"
        class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 shadow-sm rounded-sm"
      />
      <div
        v-else
        class="w-full h-full bg-slate-200 flex flex-col items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-300 rounded-sm"
      >
        <FileTextOutlined class="text-4xl" />
        <span class="mt-2 text-sm">暂无封面</span>
      </div>

      <div
        class="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[1px]"
      />
    </div>

    <div class="p-4 bg-white flex flex-col flex-1 justify-between gap-4">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <FileTextOutlined class="text-[#8c8c8c]" />
            <h3
              class="text-[15px] font-[600] text-[#1a1a1a] leading-tight truncate"
              :title="resume.title"
            >
              {{ resume.title || "未命名简历" }}
            </h3>
          </div>
          <div
            class="mt-2 text-[13px] text-[#8c8c8c] flex items-center gap-1.5"
          >
            <CalendarOutlined />
            <span>更新时间：</span>
            <span>{{ formattedTime }}</span>
          </div>
        </div>

        <a-tag v-if="resume.isTemplate" color="blue">模板</a-tag>
      </div>

      <div class="flex items-center justify-end gap-2">
        <a-button
          type="primary"
          :loading="editLoading"
          @click="$emit('edit', resume._id)"
        >
          <template #icon><EditOutlined /></template>
          编辑
        </a-button>
        <a-tooltip title="复制简历">
          <a-button :loading="copyLoading" @click="$emit('copy', resume._id)">
            <template #icon><CopyOutlined /></template>
            复制
          </a-button>
        </a-tooltip>
        <a-button
          danger
          :loading="deleteLoading"
          @click="$emit('delete', { id: resume._id, title: resume.title })"
        >
          <template #icon><DeleteOutlined /></template>
          删除
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  CalendarOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
} from "@ant-design/icons-vue";
import type { UserResumeListItem } from "@/api/resume/type";
import { formatDate } from "@/utils/day";
import { getFullImageUrl } from "@/utils/image";

const props = defineProps<{
  resume: UserResumeListItem;
  editLoading?: boolean;
  deleteLoading?: boolean;
  copyLoading?: boolean;
}>();

defineEmits<{
  (e: "edit", id: string): void;
  (e: "delete", payload: { id: string; title: string }): void;
  (e: "copy", id: string): void;
}>();

const coverUrl = computed(() => {
  const cover = props.resume.cover;

  return getFullImageUrl(cover || "");
});

const formattedTime = computed(() => {
  const t = props.resume.updatedAt ?? props.resume.createdAt;
  return t ? formatDate(t, "YYYY-MM-DD HH:mm") : "-";
});
</script>
