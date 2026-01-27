import { ref, nextTick, watch, onMounted, onUnmounted, type Ref } from "vue";

// A4 纸张高度（像素），96 DPI
// 297mm * 3.7795 px/mm ≈ 1123px
const PAGE_HEIGHT = 1123;

interface PaginationOptions {
  contentPadding?: number; // 内容区域的垂直 padding 总和
  gap?: number; // 元素间距
}

export function usePagination(
  contentRef: Ref<HTMLElement | null>,
  resumeData: Ref<any>,
  options: PaginationOptions = {},
) {
  // 存储分页结果，每页包含的模块 ID 列表
  const pages = ref<string[][]>([[]]);
  const isCalculating = ref(true);

  const contentPadding = options.contentPadding ?? 64; // 默认 p-8 * 2 = 64
  const gap = options.gap ?? 0;
  const availableHeight = PAGE_HEIGHT - contentPadding;

  let resizeObserver: ResizeObserver | null = null;

  const calculatePages = async () => {
    if (!contentRef.value) return;

    // 等待 DOM 更新
    await nextTick();

    const children = Array.from(contentRef.value.children) as HTMLElement[];
    const newPages: string[][] = [];
    let currentPageItems: string[] = [];
    let currentPageHeight = 0;

    for (const child of children) {
      // 获取元素完整高度（包括 margin）
      const style = window.getComputedStyle(child);
      const marginTop = parseFloat(style.marginTop) || 0;
      const marginBottom = parseFloat(style.marginBottom) || 0;
      const height =
        child.getBoundingClientRect().height + marginTop + marginBottom;

      const id = child.dataset.id;

      if (!id) continue;

      // 如果当前页高度 + 新元素高度 > 可用高度
      // 并且当前页已经有元素了（避免第一个元素就过高导致死循环）
      if (
        currentPageHeight + height > availableHeight &&
        currentPageItems.length > 0
      ) {
        newPages.push(currentPageItems);
        currentPageItems = [];
        currentPageHeight = 0;
      }

      currentPageItems.push(id);
      currentPageHeight += height;
    }

    if (currentPageItems.length > 0) {
      newPages.push(currentPageItems);
    }

    // 如果没有内容，至少有一页
    if (newPages.length === 0) {
      newPages.push([]);
    }

    pages.value = newPages;
    isCalculating.value = false;
  };

  // 监听数据变化
  watch(
    resumeData,
    () => {
      isCalculating.value = true;
      calculatePages();
    },
    { deep: true },
  );

  onMounted(() => {
    calculatePages();

    // 监听容器大小变化
    if (contentRef.value) {
      resizeObserver = new ResizeObserver(() => {
        calculatePages();
      });
      resizeObserver.observe(contentRef.value);

      // 监听子树变化（内容变化但未触发 resumeData 变化的情况，虽然较少）
      const mutationObserver = new MutationObserver(() => {
        calculatePages();
      });
      mutationObserver.observe(contentRef.value, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  });

  onUnmounted(() => {
    if (resizeObserver) resizeObserver.disconnect();
  });

  return {
    pages,
    gap,
    isCalculating,
  };
}
