<template>
  <section class="relative overflow-hidden bg-[#f5f5f7] pt-20 pb-32 lg:pt-32 lg:pb-40">
    <!-- Background Decor -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"
      ></div>
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <!-- Left: Content -->
        <div class="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
          <h1 class="text-4xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15]">
            专注于大学生的<br />
            <span class="text-primary-600">专业简历平台</span>
          </h1>

          <p class="text-lg text-slate-600 leading-relaxed">
            制作简历和导出完全免费，AI功能让创建更智能。<br class="hidden lg:block" />
            助你轻松获得心仪Offer。
          </p>

          <!-- Selling Points -->
          <div class="space-y-4 pt-2">
            <div
              v-for="(point, index) in sellingPoints"
              :key="index"
              class="flex items-center justify-center lg:justify-start gap-3"
            >
              <div
                class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"
              >
                <Check class="w-4 h-4 text-success" />
              </div>
              <span class="text-slate-700 font-medium">{{ point }}</span>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <button
              class="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 hover:-translate-y-1 cursor-pointer"
              @click="router.push('/dashboard/templates')"
            >
              免费开始制作
            </button>
            <button
              class="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors hover:border-slate-300 cursor-pointer"
            >
              查看AI功能演示
            </button>
          </div>
        </div>

        <!-- Right: Visual -->
        <div class="flex-1 w-full relative perspective-1000">
          <!-- Editor UI Simulator -->
          <div
            class="relative bg-white rounded-xl shadow-2xl border border-slate-200/60 p-2 transform rotate-y-[-6deg] hover:rotate-y-0 transition-transform duration-700 ease-out origin-left"
          >
            <!-- Browser Header -->
            <div
              class="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2 rounded-t-lg"
            >
              <div class="flex gap-1.5">
                <div class="w-3 h-3 rounded-full bg-red-400"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div class="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div
                class="ml-4 bg-white px-3 py-1 rounded-md text-xs text-slate-400 border border-slate-100 flex-1 text-center font-mono"
              >
                ai-resume.com/editor
              </div>
            </div>
            <!-- Editor Content -->
            <div class="grid grid-cols-12 h-[400px] bg-slate-50">
              <!-- Sidebar -->
              <div class="col-span-3 bg-white border-r border-slate-100 p-4 space-y-4">
                <div class="h-8 w-16 bg-slate-100 rounded mb-6"></div>
                <div class="space-y-3">
                  <div class="h-2 w-full bg-slate-100 rounded"></div>
                  <div class="h-2 w-3/4 bg-slate-100 rounded"></div>
                  <div class="h-2 w-5/6 bg-slate-100 rounded"></div>
                </div>
              </div>
              <!-- Preview -->
              <div class="col-span-9 p-6 flex justify-center bg-slate-50/50 overflow-hidden">
                <div
                  class="w-full h-full bg-white shadow-sm border border-slate-200 rounded px-8 py-8 space-y-6"
                >
                  <!-- Resume Header -->
                  <div class="border-b border-slate-100 pb-6">
                    <div class="h-8 w-48 bg-slate-800 rounded mb-2"></div>
                    <div class="h-4 w-64 bg-slate-200 rounded"></div>
                  </div>
                  <!-- Content Blocks -->
                  <div class="space-y-4">
                    <div class="h-4 w-32 bg-slate-200 rounded"></div>
                    <div class="space-y-2">
                      <div class="h-2 w-full bg-slate-100 rounded"></div>
                      <div class="h-2 w-full bg-slate-100 rounded"></div>
                      <div class="h-2 w-2/3 bg-slate-100 rounded"></div>
                    </div>
                    <div class="h-4 w-24 bg-slate-200 rounded mt-6"></div>
                    <div class="space-y-2">
                      <div class="h-2 w-full bg-slate-100 rounded"></div>
                      <div class="h-2 w-3/4 bg-slate-100 rounded"></div>
                    </div>
                  </div>
                  <!-- AI Suggestion Popover (Floating) -->
                  <div
                    class="absolute top-1/3 right-8 bg-white p-4 rounded-xl shadow-xl border border-primary-100 w-56 animate-pulse-slow"
                  >
                    <div class="flex items-center gap-2 mb-2">
                      <Sparkles class="w-4 h-4 text-ai" />
                      <span class="text-xs font-bold text-ai">AI 优化建议</span>
                    </div>
                    <p class="text-xs text-slate-600">
                      建议使用"负责"、"主导"等强动词开头，突出你的领导能力。
                    </p>
                    <div class="mt-3 flex gap-2">
                      <button
                        class="text-xs bg-ai text-white px-3 py-1.5 rounded-md hover:bg-purple-700 transition-colors"
                      >
                        一键优化
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Check, Sparkles } from "lucide-vue-next";
import { useRouter } from "vue-router";

const router = useRouter();

const sellingPoints = ["100%免费制作与导出", "AI智能优化与匹配", "海量专业模板"];
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
</style>
