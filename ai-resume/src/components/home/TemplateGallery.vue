<template>
  <section class="py-24 bg-slate-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between mb-12">
        <h2 class="text-3xl font-bold text-slate-900">专业简历模板</h2>
        <router-link
          to="/templates"
          class="text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1 group"
        >
          查看全部
          <ArrowRight
            class="w-4 h-4 transition-transform group-hover:translate-x-1"
          />
        </router-link>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(template, index) in templates"
          :key="index"
          class="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
        >
          <!-- Preview Image Area -->
          <div class="relative aspect-[3/4] bg-slate-100 overflow-hidden">
            <!-- Placeholder for Template Image -->
            <div
              class="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-500"
            >
              <div class="text-center p-8 w-full">
                <div
                  class="w-16 h-16 bg-slate-300 rounded-full mx-auto mb-4"
                ></div>
                <div class="h-4 w-32 bg-slate-300 mx-auto mb-2"></div>
                <div class="h-4 w-24 bg-slate-300 mx-auto"></div>
                <div class="mt-8 space-y-2">
                  <div class="h-2 w-full bg-slate-300"></div>
                  <div class="h-2 w-full bg-slate-300"></div>
                  <div class="h-2 w-2/3 bg-slate-300"></div>
                </div>
              </div>
            </div>

            <!-- Overlay -->
            <div
              class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center backdrop-blur-[2px]"
            >
              <p
                class="text-white mb-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
              >
                {{ template.description }}
              </p>
              <button
                class="bg-primary-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100 shadow-lg cursor-pointer"
              >
                使用此模板
              </button>
            </div>
          </div>

          <!-- Info -->
          <div class="p-4 border-t border-slate-100">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-slate-900">{{ template.name }}</h3>
              <div class="flex items-center gap-1 text-xs text-slate-500">
                <FireOutlined class="text-orange-500" />
                <span>{{ template.usageCount }}</span>
              </div>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in template.tags"
                :key="tag"
                class="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight } from "lucide-vue-next";
import { FireOutlined } from "@ant-design/icons-vue";

const templates = [
  {
    name: "极简主义",
    tags: ["通用", "设计岗", "产品"],
    usageCount: "12k+",
    description: "清晰简洁的布局，突出核心内容，适合设计和创意类岗位。",
  },
  {
    name: "技术专家",
    tags: ["程序员", "后端", "全栈"],
    usageCount: "8.5k+",
    description: "专为技术人员设计，强调技能栈和项目经验展示。",
  },
  {
    name: "商务精英",
    tags: ["销售", "市场", "管理"],
    usageCount: "15k+",
    description: "稳重大气的风格，适合商务、管理和传统行业岗位。",
  },
  {
    name: "学术研究",
    tags: ["博士", "教师", "科研"],
    usageCount: "5k+",
    description: "注重学术成果和发表论文的展示，适合科研教育领域。",
  },
  {
    name: "应届毕业生",
    tags: ["实习", "管培生", "校招"],
    usageCount: "20k+",
    description: "针对经验较少的同学，突出教育背景和在校实践经历。",
  },
  {
    name: "创意设计",
    tags: ["UI/UX", "插画", "艺术"],
    usageCount: "9k+",
    description: "独特的排版和配色，展现你的审美和设计能力。",
  },
];
</script>
