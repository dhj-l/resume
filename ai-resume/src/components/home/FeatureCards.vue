<template>
  <section class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <h2 class="text-3xl font-bold text-slate-900 mb-4">
          助你斩获理想工作的全套工具
        </h2>
        <p class="text-slate-600">
          我们的 AI 平台为你提供竞争优势，助你通过 ATS 筛选，打动招聘人员。
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-50 transition-all duration-300 group"
        >
          <div
            class="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm"
          >
            <component :is="feature.icon" class="w-6 h-6 text-primary-600" />
          </div>
          <h3 class="text-xl font-semibold text-slate-900 mb-3">
            {{ feature.title }}
          </h3>
          <p class="text-slate-600 leading-relaxed">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  PenTool,
  Layout,
  FileCheck,
  Zap,
  Download,
  Sparkles,
} from "lucide-vue-next";

const features = [
  {
    icon: PenTool,
    title: "AI 写作助手",
    description:
      "生成为你职位量身定制的专业经历描述。我们的 AI 分析职位描述，建议最具影响力的关键词。",
  },
  {
    icon: Layout,
    title: "智能排版",
    description:
      "再也不用担心页边距或字体问题。我们的自动排版引擎确保你的简历在任何设备上都完美呈现。",
  },
  {
    icon: FileCheck,
    title: "ATS 优化",
    description:
      "轻松通过申请人跟踪系统。我们根据行业标准检查你的简历，确保它能被真人看到。",
  },
  {
    icon: Zap,
    title: "实时建议",
    description:
      "在你输入时即时获得简历内容反馈。实时提升清晰度、影响力和语法准确性。",
  },
  {
    icon: Download,
    title: "多格式导出",
    description:
      "下载 PDF、Word 或纯文本格式的简历。在所有平台上保持格式一致。",
  },
  {
    icon: Sparkles,
    title: "求职信生成器",
    description:
      "几秒钟内生成匹配的求职信。我们的 AI 将你的经历与公司使命和职位要求完美结合。",
  },
];
</script>
