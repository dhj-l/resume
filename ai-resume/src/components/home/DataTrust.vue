<template>
  <section class="py-24 bg-white border-t border-slate-100">
    <div class="container mx-auto px-4">
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100"
      >
        <div class="p-4">
          <div class="text-4xl lg:text-5xl font-bold text-primary-600 mb-2">
            10,000+
          </div>
          <div
            class="flex items-center justify-center gap-2 text-slate-500 font-medium"
          >
            <Users class="w-5 h-5" />
            用户信任
          </div>
        </div>
        <div class="p-4">
          <div class="text-4xl lg:text-5xl font-bold text-primary-600 mb-2">
            5,000+
          </div>
          <div
            class="flex items-center justify-center gap-2 text-slate-500 font-medium"
          >
            <TrendingUp class="w-5 h-5" />
            成功案例
          </div>
        </div>
        <div class="p-4">
          <div class="text-4xl lg:text-5xl font-bold text-primary-600 mb-2">
            50+
          </div>
          <div
            class="flex items-center justify-center gap-2 text-slate-500 font-medium"
          >
            <Palette class="w-5 h-5" />
            专业模板
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Users, TrendingUp, Palette } from "lucide-vue-next";
</script>
