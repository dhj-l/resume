<template>
  <a-modal
    :open="open"
    title="上传简历"
    :width="600"
    :footer="null"
    @cancel="handleCancel"
    class="upload-resume-modal"
  >
    <div class="py-8 px-4 flex flex-col items-center">
      <div
        class="w-full max-w-md p-8 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center min-h-[200px]"
      >
        <div class="flex flex-col items-center text-center">
          <CloudUploadOutlined class="text-5xl text-slate-400 mb-4" />
          <p class="text-lg font-medium text-slate-700 mb-2">
            点击或拖拽文件到此处
          </p>
          <p
            class="text-sm text-slate-500 flex items-center justify-center gap-1"
          >
            <InfoCircleOutlined />
            支持 PDF, Word, TXT 格式 (最大 10MB)
          </p>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { CloudUploadOutlined, InfoCircleOutlined } from "@ant-design/icons-vue";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "submit", data: any): void; // Data structure depends on parsed result
}>();

const handleCancel = () => {
  emit("update:open", false);
};
</script>

<style scoped>
.upload-resume-modal :deep(.ant-modal-content) {
  border-radius: 1rem;
  overflow: hidden;
}
.upload-resume-modal :deep(.ant-modal-header) {
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1rem;
  margin-bottom: 0;
}
</style>
