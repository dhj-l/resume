<template>
  <section class="py-24 bg-white">
    <div class="container mx-auto px-4">
      <!-- Section header -->
      <div class="mx-auto mb-16 max-w-2xl text-center">
        <span
          class="inline-flex items-center gap-1.5 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-semibold tracking-wide text-primary-600"
        >
          <Sparkles class="h-3.5 w-3.5" />
          核心功能
        </span>
        <h2 class="mt-5 text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
          把写简历这件事，变简单
        </h2>
        <p class="mt-4 text-base text-slate-600 lg:text-lg">
          六个实用功能，覆盖从创建到投递的每一步。
        </p>
      </div>

      <!-- Feature cards -->
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="flex flex-col gap-8 rounded-2xl border border-slate-200 bg-white p-8 lg:flex-row lg:items-center"
          :class="feature.wide ? 'lg:col-span-2' : ''"
        >
          <div class="flex-1">
            <div class="flex items-start justify-between gap-4">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl"
                :class="
                  feature.type === 'free'
                    ? 'bg-primary-50 text-primary-600'
                    : 'bg-purple-50 text-ai'
                "
              >
                <component :is="feature.icon" class="h-6 w-6" />
              </div>
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                :class="
                  feature.type === 'free' ? 'bg-green-50 text-success' : 'bg-purple-50 text-ai'
                "
              >
                <span
                  class="h-1.5 w-1.5 rounded-full"
                  :class="feature.type === 'free' ? 'bg-success' : 'bg-ai'"
                />
                {{ feature.type === "free" ? "免费" : "AI 驱动" }}
              </span>
            </div>

            <h3 class="mt-6 text-lg font-bold tracking-tight text-slate-900">
              {{ feature.title }}
            </h3>
            <p class="mt-2 text-[15px] leading-relaxed text-slate-600">
              {{ feature.description }}
            </p>
          </div>

          <!-- Mini visual: template stack -->
          <div v-if="feature.visual === 'stack'" class="hidden w-44 flex-shrink-0 lg:block">
            <div class="relative h-36 w-44">
              <div
                class="absolute inset-0 -rotate-6 rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <div class="mb-2 h-2 w-10 rounded-full bg-slate-300"></div>
                <div class="space-y-1.5">
                  <div class="h-1.5 w-full rounded-full bg-slate-200"></div>
                  <div class="h-1.5 w-3/4 rounded-full bg-slate-200"></div>
                </div>
              </div>
              <div
                class="absolute inset-0 rotate-3 rounded-lg border border-slate-200 bg-white p-3"
              >
                <div class="mb-2 h-2 w-12 rounded-full bg-primary-200"></div>
                <div class="space-y-1.5">
                  <div class="h-1.5 w-full rounded-full bg-slate-100"></div>
                  <div class="h-1.5 w-5/6 rounded-full bg-slate-100"></div>
                </div>
              </div>
              <div
                class="absolute inset-0 rounded-lg border border-primary-200 bg-white p-3 shadow-md shadow-primary-100"
              >
                <div class="mb-2 flex items-center gap-1.5">
                  <div class="h-5 w-5 rounded-md bg-primary-500"></div>
                  <div class="h-2 w-14 rounded-full bg-slate-200"></div>
                </div>
                <div class="space-y-1.5">
                  <div class="h-1.5 w-full rounded-full bg-slate-100"></div>
                  <div class="h-1.5 w-full rounded-full bg-slate-100"></div>
                  <div class="h-1.5 w-2/3 rounded-full bg-slate-100"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mini visual: JD match -->
          <div v-else-if="feature.visual === 'match'" class="hidden w-60 flex-shrink-0 lg:block">
            <div class="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-700">JD 匹配度</span>
                <span class="text-sm font-bold text-primary-600">92%</span>
              </div>
              <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div class="h-full w-[92%] rounded-full bg-primary-500"></div>
              </div>
              <div class="mt-4 flex flex-wrap gap-1.5">
                <span
                  class="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200"
                >
                  <Check class="h-3 w-3 text-success" />
                  Vue.js
                </span>
                <span
                  class="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200"
                >
                  <Check class="h-3 w-3 text-success" />
                  项目经历
                </span>
                <span
                  class="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200"
                >
                  <Check class="h-3 w-3 text-success" />
                  沟通表达
                </span>
                <span
                  class="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-400 ring-1 ring-slate-200"
                >
                  <X class="h-3 w-3" />
                  英语六级
                </span>
              </div>
            </div>
          </div>

          <!-- Mini visual: resume import -->
          <div v-else-if="feature.visual === 'import'" class="hidden w-60 flex-shrink-0 lg:block">
            <div class="space-y-2.5">
              <div
                class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600"
                >
                  <FileText class="h-5 w-5" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-xs font-semibold text-slate-800">个人简历.pdf</p>
                  <p class="text-[11px] text-slate-500">已解析 · 可直接编辑</p>
                </div>
                <CircleCheck class="h-4 w-4 flex-shrink-0 text-success" />
              </div>
              <div
                class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-ai"
                >
                  <FileDown class="h-5 w-5" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-xs font-semibold text-slate-800">实习经历.docx</p>
                  <p class="text-[11px] text-slate-500">已导入 · 排版已还原</p>
                </div>
                <CircleCheck class="h-4 w-4 flex-shrink-0 text-success" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Component } from "vue";

import {
  Check,
  CircleCheck,
  Eye,
  FileDown,
  FileText,
  LayoutTemplate,
  ScanSearch,
  Sparkles,
  X,
} from "lucide-vue-next";

type FeatureType = "free" | "ai";

interface Feature {
  title: string;
  description: string;
  icon: Component;
  type: FeatureType;
  wide?: boolean;
  visual?: "stack" | "match" | "import";
}

const features: Feature[] = [
  {
    title: "免费模板库",
    description: "覆盖互联网、金融、教育等主流行业，挑一个喜欢的模板，一键套用，全程免费。",
    icon: LayoutTemplate,
    type: "free",
    wide: true,
    visual: "stack",
  },
  {
    title: "PDF 导出",
    description: "一键导出高清 PDF，排版分毫不差，线上投递和打印都放心。",
    icon: FileDown,
    type: "free",
  },
  {
    title: "AI 简历生成",
    description: "填好基本信息，AI 帮你把项目经历和技能描述写具体、写专业。",
    icon: Sparkles,
    type: "ai",
  },
  {
    title: "JD 智能匹配",
    description: "粘贴目标岗位 JD，AI 逐条比对关键词，告诉你简历还差在哪里。",
    icon: ScanSearch,
    type: "ai",
    wide: true,
    visual: "match",
  },
  {
    title: "简历解析导入",
    description: "导入已有的 PDF / Word 简历，自动解析成可编辑内容，无缝接着写。",
    icon: FileText,
    type: "ai",
    wide: true,
    visual: "import",
  },
  {
    title: "实时预览编辑",
    description: "左边编辑右边预览，改完立刻看到最终效果，所见即所得。",
    icon: Eye,
    type: "free",
  },
];
</script>
