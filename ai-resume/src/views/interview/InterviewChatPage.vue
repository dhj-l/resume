<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";

import {
  BulbOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  CodeOutlined,
  FileDoneOutlined,
  FolderOpenOutlined,
  LoadingOutlined,
  RobotOutlined,
  SendOutlined,
  SoundFilled,
  SoundOutlined,
  AppstoreOutlined,
} from "@ant-design/icons-vue";
import { Button, Input, Modal, Popover, Spin, Tooltip, message } from "ant-design-vue";
import { MessagesSquare, PanelLeftOpen, Volume2, VolumeX } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";

import {
  cancelSessionAPI,
  finishSessionAPI,
  getReverseSuggestionsAPI,
  getSessionDetailAPI,
} from "@/api/interview/interview";
import { submitAnswerSSE } from "@/api/interview/sse";
import type {
  AnswerFeedback,
  EndedReason,
  InterviewMessage,
  InterviewPhase,
  InterviewSession,
  OutlineItem,
  ReverseSuggestion,
} from "@/api/interview/type";
import {
  getEndedReasonLabel,
  getModeLabel,
  getQuestionTypeLabel,
  getSessionLevelLabel,
} from "@/api/interview/type";
import { useAuthStore } from "@/stores/auth";
import { useInterviewStore } from "@/stores/interviewStore";

import InterviewSidebar from "./components/InterviewSidebar.vue";
import VoiceRecordButton from "./components/VoiceRecordButton.vue";
import { useTtsPlayer } from "./composables/useTtsPlayer";

const ANSWER_MAX_LENGTH = 5000;
/** 会话剩余时间临期提醒阈值（分钟） */
const EXPIRE_WARN_MINUTES = 5;
/** 打字机每个字符间隔（毫秒） */
const TYPE_INTERVAL = 18;

/** 右侧视图模式：empty=欢迎页 / chat=进行中对话 / replay=历史只读回放 */
type ViewMode = "empty" | "chat" | "replay";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const interviewStore = useInterviewStore();

const {
  autoPlayEnabled,
  play: playTts,
  autoPlay: autoPlayTts,
  toggleAutoPlay,
  dispose: disposeTts,
  isLoading: ttsLoading,
  isPlaying: ttsPlaying,
} = useTtsPlayer();

const viewMode = ref<ViewMode>(route.query.id ? "chat" : "empty");
const detailLoading = ref(false);

const sessionId = ref("");
const sessionTitle = ref("");
const levelConfig = ref<InterviewSession["levelConfig"] | null>(null);
const currentRound = ref(0);
/** 会话阶段：main=主体考察 / reverse=反问环节 */
const phase = ref<InterviewPhase>("main");
const startedAt = ref("");
const endedAt = ref<string | null>(null);
const outlineItems = ref<OutlineItem[]>([]);
const askedTopicKeys = ref<string[]>([]);
const expiresAt = ref("");
const endedReason = ref<EndedReason | null>(null);
const hasReport = ref(false);

const messages = ref<InterviewMessage[]>([]);

const answerText = ref("");
const submitting = ref(false);
/** 语音输入按钮（暴露 stopAll 用于发送前关闭语音收集：停止录音并丢弃在途识别） */
const voiceBtnRef = ref<InstanceType<typeof VoiceRecordButton> | null>(null);
/** AI 正在生成下一题 */
const aiThinking = ref(false);
/** 下一题打字机输出中 */
const typing = ref(false);
/** 本轮面试已结束（等待跳转报告） */
const finished = ref(false);
/** 反问收尾：告别语已展示、评价报告生成中（后端生成可能耗时数分钟） */
const generatingReport = ref(false);
/** 移动端侧边栏抽屉 */
const mobileSidebarOpen = ref(false);

// ==================== 反问环节推荐话术（状态） ====================

const reverseSuggestions = ref<ReverseSuggestion[]>([]);
const suggestionsLoading = ref(false);
/** 是否已自动加载过（进入反问环节仅自动拉取一次） */
const suggestionsLoaded = ref(false);

const listRef = ref<HTMLElement | null>(null);

let expireTimer: number | null = null;
let typeTimer: number | null = null;
/** 剩余秒数 */
const remainSeconds = ref(0);
/** 秒级心跳（驱动「已进行 X 分钟」刷新） */
const nowTick = ref(Date.now());

const remainDisplay = computed(() => {
  const total = Math.max(0, remainSeconds.value);
  const mm = Math.floor(total / 60);
  const ss = total % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
});

const remainPercent = computed(() => {
  if (!expiresAt.value) return 100;
  const expireTime = new Date(expiresAt.value).getTime();
  const startedTime = new Date(messages.value[0]?.askedAt ?? Date.now()).getTime();
  if (Number.isNaN(expireTime) || Number.isNaN(startedTime) || expireTime <= startedTime) {
    return 100;
  }
  return Math.min(100, Math.max(0, ((expireTime - Date.now()) / (expireTime - startedTime)) * 100));
});

const remainWarn = computed(
  () => remainSeconds.value <= EXPIRE_WARN_MINUTES * 60 && remainSeconds.value > 0,
);

