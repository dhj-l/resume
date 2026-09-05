/**
 * 模拟面试提交回答 SSE 客户端
 *
 * 使用原生 fetch + ReadableStream 实现，不走 axios 实例与响应拦截器。
 * 帧格式：每帧 `data: {...}\n\n`，按 `\n\n` 分帧解析 data: JSON，
 * 处理跨 chunk 的半帧缓冲。
 *
 * 注意：业务性错误（409 已结束/已超时、400 等）在建连前抛出，
 * 此时响应是标准 JSON 错误包络而非 SSE，需按响应 Content-Type 区分处理。
 */

import type {
  InterviewSseErrorMessage,
  InterviewSseFinishedMessage,
  InterviewSseInitMessage,
  InterviewSseMessage,
  InterviewSseQuestionMessage,
} from "./type";

/** SSE 回调集合 */
export interface InterviewSseCallbacks {
  onInit?: (msg: InterviewSseInitMessage) => void;
  onQuestion?: (data: InterviewSseQuestionMessage["data"]) => void;
  onFinished?: (data: InterviewSseFinishedMessage["data"]) => void;
  onError?: (error: Error) => void;
}

/** SSE 调用选项 */
export interface SubmitAnswerSseOptions extends InterviewSseCallbacks {
  /** 超时时间（毫秒），默认 5 分钟 */
  timeout?: number;
}

/** 默认超时：5 分钟 */
const DEFAULT_TIMEOUT = 5 * 60 * 1000;

/** 从 localStorage 读取 auth token，与 src/http/request.ts 保持一致 */
export const getAuthToken = (): string | null => {
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
export const parseSseFrame = (frame: string): InterviewSseMessage | null => {
  const dataLines = frame
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim());

  if (dataLines.length === 0) return null;

  const jsonStr = dataLines.join("\n");
  try {
    return JSON.parse(jsonStr) as InterviewSseMessage;
  } catch (e) {
    console.warn("Failed to parse interview SSE frame", jsonStr, e);
    return null;
  }
};

/**
 * 调用提交回答 SSE 端点（POST /interview/sessions/:id/answers/stream）
 *
 * @param id 会话 ID
 * @param payload 与 submitAnswerAPI 相同的请求体
 * @param options 回调与超时控制
 */
export const submitAnswerSSE = async (
  id: string,
  payload: { content: string; channel?: string },
  options: SubmitAnswerSseOptions = {},
): Promise<void> => {
  const { onInit, onQuestion, onFinished, onError, timeout = DEFAULT_TIMEOUT } = options;

  const token = getAuthToken();
  if (!token) {
    onError?.(new Error("未检测到登录状态，请重新登录"));
    return;
  }

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const url = `${baseURL}/interview/sessions/${id}/answers/stream`;

  const controller = new AbortController();
  let timedOut = false;
  const timer = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeout);

  const cleanup = () => {
    window.clearTimeout(timer);
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

    // 业务性错误在建连前抛出，响应是标准 JSON 错误包络而非 SSE
    const contentType = response.headers.get("Content-Type") ?? "";
    if (!contentType.includes("text/event-stream")) {
      let errMsg = `提交回答失败（HTTP ${response.status}）`;
      try {
        const json = await response.json();
        if (json?.message) errMsg = json.message;
      } catch {
        // 保留默认错误信息
      }
      cleanup();
      onError?.(new Error(errMsg));
      return;
    }

    if (!response.body) {
      cleanup();
      onError?.(new Error(`提交回答失败（HTTP ${response.status}）`));
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
        } else if (message.type === "question") {
          onQuestion?.(message.data);
          cleanup();
          return;
        } else if (message.type === "finished") {
          onFinished?.(message.data);
          cleanup();
          return;
        } else if (message.type === "error") {
          onError?.(
            new Error((message as InterviewSseErrorMessage).message || "AI 处理回答失败，请重试"),
          );
          cleanup();
          return;
        }
      }
    }

    // 流自然结束但未收到 question/finished 帧 -> 视为断线
    cleanup();
    onError?.(new Error("面试连接已断开，请重试"));
  } catch (err) {
    cleanup();
    if (timedOut) {
      onError?.(new Error("AI 处理超时，请稍后重试"));
    } else if (err instanceof DOMException && err.name === "AbortError") {
      onError?.(new Error("提交回答已取消"));
    } else {
      onError?.(err instanceof Error ? err : new Error("网络异常，请检查网络设置"));
    }
  }
};
