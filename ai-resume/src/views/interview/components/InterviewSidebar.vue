<script setup lang="ts">
import { computed, onMounted } from "vue";

import { HomeOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { Spin, Tooltip } from "ant-design-vue";
import { MessagesSquare, PanelLeftClose } from "lucide-vue-next";
import { useRouter } from "vue-router";

import type { InterviewSessionSummary } from "@/api/interview/type";
import { getEndedReasonLabel } from "@/api/interview/type";
import { useInterviewStore } from "@/stores/interviewStore";
import { formatRelativeTime } from "@/utils/day";

const props = defineProps<{
  /** 当前在右侧展示的会话 id */
  activeId?: string;
}>();

const emit = defineEmits<{
  /** 点击一条面试记录 */
  select: [session: InterviewSessionSummary];
}>();

const router = useRouter();
const store = useInterviewStore();

onMounted(() => {
  store.fetchSessionList();
});

const activeSessions = computed(() =>
  store.sessionList.filter((item) => item.status === "in_progress"),
);
const endedSessions = computed(() =>
  store.sessionList.filter((item) => item.status !== "in_progress"),
);

const getTitle = (item: InterviewSessionSummary) =>
  item.jobDescription.split("\n")[0]?.slice(0, 40) || "模拟面试";

const getDotClass = (item: InterviewSessionSummary) => {
  if (item.status === "in_progress") return "bg-emerald-500";
  if (item.status === "completed") return "bg-violet-500";
  return "bg-slate-300";
};

const getStatusText = (item: InterviewSessionSummary) => {
  if (item.status === "in_progress") return "进行中";
  if (item.status === "completed") return "已出报告";
  return getEndedReasonLabel(item.endedReason ?? "") || "已中断";
};

/** 点击记录：交给父级加载对话 */
const handleSelect = (item: InterviewSessionSummary) => {
  emit("select", item);
};
</script>

<template>
  <aside class="flex h-full w-[264px] flex-shrink-0 flex-col border-r border-slate-200/70 bg-white">
    <!-- 品牌行 -->
    <div class="flex h-14 flex-shrink-0 items-center gap-2.5 px-4">
      <div
        class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-200"
      >
        <MessagesSquare class="h-4 w-4" />
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-semibold leading-tight text-slate-800">AI 模拟面试</p>
        <p class="text-[11px] leading-tight text-slate-400">多轮追问 · 智能评价</p>
      </div>
      <Tooltip title="收起侧栏" placement="right">
        <button
          class="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 lg:flex"
          @click="store.toggleSidebar()"
        >
          <PanelLeftClose class="h-4 w-4" />
        </button>
      </Tooltip>
    </div>

    <!-- 发起新面试 -->
    <div class="flex-shrink-0 px-3 pb-1 pt-2">
      <button
        class="flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-sm font-medium text-white shadow-lg shadow-indigo-200/70 transition-all hover:-translate-y-px hover:opacity-90"
        @click="router.push('/interview')"
      >
        <PlusOutlined class="text-xs" />
        发起新面试
      </button>
    </div>

    <!-- 记录列表 -->
    <div class="sidebar-scroll min-h-0 flex-1 overflow-y-auto px-3 pb-3 pt-2">
      <Spin :spinning="store.listLoading" wrapper-class-name="h-full">
        <!-- 骨架屏 -->
        <template v-if="store.listLoading && !store.listLoaded">
          <div v-for="i in 4" :key="i" class="mb-2 rounded-xl px-3 py-2.5">
            <div class="h-3.5 w-4/5 animate-pulse rounded bg-slate-100" />
            <div class="mt-2 h-2.5 w-2/5 animate-pulse rounded bg-slate-100" />
          </div>
        </template>

        <template v-else>
          <!-- 空状态 -->
          <div v-if="!store.sessionList.length" class="px-2 py-10 text-center">
            <div
              class="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-300"
            >
              <MessagesSquare class="h-5 w-5" />
            </div>
            <p class="text-xs text-slate-400">暂无面试记录</p>
            <p class="mt-1 text-[11px] text-slate-300">点击上方按钮开始第一场练习</p>
          </div>

          <template v-else>
            <!-- 进行中 -->
            <div v-if="activeSessions.length" class="mb-1">
              <p class="sidebar-group-label">进行中</p>
              <button
                v-for="item in activeSessions"
                :key="item._id"
                class="session-item"
                :class="item._id === props.activeId ? 'session-item-active' : ''"
                @click="handleSelect(item)"
              >
                <p class="session-title">{{ getTitle(item) }}</p>
                <p class="session-meta">
                  <span class="relative flex h-1.5 w-1.5 flex-shrink-0">
                    <span
                      class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
                    />
                    <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  <span class="text-emerald-600">{{ getStatusText(item) }}</span>
                  <span class="text-slate-300">·</span>
                  <span>{{ item.currentRound }}/{{ item.targetRounds }} 轮</span>
                  <span class="text-slate-300">·</span>
                  <span>{{ formatRelativeTime(item.lastActivityAt) }}</span>
                </p>
              </button>
            </div>

            <!-- 已结束 -->
            <div v-if="endedSessions.length">
              <p class="sidebar-group-label">已结束</p>
              <button
                v-for="item in endedSessions"
                :key="item._id"
                class="session-item"
                :class="item._id === props.activeId ? 'session-item-active' : ''"
                @click="handleSelect(item)"
              >
                <p class="session-title">{{ getTitle(item) }}</p>
                <p class="session-meta">
                  <span class="h-1.5 w-1.5 flex-shrink-0 rounded-full" :class="getDotClass(item)" />
                  <span>{{ getStatusText(item) }}</span>
                  <span class="text-slate-300">·</span>
                  <span>{{ item.currentRound }}/{{ item.targetRounds }} 轮</span>
                  <span class="text-slate-300">·</span>
                  <span>{{ formatRelativeTime(item.lastActivityAt) }}</span>
                </p>
              </button>
            </div>
          </template>
        </template>
      </Spin>
    </div>

    <!-- 底部：返回首页 -->
    <div class="flex-shrink-0 border-t border-slate-100 p-3">
      <button
        class="flex h-9 w-full items-center gap-2 rounded-lg px-3 text-[13px] text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        @click="router.push('/')"
      >
        <HomeOutlined class="text-sm" />
        返回首页
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-group-label {
  padding: 0.75rem 0.75rem 0.375rem;
  font-size: 11px;
  color: theme("colors.slate.400");
}

.session-item {
  display: block;
  width: 100%;
  text-align: left;
  border-radius: theme("borderRadius.xl");
  padding: 0.625rem 0.75rem;
  transition: background-color 0.15s ease;
}

.session-item:hover {
  background-color: theme("colors.slate.100");
}

.session-item-active,
.session-item-active:hover {
  background-color: theme("colors.indigo.50");
}

.session-item-active .session-title {
  color: theme("colors.indigo.700");
}

.session-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 500;
  color: theme("colors.slate.700");
}

.session-meta {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.25rem;
  font-size: 11px;
  color: theme("colors.slate.400");
}

.sidebar-scroll::-webkit-scrollbar {
  width: 4px;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: theme("colors.slate.200");
}

.sidebar-scroll::-webkit-scrollbar-thumb:hover {
  background: theme("colors.slate.300");
}
</style>
