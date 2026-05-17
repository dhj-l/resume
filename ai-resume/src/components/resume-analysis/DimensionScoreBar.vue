<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

interface Props {
  name: string;
  score: number;
  max: number;
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
  <div class="space-y-1.5">
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
</template>
