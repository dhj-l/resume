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
        class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm select-none"
        role="status"
        aria-live="polite"
        @contextmenu.prevent
        @touchmove.prevent
      >
        <div
          class="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center max-w-md w-full mx-4"
        >
          <!-- Ant Design Vue Spin -->
          <a-spin size="large" />

          <!-- Loading Text -->
          <h3
            class="mt-6 text-gray-800 text-lg font-medium tracking-wide text-center leading-relaxed"
          >
            {{ text }}
          </h3>

          <!-- Subtext -->
          <p class="mt-2 text-gray-500 text-sm font-light text-center">请勿关闭页面或刷新</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from "vue";

interface Props {
  loading: boolean;
  text?: string;
  timeout?: number; // milliseconds
}

const props = withDefaults(defineProps<Props>(), {
  text: "AI正在为您生成简历，过程可能需要1到2分钟，请稍等。",
  timeout: 180000, // 180 seconds default
});

const emit = defineEmits<{
  (e: "update:loading", value: boolean): void;
  (e: "timeout"): void;
}>();

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