/** 头部级别文案（轮次 · 模式，历史会话兜底 focus） */
const headerLevelText = computed(() => {
  const lc = levelConfig.value;
  if (!lc) return "";
  return [getSessionLevelLabel(lc), getModeLabel(lc.mode ?? "")].filter(Boolean).join(" · ");
});

/** 主体考察已进行分钟数（回放取结束时间，进行中随秒级 tick 刷新） */
const elapsedMinutes = computed(() => {
  const start = startedAt.value ? new Date(startedAt.value).getTime() : NaN;
  if (Number.isNaN(start)) return 0;
  const end = endedAt.value ? new Date(endedAt.value).getTime() : nowTick.value;
  if (Number.isNaN(end) || end <= start) return 0;
  return Math.floor((end - start) / 60000);
});

/** 已问题数（不含反问环节的面试官回应） */
const questionCount = computed(
  () => messages.value.filter((m) => m.kind === "question" && m.questionType !== "reverse").length,
);

/** 反问环节在消息列表中的起始位置（用于渲染阶段分隔条） */
const reverseStartIndex = computed(() =>
  messages.value.findIndex((m) => m.questionType === "reverse"),
);

const userInitial = computed(() => authStore.userInfo?.username?.[0]?.toUpperCase() || "U");

const canSubmitAnswer = computed(
  () =>
    !!answerText.value.trim() &&
    !submitting.value &&
    !aiThinking.value &&
    !typing.value &&
    !finished.value &&
    !generatingReport.value,
);

/** 考察大纲（含已考察标记，供进度 Popover 展示） */
const topicList = computed(() =>
  outlineItems.value.map((item) => ({
    ...item,
    asked: askedTopicKeys.value.includes(item.key),
  })),
);
const askedCount = computed(() => topicList.value.filter((item) => item.asked).length);

const DIFFICULTY_CLASS_MAP: Record<string, string> = {
  基础: "bg-emerald-50 text-emerald-600",
  进阶: "bg-sky-50 text-sky-600",
  高阶: "bg-violet-50 text-violet-600",
};

/** 欢迎页面试轮次胶囊 */
const stageOptions = [
  { value: "first", label: "一面 · 基础技术面", icon: CodeOutlined },
  { value: "second", label: "二面 · 项目深入面", icon: FolderOpenOutlined },
  { value: "third", label: "三面 · 综合面", icon: AppstoreOutlined },
] as const;

