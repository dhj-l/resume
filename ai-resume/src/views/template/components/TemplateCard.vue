<template>
  <div
    class="group relative bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border border-[#f0f0f0] flex flex-col h-full"
    @click="$emit('click', template.id)"
  >
    <!-- Template Preview Image (70%) -->
    <div class="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
      <!-- Placeholder or Image -->
      <img
        v-if="template.previewImage"
        :src="template.previewImage"
        :alt="template.name"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div
        v-else
        class="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-300"
      >
        <span class="text-4xl">📄</span>
      </div>

      <!-- Overlay -->
      <div
        class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]"
      >
        <button
          class="bg-[#1677ff] text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-600 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
          @click.stop="$emit('click', template.id)"
        >
          使用此模板
        </button>
      </div>
    </div>

    <!-- Info Area (30%) -->
    <div class="p-6 bg-white flex flex-col flex-1 justify-between gap-4">
      <h3
        class="text-[16px] font-[600] text-[#1a1a1a] leading-tight truncate"
        :title="template.name"
      >
        {{ template.name }}
      </h3>

      <div class="flex flex-col gap-2.5">
        <!-- Category -->
        <div class="flex items-center gap-2 text-[#8c8c8c] text-[14px]">
          <TagOutlined />
          <span class="truncate">{{ template.category }}</span>
        </div>

        <!-- Stats row -->
        <div class="flex items-center justify-between text-[#8c8c8c] text-[14px]">
          <div class="flex items-center gap-2" title="使用人数">
            <TeamOutlined />
            <span>{{ formatNumber(template.usedCount) }}人使用</span>
          </div>
          <div class="flex items-center gap-2" title="创建时间">
            <CalendarOutlined />
            <span>{{ template.createdAt }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TagOutlined, TeamOutlined, CalendarOutlined } from "@ant-design/icons-vue";
import type { ResumeTemplate } from "../types";

defineProps<{
  template: ResumeTemplate;
}>();

defineEmits<{
  (e: "click", id: string): void;
}>();

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("zh-CN").format(num);
};
</script>

<style scoped>
/* Ensure aspect ratio works nicely */
</style>
