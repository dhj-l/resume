<template>
  <section class="relative overflow-hidden bg-slate-50 pt-16 pb-32 space-y-24">
    <div class="container mx-auto px-4 relative z-10">
      <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <!-- Text Content -->
        <div class="flex-1 text-center lg:text-left space-y-8">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium"
          >
            <Sparkles class="w-4 h-4" />
            <span>AI 驱动的简历生成器</span>
          </div>

          <h1
            class="text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight"
          >
            几分钟内构建你的<br />
            <span class="text-primary-600">
              <TypewriterEffect
                :words="[
                  '软件工程师',
                  '产品经理',
                  '数据科学家',
                  'UI/UX 设计师',
                ]"
                :typing-speed="150"
                :pause-time="2000"
              />
            </span>
            <br />专业简历。
          </h1>

          <p class="text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0">
            与我们的 AI 助手对话，制作一份专业、ATS
            友好的简历，突出你的独特经历。告别写作障碍。
          </p>

          <div
            class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <router-link
              to="/auth/register"
              class="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
            >
              免费试用
              <ArrowRight class="w-5 h-5 ml-2" />
            </router-link>
            <button
              class="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              查看示例
            </button>
          </div>

          <div
            class="flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 pt-4"
          >
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-green-500" />
              <span>ATS 友好</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-green-500" />
              <span>GPT-4 驱动</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-green-500" />
              <span>PDF 导出</span>
            </div>
          </div>
        </div>

        <!-- Conversational UI Demo -->
        <div class="flex-1 w-full max-w-md lg:max-w-full perspective-1000">
          <div
            class="relative bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 transform rotate-y-[-5deg] hover:rotate-y-0 transition-transform duration-500 ease-out"
          >
            <!-- Chat Header -->
            <div
              class="flex items-center justify-between border-b border-slate-100 pb-4 mb-4"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center"
                >
                  <Bot class="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 class="font-semibold text-slate-900">简历 AI 助手</h3>
                  <p class="text-xs text-green-500 flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-green-500"></span>
                    在线
                  </p>
                </div>
              </div>
              <MoreHorizontal class="w-5 h-5 text-slate-400" />
            </div>

            <!-- Chat Messages -->
            <div class="space-y-4 h-[300px] overflow-y-auto px-2 relative">
              <!-- AI Message -->
              <div class="flex gap-3">
                <div
                  class="w-8 h-8 rounded-full bg-primary-50 flex-shrink-0 flex items-center justify-center mt-1"
                >
                  <Bot class="w-5 h-5 text-primary-600" />
                </div>
                <div
                  class="bg-slate-100 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-slate-700 max-w-[85%]"
                >
                  你好！我可以帮你制作简历。首先，你在上一家公司的职位是什么？
                </div>
              </div>

              <!-- User Message -->
              <div
                class="flex gap-3 flex-row-reverse animate-fade-in delay-700"
                style="animation-fill-mode: backwards; animation-delay: 1s"
              >
                <div
                  class="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center mt-1"
                >
                  <User class="w-5 h-5 text-slate-600" />
                </div>
                <div
                  class="bg-primary-600 rounded-2xl rounded-tr-none px-4 py-3 text-sm text-white max-w-[85%]"
                >
                  我是 TechCorp 的高级前端开发工程师。
                </div>
              </div>

              <!-- AI Message (Typing/Response) -->
              <div
                class="flex gap-3 animate-fade-in"
                style="animation-fill-mode: backwards; animation-delay: 2.5s"
              >
                <div
                  class="w-8 h-8 rounded-full bg-primary-50 flex-shrink-0 flex items-center justify-center mt-1"
                >
                  <Bot class="w-5 h-5 text-primary-600" />
                </div>
                <div
                  class="bg-slate-100 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-slate-700 max-w-[85%]"
                >
                  <p class="mb-2">太棒了！这是为你生成的经历描述：</p>
                  <div
                    class="bg-white rounded p-2 border border-slate-200 text-xs text-slate-600"
                  >
                    • 负责基于 Vue 3 和 TypeScript
                    的前端架构设计，将页面加载性能提升了 40%。
                  </div>
                  <div class="mt-2 flex gap-2">
                    <button
                      class="text-xs bg-white border border-slate-200 px-2 py-1 rounded hover:bg-slate-50"
                    >
                      更简练一点
                    </button>
                    <button
                      class="text-xs bg-white border border-slate-200 px-2 py-1 rounded hover:bg-slate-50"
                    >
                      添加数据指标
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Input Area -->
            <div class="mt-4 pt-4 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder="输入你的回答..."
                class="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled
              />
              <button
                class="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Send class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Decorative Elements -->
          <div
            class="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary-200/50 to-blue-200/50 blur-3xl rounded-full opacity-60"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Bot,
  MoreHorizontal,
  User,
  Send,
} from "lucide-vue-next";
import TypewriterEffect from "../common/TypewriterEffect.vue";
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
</style>
