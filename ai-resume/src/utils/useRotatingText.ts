import { computed, onMounted, onUnmounted, ref } from "vue";

/**
 * 按固定间隔轮播文本，带淡入淡出的切换由调用方用 <Transition> 包裹实现。
 * 组件卸载时自动清理定时器。仅当 texts 长度 > 1 时才轮播。
 */
export const useRotatingText = (texts: string[], interval = 2400) => {
  const index = ref(0);
  const text = computed(() => texts[index.value % texts.length] ?? "");

  let timer: number | null = null;

  onMounted(() => {
    if (texts.length > 1) {
      timer = window.setInterval(() => {
        index.value = (index.value + 1) % texts.length;
      }, interval);
    }
  });

  onUnmounted(() => {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  });

  return text;
};
