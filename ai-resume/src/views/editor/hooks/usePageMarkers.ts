import { ref, watch, onMounted, onUnmounted, type Ref, unref, type MaybeRef } from "vue";

import { useDebounceFn } from "@vueuse/core";

const A4_HEIGHT = 1122;

interface PageMarker {
  pageNum: number;
  top: number;
}

interface PageMarkerOptions {
  firstPageHeight?: MaybeRef<number>;
}

export function usePageMarkers(
  containerRef: Ref<HTMLElement | null>,
  options: PageMarkerOptions = {},
) {
  const markers = ref<PageMarker[]>([]);
  let resizeObserver: ResizeObserver | null = null;
  let mutationObserver: MutationObserver | null = null;

  const calculate = () => {
    const el = containerRef.value;
    if (!el) {
      markers.value = [];
      return;
    }

    const firstPageH = unref(options.firstPageHeight) ?? A4_HEIGHT;
    const totalHeight = el.scrollHeight;
    const newMarkers: PageMarker[] = [];

    let pos = firstPageH;
    let pageNum = 2;

    while (pos < totalHeight) {
      newMarkers.push({ pageNum, top: pos });
      pos += A4_HEIGHT;
      pageNum++;
    }

    markers.value = newMarkers;
  };

  const debouncedCalculate = useDebounceFn(calculate, 100);

  onMounted(() => {
    calculate();

    if (containerRef.value) {
      resizeObserver = new ResizeObserver(debouncedCalculate);
      resizeObserver.observe(containerRef.value);

      mutationObserver = new MutationObserver(debouncedCalculate);
      mutationObserver.observe(containerRef.value, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  });

  watch(containerRef, (el, oldEl) => {
    if (oldEl && resizeObserver) {
      resizeObserver.unobserve(oldEl);
    }
    if (el && resizeObserver) {
      resizeObserver.observe(el);
      calculate();
    }
    if (mutationObserver) {
      mutationObserver.disconnect();
      if (el) {
        mutationObserver.observe(el, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      }
    }
  });

  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = null;
    }
  });

  return { markers };
}
