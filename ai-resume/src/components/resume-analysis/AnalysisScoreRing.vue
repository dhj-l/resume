<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getScoreColor, getScoreLevel } from "./types";

interface Props {
  score: number;
  max?: number;
  label?: string;
  description?: string;
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
  label: "",
  description: "",
});

const animated = ref(false);

const percentage = computed(() => Math.min(props.score / props.max, 1));
const strokeColor = computed(() => getScoreColor(props.score));
const displayLabel = computed(() => props.label || getScoreLevel(props.score));

const size = 140;
const strokeWidth = 10;
const radius = (size - strokeWidth) / 2;
const circumference = 2 * Math.PI * radius;

onMounted(() => {
  requestAnimationFrame(() => {
    animated.value = true;
  });
});
</script>

<template>
  <div class="flex items-center gap-5">
    <div class="relative shrink-0" :style="{ width: size + 'px', height: size + 'px' }">
      <svg class="w-full h-full -rotate-90" :viewBox="`0 0 ${size} ${size}`">
        <circle
          :cx="size / 2"
          :cy="size / 2"
          :r="radius"
          fill="none"
          stroke="#e5e7eb"
          :stroke-width="strokeWidth"
        />
        <circle
          :cx="size / 2"
          :cy="size / 2"
          :r="radius"
          fill="none"
          :stroke="strokeColor"
          :stroke-width="strokeWidth"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="animated ? circumference * (1 - percentage) : circumference"
          class="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-[32px] font-bold text-neutral-700 leading-none">{{ score }}</span>
        <span class="text-xs text-neutral-400 mt-0.5">/ {{ max }}</span>
      </div>
    </div>
    <div class="min-w-0">
      <div class="text-lg font-semibold" :style="{ color: strokeColor }">
        <span class="hidden md:inline">整体竞争</span>{{ displayLabel }}
      </div>
      <div v-if="description" class="text-sm text-neutral-400 mt-1">{{ description }}</div>
    </div>
  </div>
</template>
