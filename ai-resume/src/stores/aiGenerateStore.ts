import { ref } from "vue";

import { defineStore } from "pinia";

import type { AiResumeParams } from "@/api/resume/type";
import { generateAiResumeSSE } from "@/api/resume-ai/sse";
import { getSseModuleLabel } from "@/api/resume-ai/type";

export type AiGenerateStatus = "idle" | "generating" | "completed" | "failed";

/**
 * AI 生成跨页面会话
 *
 * 模板详情页发起生成后立即跳转编辑页，SSE 连接与已生成模块数据保存在此
 * store（Pinia 全局单例，路由切换不丢失）。刷新页面后 store 重建，
 * 由编辑页根据 sessionStorage + 简历 aiStatus 提示生成中断。
 */
export const useAiGenerateStore = defineStore("aiGenerate", () => {
  const status = ref<AiGenerateStatus>("idle");
  const resumeId = ref("");
  const totalModules = ref(0);
  const currentModule = ref(0);
  const moduleLabel = ref("");
  /** 已生成模块数据：moduleName -> 模块内容 */
  const completedModules = ref<Record<string, any>>({});
  const error = ref("");

  /** 非响应式标记：判断当前会话是否仍由本页面持有（刷新后为 false） */
  let active = false;
  /** 当前生成代会次 token，用于区分新旧 SSE 回调；每次发起新生成递增 */
  let generationToken = 0;
  /** 当前 SSE 的中止控制器，发起新生成时中止上一次仍在运行的连接 */
  let abortController: AbortController | null = null;

  const clearSession = () => {
    if (resumeId.value) {
      sessionStorage.removeItem(`ai-generate:${resumeId.value}`);
    }
  };

  const reset = () => {
    status.value = "idle";
    resumeId.value = "";
    totalModules.value = 0;
    currentModule.value = 0;
    moduleLabel.value = "";
    completedModules.value = {};
    error.value = "";
    active = false;
  };

  /**
   * 发起 AI 生成并持续更新会话状态
   * @param onInit 收到 init 帧（草稿已创建）时回调，调用方在此跳转编辑页
   */
  const startGeneration = async (
    payload: AiResumeParams,
    onInit?: (resumeId: string) => void,
  ): Promise<boolean> => {
    // 中止上一次仍在运行的 SSE，避免新旧会话并发写入同一个 store
    abortController?.abort();
    // 清理被取代的旧会话记录，避免 ai-generate:<旧resumeId> 在 sessionStorage 残留
    clearSession();
    const myToken = ++generationToken;
    abortController = new AbortController();

    reset();
    active = true;
    status.value = "generating";

    // 仅当前代次的回调才写 store，被新生成取代的旧回调一律忽略
    const isCurrent = () => myToken === generationToken;

    await generateAiResumeSSE(payload, {
      signal: abortController.signal,
      onInit: (msg) => {
        if (!isCurrent()) return;
        resumeId.value = msg.resumeId;
        totalModules.value = msg.totalModules;
        currentModule.value = 0;
        onInit?.(msg.resumeId);
      },
      onProgress: (msg) => {
        if (!isCurrent()) return;
        currentModule.value = msg.currentModule;
        totalModules.value = msg.totalModules;
        moduleLabel.value = getSseModuleLabel(msg.moduleName);
        if (msg.status === "completed" && msg.data !== undefined) {
          completedModules.value = {
            ...completedModules.value,
            [msg.moduleName]: msg.data,
          };
        }
      },
      onComplete: (msg) => {
        if (!isCurrent()) return;
        status.value = "completed";
        totalModules.value = msg.totalModules;
        currentModule.value = msg.totalModules;
        active = false;
        clearSession();
      },
      onError: (err) => {
        if (!isCurrent()) return;
        status.value = "failed";
        error.value = err.message ?? "AI 生成失败";
        active = false;
        clearSession();
      },
      timeout: 600000,
    });

    // 返回本次调用是否仍是最近一代，调用方据此决定是否处理收尾；
    // 被新调用取代的旧调用返回 false，其收尾逻辑一律忽略
    return isCurrent();
  };

  return {
    status,
    resumeId,
    totalModules,
    currentModule,
    moduleLabel,
    completedModules,
    error,
    startGeneration,
    reset,
    clearSession,
    isActive: () => active,
  };
});
