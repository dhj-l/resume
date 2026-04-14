<template>
  <a-modal
    :open="open"
    title="导入简历与岗位要求"
    :width="800"
    :mask-closable="false"
    :keyboard="false"
    :ok-button-props="{
      disabled: !isValid || loading || submitting,
      loading: loading || submitting,
    }"
    ok-text="确定"
    cancel-text="取消"
    class="upload-resume-modal"
    @cancel="handleCancel"
    @ok="handleConfirm"
  >
    <div class="py-4 px-4 space-y-6">
      <!-- Section 1: Resume Content -->
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-slate-700">
            简历内容解析
            <span v-if="localResumeText" class="text-slate-400 text-xs ml-2 font-normal">
              (可编辑，已解析 {{ localResumeText.length }} 字)
            </span>
          </label>
          <a-button
            v-if="localResumeText"
            type="link"
            size="small"
            danger
            :disabled="loading"
            @click="clearResume"
          >
            重新上传
          </a-button>
        </div>

        <!-- Upload Area -->
        <div v-if="!localResumeText" class="relative">
          <a-upload-dragger
            name="file"
            :multiple="false"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :custom-request="handleUpload"
            accept=".pdf,.doc,.docx"
            class="block"
            :disabled="loading"
          >
            <div
              class="p-8 flex flex-col items-center justify-center min-h-[240px] transition-colors"
            >
              <div v-if="loading" class="text-center space-y-4">
                <a-spin size="large" />
                <p class="text-slate-600 font-medium">正在智能解析简历中...</p>
                <p class="text-slate-400 text-xs">AI 正在识别关键信息，请稍候</p>
              </div>
              <div v-else class="text-center space-y-3">
                <div
                  class="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-2"
                >
                  <CloudUploadOutlined class="text-3xl" />
                </div>
                <p class="text-lg font-medium text-slate-700">点击或拖拽简历文件到此处</p>
                <p class="text-sm text-slate-500">支持 PDF, Word (doc/docx) 格式，最大 5MB</p>
              </div>
            </div>
          </a-upload-dragger>
        </div>

        <!-- Text Area (Edit Mode) -->
        <div v-else>
          <a-textarea
            v-model:value="localResumeText"
            placeholder="简历内容将在此显示..."
            :rows="10"
            :maxlength="5000"
            show-count
            class="!resize-none !text-sm !leading-relaxed"
            :status="!localResumeText ? 'error' : ''"
          />
        </div>
      </div>

      <!-- Section 2: JD Input -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-slate-700">
          岗位描述 (JD)
          <span class="text-slate-400 text-xs ml-2 font-normal">
            (粘贴职位描述，AI 将针对性优化简历)
          </span>
        </label>
        <a-textarea
          v-model:value="localJdText"
          placeholder="请输入或粘贴目标岗位的职位描述（JD）..."
          :rows="6"
          :maxlength="2000"
          show-count
          class="!resize-none !text-sm !leading-relaxed"
          :status="jdError ? 'error' : ''"
          @change="jdError = ''"
        />
        <div v-if="jdError" class="text-red-500 text-xs mt-1">
          {{ jdError }}
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

import { CloudUploadOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { UploadProps } from "ant-design-vue";

import { parseResumeAPI } from "@/api/resume/resume";

/**
 * Props Definition
 */
interface Props {
  open: boolean;
  submitting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  submitting: false,
});

/**
 * Emits Definition
 */
const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "submit", payload: { resumeText: string; jdText: string }): void;
}>();

/**
 * State Management
 */
const loading = ref(false);
const jdError = ref("");

// 使用 ref 管理组件内部状态，不再依赖父组件的 props 回流
// 这样可以确保数据流单向，且组件内部状态自洽
const localResumeText = ref("");
const localJdText = ref("");

/**
 * Validation
 */
const isValid = computed(() => {
  return localResumeText.value.trim().length > 0 && localJdText.value.trim().length > 0;
});

/**
 * File Upload Handlers
 */
const beforeUpload: UploadProps["beforeUpload"] = (file) => {
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error("文件大小不能超过 5MB!");
    return false; // Prevent upload
  }

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  // Note: File type checking can be tricky across browsers, relying on extension is also common practice if MIME types fail
  const fileName = file.name.toLowerCase();
  const isAllowedExt =
    fileName.endsWith(".pdf") || fileName.endsWith(".doc") || fileName.endsWith(".docx");

  if (!allowedTypes.includes(file.type) && !isAllowedExt) {
    message.error("只支持 PDF, DOC, DOCX 格式文件!");
    return false;
  }

  return true;
};

const handleUpload = async (options: any) => {
  const { file, onSuccess } = options;
  loading.value = true;
  try {
    const res = await parseResumeAPI(file);
    localResumeText.value = res.data;
    message.success("简历解析成功");
    onSuccess(res.data);
  } finally {
    loading.value = false;
  }
};

/**
 * Actions
 */
const clearResume = () => {
  localResumeText.value = "";
};

const handleCancel = () => {
  if (loading.value || props.submitting) return;
  emit("update:open", false);
};

const handleConfirm = () => {
  if (!localResumeText.value.trim()) {
    message.warning("请先上传或输入简历内容");
    return;
  }
  if (!localJdText.value.trim()) {
    jdError.value = "岗位描述不能为空";
    return;
  }

  emit("submit", {
    resumeText: localResumeText.value,
    jdText: localJdText.value,
  });
  // Note: We don't automatically close here, expecting parent to handle or close on success
  // But typically a dialog closes on OK.
  // If parent handles async submission, they might want to keep it open.
  // Based on current requirement, we just emit submit.
  // We can also close if parent updates the prop.
};

// Reset error and data on open
watch(
  () => props.open,
  (newVal) => {
    if (newVal) {
      jdError.value = "";
      localResumeText.value = "";
      localJdText.value = "";
    }
  },
);
</script>

<style scoped>
.upload-resume-modal :deep(.ant-modal-content) {
  border-radius: 12px;
  overflow: hidden;
}
.upload-resume-modal :deep(.ant-modal-header) {
  border-bottom: 1px solid #f1f5f9;
  padding: 16px 24px;
  margin-bottom: 0;
}
.upload-resume-modal :deep(.ant-modal-body) {
  padding: 0;
}
.upload-resume-modal :deep(.ant-upload-drag) {
  background: #f8fafc;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s ease;
}
.upload-resume-modal :deep(.ant-upload-drag:hover) {
  border-color: #3b82f6;
  background: #eff6ff;
}
.upload-resume-modal :deep(.ant-upload-btn) {
  padding: 0 !important;
}
</style>