/** 逐题反馈三维度展示项（分数带颜色） */
const feedbackDims = (fb: AnswerFeedback) => {
  const color = (score: number) => (score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444");
  return [
    { label: "完整性", value: fb.completeness, color: color(fb.completeness) },
    { label: "逻辑性", value: fb.logic, color: color(fb.logic) },
    { label: "技术深度", value: fb.depth, color: color(fb.depth) },
  ];
};

const endedReasonText = computed(() =>
  endedReason.value ? getEndedReasonLabel(endedReason.value) : "本场面试已结束",
);

const scrollToBottom = async (smooth = false) => {
  await nextTick();
  if (listRef.value) {
    listRef.value.scrollTo({
      top: listRef.value.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }
};

const startExpireTimer = () => {
  stopExpireTimer();
  if (!expiresAt.value) return;
  const expireTime = new Date(expiresAt.value).getTime();
  if (Number.isNaN(expireTime)) return;
  const tick = () => {
    remainSeconds.value = Math.floor((expireTime - Date.now()) / 1000);
    nowTick.value = Date.now();
  };
  tick();
  expireTimer = window.setInterval(tick, 1000);
};

const stopExpireTimer = () => {
  if (expireTimer !== null) {
    window.clearInterval(expireTimer);
    expireTimer = null;
  }
};

const stopTypeTimer = () => {
  if (typeTimer !== null) {
    window.clearInterval(typeTimer);
    typeTimer = null;
  }
};

/** 打字机流式输出一道题目 */
const typewriter = (msg: InterviewMessage, full: string) => {
  typing.value = true;
  msg.content = "";
  let i = 0;
  const step = Math.max(1, Math.ceil(full.length / 120));
  typeTimer = window.setInterval(() => {
    i += step;
    if (i >= full.length) {
      msg.content = full;
      typing.value = false;
      stopTypeTimer();
    } else {
      msg.content = full.slice(0, i);
    }
    scrollToBottom();
  }, TYPE_INTERVAL);
};

const resetSessionState = () => {
  stopExpireTimer();
  stopTypeTimer();
  disposeTts();
  sessionId.value = "";
  sessionTitle.value = "";
  levelConfig.value = null;
  currentRound.value = 0;
  phase.value = "main";
  startedAt.value = "";
  endedAt.value = null;
  outlineItems.value = [];
  askedTopicKeys.value = [];
  expiresAt.value = "";
  endedReason.value = null;
  hasReport.value = false;
  messages.value = [];
  answerText.value = "";
  submitting.value = false;
  aiThinking.value = false;
  typing.value = false;
  finished.value = false;
  generatingReport.value = false;
  reverseSuggestions.value = [];
  suggestionsLoaded.value = false;
};

/** 渲染会话到当前视图（chat/replay 由调用方决定） */
const applySession = (session: InterviewSession, animate = false) => {
  sessionId.value = session._id;
  sessionTitle.value = session.jobDescription.split("\n")[0]?.slice(0, 40) || "模拟面试";
  levelConfig.value = session.levelConfig ?? null;
  currentRound.value = session.currentRound ?? 1;
  phase.value = session.phase ?? "main";
  startedAt.value = session.startedAt ?? "";
  endedAt.value = session.endedAt ?? null;
  outlineItems.value = session.outline ?? [];
  askedTopicKeys.value = session.askedTopicKeys ?? [];
  endedReason.value = session.endedReason ?? null;
  hasReport.value = !!session.report;
  messages.value = [...(session.messages ?? [])];
  expiresAt.value = session.expiresAt;
  startExpireTimer();
  scrollToBottom();
  if (animate) {
    const lastMsg = messages.value[messages.value.length - 1];
    if (lastMsg && lastMsg.role === "interviewer") {
      typewriter(lastMsg, lastMsg.content);
      // 开场白/恢复现场时的最后一题同样自动播报语音（此前只有 SSE
      // question 帧触发的下一题会播，导致第一题静音）
      autoPlayTts(sessionId.value, lastMsg.round);
    }
  }
};

/** 同步侧边栏列表项（新建会话插入 / 状态变化刷新） */
const syncSessionToList = (session: InterviewSession) => {
  const { messages: _messages, report: _report, ...rest } = session;
  interviewStore.upsertSession({ ...rest, hasReport: !!session.report });
};

/** 加载并打开一个会话：进行中转对话，已结束转只读回放 */
const openSession = async (id: string) => {
  resetSessionState();
  detailLoading.value = true;
  viewMode.value = "chat";
  try {
    const session = await interviewStore.loadSession(id);
    syncSessionToList(session);
    if (session.status === "in_progress") {
      viewMode.value = "chat";
      // 恢复现场时重放最后一题，保持“AI 正在提问”的临场感
      applySession(session, true);
    } else {
      viewMode.value = "replay";
      applySession(session);
    }
  } catch {
    viewMode.value = "empty";
    message.error("获取面试会话失败");
  } finally {
    detailLoading.value = false;
  }
};

/** 侧边栏点击记录：更新 URL，由路由 watch 统一驱动加载 */
const handleSelectSession = (item: { _id: string }) => {
  mobileSidebarOpen.value = false;
  if (item._id === ((route.query.id as string) ?? "")) return;
  router.push({ path: "/interview/chat", query: { id: item._id } });
};

const resetToEmpty = () => {
  resetSessionState();
  viewMode.value = "empty";
};

// 路由 id 驱动会话加载（首次进入 / 侧边栏切换 / 浏览器前进后退）
watch(
  () => route.query.id,
  async (id) => {
    const sid = (id as string) || "";
    if (sid === sessionId.value && viewMode.value !== "empty") return;
    if (!sid) {
      resetToEmpty();
      return;
    }
    await openSession(sid);
  },
  { immediate: true },
);

/** 静默刷新会话元信息（不打断正在展示的对话） */
const refreshSessionMeta = async () => {
  try {
    const { data } = await getSessionDetailAPI(sessionId.value);
    expiresAt.value = data.expiresAt;
    currentRound.value = data.currentRound ?? 1;
    phase.value = data.phase ?? phase.value;
    outlineItems.value = data.outline ?? [];
    askedTopicKeys.value = data.askedTopicKeys ?? [];
    startExpireTimer();
  } catch {
    // 静默刷新失败不打扰对话
  }
};

/** 语音识别增量：按句追加进输入框 */
const handleVoiceDelta = (text: string) => {
  // 超长时截断，与输入框 maxlength 上限保持一致
  answerText.value = (answerText.value + text).slice(0, ANSWER_MAX_LENGTH);
};

/** 语音识别失败提示 */
const handleVoiceError = (error: Error) => {
  message.error(error.message || "语音识别失败，请稍后重试");
};

// ==================== 反问环节推荐话术（加载逻辑） ====================

const loadReverseSuggestions = async (force = false) => {
  if (!sessionId.value || suggestionsLoading.value) return;
  if (suggestionsLoaded.value && !force) return;
  suggestionsLoading.value = true;
  try {
    const { data } = await getReverseSuggestionsAPI(sessionId.value);
    reverseSuggestions.value = data.suggestions ?? [];
    suggestionsLoaded.value = true;
  } catch {
    // 推荐话术为非关键能力，静默失败，用户可手动重试
  } finally {
    suggestionsLoading.value = false;
  }
};

/** 点击推荐话术填入输入框 */
const applySuggestion = (text: string) => {
  answerText.value = text;
};

/** 反问环节输入框占位文案 */
const inputPlaceholder = computed(() =>
  phase.value === "reverse"
    ? "输入你想问面试官的问题…（Ctrl + Enter 发送）"
    : "输入你的回答…（Ctrl + Enter 发送）",
);

/** 反问环节快捷收尾：发送礼貌的结束语，AI 会自然收尾并生成报告 */
const handleNoQuestions = () => {
  handleSend("感谢面试官的时间，我没有什么想问的了，谢谢！");
};

/** 提交回答（SSE 流式）；overrideContent 供反问快捷收尾等程序化发送使用 */
const handleSend = async (overrideContent?: string) => {
  const content = (overrideContent ?? answerText.value).trim();
  if (!content || submitting.value || aiThinking.value || typing.value || finished.value) return;

  // 发送即主动关闭语音收集：停止录音（丢弃尾句）、清空排队/在途识别，
  // 避免增量继续写入下一条回答；之后用户可重新点击麦克风开始新一轮输入
  voiceBtnRef.value?.stopAll();

  // 先乐观渲染用户回答，失败时回滚
  const optimisticMsg: InterviewMessage = {
    role: "candidate",
    content,
    round: currentRound.value,
    kind: "answer",
    channel: "text",
    ...(phase.value === "reverse" ? { questionType: "reverse" as const } : {}),
  };
  messages.value.push(optimisticMsg);
  const answerTextBackup = answerText.value;
  answerText.value = "";
  submitting.value = true;
  aiThinking.value = true;
  scrollToBottom(true);

  await submitAnswerSSE(
    sessionId.value,
    { content },
    {
      onInit: () => {
        aiThinking.value = true;
      },
      onFeedback: (fb) => {
        // 逐题反馈先于下一题到达：挂到本条回答消息上（与后端落库结构一致）
        for (let i = messages.value.length - 1; i >= 0; i--) {
          const msg = messages.value[i];
          if (msg && msg.role === "candidate") {
            msg.feedback = fb;
            break;
          }
        }
        scrollToBottom(true);
      },
      onQuestion: (data) => {
        aiThinking.value = false;
        currentRound.value = data.round;
        const nextPhase = data.phase ?? "main";
        const enteringReverse = nextPhase === "reverse" && phase.value !== "reverse";
        phase.value = nextPhase;
        const questionMsg: InterviewMessage = {
          role: "interviewer",
          content: data.nextQuestion,
          round: data.round,
          kind: "question",
          ...(nextPhase === "reverse" ? { questionType: "reverse" as const } : {}),
        };
        messages.value.push(questionMsg);
        scrollToBottom(true);
        typewriter(questionMsg, data.nextQuestion);
        // 问题到达即请求语音（与打字机并行），音频就绪后自动朗读
        autoPlayTts(sessionId.value, data.round);
        // 安静刷新一次会话，同步 expiresAt 与已考察主题
        refreshSessionMeta();
        if (enteringReverse) {
          message.info("已进入反问环节，你可以向面试官提问");
          void loadReverseSuggestions();
        }
        const listItem = interviewStore.sessionList.find((item) => item._id === sessionId.value);
        if (listItem) {
          listItem.currentRound = data.round;
          listItem.phase = nextPhase;
        }
      },
      onClosing: (data) => {
        // 反问收尾/候选人主动终止：面试官告别语先于报告生成到达，立即渲染
        aiThinking.value = false;
        generatingReport.value = true;
        currentRound.value = data.round;
        const farewellMsg: InterviewMessage = {
          role: "interviewer",
          content: data.farewell,
          round: data.round,
          kind: "question",
          // 反问环节的告别语标 reverse；主体考察中的终止告别语不加徽章
          ...(data.phase === "reverse" ? { questionType: "reverse" as const } : {}),
        };
        messages.value.push(farewellMsg);
        scrollToBottom(true);
        typewriter(farewellMsg, data.farewell);
        autoPlayTts(sessionId.value, data.round);
        refreshSessionMeta();
      },
      onFinished: () => {
        aiThinking.value = false;
        generatingReport.value = false;
        finished.value = true;
        message.success("面试已结束，正在跳转评价报告…");
        // 留出短暂时间展示最后一条回应，再进入报告页
        window.setTimeout(() => {
          router.push({ path: "/interview/report", query: { id: sessionId.value } });
        }, 1200);
      },
      onError: (err) => {
        aiThinking.value = false;
        // 提交失败的回答回填输入框便于重试
        answerText.value = answerTextBackup;
        messages.value = messages.value.filter((m) => m !== optimisticMsg);
        handleSseError(err.message);
      },
    },
  );

  submitting.value = false;
};

/** 统一处理提交错误：超时转为回放态并引导重新发起，其余提示后可重试 */
const handleSseError = (msg: string) => {
  if (msg.includes("长时间无回复")) {
    Modal.warning({
      title: "面试已自动结束",
      content: "本次面试因长时间无回复已被关闭。可重新发起一场新的模拟面试。",
      okText: "知道了",
      onOk: () => {
        openSession(sessionId.value);
      },
    });
  } else {
    message.error(msg || "提交回答失败，请重试");
  }
};

/** 用户主动收尾出报告 */
const handleFinish = () => {
  if (messages.value.length < 2) {
    message.warning("至少完成一轮问答后再收尾，否则报告质量无法保证");
    return;
  }
  Modal.confirm({
    title: "确认提前收尾？",
    content: "将立即基于已有问答生成评价报告，收尾后无法继续作答。",
    okText: "确认收尾",
    cancelText: "继续作答",
    onOk: async () => {
      try {
        await finishSessionAPI(sessionId.value);
        message.success("评价报告已生成");
        router.replace({ path: "/interview/report", query: { id: sessionId.value } });
      } catch {
        // 全局拦截器已提示
      }
    },
  });
};

/** 放弃面试（不生成报告），停留当前页转为只读回放 */
const handleCancel = () => {
  Modal.confirm({
    title: "确认放弃本场面试？",
    content: "中断后不会生成评价报告，且该会话无法继续作答。",
    okText: "确认放弃",
    okType: "danger",
    cancelText: "取消",
    onOk: async () => {
      try {
        const { data: session } = await cancelSessionAPI(sessionId.value);
        message.info("面试已中断，未生成报告");
        stopExpireTimer();
        stopTypeTimer();
        viewMode.value = "replay";
        applySession(session);
        syncSessionToList(session);
      } catch {
        // 全局拦截器已提示
      }
    },
  });
};

const goReport = () => {
  router.push({ path: "/interview/report", query: { id: sessionId.value } });
};

onBeforeUnmount(() => {
  stopExpireTimer();
  stopTypeTimer();
  disposeTts();
});
</script>

<template>
  <div class="flex h-screen overflow-hidden chat-bg">
    <!-- 桌面端侧边栏（可折叠） -->
    <div
      class="hidden flex-shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out lg:block"
      :class="interviewStore.sidebarCollapsed ? 'w-0' : 'w-[264px]'"
    >
      <InterviewSidebar :active-id="sessionId" @select="handleSelectSession" />
    </div>

    <!-- 移动端抽屉侧边栏 -->
    <div v-if="mobileSidebarOpen" class="fixed inset-0 z-40 lg:hidden">
      <div class="absolute inset-0 bg-slate-900/30" @click="mobileSidebarOpen = false" />
      <div class="absolute inset-y-0 left-0 shadow-2xl">
        <InterviewSidebar :active-id="sessionId" @select="handleSelectSession" />
      </div>
    </div>

    <!-- 右侧主区 -->
    <main class="flex min-w-0 flex-1 flex-col">
      <!-- 顶部信息条 -->
      <header
        class="flex h-14 flex-shrink-0 items-center gap-2 border-b border-slate-200/70 bg-white/80 px-3 backdrop-blur-md md:px-5"
      >
        <!-- 移动端侧栏开关 -->
        <button
          class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          @click="mobileSidebarOpen = true"
        >
          <MessagesSquare class="h-5 w-5" />
        </button>
        <!-- 桌面端折叠后的展开按钮 -->
        <button
          v-if="interviewStore.sidebarCollapsed"
          class="hidden h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:flex"
          @click="interviewStore.toggleSidebar()"
        >
          <PanelLeftOpen class="h-4 w-4" />
        </button>

        <template v-if="viewMode !== 'empty' && sessionTitle">
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold leading-tight text-slate-800">
              {{ sessionTitle }}
            </p>
            <p class="text-xs leading-tight text-slate-400">{{ headerLevelText }}</p>
          </div>

          <div class="flex-1" />

          <!-- 考察进度 -->
          <Popover
            v-if="viewMode === 'chat' && topicList.length"
            trigger="click"
            placement="bottomRight"
          >
            <template #content>
              <div class="w-64">
                <p class="mb-2 text-xs font-medium text-slate-500">
                  考察进度
                  <span class="ml-1 text-indigo-500">{{ askedCount }}/{{ topicList.length }}</span>
                </p>
                <div class="topic-popover-scroll max-h-64 space-y-1 overflow-y-auto">
                  <div
                    v-for="topic in topicList"
                    :key="topic.key"
                    class="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs"
                    :class="topic.asked ? 'bg-indigo-50/60' : ''"
                  >
                    <span
                      class="flex-shrink-0 rounded px-1.5 py-0.5 text-[10px]"
                      :class="
                        DIFFICULTY_CLASS_MAP[topic.difficulty ?? ''] ??
                        'bg-slate-100 text-slate-500'
                      "
                    >
                      {{ topic.difficulty || "基础" }}
                    </span>
                    <span
                      v-if="topic.questionType"
                      class="flex-shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500"
                    >
                      {{ getQuestionTypeLabel(topic.questionType) }}
                    </span>
                    <span
                      class="flex-1 truncate"
                      :class="topic.asked ? 'text-slate-700' : 'text-slate-400'"
                    >
                      {{ topic.title }}
                    </span>
                    <CheckCircleFilled v-if="topic.asked" class="flex-shrink-0 text-indigo-500" />
                  </div>
                </div>
              </div>
            </template>
            <Button size="small" class="rounded-full">
              <template #icon><FileDoneOutlined /></template>
              <span class="hidden sm:inline">考察进度</span>
              <span class="tabular-nums sm:ml-0.5">{{ askedCount }}/{{ topicList.length }}</span>
            </Button>
          </Popover>

          <!-- 面试进度（时长驱动，不再有总轮次） -->
          <div
            v-if="viewMode === 'chat'"
            class="hidden items-center gap-2 md:flex md:max-w-[240px]"
          >
            <Tooltip
              title="主体考察约 30-60 分钟，AI 面试官将根据你的回答把握节奏；超过 45 分钟无任何活动，面试将被自动关闭"
            >
              <span class="whitespace-nowrap text-xs tabular-nums text-slate-500">
                已进行 {{ elapsedMinutes }} 分钟 · 已问 {{ questionCount }} 题
              </span>
            </Tooltip>
            <span
              v-if="phase === 'reverse'"
              class="flex-shrink-0 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] text-violet-600"
            >
              反问环节
            </span>
          </div>

          <!-- 剩余时间 -->
          <Tooltip v-if="viewMode === 'chat'" title="超过 45 分钟无任何活动，面试将被自动关闭">
            <div class="hidden items-center gap-1.5 sm:flex">
              <ClockCircleOutlined :class="remainWarn ? 'text-red-500' : 'text-slate-400'" />
              <div class="w-16">
                <span
                  class="block text-center text-xs tabular-nums"
                  :class="remainWarn ? 'font-medium text-red-500' : 'text-slate-500'"
                >
                  {{ remainDisplay }}
                </span>
                <div class="mt-0.5 h-0.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    class="h-full rounded-full transition-all duration-1000"
                    :class="remainWarn ? 'bg-red-400' : 'bg-emerald-400'"
                    :style="{ width: `${remainPercent}%` }"
                  />
                </div>
              </div>
            </div>
          </Tooltip>

          <!-- 语音自动朗读开关 -->
          <Tooltip
            v-if="viewMode === 'chat'"
            :title="
              autoPlayEnabled ? '语音自动朗读已开启，点击关闭' : '语音自动朗读已关闭，点击开启'
            "
          >
            <button
              class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-slate-100"
              :class="autoPlayEnabled ? 'text-indigo-500' : 'text-slate-400'"
              @click="toggleAutoPlay"
            >
              <VolumeX v-if="!autoPlayEnabled" class="h-4 w-4" />
              <Volume2 v-else class="h-4 w-4" />
            </button>
          </Tooltip>

          <template v-if="viewMode === 'chat'">
            <Button size="small" class="rounded-full" @click="handleFinish">收尾出报告</Button>
            <Button size="small" danger class="rounded-full" @click="handleCancel">放弃</Button>
          </template>
          <template v-else-if="viewMode === 'replay'">
            <Button v-if="hasReport" size="small" class="report-btn rounded-full" @click="goReport">
              查看评价报告
            </Button>
          </template>
        </template>
      </header>

      <!-- 内容区 -->
      <div ref="listRef" class="min-h-0 flex-1 overflow-y-auto">
        <Spin :spinning="detailLoading">
          <!-- 欢迎页（无选中会话） -->
          <div
            v-if="viewMode === 'empty'"
            class="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 py-10"
          >
            <div
              class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-xl shadow-indigo-200"
            >
              <MessagesSquare class="h-7 w-7" />
            </div>
            <h1 class="mt-5 text-2xl font-bold text-slate-800">随时开始，上场练习</h1>
            <p class="mt-2 text-center text-sm text-slate-400">
              AI 面试官以简历项目为主线深挖追问，像真实大厂面试一样作答，结束自动生成评价报告
            </p>
            <div class="mt-8 flex flex-wrap justify-center gap-3">
              <button
                v-for="opt in stageOptions"
                :key="opt.value"
                class="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-2.5 text-sm text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md hover:shadow-indigo-100"
                @click="router.push({ path: '/interview', query: { stage: opt.value } })"
              >
                <component :is="opt.icon" class="h-4 w-4 text-indigo-500" />
                {{ opt.label }}
              </button>
            </div>
            <p class="mt-10 text-xs text-slate-300">选择一场面试轮次，从左侧或上方开始你的面试</p>
          </div>

          <!-- 对话 / 回放 -->
          <div v-else class="mx-auto max-w-3xl px-4 py-6">
            <div class="space-y-5">
              <!-- 开场说明 -->
              <div class="py-3 text-center">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs text-slate-400"
                >
                  <RobotOutlined />
                  AI 面试官已就位，请认真作答，回答越具体报告越有针对性
                </span>
              </div>

              <template v-for="(msg, index) in messages" :key="index">
                <!-- 反问环节分隔条 -->
                <div v-if="index === reverseStartIndex" class="flex items-center gap-3 py-1">
                  <div class="h-px flex-1 bg-slate-200/80" />
                  <span
                    class="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50/70 px-3 py-1 text-xs text-violet-500"
                  >
                    <MessagesSquare class="h-3 w-3" />
                    反问环节 · 你也可以向面试官提问
                  </span>
                  <div class="h-px flex-1 bg-slate-200/80" />
                </div>
                <div
                  class="flex items-start gap-3"
                  :class="msg.role === 'candidate' ? 'flex-row-reverse' : ''"
                >
                  <!-- 头像 -->
                  <div
                    class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full shadow-sm"
                    :class="
                      msg.role === 'candidate'
                        ? 'border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-500'
                        : 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white'
                    "
                  >
                    <span v-if="msg.role === 'candidate'">{{ userInitial }}</span>
                    <RobotOutlined v-else />
                  </div>

                  <!-- 气泡 -->
                  <div class="max-w-[80%] md:max-w-[75%]">
                    <p
                      class="mb-1 flex items-center gap-1 px-1 text-[11px] text-slate-400"
                      :class="msg.role === 'candidate' ? 'justify-end' : ''"
                    >
                      <span>{{
                        msg.role === "candidate" ? "我" : `AI 面试官 · 第 ${msg.round} 轮`
                      }}</span>
                      <!-- 题型徽章：反问环节 / 新版会话的题目类型 -->
                      <span
                        v-if="
                          msg.questionType &&
                          (msg.role === 'candidate' || msg.questionType !== 'self_intro')
                        "
                        class="rounded px-1.5 py-0.5 text-[10px]"
                        :class="
                          msg.questionType === 'reverse'
                            ? 'bg-violet-50 text-violet-500'
                            : 'bg-indigo-50 text-indigo-500'
                        "
                      >
                        {{ getQuestionTypeLabel(msg.questionType) }}
                      </span>
                      <!-- 问题语音：自动朗读失败或想重听时点击播放，播放中点击即停止 -->
                      <button
                        v-if="msg.role === 'interviewer' && sessionId"
                        class="tts-btn"
                        :title="ttsPlaying(sessionId, msg.round) ? '停止播放' : '播放本题语音'"
                        @click="playTts(sessionId, msg.round)"
                      >
                        <LoadingOutlined v-if="ttsLoading(sessionId, msg.round)" spin />
                        <SoundFilled
                          v-else-if="ttsPlaying(sessionId, msg.round)"
                          class="text-indigo-500"
                        />
                        <SoundOutlined v-else />
                      </button>
                    </p>
                    <div
                      class="whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-relaxed"
                      :class="
                        msg.role === 'candidate'
                          ? 'rounded-tr-sm bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-100'
                          : 'rounded-tl-sm border border-slate-200/80 bg-white text-slate-800 shadow-sm'
                      "
                    >
                      {{ msg.content
                      }}<span
                        v-if="
                          typing &&
                          msg === messages[messages.length - 1] &&
                          msg.role === 'interviewer'
                        "
                        class="type-cursor"
                      />
                    </div>

                    <!-- 逐题反馈卡片（挂在候选人回答下方，实时与回放一致） -->
                    <div
                      v-if="msg.role === 'candidate' && msg.feedback"
                      class="mt-2 rounded-xl border border-indigo-100 bg-indigo-50/70 px-3 py-2.5"
                    >
                      <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span class="text-[11px] font-medium text-indigo-500">AI 点评</span>
                        <span
                          v-for="dim in feedbackDims(msg.feedback)"
                          :key="dim.label"
                          class="text-[11px] tabular-nums"
                          :style="{ color: dim.color }"
                        >
                          {{ dim.label }} {{ dim.value }}
                        </span>
                      </div>
                      <p
                        v-if="msg.feedback.comment"
                        class="mt-1 text-[11px] leading-relaxed text-slate-500"
                      >
                        {{ msg.feedback.comment }}
                      </p>
                    </div>
                  </div>
                </div>
              </template>

              <!-- AI 思考中 -->
              <div v-if="aiThinking" class="flex items-start gap-3">
                <div
                  class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-sm"
                >
                  <RobotOutlined />
                </div>
                <div
                  class="rounded-2xl rounded-tl-sm border border-slate-200/80 bg-white px-4 py-3 shadow-sm"
                >
                  <span class="dot-loading text-slate-400">AI 正在思考你的回答</span>
                </div>
              </div>

              <!-- 反问收尾：报告生成中 -->
              <div v-else-if="generatingReport" class="flex justify-center py-2">
                <span
                  class="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-indigo-50/70 px-4 py-1.5 text-xs text-indigo-500"
                >
                  <LoadingOutlined spin />
                  <span class="dot-loading">正在生成面试评价报告，约需 1-4 分钟</span>
                </span>
              </div>
            </div>
          </div>
        </Spin>
      </div>

      <!-- 输入区 / 回放操作区 -->
      <footer v-if="viewMode !== 'empty'" class="flex-shrink-0 px-4 pb-4 pt-1">
        <div class="mx-auto max-w-3xl">
          <!-- 进行中：答题输入框 -->
          <div
            v-if="viewMode === 'chat'"
            class="rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/60 transition-colors focus-within:border-indigo-300 focus-within:shadow-indigo-100"
          >
            <Input.TextArea
              v-model:value="answerText"
              :placeholder="inputPlaceholder"
              :rows="3"
              :maxlength="ANSWER_MAX_LENGTH"
              :bordered="false"
              class="answer-textarea"
              :disabled="finished || generatingReport"
              @keydown.ctrl.enter.prevent="handleSend()"
            />
            <div class="mt-1 flex items-center justify-between px-1">
              <p class="text-xs text-slate-400">
                {{
                  finished
                    ? "面试已结束"
                    : typing
                      ? "AI 正在输出题目…"
                      : generatingReport
                        ? "评价报告生成中，完成后自动跳转…"
                        : "Ctrl + Enter 快速发送"
                }}
              </p>
              <div class="flex items-center gap-3">
                <!-- 反问环节：推荐问法 -->
                <Popover
                  v-if="viewMode === 'chat' && phase === 'reverse' && !generatingReport"
                  trigger="click"
                  placement="topRight"
                >
                  <template #content>
                    <div class="w-80 space-y-2">
                      <div class="flex items-center justify-between">
                        <p class="text-xs font-medium text-slate-500">反问推荐话术</p>
                        <Button
                          type="link"
                          size="small"
                          class="px-0"
                          :loading="suggestionsLoading"
                          @click="loadReverseSuggestions(true)"
                        >
                          换一批
                        </Button>
                      </div>
                      <template v-if="reverseSuggestions.length">
                        <button
                          v-for="(suggestion, idx) in reverseSuggestions"
                          :key="idx"
                          type="button"
                          class="suggestion-card w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left transition-all hover:border-indigo-300 hover:bg-indigo-50/40"
                          @click="applySuggestion(suggestion.content)"
                        >
                          <span
                            class="inline-block rounded bg-indigo-50 px-1.5 py-0.5 text-[11px] font-medium text-indigo-500"
                          >
                            {{ suggestion.title }}
                          </span>
                          <p class="mt-1.5 text-xs leading-relaxed text-slate-600">
                            {{ suggestion.content }}
                          </p>
                          <p v-if="suggestion.rationale" class="mt-1 text-[11px] text-slate-400">
                            {{ suggestion.rationale }}
                          </p>
                        </button>
                      </template>
                      <p v-else-if="suggestionsLoading" class="text-xs text-slate-400">
                        正在生成推荐话术…
                      </p>
                      <p v-else class="text-xs text-slate-400">暂无推荐，点击「换一批」重试</p>
                    </div>
                  </template>
                  <Button size="small" class="rounded-full" :loading="suggestionsLoading">
                    <template #icon><BulbOutlined /></template>
                    <span class="hidden sm:inline">推荐问法</span>
                  </Button>
                </Popover>
                <!-- 反问环节：快捷收尾 -->
                <Button
                  v-if="viewMode === 'chat' && phase === 'reverse' && !generatingReport"
                  size="small"
                  class="rounded-full"
                  :disabled="submitting || aiThinking || typing"
                  @click="handleNoQuestions"
                >
                  没有问题了
                </Button>
                <span class="text-xs tabular-nums text-slate-300">
                  {{ answerText.length }}/{{ ANSWER_MAX_LENGTH }}
                </span>
                <VoiceRecordButton
                  ref="voiceBtnRef"
                  :disabled="finished || generatingReport || typing || submitting || aiThinking"
                  @delta="handleVoiceDelta"
                  @error="handleVoiceError"
                />
                <Button
                  type="primary"
                  shape="circle"
                  class="send-btn flex items-center justify-center"
                  :loading="submitting || aiThinking"
                  :disabled="!canSubmitAnswer"
                  @click="handleSend()"
                >
                  <template #icon><SendOutlined /></template>
                </Button>
              </div>
            </div>
          </div>

          <!-- 回放：已结束提示条 -->
          <div
            v-else
            class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p class="text-sm font-medium text-slate-600">本场面试已结束</p>
              <p class="mt-0.5 text-xs text-slate-400">
                {{ endedReasonText }}{{ hasReport ? "，评价报告已生成" : "，未生成评价报告" }}
              </p>
            </div>
            <div class="flex flex-shrink-0 gap-2">
              <Button
                v-if="hasReport"
                type="primary"
                class="report-btn rounded-full"
                @click="goReport"
              >
                查看评价报告
              </Button>
              <Button class="rounded-full" @click="router.push('/interview')">再练一场</Button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  </div>
</template>

<style scoped>
.chat-bg {
  background:
    radial-gradient(ellipse 70% 50% at 20% 0%, rgba(99, 102, 241, 0.05), transparent),
    radial-gradient(ellipse 60% 40% at 90% 100%, rgba(168, 85, 247, 0.05), transparent), #f8fafc;
}

.send-btn {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  box-shadow: 0 4px 12px -2px rgba(99, 102, 241, 0.4);
}

.send-btn:not(:disabled):hover {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
}

.report-btn {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  color: #fff;
}

.report-btn:hover {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important;
  color: #fff;
}

.answer-textarea {
  resize: none;
  font-size: 14px;
}

.answer-textarea:focus {
  box-shadow: none;
}

.tts-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  font-size: 12px;
  color: #94a3b8;
  transition:
    color 0.2s,
    background-color 0.2s;
}

.tts-btn:hover {
  color: #6366f1;
  background-color: rgba(99, 102, 241, 0.08);
}

.topic-popover-scroll::-webkit-scrollbar {
  width: 4px;
}

.topic-popover-scroll::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: #e2e8f0;
}

.type-cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 2px;
  vertical-align: text-bottom;
  background: #6366f1;
  animation: blink 0.8s step-end infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.dot-loading::after {
  content: "";
  animation: dots 1.2s steps(4, end) infinite;
}

@keyframes dots {
  0% {
    content: "";
  }
  25% {
    content: ".";
  }
  50% {
    content: "..";
  }
  75% {
    content: "...";
  }
  100% {
    content: "";
  }
}
</style>
