import {
  ref,
  nextTick,
  watch,
  onMounted,
  onUnmounted,
  type Ref,
  unref,
  type MaybeRef,
} from "vue";

const A4_HEIGHT_MM = 297;
const MM_TO_PX = 3.779527559;
const PAGE_HEIGHT = Math.round(A4_HEIGHT_MM * MM_TO_PX);
const SAFE_PAGE_HEIGHT = 1122;

const DEBUG_PAGINATION = true;

interface PaginationOptions {
  contentPadding?: MaybeRef<number | string>;
  gap?: MaybeRef<number>;
  firstPageOffset?: MaybeRef<number>;
}

function parsePaddingValue(value: number | string | undefined): number {
  if (value === undefined) return 24;
  if (typeof value === "number") return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 24 : parsed;
}

export function usePagination(
  contentRef: Ref<HTMLElement | null>,
  resumeData: Ref<any>,
  options: PaginationOptions = {},
) {
  const pages = ref<string[][]>([[]]);
  const isCalculating = ref(true);

  let resizeObserver: ResizeObserver | null = null;

  const calculatePages = async () => {
    if (!contentRef.value) return;

    await nextTick();

    const rawPadding = unref(options.contentPadding);
    const contentPadding = parsePaddingValue(rawPadding);
    const firstPageOffset = unref(options.firstPageOffset) ?? 0;
    const effectivePageHeight = SAFE_PAGE_HEIGHT;
    const availableHeight = effectivePageHeight - contentPadding;
    const firstPageAvailableHeight = availableHeight - firstPageOffset;

    const children = Array.from(contentRef.value.children) as HTMLElement[];
    const newPages: string[][] = [];
    let currentPageItems: string[] = [];
    let currentPageHeight = 0;
    let isFirstPage = true;

    const moduleHeights: { id: string | undefined; height: number; marginTop: number; marginBottom: number }[] = [];

    for (const child of children) {
      const style = window.getComputedStyle(child);
      const marginTop = parseFloat(style.marginTop) || 0;
      const marginBottom = parseFloat(style.marginBottom) || 0;
      const height =
        child.getBoundingClientRect().height + marginTop + marginBottom;

      const id = child.dataset.id;
      moduleHeights.push({ id, height, marginTop, marginBottom });

      if (!id) continue;

      const currentAvailableHeight = isFirstPage ? firstPageAvailableHeight : availableHeight;

      if (
        currentPageHeight + height > currentAvailableHeight &&
        currentPageItems.length > 0
      ) {
        newPages.push(currentPageItems);
        currentPageItems = [];
        currentPageHeight = 0;
        isFirstPage = false;
      }

      currentPageItems.push(id);
      currentPageHeight += height;
    }

    if (currentPageItems.length > 0) {
      newPages.push(currentPageItems);
    }

    if (newPages.length === 0) {
      newPages.push([]);
    }

    if (DEBUG_PAGINATION) {
      console.log('[Pagination] ========== 分页计算 ==========');
      console.log('[Pagination] A4高度(mm):', A4_HEIGHT_MM);
      console.log('[Pagination] MM转PX系数:', MM_TO_PX);
      console.log('[Pagination] 计算页面高度:', PAGE_HEIGHT);
      console.log('[Pagination] 安全页面高度:', SAFE_PAGE_HEIGHT);
      console.log('[Pagination] 原始padding值:', rawPadding);
      console.log('[Pagination] 解析后padding:', contentPadding);
      console.log('[Pagination] 可用高度:', availableHeight);
      console.log('[Pagination] 模块高度详情:', moduleHeights);
      console.log('[Pagination] 分页结果:', newPages);
      console.log('[Pagination] ==============================');
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

    isCalculating,
  };
}
