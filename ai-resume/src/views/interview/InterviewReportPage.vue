<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { ArrowLeftOutlined, RobotOutlined } from "@ant-design/icons-vue";
import { Button, Collapse, CollapsePanel, Progress, Spin, message } from "ant-design-vue";
import { Lightbulb, Trophy, Wrench } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";

import { getSessionDetailAPI, getReportAPI } from "@/api/interview/interview";
import type { InterviewMessage, InterviewSession } from "@/api/interview/type";
import { getEndedReasonLabel, getExperienceLevelLabel, getFocusLabel } from "@/api/interview/type";

import TopicRadarChart from "./components/TopicRadarChart.vue";

const route = useRoute();
const router = useRouter();

const pageLoading = ref(true);
const report = ref<Awaited<ReturnType<typeof getReportAPI>>["data"] | null>(null);
const session = ref<InterviewSession | null>(null);

/** 问答对（question + 下一条 answer 组合） */
interface QAItem {
  question: InterviewMessage;
  answer?: InterviewMessage;
}

const qaItems = computed<QAItem[]>(() => {
  if (!session.value) return [];
  const items: QAItem[] = [];
  let current: QAItem | null = null;
  for (const msg of session.value.messages ?? []) {
    if (msg.kind === "question") {
      current = { question: msg };
      items.push(current);
    } else if (current && msg.kind === "answer") {
      current.answer = msg;
      current = null;
    }
  }
  return items;
});

const scoreColor = (score: number) =>
  score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";

/** 推荐等级徽章样式，未知值兜底 */
const recommendationBadge = computed(() => {
  const rec = report.value?.recommendation ?? "";
  if (rec.includes("强烈推荐")) return { bg: "bg-emerald-50 text-emerald-600 border-emerald-200" };
  if (rec.includes("推荐")) return { bg: "bg-indigo-50 text-indigo-600 border-indigo-200" };
  if (rec.includes("待定")) return { bg: "bg-amber-50 text-amber-600 border-amber-200" };
  return { bg: "bg-red-50 text-red-600 border-red-200" };
});

const sessionMeta = computed(() => {
  if (!session.value) return [];
  return [
    getFocusLabel(session.value.levelConfig?.focus ?? ""),
    getExperienceLevelLabel(session.value.levelConfig?.experienceLevel ?? ""),
    `${session.value.currentRound}/${session.value.targetRounds} 轮`,
  ].filter(Boolean);
});

const endedLabel = computed(() =>
  session.value?.endedReason ? getEndedReasonLabel(session.value.endedReason) : "",
);

/** 返回该场面试的回放页（保留会话上下文） */
const goBack = () => {
  const id = route.query.id as string;
  router.push({ path: "/interview/chat", query: id ? { id } : undefined });
};

/** 雷达图数据（维度过多时截取前 8 个，保证可读性） */
const radarTopics = computed(() =>
  (report.value?.topics ?? []).slice(0, 8).map((t) => ({ name: t.title, score: t.score ?? 0 })),
);

const summaryBlocks = computed(() => [
  {
    title: "优势亮点",
    icon: Trophy,
    soft: "bg-emerald-50 text-emerald-600",
    list: report.value?.strengths ?? [],
  },
  {
    title: "待改进项",
    icon: Wrench,
    soft: "bg-amber-50 text-amber-600",
    list: report.value?.weaknesses ?? [],
  },
  {
    title: "提升建议",
    icon: Lightbulb,
    soft: "bg-indigo-50 text-indigo-600",
    list: report.value?.suggestions ?? [],
  },
]);

