<template>
  <section class="py-24 bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16 space-y-4">
        <h2 class="text-3xl lg:text-4xl font-bold text-slate-900">
          全方位功能支持
        </h2>
        <p class="text-slate-500 text-lg">
          从创建到投递，我们为你提供完整的求职工具箱
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="group relative bg-white rounded-2xl p-8 border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300 cursor-pointer"
        >
          <!-- Badge -->
          <div class="absolute top-6 right-6">
            <span
              v-if="feature.type === 'free'"
              class="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-success"
            >
              免费
            </span>
            <span
              v-else
              class="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-ai"
            >
              AI 驱动
            </span>
          </div>

          <!-- Icon -->
          <div
            class="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-primary-50 transition-colors"
          >
            <component
              :is="feature.icon"
              class="w-7 h-7 text-slate-600 group-hover:text-primary-600 transition-colors"
            />
          </div>

          <h3 class="text-xl font-bold text-slate-900 mb-3">
            {{ feature.title }}
          </h3>
          <p class="text-slate-500 leading-relaxed">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  LayoutTemplate,
  FileDown,
  Sparkles,
  ScanSearch,
  FileText,
  Eye,
} from "lucide-vue-next";

const features = [
  {
    title: "免费模板库",
    description:
      "海量专业简历模板任你选择，涵盖各个行业，一键套用，永久免费。",
    icon: LayoutTemplate,
    type: "free",
  },
  {
    title: "PDF 导出",
    description:
      "支持高清 PDF 格式导出，完美保留排版样式，ATS 友好，打印无忧。",
    icon: FileDown,
    type: "free",
  },
  {
    title: "AI 简历生成",
    description:
      "只需输入基本信息，AI 助手自动为你生成专业、有吸引力的简历内容。",
    icon: Sparkles,
    type: "ai",
  },
  {
    title: "JD 智能匹配",
    description:
      "粘贴职位描述，AI 自动分析匹配度，并提供针对性的简历优化建议。",
    icon: ScanSearch,
    type: "ai",
  },
  {
    title: "简历解析导入",
    description: "支持导入现有简历（PDF/Word），智能解析内容，快速开始编辑。",
    icon: FileText,
    type: "ai",
  },
  {
    title: "实时预览编辑",
    description: "所见即所得的编辑体验，左右分栏实时预览，排版调整轻松搞定。",
    icon: Eye,
    type: "free",
  },
];
</script>
