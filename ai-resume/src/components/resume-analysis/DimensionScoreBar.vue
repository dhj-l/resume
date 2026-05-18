<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

interface Props {
  name: string;
  score: number;
  max: number;
  weight?: number;
  color: string;
}

const props = defineProps<Props>();

const animated = ref(false);
const percentage = computed(() => (props.score / props.max) * 100);

onMounted(() => {
  requestAnimationFrame(() => {
    animated.value = true;
  });
});
</script>

<template>
  <div>
    <!-- Mobile Layout -->
    <div class="md:hidden space-y-1.5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: color }" />
          <span class="text-sm font-medium text-neutral-600">{{ name }}</span>
        </div>
        <span class="text-sm text-neutral-500 tabular-nums">{{ score }}/{{ max }}</span>
      </div>
      <div class="h-2 bg-neutral-100 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-[width] duration-800 ease-out"
          :style="{
            width: animated ? percentage + '%' : '0%',
            backgroundColor: color,
          }"
        />
      </div>
    </div>

    <!-- Desktop Layout -->
    <div
      class="hidden md:grid grid-cols-[1.2fr_1.5fr_1fr] items-center gap-4 py-3 border-b border-neutral-50 last:border-0"
    >
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: color }" />
        <span class="text-sm font-medium text-neutral-700">{{ name }}</span>
      </div>
      <div class="flex flex-col">
        <div class="text-sm font-bold text-neutral-800 text-center mb-1">
          {{ score }}<span class="text-xs text-neutral-400 font-normal">/{{ max }}</span>
        </div>
        <div class="h-1 bg-neutral-100 rounded-full overflow-hidden mx-auto w-full max-w-[120px]">
          <div
            class="h-full rounded-full transition-[width] duration-800 ease-out"
            :style="{
              width: animated ? percentage + '%' : '0%',
              backgroundColor: color,
            }"
          />
        </div>
      </div>
      <div class="text-sm text-neutral-500 text-right">{{ weight ? weight + "%" : "--" }}</div>
    </div>
  </div>
</template>
