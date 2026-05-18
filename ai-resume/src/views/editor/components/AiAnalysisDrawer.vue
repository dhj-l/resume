<script setup lang="ts">
import { computed, ref } from "vue";

import { CloseOutlined } from "@ant-design/icons-vue";
import { Button, Input, message } from "ant-design-vue";
import { Sparkles } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

import { analyzeResumeAPI } from "@/api/resume-ai/resume-ai";
import type { AnalysisResultData } from "@/api/resume-ai/type";
import ResumeAnalysisReport from "@/components/resume-analysis/ResumeAnalysisReport.vue";
import { useResumeStore } from "@/stores/resumeStore";

defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { resumeData } = storeToRefs(useResumeStore());
const router = useRouter();

const jobDescription = ref("");
const loading = ref(false);
const analysisResult = ref<AnalysisResultData | null>(null);
const recordId = ref("");
const showInput = ref(true);

const btnDisabled = computed(() => {
  return jobDescription.value.length >= 10;
});

const handleAnalyze = async () => {
  loading.value = true;
  try {
    const res = await analyzeResumeAPI({
      resumeId: resumeData.value._id,
      jobDescription: jobDescription.value,
    });
    analysisResult.value = res.data.analysisResult;
    recordId.value = res.data.recordId;
    showInput.value = false;
  } catch {
    message.error("分析失败，请稍后重试");
  } finally {
    loading.value = false;
  }
};

const handleReAnalyze = () => {
  showInput.value = true;
  analysisResult.value = null;
};

const handleViewDetail = () => {
  const id = recordId.value;
  if (id) {
    router.push({ path: "/analysis-detail", query: { id } });
  }
};
</script>

<template>
  <div
    class="fixed top-16 right-0 bottom-[52px] w-[400px] bg-white border-l border-gray-200 shadow-[-4px_0_16px_rgba(0,0,0,0.08)] z-30 flex flex-col transition-transform duration-300 ease-in-out"
    :class="visible ? 'translate-x-0' : 'translate-x-full'"
  >
    <!-- Header -->
    <div class="h-12 border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
      <div class="flex items-center gap-2">
        <Sparkles class="w-4 h-4 text-purple-500" />
        <span class="font-medium text-gray-700">AI 分析</span>
      </div>
      <Button type="text" size="small" @click="emit('close')">
        <template #icon><CloseOutlined /></template>
      </Button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <template v-if="showInput">
        <!-- Job Description Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">目标职位描述</label>
          <Input.TextArea
            v-model:value="jobDescription"
            :rows="6"
            placeholder="请粘贴目标职位的职位描述（JD），AI 将据此分析简历匹配度..."
            :maxlength="2000"
            show-count
          />
          <p
            v-if="jobDescription.length > 0 && jobDescription.length < 10"
            class="text-red-500 text-xs mt-1"
          >
            岗位描述至少需要输入 10 个字符
          </p>
        </div>

        <div class="border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-400">
          <Sparkles class="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p class="text-sm">粘贴职位描述后，点击分析按钮</p>
          <p class="text-xs mt-1">AI 将为您提供简历优化建议</p>
        </div>
      </template>

      <!-- Analysis Result -->
      <ResumeAnalysisReport v-if="!showInput && analysisResult" :data="analysisResult" />
    </div>

    <!-- Footer -->
    <div class="h-14 border-t border-gray-200 flex items-center justify-end px-4 gap-2 shrink-0">
      <template v-if="showInput">
        <Button
          :disabled="!btnDisabled"
          :loading="loading"
          type="primary"
          class="flex items-center"
          @click="handleAnalyze"
        >
          <template #icon><Sparkles class="w-3.5 h-3.5 mr-2" /></template>
          开始分析
        </Button>
      </template>
      <template v-else>
        <Button class="flex items-center" @click="handleViewDetail"> 查看详情 </Button>
        <Button class="flex items-center" @click="handleReAnalyze">
          <template #icon><Sparkles class="w-3.5 h-3.5 mr-2" /></template>
          重新分析
        </Button>
      </template>
    </div>
  </div>
</template>
