<template>
  <a-modal
    :open="open"
    title="选择已有简历"
    :width="600"
    class="select-resume-modal"
    @cancel="handleCancel"
  >
    <div class="py-4 space-y-6">
      <!-- JD Input Section -->
      <div>
        <div class="mb-2 font-medium text-slate-700">
          岗位描述 (JD) <span class="text-red-500">*</span>
        </div>
        <a-textarea
          v-model:value="jobDescription"
          placeholder="请粘贴或输入目标岗位的职位描述..."
          :auto-size="{ minRows: 3, maxRows: 6 }"
          class="!rounded-lg !border-slate-200 focus:!border-primary-500 focus:!shadow-none"
        />
      </div>

      <!-- Resume Selection Section -->
      <div>
        <div class="mb-2 font-medium text-slate-700">
          选择简历 <span class="text-red-500">*</span>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="space-y-3">
          <a-skeleton v-for="i in 3" :key="i" active :paragraph="{ rows: 1 }" />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex flex-col items-center py-8 text-center">
          <div class="text-red-500 mb-2">{{ error }}</div>
          <a-button @click="fetchResumes">重试</a-button>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="resumes.length === 0"
          class="flex flex-col items-center py-8 border border-dashed border-slate-200 rounded-lg bg-slate-50"
        >
          <div class="text-slate-400 mb-4">暂无可用简历</div>
          <a-button type="primary" @click="$emit('create-new')">创建新简历</a-button>
        </div>

        <!-- Resume List -->
        <div v-else class="max-h-[300px] overflow-y-auto px-1 space-y-2 custom-scrollbar">
          <div
            v-for="resume in resumes"
            :key="resume._id"
            class="flex items-center p-3 border rounded-lg cursor-pointer transition-all group relative"
            :class="[
              selectedResumeId === resume._id
                ? 'border-primary-500 bg-primary-50'
                : 'border-slate-200 hover:border-primary-200 hover:bg-slate-50',
            ]"
            @click="selectedResumeId = resume._id"
          >
            <div
              class="w-10 h-10 rounded flex items-center justify-center mr-3 shrink-0 transition-colors"
              :class="
                selectedResumeId === resume._id
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-slate-100 text-slate-500'
              "
            >
              <FileTextOutlined class="text-xl" />
            </div>
            <div class="flex-1 min-w-0">
              <h4
                class="font-medium truncate"
                :class="selectedResumeId === resume._id ? 'text-primary-700' : 'text-slate-700'"
              >
                {{ resume.title || "未命名简历" }}
              </h4>
              <p
                class="text-xs mt-0.5"
                :class="selectedResumeId === resume._id ? 'text-primary-500' : 'text-slate-400'"
              >
                更新于 {{ formatDate(resume.updatedAt || "") }}
              </p>
            </div>

            <!-- Selection Indicator -->
            <div
              v-if="selectedResumeId === resume._id"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-primary-500"
            >
              <CheckCircleFilled class="text-lg" />
            </div>
          </div>
        </div>
      </div>

      <!-- Module Selection Section -->
      <div>
        <ModuleSelectPanel v-model="selectedModules" />
      </div>
    </div>

    <!-- Footer Actions -->
    <template #footer>
      <div class="flex justify-end gap-3 pt-2">
        <a-button @click="handleCancel">取消</a-button>
        <a-button
          type="primary"
          :disabled="!isConfirmEnabled"
          :loading="loading || submitting"
          @click="handleConfirm"
        >
          确定
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

import { FileTextOutlined, CheckCircleFilled } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

import { getUserResumesAPI } from "@/api/resume/resume";
import type { UserResumeListItem } from "@/api/resume/type";
import { SSE_MODULE_KEYS } from "@/api/resume-ai/type";
import { formatDate } from "@/utils/day";

import ModuleSelectPanel from "./ModuleSelectPanel.vue";

const props = defineProps<{
  open: boolean;
  submitting?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "submit", payload: { jd: string; resumeId: string; modules: string[] }): void;
  (e: "create-new"): void;
}>();

// State
const jobDescription = ref("");
const selectedResumeId = ref<string | null>(null);
const selectedModules = ref<string[]>([...SSE_MODULE_KEYS]);
const resumes = ref<UserResumeListItem[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Computed
const isConfirmEnabled = computed(() => {
  return jobDescription.value.trim().length > 0 && selectedResumeId.value !== null;
});

// Methods
const fetchResumes = async () => {
  loading.value = true;
  error.value = null;
  try {
    // 对话框需要展示用户全部简历：后端单页上限 100，按 total 分页拉全量
    const PAGE_SIZE = 100;
    const first = await getUserResumesAPI({ page: 1, pageSize: PAGE_SIZE });
    const firstList = first?.data?.list || [];
    const total = first?.data?.total ?? firstList.length;
    const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const rest = await Promise.all(
      Array.from({ length: pageCount - 1 }, (_, index) =>
        getUserResumesAPI({ page: index + 2, pageSize: PAGE_SIZE }),
      ),
    );
    resumes.value = [...firstList, ...rest.flatMap((item) => item?.data?.list || [])];
  } catch {
    error.value = "加载简历列表失败，请重试";
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  emit("update:open", false);
};

const handleConfirm = () => {
  if (!jobDescription.value.trim()) {
    message.warning("请输入岗位描述");
    return;
  }
  if (!selectedResumeId.value) {
    message.warning("请选择一份简历");
    return;
  }
  if (selectedModules.value.length === 0) {
    message.warning("请至少选择一个模块");
    return;
  }

  emit("submit", {
    jd: jobDescription.value,
    resumeId: selectedResumeId.value,
    modules: [...selectedModules.value],
  });

  // Optional: Reset state or close dialog?
  // Usually parent controls visibility.
};

// Watchers
watch(
  () => props.open,
  (newVal) => {
    if (newVal) {
      // 打开时重置状态并拉取最新简历列表
      selectedResumeId.value = null;
      jobDescription.value = "";
      selectedModules.value = [...SSE_MODULE_KEYS];
      error.value = null;
      fetchResumes();
    }
  },
);
</script>

<style scoped>
.select-resume-modal :deep(.ant-modal-content) {
  border-radius: 1rem;
  overflow: hidden;
}
.select-resume-modal :deep(.ant-modal-header) {
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1rem;
  margin-bottom: 0;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #cbd5e1;
}
</style>
