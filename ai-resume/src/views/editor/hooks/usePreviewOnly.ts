import { inject } from "vue";

/** provide/inject key：预览态（对比页等）下点击模块不触发编辑器选中/展开 */
export const PREVIEW_ONLY_KEY = "previewOnly";

export function usePreviewOnly(): boolean {
  return inject<boolean>(PREVIEW_ONLY_KEY, false) ?? false;
}
