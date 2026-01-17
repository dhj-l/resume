<template>
  <div class="min-h-screen bg-white">
    <HeroSection />
    <IntegrationLogos />
    <FeatureCards />

    <!-- CTA Section -->
    <section class="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-primary-900/20"></div>
      <div
        class="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
      ></div>

      <div class="container mx-auto px-4 relative z-10 text-center">
        <h2 class="text-4xl font-bold mb-6">准备好开启你的职业生涯了吗？</h2>
        <p class="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          加入成千上万的求职者，使用我们的 AI
          简历生成器成功获得顶尖公司的面试机会。
        </p>
        <router-link
          to="/auth/register"
          class="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-primary-600 bg-white rounded-xl hover:bg-slate-50 transition-colors shadow-lg shadow-white/10"
        >
          立即制作我的简历
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import HeroSection from "@/components/home/HeroSection.vue";
import FeatureCards from "@/components/home/FeatureCards.vue";
import IntegrationLogos from "@/components/home/IntegrationLogos.vue";
</script>
