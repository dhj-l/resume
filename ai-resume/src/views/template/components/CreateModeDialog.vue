<template>
  <a-modal
    :open="open"
    title="选择创建方式"
    :width="800"
    :footer="null"
    class="create-mode-modal"
    @cancel="handleCancel"
  >
    <div class="py-8 px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Manual Input -->
        <div
          class="group relative flex flex-col items-center p-6 bg-white border border-slate-200 rounded-xl hover:border-primary-500 hover:shadow-lg hover:shadow-primary-500/10 transition-all cursor-pointer"
          @click="handleSelect('manual')"
        >
          <div
            class="w-16 h-16 mb-4 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors"
          >
            <EditOutlined class="text-[32px]" />
          </div>
          <h3 class="text-lg font-bold text-slate-800 mb-2">手动输入</h3>
          <p class="text-slate-500 text-sm text-center leading-relaxed">
            填写核心信息，AI 帮您生成高质量简历内容
          </p>
          <div
            class="absolute inset-0 border-2 border-transparent group-hover:border-primary-500 rounded-xl transition-colors pointer-events-none"
          ></div>
        </div>

        <!-- Select Existing -->
        <div
          class="group relative flex flex-col items-center p-6 bg-white border border-slate-200 rounded-xl hover:border-primary-500 hover:shadow-lg hover:shadow-primary-500/10 transition-all cursor-pointer"
          @click="handleSelect('select')"
        >
          <div
            class="w-16 h-16 mb-4 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors"
          >
            <CopyOutlined class="text-[32px]" />
          </div>
          <h3 class="text-lg font-bold text-slate-800 mb-2">选择已有简历</h3>
          <p class="text-slate-500 text-sm text-center leading-relaxed">
            复用已有简历数据，一键应用新模板
          </p>
          <div
            class="absolute inset-0 border-2 border-transparent group-hover:border-primary-500 rounded-xl transition-colors pointer-events-none"
          ></div>
        </div>

        <!-- Upload External -->
        <div
          class="group relative flex flex-col items-center p-6 bg-white border border-slate-200 rounded-xl hover:border-primary-500 hover:shadow-lg hover:shadow-primary-500/10 transition-all cursor-pointer"
          @click="handleSelect('upload')"
        >
          <div
            class="w-16 h-16 mb-4 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors"
          >
            <CloudUploadOutlined class="text-[32px]" />
          </div>
          <h3 class="text-lg font-bold text-slate-800 mb-2">外部上传简历</h3>
          <p class="text-slate-500 text-sm text-center leading-relaxed">
            支持 PDF/Word 解析，智能提取简历信息
          </p>
          <div
            class="absolute inset-0 border-2 border-transparent group-hover:border-primary-500 rounded-xl transition-colors pointer-events-none"
          ></div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { EditOutlined, CopyOutlined, CloudUploadOutlined } from "@ant-design/icons-vue";

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "select", mode: "manual" | "select" | "upload"): void;
}>();

const handleCancel = () => {
  emit("update:open", false);
};

const handleSelect = (mode: "manual" | "select" | "upload") => {
  emit("select", mode);
};
</script>

<style scoped>
.create-mode-modal :deep(.ant-modal-content) {
  border-radius: 1rem;
  overflow: hidden;
}
.create-mode-modal :deep(.ant-modal-header) {
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1rem;
  margin-bottom: 0;
}
</style>
