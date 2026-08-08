<template>
  <div
    class="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-100/60"
    @click="$emit('click', template._id)"
  >
    <!-- Template preview image -->
    <div class="relative aspect-[210/297] overflow-hidden bg-slate-50 p-3">
      <img
        v-if="template.previewImage"
        :src="getFullImageUrl(template.previewImage)"
        :alt="template.name"
        class="h-full w-full rounded-md object-contain shadow-sm transition-transform duration-300 group-hover:scale-[1.02]"
      />
      <div v-else class="flex h-full w-full items-center justify-center rounded-md bg-slate-100">
        <FileText class="h-10 w-10 text-slate-300" />
      </div>

      <!-- Hover overlay -->
      <div
        class="absolute inset-0 flex items-center justify-center bg-slate-900/45 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100"
      >
        <button
          class="translate-y-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg transition-all duration-300 hover:bg-primary-600 hover:text-white group-hover:translate-y-0"
          @click.stop="$emit('click', template._id)"
        >
          使用此模板
        </button>
      </div>
    </div>

    <!-- Info area -->
    <div class="flex flex-1 flex-col gap-3 p-5">
      <h3
        class="truncate text-[15px] font-semibold leading-snug text-slate-900"
        :title="template.name"
      >
        {{ template.name }}
      </h3>

      <div class="flex items-center gap-1.5 text-[13px] text-slate-500">
        <Tags class="h-3.5 w-3.5" />
        <span class="truncate">{{ template.category }}</span>
      </div>

      <div
        class="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-[13px] text-slate-500"
      >
        <span class="inline-flex items-center gap-1.5" title="使用人数">
          <Users class="h-3.5 w-3.5" />
          {{ formatNumber(template.usedCount) }}
        </span>
        <span class="inline-flex items-center gap-1.5" title="创建时间">
          <CalendarDays class="h-3.5 w-3.5" />
          {{ formatDate(template.createdAt) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarDays, FileText, Tags, Users } from "lucide-vue-next";

import type { Template } from "@/api/templates/type";
import { formatDate } from "@/utils/day";
import { getFullImageUrl } from "@/utils/image";

defineProps<{
  template: Template;
}>();

defineEmits<{
  (e: "click", id: string): void;
}>();

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("zh-CN").format(num);
};
</script>
