<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";

import {
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

import { cancelSessionAPI, finishSessionAPI, getSessionDetailAPI } from "@/api/interview/interview";
import { submitAnswerSSE } from "@/api/interview/sse";
import type {
  EndedReason,
  InterviewMessage,
  InterviewSession,
  OutlineItem,
} from "@/api/interview/type";
import { FOCUS_LABEL_MAP, getEndedReasonLabel, getFocusLabel } from "@/api/interview/type";
import { useAuthStore } from "@/stores/auth";
import { useInterviewStore } from "@/stores/interviewStore";

import InterviewSidebar from "./components/InterviewSidebar.vue";
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
const focusLabel = ref("");
const targetRounds = ref(0);
const currentRound = ref(0);
/** 当前待回答的问题轮次（用于进度展示） */
const displayRound = computed(() => Math.min(currentRound.value || 1, targetRounds.value || 1));
const outlineItems = ref<OutlineItem[]>([]);
const askedTopicKeys = ref<string[]>([]);
const expiresAt = ref("");
const endedReason = ref<EndedReason | null>(null);
const hasReport = ref(false);

const messages = ref<InterviewMessage[]>([]);

const answerText = ref("");
const submitting = ref(false);
/** AI 正在生成下一题 */
const aiThinking = ref(false);
/** 下一题打字机输出中 */
const typing = ref(false);
/** 本轮面试已结束（等待跳转报告） */
const finished = ref(false);
/** 移动端侧边栏抽屉 */
const mobileSidebarOpen = ref(false);

const listRef = ref<HTMLElement | null>(null);

let expireTimer: number | null = null;
let typeTimer: number | null = null;
/** 剩余秒数 */
const remainSeconds = ref(0);

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

const userInitial = computed(() => authStore.userInfo?.username?.[0]?.toUpperCase() || "U");

const canSubmitAnswer = computed(
  () =>
    !!answerText.value.trim() &&
    !submitting.value &&
    !aiThinking.value &&
    !typing.value &&
    !finished.value,
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

/** 欢迎页考察侧重胶囊 */
const focusOptions = [
  { value: "technical", label: FOCUS_LABEL_MAP.technical, icon: CodeOutlined },
  { value: "project", label: FOCUS_LABEL_MAP.project, icon: FolderOpenOutlined },
  { value: "mixed", label: FOCUS_LABEL_MAP.mixed, icon: AppstoreOutlined },
] as const;

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
  focusLabel.value = "";
  targetRounds.value = 0;
  currentRound.value = 0;
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
};

/** 渲染会话到当前视图（chat/replay 由调用方决定） */
const applySession = (session: InterviewSession, animate = false) => {
  sessionId.value = session._id;
  sessionTitle.value = session.jobDescription.split("\n")[0]?.slice(0, 40) || "模拟面试";
  focusLabel.value = getFocusLabel(session.levelConfig?.focus ?? "");
  targetRounds.value = session.targetRounds ?? 0;
  currentRound.value = session.currentRound ?? 1;
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
    targetRounds.value = data.targetRounds ?? 0;
    outlineItems.value = data.outline ?? [];
    askedTopicKeys.value = data.askedTopicKeys ?? [];
    startExpireTimer();
  } catch {
    // 静默刷新失败不打扰对话
  }
};

/** 提交回答（SSE 流式） */
const handleSend = async () => {
  const content = answerText.value.trim();
  if (!canSubmitAnswer.value) return;

  // 先乐观渲染用户回答，失败时回滚
  const optimisticMsg: InterviewMessage = {
    role: "candidate",
    content,
    round: currentRound.value,
    kind: "answer",
    channel: "text",
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
      onQuestion: async (data) => {
        aiThinking.value = false;
        currentRound.value = data.round;
        targetRounds.value = data.targetRounds;
        const questionMsg: InterviewMessage = {
          role: "interviewer",
          content: data.nextQuestion,
          round: data.round,
          kind: "question",
        };
        messages.value.push(questionMsg);
        scrollToBottom(true);
        typewriter(questionMsg, data.nextQuestion);
        // 问题到达即请求语音（与打字机并行），音频就绪后自动朗读
        autoPlayTts(sessionId.value, data.round);
        // 安静刷新一次会话，同步 expiresAt 与已考察主题
        refreshSessionMeta();
        const listItem = interviewStore.sessionList.find((item) => item._id === sessionId.value);
        if (listItem) {
          listItem.currentRound = data.round;
          listItem.targetRounds = data.targetRounds;
        }
      },
      onFinished: (data) => {
        aiThinking.value = false;
        finished.value = true;
        message.success(
          data.endedReason === "ai_suggest"
            ? "AI 认为本场面试可以结束了，正在生成评价报告…"
            : "全部轮次已完成，正在跳转评价报告…",
        );
        // 留出短暂时间展示最后一条回答，再进入报告页
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
            <p class="text-xs leading-tight text-slate-400">{{ focusLabel }}</p>
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

          <!-- 轮次进度 -->
          <div
            v-if="viewMode === 'chat'"
            class="hidden items-center gap-2 md:flex md:max-w-[180px]"
          >
            <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                :style="{ width: `${(displayRound / (targetRounds || 1)) * 100}%` }"
              />
            </div>
            <span class="whitespace-nowrap text-xs tabular-nums text-slate-500">
              {{ displayRound }}/{{ targetRounds }} 轮
            </span>
          </div>

          <!-- 剩余时间 -->
          <Tooltip v-if="viewMode === 'chat'" title="超过 30 分钟无任何活动，面试将被自动关闭">
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
              AI 面试官多轮追问，像真实面试一样作答，结束自动生成评价报告
            </p>
            <div class="mt-8 flex flex-wrap justify-center gap-3">
              <button
                v-for="opt in focusOptions"
                :key="opt.value"
                class="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-2.5 text-sm text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md hover:shadow-indigo-100"
                @click="router.push({ path: '/interview', query: { focus: opt.value } })"
              >
                <component :is="opt.icon" class="h-4 w-4 text-indigo-500" />
                {{ opt.label }}
              </button>
            </div>
            <p class="mt-10 text-xs text-slate-300">选择一种考察侧重，从左侧或上方开始你的面试</p>
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

              <div
                v-for="(msg, index) in messages"
                :key="index"
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
                </div>
              </div>

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
              placeholder="输入你的回答…（Ctrl + Enter 发送）"
              :rows="3"
              :maxlength="ANSWER_MAX_LENGTH"
              :bordered="false"
              class="answer-textarea"
              :disabled="finished"
              @keydown.ctrl.enter.prevent="handleSend"
            />
            <div class="mt-1 flex items-center justify-between px-1">
              <p class="text-xs text-slate-400">
                {{
                  finished ? "面试已结束" : typing ? "AI 正在输出题目…" : "Ctrl + Enter 快速发送"
                }}
              </p>
              <div class="flex items-center gap-3">
                <span class="text-xs tabular-nums text-slate-300">
                  {{ answerText.length }}/{{ ANSWER_MAX_LENGTH }}
                </span>
                <Button
                  type="primary"
                  shape="circle"
                  class="send-btn"
                  :loading="submitting || aiThinking"
                  :disabled="!canSubmitAnswer"
                  @click="handleSend"
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