onMounted(async () => {
  const id = route.query.id as string;
  if (!id) {
    message.error("缺少面试会话 ID");
    router.replace({ path: "/interview" });
    return;
  }

  try {
    const [reportRes] = await Promise.all([
      getReportAPI(id),
      getSessionDetailAPI(id)
        .then((res) => {
          session.value = res.data;
        })
        .catch(() => undefined),
    ]);
    report.value = reportRes.data;
  } catch {
    message.error("该面试尚未生成评价报告");
  } finally {
    pageLoading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Header -->
    <div
      class="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-slate-200/70 bg-white/85 px-4 backdrop-blur-md md:px-6"
    >
      <Button type="text" class="flex items-center" @click="goBack">
        <template #icon><ArrowLeftOutlined /></template>
        返回
      </Button>
      <div
        class="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-sm shadow-indigo-200"
      >
        <RobotOutlined class="text-xs" />
      </div>
      <span class="text-sm font-semibold text-slate-800">面试评价报告</span>
    </div>

    <Spin :spinning="pageLoading">
      <div v-if="report" class="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <!-- 总览卡片 -->
        <div class="report-card p-6 md:p-8">
          <div class="flex flex-col items-center gap-8 sm:flex-row">
            <!-- 分数环 -->
            <div class="relative h-[150px] w-[150px] flex-shrink-0">
              <Progress
                type="circle"
                :percent="report.overallScore"
                :size="150"
                :stroke-color="{ '0%': '#6366f1', '100%': '#8b5cf6' }"
                :stroke-width="8"
                :format="() => ''"
              />
              <div
                class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
              >
                <span class="text-4xl font-bold text-slate-800">{{ report.overallScore }}</span>
                <span class="mt-1 text-xs text-slate-400">综合得分</span>
              </div>
            </div>

            <!-- 概要 -->
            <div class="flex-1 space-y-3">
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="rounded-full border px-3 py-1 text-xs font-semibold"
                  :class="recommendationBadge.bg"
                >
                  {{ report.recommendation || "暂无结论" }}
                </span>
                <span
                  v-for="meta in sessionMeta"
                  :key="meta"
                  class="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500"
                >
                  {{ meta }}
                </span>
                <span
                  v-if="endedLabel"
                  class="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-400"
                >
                  {{ endedLabel }}
                </span>
              </div>
              <h2 class="text-base font-semibold text-slate-800">总评</h2>
              <p class="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                {{ report.summary }}
              </p>
            </div>
          </div>
        </div>

        <!-- 主题评分 + 雷达图 -->
        <div v-if="report.topics?.length" class="report-card p-6 md:p-8">
          <h3 class="mb-5 text-base font-semibold text-slate-800">主题评分</h3>
          <div class="grid grid-cols-1 items-center gap-8 lg:grid-cols-5">
            <div class="lg:col-span-2">
              <TopicRadarChart :topics="radarTopics" />
            </div>
            <div class="space-y-5 lg:col-span-3">
              <div v-for="topic in report.topics" :key="topic.topicKey">
                <div class="mb-1.5 flex items-center justify-between">
                  <span class="text-sm font-medium text-slate-700">{{ topic.title }}</span>
                  <span
                    class="text-sm font-semibold tabular-nums"
                    :style="{ color: scoreColor(topic.score ?? 0) }"
                  >
                    {{ topic.score }}
                  </span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    class="h-full rounded-full transition-all duration-700"
                    :style="{
                      width: `${Math.min(100, Math.max(0, topic.score ?? 0))}%`,
                      backgroundColor: scoreColor(topic.score ?? 0),
                    }"
                  />
                </div>
                <p v-if="topic.comment" class="mt-1.5 text-xs leading-relaxed text-slate-500">
                  {{ topic.comment }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 优势 / 不足 / 建议 -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div v-for="block in summaryBlocks" :key="block.title" class="report-card p-5">
            <p class="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <span
                class="inline-flex h-7 w-7 items-center justify-center rounded-lg"
                :class="block.soft"
              >
                <component :is="block.icon" class="h-4 w-4" />
              </span>
              {{ block.title }}
            </p>
            <ul class="space-y-2.5">
              <li
                v-for="(item, idx) in block.list"
                :key="idx"
                class="flex gap-2 text-xs leading-relaxed text-slate-600"
              >
                <span class="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-slate-300" />
                {{ item }}
              </li>
            </ul>
            <p v-if="!block.list?.length" class="text-xs text-slate-300">暂无内容</p>
          </div>
        </div>

        <!-- 问答回顾 -->
        <div v-if="qaItems.length" class="report-card p-6 md:p-8">
          <h3 class="mb-4 text-base font-semibold text-slate-800">问答回顾</h3>
          <Collapse class="qa-collapse">
            <CollapsePanel v-for="(qa, idx) in qaItems" :key="idx" :show-arrow="false">
              <template #header>
                <span class="flex items-center gap-2.5">
                  <span class="round-badge">{{ qa.question.round }}</span>
                  <span class="text-sm font-medium text-slate-700"
                    >第 {{ qa.question.round }} 轮</span
                  >
                </span>
              </template>
              <template #extra>
                <span
                  v-if="qa.answer"
                  class="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-600"
                >
                  已回答
                </span>
                <span
                  v-else
                  class="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] text-amber-600"
                >
                  未回答
                </span>
              </template>
              <div class="space-y-4 pb-1">
                <div class="flex gap-2.5">
                  <span class="qa-tag qa-tag-q">问</span>
                  <p class="flex-1 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">
                    {{ qa.question.content }}
                  </p>
                </div>
                <div v-if="qa.answer" class="flex gap-2.5">
                  <span class="qa-tag qa-tag-a">答</span>
                  <p class="flex-1 text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                    {{ qa.answer.content }}
                  </p>
                </div>
                <p v-else class="pl-8 text-xs text-slate-400">本题未作答</p>
              </div>
            </CollapsePanel>
          </Collapse>
        </div>

        <div class="flex justify-center gap-3 pb-8">
          <Button class="rounded-full" @click="router.push({ path: '/interview/chat' })">
            再来一场面试
          </Button>
          <Button
            type="primary"
            class="start-btn rounded-full"
            @click="router.push('/user/resumes')"
          >
            返回我的简历
          </Button>
        </div>

        <p class="pb-8 text-center text-xs text-slate-400">
          * 本报告由 AI 自动生成，仅供参考，请结合实际情况理性看待
        </p>
      </div>

      <!-- 无报告兜底 -->
      <div v-else-if="!pageLoading" class="py-24 text-center">
        <div
          class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-300"
        >
          <RobotOutlined class="text-xl" />
        </div>
        <p class="text-sm text-slate-400">该面试尚未生成评价报告</p>
        <Button
          type="primary"
          class="start-btn mt-4 rounded-full"
          @click="router.push({ path: '/interview' })"
        >
          去发起面试
        </Button>
      </div>
    </Spin>
  </div>
</template>

<style scoped>
.report-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 24px -8px rgba(15, 23, 42, 0.06);
}

.start-btn {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
}

.start-btn:not(:disabled):hover {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
}

.round-badge {
  display: inline-flex;
  height: 1.375rem;
  width: 1.375rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
}

.qa-tag {
  display: inline-flex;
  height: 1.375rem;
  width: 1.375rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-size: 11px;
  font-weight: 600;
}

.qa-tag-q {
  background: #eef2ff;
  color: #4f46e5;
}

.qa-tag-a {
  background: #f1f5f9;
  color: #64748b;
}
</style>
