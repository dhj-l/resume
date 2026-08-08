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

  const clearSessionStorage = () => {
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
  const startGeneration = async (payload: AiResumeParams, onInit?: (resumeId: string) => void) => {
    reset();
    active = true;
    status.value = "generating";

    await generateAiResumeSSE(payload, {
      onInit: (msg) => {
        resumeId.value = msg.resumeId;
        totalModules.value = msg.totalModules;
        currentModule.value = 0;
        onInit?.(msg.resumeId);
      },
      onProgress: (msg) => {
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
        status.value = "completed";
        totalModules.value = msg.totalModules;
        currentModule.value = msg.totalModules;
        active = false;
        clearSessionStorage();
      },
      onError: (err) => {
        status.value = "failed";
        error.value = err.message ?? "AI 生成失败";
        active = false;
        clearSessionStorage();
      },
      timeout: 600000,
    });
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
    isActive: () => active,
  };
});
