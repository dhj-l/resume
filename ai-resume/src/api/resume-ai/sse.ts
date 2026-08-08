/**
 * AI 生成简历 SSE 客户端
 *
 * 使用原生 fetch + ReadableStream 实现，不走 axios 实例与响应拦截器。
 * 帧格式：每帧 `data: {...}\n\n`，按 `\n\n` 分帧解析 data: JSON，
 * 处理跨 chunk 的半帧缓冲。AbortController 超时 10 分钟。
 */

import type { AiResumeParams } from "@/api/resume/type";

import type {
  SseCompleteMessage,
  SseErrorMessage,
  SseInitMessage,
  SseMessage,
  SseProgressMessage,
} from "./type";

/** SSE 回调集合 */
export interface SseCallbacks {
  onInit?: (msg: SseInitMessage) => void;
  onProgress?: (msg: SseProgressMessage) => void;
  onComplete?: (msg: SseCompleteMessage) => void;
  onError?: (error: SseErrorMessage | Error) => void;
}

/** SSE 调用选项 */
export interface GenerateAiResumeSseOptions extends SseCallbacks {
  /** 超时时间（毫秒），默认 10 分钟 */
  timeout?: number;
  /** 外部 AbortSignal，用于外部主动中止 */
  signal?: AbortSignal;
}

/** 默认超时：10 分钟 */
const DEFAULT_TIMEOUT = 10 * 60 * 1000;

/** 从 localStorage 读取 auth token，与 src/http/request.ts 保持一致 */
const getAuthToken = (): string | null => {
  try {
    const authStoreStr = localStorage.getItem("auth");
    if (!authStoreStr) return null;
    const authStore = JSON.parse(authStoreStr);
    return authStore?.token ?? null;
  } catch (e) {
    console.warn("Failed to retrieve auth token", e);
    return null;
  }
};

/** 解析单个 SSE 帧：合并多行 data: 字段并 JSON.parse */
const parseSseFrame = (frame: string): SseMessage | null => {
  const dataLines = frame
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim());

  if (dataLines.length === 0) return null;

  const jsonStr = dataLines.join("\n");
  try {
    return JSON.parse(jsonStr) as SseMessage;
  } catch (e) {
    console.warn("Failed to parse SSE frame", jsonStr, e);
    return null;
  }
};

/**
 * 调用 AI 生成简历 SSE 端点（POST /resume-ai/generatesse）
 *
 * @param payload 与 generateAiResumeAPI 相同的请求体
 * @param options 回调与超时控制
 */
export const generateAiResumeSSE = async (
  payload: AiResumeParams,
  options: GenerateAiResumeSseOptions = {},
): Promise<void> => {
  const { onInit, onProgress, onComplete, onError, timeout = DEFAULT_TIMEOUT, signal } = options;

  const token = getAuthToken();
  if (!token) {
    onError?.(new Error("未检测到登录状态，请重新登录"));
    return;
  }

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const url = `${baseURL}/resume-ai/generatesse`;

  const controller = new AbortController();
  let timedOut = false;
  const timer = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeout);

  // 外部 signal 同步中止状态
  const onExternalAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener("abort", onExternalAbort, { once: true });
    }
  }

  const cleanup = () => {
    window.clearTimeout(timer);
    if (signal) signal.removeEventListener("abort", onExternalAbort);
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "text/event-stream",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok || !response.body) {
      onError?.(new Error(`AI 生成请求失败（HTTP ${response.status}）`));
      cleanup();
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    let reading = true;
    while (reading) {
      const { value, done } = await reader.read();
      if (done) {
        reading = false;
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      // 按 \n\n 分帧，保留跨 chunk 的半帧于 buffer
      let separatorIndex = buffer.indexOf("\n\n");
      while (separatorIndex !== -1) {
        const frame = buffer.slice(0, separatorIndex);
        buffer = buffer.slice(separatorIndex + 2);

        const message = parseSseFrame(frame);
        separatorIndex = buffer.indexOf("\n\n");
        if (!message) continue;

        if (message.type === "init") {
          onInit?.(message);
        } else if (message.type === "progress") {
          onProgress?.(message);
        } else if (message.type === "complete") {
          onComplete?.(message);
          cleanup();
          controller.abort();
          return;
        } else if (message.type === "error") {
          onError?.(message);
          cleanup();
          controller.abort();
          return;
        }
        // heartbeat 帧忽略，仅保活
      }
    }

    // 流自然结束但未收到 complete 帧 -> 视为断线
    cleanup();
    onError?.(new Error("AI 生成连接已断开，请重试"));
  } catch (err) {
    cleanup();
    if (timedOut) {
      onError?.(new Error("AI 生成超时，请稍后重试"));
    } else if (signal?.aborted) {
      onError?.(new Error("AI 生成已取消"));
    } else {
      onError?.(err instanceof Error ? err : new Error("AI 生成网络异常，请检查网络设置"));
    }
  }
};
