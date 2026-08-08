<template>
  <a-alert
    class="rounded-none border-x-0"
    :type="alertType"
    :show-icon="true"
    :closable="closable"
    :message="title"
    :description="description"
    @close="$emit('dismiss')"
  >
    <template v-if="status === 'interrupted'" #action>
      <a-button size="small" type="primary" @click="$emit('confirm-interrupt')"> 知道了 </a-button>
    </template>
  </a-alert>
</template>

<script setup lang="ts">
import { computed } from "vue";

export type AiBannerStatus = "generating" | "completed" | "failed" | "interrupted";

const props = defineProps<{
  status: AiBannerStatus;
  current?: number;
  total?: number;
  label?: string;
  error?: string;
}>();

defineEmits<{
  (e: "dismiss"): void;
  (e: "confirm-interrupt"): void;
}>();

const alertType = computed(() => {
  switch (props.status) {
    case "completed":
      return "success";
    case "failed":
      return "error";
    case "interrupted":
      return "warning";
    default:
      return "info";
  }
});

const closable = computed(() => props.status !== "interrupted");

const title = computed(() => {
  switch (props.status) {
    case "generating":
      return `AI 生成中：${props.current ?? 0}/${props.total ?? 0} · 正在生成${props.label ?? ""}`;
    case "completed":
      return "AI 生成完成，可以开始编辑了";
    case "failed":
      return `AI 生成失败：${props.error || "未知错误"}`;
    case "interrupted":
      return "生成已中断，已完成内容已保存";
    default:
      return "";
  }
});

const description = computed(() => {
  switch (props.status) {
    case "generating":
      return "生成完成前编辑功能已锁定，预览会随生成实时更新。";
    case "failed":
      return "已生成的内容已保留，可继续编辑或重新生成。";
    case "interrupted":
      return "刷新导致生成中断，可继续编辑已生成内容或重新生成。";
    default:
      return "";
  }
});
</script>
