<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";

import {
  AppstoreOutlined,
  ArrowLeftOutlined,
  CheckCircleFilled,
  CodeOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons-vue";
import { Alert, Button, Input, Modal, Select, Spin, message } from "ant-design-vue";
import { MessagesSquare } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";

import {
  getCurrentSessionAPI,
  createSessionAPI,
  cancelSessionAPI,
} from "@/api/interview/interview";
import type { ExperienceLevel, Focus } from "@/api/interview/type";
import { FOCUS_TARGET_ROUNDS_MAP } from "@/api/interview/type";
import { getUserResumesAPI } from "@/api/resume/resume";
import type { UserResumeListItem } from "@/api/resume/type";
import FullScreenLoading from "@/components/common/FullScreenLoading.vue";
import { AI_INTERVIEW_TIPS } from "@/utils/aiTips";

const JD_MIN_LENGTH = 150;
const JD_MAX_LENGTH = 5000;

const router = useRouter();
const route = useRoute();

const pageLoading = ref(true);
const submitting = ref(false);

/** 上次会话超时关闭提示 */
const showTimeoutHint = ref(false);

/** 存在进行中的会话，可恢复 */
const activeSessionId = ref("");

const resumes = ref<UserResumeListItem[]>([]);
const resumesLoading = ref(false);

const form = reactive({
  resumeId: "",
  jobDescription: "",
  experienceLevel: "mid" as ExperienceLevel,
  focus: "technical" as Focus,
});

const experienceLevelOptions = [
  { value: "junior", label: "校招/应届生" },
  { value: "mid", label: "1-3 年经验" },
  { value: "senior", label: "3-5 年经验" },
  { value: "expert", label: "5 年以上经验" },
];

const focusOptions = [
  {
    value: "technical",
    label: "技术面",
    desc: "考察技术功底与深度",
    rounds: 8,
    icon: CodeOutlined,
  },
  {
    value: "project",
    label: "项目深挖面",
    desc: "深挖项目细节与亮点",
    rounds: 6,
    icon: FolderOpenOutlined,
  },
  {
    value: "mixed",
    label: "综合面",
    desc: "技术与项目结合考察",
    rounds: 10,
    icon: AppstoreOutlined,
  },
];

const jdLength = computed(() => form.jobDescription.trim().length);
const targetRounds = computed(() => FOCUS_TARGET_ROUNDS_MAP[form.focus] ?? 8);

const jdValidateStatus = computed(() => {
  if (!form.jobDescription) return "";
  return jdLength.value >= JD_MIN_LENGTH && jdLength.value <= JD_MAX_LENGTH ? "" : "error";
});

const jdHelpText = computed(() => {
  if (!form.jobDescription)
    return `请粘贴完整岗位 JD，包含职位/职责/要求等关键信息（${JD_MIN_LENGTH}-${JD_MAX_LENGTH} 字符）`;
  if (jdLength.value < JD_MIN_LENGTH)
    return `JD 内容过短，还需至少 ${JD_MIN_LENGTH - jdLength.value} 个字符`;
  if (jdLength.value > JD_MAX_LENGTH) return `JD 内容超出 ${JD_MAX_LENGTH} 字符上限`;
  return "";
});

const canSubmit = computed(
  () =>
    !!form.resumeId &&
    jdLength.value >= JD_MIN_LENGTH &&
    jdLength.value <= JD_MAX_LENGTH &&
    !submitting.value,
);

const fetchResumes = async () => {
  resumesLoading.value = true;
  try {
    const { data } = await getUserResumesAPI({ page: 1, pageSize: 100 });
    resumes.value = data.list.filter((item) => !item.isTemplate);
  } finally {
    resumesLoading.value = false;
  }
};

/** 进入页面时检测当前会话：恢复现场或提示超时 */
const checkCurrentSession = async () => {
  try {
    const { data } = await getCurrentSessionAPI();
    if (data.active && data.session) {
      activeSessionId.value = data.session._id;
    } else if (
      !data.active &&
      data.session?.status === "cancelled" &&
      data.session?.endedReason === "timeout"
    ) {
      showTimeoutHint.value = true;
    }
  } catch {
    // 检测失败不阻塞表单填写
  }
};

const handleResumeSession = () => {
  router.push({ path: "/interview/chat", query: { id: activeSessionId.value } });
};

const handleCancelSession = () => {
  Modal.confirm({
    title: "放弃进行中的面试？",
    content: "中断后本次面试不会生成评价报告，且无法恢复。",
    okText: "确认中断",
    okType: "danger",
    cancelText: "继续面试",
    async onOk() {
      try {
        await cancelSessionAPI(activeSessionId.value);
        activeSessionId.value = "";
        message.info("已中断上次面试");
      } catch {
        // 全局拦截器已提示
      }
    },
  });
};

const handleSubmit = async () => {
  if (!canSubmit.value) return;
  submitting.value = true;
  try {
    const { data } = await createSessionAPI({
      resumeId: form.resumeId,
      jobDescription: form.jobDescription.trim(),
      levelConfig: {
        experienceLevel: form.experienceLevel,
        focus: form.focus,
      },
    });
    message.success("面试准备完成，开始作答");
    router.push({ path: "/interview/chat", query: { id: data._id } });
  } catch {
    // 错误提示由全局拦截器处理（如 409 已有进行中会话）
  } finally {
    submitting.value = false;
  }
};

onMounted(async () => {
  // 从对话页欢迎状态跳转过来时，预选考察侧重
  const focusQuery = route.query.focus as Focus;
  if (focusQuery && focusQuery in FOCUS_TARGET_ROUNDS_MAP) {
    form.focus = focusQuery;
  }
  await Promise.all([checkCurrentSession(), fetchResumes()]);
  pageLoading.value = false;
});
</script>

<template>
  <div class="interview-bg min-h-screen overflow-y-auto">
    <Spin :spinning="pageLoading">
      <div class="max-w-2xl mx-auto px-4 py-10">
        <!-- 顶部 -->
        <div class="flex items-center gap-3 mb-8">
          <Button shape="circle" @click="router.push('/')">
            <template #icon><ArrowLeftOutlined /></template>
          </Button>
          <div
            class="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-200"
          >
            <MessagesSquare class="h-5 w-5" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-slate-900 tracking-tight">发起模拟面试</h1>
            <p class="text-sm text-slate-500 mt-0.5">
              AI 面试官将根据你的简历与目标岗位进行多轮模拟面试
            </p>
          </div>
        </div>

        <!-- 超时提示 -->
        <Alert
          v-if="showTimeoutHint"
          type="warning"
          show-icon
          class="mb-4 rounded-xl"
          message="上次面试因超时已关闭"
          description="30 分钟内无任何活动，上次面试已被自动关闭。你可以重新发起新的面试。"
        />

        <!-- 进行中会话恢复 -->
        <div
          v-if="activeSessionId"
          class="mb-4 rounded-xl border border-indigo-200 bg-indigo-50/60 p-4 flex flex-wrap items-center justify-between gap-3"
        >
          <div>
            <p class="text-sm font-medium text-slate-800 flex items-center gap-1.5">
              <span class="relative flex h-2 w-2">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                ></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              您有一个进行中的面试
            </p>
            <p class="text-xs text-slate-500 mt-1">同一时间只能进行一场面试</p>
          </div>
          <div class="flex items-center gap-2">
            <Button size="small" @click="handleCancelSession">放弃旧面试</Button>
            <Button
              type="primary"
              size="small"
              class="resume-btn rounded-full"
              @click="handleResumeSession"
            >
              返回继续面试
            </Button>
          </div>
        </div>

        <!-- 表单卡片 -->
        <div class="interview-card rounded-2xl p-6 md:p-8 space-y-8">
          <!-- 面试简历 -->
          <section>
            <div class="flex items-center gap-3 mb-3">
              <span class="step-num">1</span>
              <div>
                <p class="text-sm font-semibold text-slate-800">
                  面试简历 <span class="text-red-400">*</span>
                </p>
                <p class="text-xs text-slate-400">AI 将基于这份简历的内容进行提问与追问</p>
              </div>
            </div>
            <Select
              v-model:value="form.resumeId"
              placeholder="选择用于本次面试的简历"
              :loading="resumesLoading"
              class="w-full"
              size="large"
              :options="resumes.map((r) => ({ value: r._id, label: r.title || '未命名简历' }))"
            />
          </section>

          <!-- 岗位 JD -->
          <section>
            <div class="flex items-center gap-3 mb-3">
              <span class="step-num">2</span>
              <div>
                <p class="text-sm font-semibold text-slate-800">
                  岗位 JD <span class="text-red-400">*</span>
                </p>
                <p class="text-xs text-slate-400">
                  建议包含职位名称、工作职责、任职要求、薪资范围等关键信息
                </p>
              </div>
            </div>
            <div class="relative">
              <Input.TextArea
                v-model:value="form.jobDescription"
                placeholder="粘贴目标岗位的职位描述，例如：&#10;Node.js 后端开发工程师&#10;工作地点：上海&#10;职位描述：&#10;1、负责服务端接口研发……&#10;任职要求：&#10;1、本科及以上学历……"
                :rows="9"
                :maxlength="JD_MAX_LENGTH"
                class="jd-textarea"
                :class="{ 'jd-textarea-error': jdValidateStatus === 'error' }"
              />
              <span
                class="absolute bottom-3 right-4 text-xs pointer-events-none"
                :class="jdValidateStatus === 'error' ? 'text-red-400' : 'text-slate-300'"
              >
                {{ jdLength }} / {{ JD_MAX_LENGTH }}
              </span>
            </div>
            <p
              v-if="jdHelpText && form.jobDescription"
              class="text-xs mt-1.5"
              :class="jdValidateStatus === 'error' ? 'text-red-400' : 'text-slate-400'"
            >
              {{ jdHelpText }}
            </p>
          </section>

          <!-- 经验层级 -->
          <section>
            <div class="flex items-center gap-3 mb-3">
              <span class="step-num">3</span>
              <p class="text-sm font-semibold text-slate-800">经验层级</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="opt in experienceLevelOptions"
                :key="opt.value"
                type="button"
                class="px-4 py-2 rounded-full text-sm border transition-all"
                :class="
                  form.experienceLevel === opt.value
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-600 font-medium shadow-sm shadow-indigo-100'
                    : 'border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-500'
                "
                @click="form.experienceLevel = opt.value as ExperienceLevel"
              >
                {{ opt.label }}
              </button>
            </div>
          </section>

          <!-- 考察侧重 -->
          <section>
            <div class="flex items-center gap-3 mb-3">
              <span class="step-num">4</span>
              <p class="text-sm font-semibold text-slate-800">考察侧重</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                v-for="opt in focusOptions"
                :key="opt.value"
                type="button"
                class="relative text-left rounded-xl border p-4 transition-all"
                :class="
                  form.focus === opt.value
                    ? 'border-indigo-500 bg-indigo-50/70 shadow-md shadow-indigo-100'
                    : 'border-slate-200 hover:border-indigo-300 bg-white hover:-translate-y-0.5'
                "
                @click="form.focus = opt.value as Focus"
              >
                <CheckCircleFilled
                  v-if="form.focus === opt.value"
                  class="absolute top-3 right-3 text-indigo-500"
                />
                <component
                  :is="opt.icon"
                  class="h-5 w-5"
                  :class="form.focus === opt.value ? 'text-indigo-500' : 'text-slate-400'"
                />
                <p class="mt-2 font-medium text-sm text-slate-800">{{ opt.label }}</p>
                <p class="text-xs text-slate-400 mt-0.5">{{ opt.desc }}</p>
                <p class="text-xs mt-1.5 font-medium" :class="'text-indigo-500'">
                  共 {{ opt.rounds }} 轮
                </p>
              </button>
            </div>
          </section>
        </div>

        <!-- 提交 -->
        <div class="mt-6">
          <Button
            type="primary"
            size="large"
            block
            class="start-btn h-12 rounded-xl text-base font-medium"
            :loading="submitting"
            :disabled="!canSubmit"
            @click="handleSubmit"
          >
            {{ submitting ? "正在准备面试…" : `开始模拟面试（${targetRounds} 轮）` }}
          </Button>
          <p class="text-xs text-slate-400 text-center mt-3">
            创建面试需要 AI 生成考察大纲与首题，可能需要 1-2 分钟，请耐心等待
          </p>
        </div>
      </div>
    </Spin>

    <!-- 面试准备中全屏遮罩动画（生成结束自动关闭） -->
    <FullScreenLoading
      v-model:loading="submitting"
      text="AI 面试官正在准备本场面试，请稍候..."
      :tips="AI_INTERVIEW_TIPS"
      :timeout="600000"
    />
  </div>
</template>

<style scoped>
.interview-bg {
  background:
    radial-gradient(ellipse 60% 40% at 20% 0%, rgba(99, 102, 241, 0.08), transparent),
    radial-gradient(ellipse 50% 35% at 85% 10%, rgba(168, 85, 247, 0.06), transparent), #f8fafc;
}

.interview-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 24px -8px rgba(15, 23, 42, 0.08);
}

.jd-textarea {
  padding-bottom: 2rem;
}

.jd-textarea-error :deep(textarea) {
  border-color: #fca5a5;
}

/* 步骤编号圆标 */
.step-num {
  display: inline-flex;
  height: 1.75rem;
  width: 1.75rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 0.625rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
}

/* 紫渐变主按钮（恢复会话） */
.resume-btn {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
}

.resume-btn:hover {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important;
}

.start-btn {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
}

.start-btn:not(:disabled):hover {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
}
</style>
