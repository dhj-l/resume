<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { CloseOutlined } from "@ant-design/icons-vue";
import { useElementSize } from "@vueuse/core";
import { Button, Input, Select, message } from "ant-design-vue";
import { Sparkles } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

import { getLatestQuestionsAPI, predictQuestionsAPI } from "@/api/resume-ai/resume-ai";
import type { InterviewQuestionItem } from "@/api/resume-ai/type";
import FullScreenLoading from "@/components/common/FullScreenLoading.vue";
import InterviewQuestionsReport from "@/components/resume-questions/InterviewQuestionsReport.vue";
import { useResumeStore } from "@/stores/resumeStore";
import { AI_QUESTIONS_TIPS } from "@/utils/aiTips";
import { AI_DRAWER_BOTTOM_OFFSET, EDIT_DRAWER_EXPANDED_HEIGHT } from "@/views/editor/constants";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { resumeData, isExpanded } = storeToRefs(useResumeStore());
const router = useRouter();

const drawerRef = ref<HTMLElement>();
const { width } = useElementSize(drawerRef);
const isDesktop = computed(() => width.value >= 768);

/**
 * 底部内容编辑抽屉展开时，右侧 AI 抽屉同步向上让位，
 * 与 AI 分析抽屉保持一致的布局行为。
 */
const drawerBottom = computed(() =>
  isExpanded.value
    ? `calc(${EDIT_DRAWER_EXPANDED_HEIGHT} + ${AI_DRAWER_BOTTOM_OFFSET}px)`
    : `${AI_DRAWER_BOTTOM_OFFSET}px`,
);

const jobDescription = ref("");
const questionCount = ref(10);
const loading = ref(false);
const fetchLoading = ref(false);
const result = ref<InterviewQuestionItem[] | null>(null);
const recordId = ref("");
const showInput = ref(true);

const questionCountOptions = computed(() =>
  Array.from({ length: 8 }, (_, index) => 8 + index).map((value) => ({
    label: `${value} 道`,
    value,
  })),
);

const targetPosition = computed(() => resumeData.value.jobIntention?.jobIntention || "");
const workYears = computed(() => resumeData.value.basicInfo?.workYear || "");

const btnDisabled = computed(() => jobDescription.value.length < 10);

watch(
  () => props.visible,
  async (newVal) => {
    if (!newVal) {
      result.value = null;
      showInput.value = true;
      return;
    }

    if (!resumeData.value._id) {
      showInput.value = true;
      return;
    }

    fetchLoading.value = true;
    try {
      const { data } = await getLatestQuestionsAPI(resumeData.value._id, {
        silent: true,
      });
      if (data?.status === "completed" && data?.result?.length) {
        result.value = data.result;
        recordId.value = data._id;
        jobDescription.value = data.jobDescription || "";
        questionCount.value = data.questionCount || 10;
        showInput.value = false;
      } else {
        showInput.value = true;
      }
    } catch {
      // 暂无历史押题或请求失败：静默降级为输入模式
      showInput.value = true;
    } finally {
      fetchLoading.value = false;
    }
  },
);

const handlePredict = async () => {
  if (!resumeData.value._id) {
    message.warning("请先保存简历后再进行押题");
    return;
  }
  loading.value = true;
  try {
    const res = await predictQuestionsAPI({
      resumeId: resumeData.value._id,
      jobDescription: jobDescription.value,
      questionCount: questionCount.value,
    });
    result.value = res.data.result;
    recordId.value = res.data.recordId;
    showInput.value = false;
  } catch {
    message.error("押题失败，请稍后重试");
  } finally {
    loading.value = false;
  }
};

const handleRePredict = () => {
  showInput.value = true;
  result.value = null;
};

const handleViewDetail = () => {
  const id = recordId.value;
  if (id) {
    router.push({ path: "/question-detail", query: { id } });
  }
};
</script>

<template>
  <div
    ref="drawerRef"
    class="fixed top-16 right-0 w-[400px] bg-white border-l border-gray-200 shadow-[-4px_0_16px_rgba(0,0,0,0.08)] z-30 flex flex-col transition-all duration-300 ease-in-out"
    :style="{ bottom: drawerBottom }"
    :class="visible ? 'translate-x-0' : 'translate-x-full'"
  >
    <!-- Header -->
    <div class="h-12 border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
      <div class="flex items-center gap-2">
        <Sparkles class="w-4 h-4 text-purple-500" />
        <span class="font-medium text-gray-700">AI 押题</span>
      </div>
      <Button type="text" size="small" class="flex items-center" @click="emit('close')">
        <template #icon><CloseOutlined /></template>
      </Button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <div v-if="fetchLoading" class="flex items-center justify-center py-12">
        <a-spin tip="正在加载最新押题数据..." />
      </div>

      <template v-else-if="showInput">
        <!-- 目标职位描述 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">目标职位描述</label>
          <Input.TextArea
            v-model:value="jobDescription"
            :rows="6"
            placeholder="请粘贴目标职位的职位描述（JD），AI 将据此预测面试高频问题..."
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

        <!-- 题目数量 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">押题数量</label>
          <Select v-model:value="questionCount" class="w-full" :options="questionCountOptions" />
          <p class="text-xs text-gray-400 mt-1">可选 8-15 道，每道均附带参考解答</p>
        </div>

        <!-- 简历信息（只读提示） -->
        <div class="bg-gray-50 rounded-lg p-3 space-y-1">
          <p class="text-xs text-gray-500">
            求职岗位：<span class="text-gray-700 font-medium">{{
              targetPosition || "未填写"
            }}</span>
          </p>
          <p class="text-xs text-gray-500">
            工作年限：<span class="text-gray-700 font-medium">{{ workYears || "未填写" }}</span>
          </p>
          <p class="text-xs text-gray-400">岗位与年限取自当前简历，可在简历编辑中更新</p>
        </div>

        <div class="border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-400">
          <Sparkles class="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p class="text-sm">粘贴职位描述并选择数量后，点击开始押题</p>
          <p class="text-xs mt-1">AI 将结合简历经历与当前招聘市场生成高频面试题</p>
        </div>
      </template>

      <!-- 押题结果 -->
      <InterviewQuestionsReport
        v-if="!showInput && result"
        :questions="result"
        :is-desktop="isDesktop"
      />
    </div>

    <!-- Footer -->
    <div class="h-14 border-t border-gray-200 flex items-center justify-end px-4 gap-2 shrink-0">
      <template v-if="showInput">
        <Button
          :disabled="btnDisabled"
          :loading="loading"
          type="primary"
          class="flex items-center"
          @click="handlePredict"
        >
          <template #icon><Sparkles class="w-3.5 h-3.5 mr-2" /></template>
          开始押题
        </Button>
      </template>
      <template v-else>
        <Button class="flex items-center" @click="handleViewDetail"> 查看详情 </Button>
        <Button class="flex items-center" @click="handleRePredict">
          <template #icon><Sparkles class="w-3.5 h-3.5 mr-2" /></template>
          重新押题
        </Button>
      </template>
    </div>

    <!-- 押题中全屏遮罩动画（不可手动关闭，生成结束自动关闭） -->
    <FullScreenLoading
      v-model:loading="loading"
      text="AI 正在根据简历与岗位押题，请稍候..."
      :tips="AI_QUESTIONS_TIPS"
      :timeout="600000"
    />
  </div>
</template>
