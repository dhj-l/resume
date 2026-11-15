<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="loading"
        class="fsl-overlay fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-black/60 backdrop-blur-sm select-none"
        role="status"
        aria-live="polite"
        @contextmenu.prevent
        @touchmove.prevent
      >
        <!-- 背景动态光斑 -->
        <div class="fsl-orb fsl-orb-1" aria-hidden="true"></div>
        <div class="fsl-orb fsl-orb-2" aria-hidden="true"></div>
        <div class="fsl-orb fsl-orb-3" aria-hidden="true"></div>

        <div
          class="relative z-10 bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center max-w-md w-full mx-4"
        >
          <!-- Lottie 动画 + 呼吸光晕 -->
          <div class="fsl-lottie-wrap relative">
            <div class="fsl-halo" aria-hidden="true"></div>
            <Vue3Lottie
              :animation-link="animationLink"
              :loop="true"
              autoplay
              :width="120"
              :height="120"
              class="relative shrink-0"
            />
          </div>

          <!-- Loading Text -->
          <h3
            class="mt-6 text-gray-800 text-lg font-medium tracking-wide text-center leading-relaxed"
          >
            <template v-if="progress">
              正在生成：{{ progress.label }}（{{ progress.current }}/{{ progress.total }}）
            </template>
            <template v-else>{{ text }}</template>
          </h3>

          <!-- 轮播提示语 -->
          <Transition
            v-if="tips.length > 0"
            mode="out-in"
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <p :key="tipText" class="mt-1 h-5 text-sm text-center text-primary-500">
              {{ tipText }}
            </p>
          </Transition>

          <!-- Progress Bar -->
          <a-progress
            v-if="progress"
            :percent="progressPercent"
            status="active"
            class="mt-4 w-full"
            :show-info="false"
          />

          <!-- Subtext -->
          <p class="mt-2 text-gray-400 text-xs font-light text-center">请勿关闭页面或刷新</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onUnmounted } from "vue";

import { Vue3Lottie } from "vue3-lottie";

import { useRotatingText } from "@/utils/useRotatingText";

interface ProgressInfo {
  current: number;
  total: number;
  label: string;
}

interface Props {
  loading: boolean;
  text?: string;
  timeout?: number; // milliseconds
  progress?: ProgressInfo | null;
  /** Lottie 动画资源链接 */
  animationLink?: string;
  /** 轮播提示语；不传则不显示轮播区 */
  tips?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  text: "AI正在为您生成简历，过程可能需要1到2分钟，请稍等。",
  timeout: 180000, // 180 seconds default
  progress: null,
  animationLink: "/lottie/ai-generating.json",
  tips: () => [],
});

const emit = defineEmits<{
  (e: "update:loading", value: boolean): void;
  (e: "timeout"): void;
}>();

const progressPercent = computed(() => {
  if (!props.progress || !props.progress.total) return 0;
  return Math.round((props.progress.current / props.progress.total) * 100);
});

const tipText = useRotatingText(props.tips, 2400);

let timer: number | null = null;

// Prevent keyboard interactions
const preventKeys = (e: KeyboardEvent) => {
  // Block F5, Ctrl+R, Esc
  if (e.key === "F5" || (e.ctrlKey && e.key === "r") || e.key === "Escape") {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
};

// Prevent page unload
const preventUnload = (e: BeforeUnloadEvent) => {
  e.preventDefault();
  e.returnValue = "";
  return "";
};

watch(
  () => props.loading,
  (newVal) => {
    if (newVal) {
      // Add listeners
      window.addEventListener("keydown", preventKeys, { capture: true });
      window.addEventListener("beforeunload", preventUnload);

      // Set safety timeout
      if (timer) clearTimeout(timer);
      timer = window.setTimeout(() => {
        emit("update:loading", false);
        emit("timeout");
      }, props.timeout);

      // Lock body scroll
      document.body.style.overflow = "hidden";
    } else {
      // Remove listeners
      window.removeEventListener("keydown", preventKeys, { capture: true });
      window.removeEventListener("beforeunload", preventUnload);

      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      // Restore body scroll
      document.body.style.overflow = "";
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  window.removeEventListener("keydown", preventKeys, { capture: true });
  window.removeEventListener("beforeunload", preventUnload);
  if (timer) clearTimeout(timer);
  document.body.style.overflow = "";
});
</script>

<style scoped>
.fsl-overlay {
  overflow: hidden;
}

.fsl-orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(70px);
  opacity: 0.45;
  pointer-events: none;
  will-change: transform;
}
.fsl-orb-1 {
  width: 360px;
  height: 360px;
  background: #1677ff;
  top: -80px;
  left: -60px;
  animation: fsl-float-1 9s ease-in-out infinite;
}
.fsl-orb-2 {
  width: 320px;
  height: 320px;
  background: #722ed1;
  bottom: -70px;
  right: -50px;
  animation: fsl-float-2 11s ease-in-out infinite;
}
.fsl-orb-3 {
  width: 260px;
  height: 260px;
  background: #4096ff;
  top: 45%;
  right: 35%;
  animation: fsl-float-3 13s ease-in-out infinite;
}
@keyframes fsl-float-1 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(50px, 40px) scale(1.15);
  }
}
@keyframes fsl-float-2 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-40px, -50px) scale(1.2);
  }
}
@keyframes fsl-float-3 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.35;
  }
  50% {
    transform: translate(-30px, 30px) scale(1.1);
    opacity: 0.5;
  }
}

.fsl-lottie-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
.fsl-halo {
  position: absolute;
  inset: -25%;
  border-radius: 9999px;
  background: radial-gradient(
    circle,
    rgba(22, 119, 255, 0.35),
    rgba(114, 46, 209, 0.15) 50%,
    transparent 70%
  );
  animation: fsl-pulse 2.4s ease-in-out infinite;
  pointer-events: none;
}
@keyframes fsl-pulse {
  0%,
  100% {
    transform: scale(0.95);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.9;
  }
}
</style>
