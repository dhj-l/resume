<template>
  <a-modal
    :open="open"
    title="选择已有简历"
    :width="600"
    :footer="null"
    @cancel="handleCancel"
    class="select-resume-modal"
  >
    <div class="py-4">
      <div v-if="resumes.length === 0" class="flex flex-col items-center py-12">
        <div class="text-slate-400 mb-4">暂无可用简历</div>
        <a-button type="primary" @click="$emit('create-new')"
          >创建新简历</a-button
        >
      </div>

      <div v-else class="max-h-[400px] overflow-y-auto px-2">
        <div
          v-for="resume in resumes"
          :key="resume._id"
          class="flex items-center p-4 mb-3 border border-slate-200 rounded-lg hover:border-primary-500 hover:bg-primary-50/30 transition-all cursor-pointer group"
          @click="handleSelect(resume)"
        >
          <div
            class="w-10 h-10 rounded bg-blue-100 flex items-center justify-center text-blue-600 mr-4 shrink-0"
          >
            <FileTextOutlined class="text-xl" />
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-medium text-slate-900 truncate">
              {{ resume.title || "未命名简历" }}
            </h4>
            <p class="text-xs text-slate-500 mt-1">
              更新于 {{ formatDate(resume.updatedAt) }}
            </p>
          </div>
          <div class="opacity-0 group-hover:opacity-100 transition-opacity">
            <a-button type="primary" size="small">选择</a-button>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { FileTextOutlined } from "@ant-design/icons-vue";
import { formatDate } from "@/utils/day";

// 定义简单的 Mock 数据类型
interface MockResume {
  _id: string;
  title: string;
  updatedAt: string;
}

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "submit", resumeId: string): void;
  (e: "create-new"): void;
}>();

// 静态 Mock 数据
const resumes = ref<MockResume[]>([
  {
    _id: "1",
    title: "前端开发工程师 - 3年经验",
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "全栈开发工程师 - 资深",
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "3",
    title: "产品经理 - 简历",
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
]);

const handleCancel = () => {
  emit("update:open", false);
};

const handleSelect = (resume: MockResume) => {
  emit("submit", resume._id);
};
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
</style>
