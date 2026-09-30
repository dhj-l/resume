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

import { getAuthToken, parseSseFrame as parseGenericSseFrame } from "@/api/sse";

import type {
  InterviewSseErrorMessage,
  InterviewSseFinishedMessage,
  InterviewSseInitMessage,
  InterviewSseMessage,
  InterviewSseQuestionMessage,
} from "./type";

/** 与 stt.ts / tts.ts 保持既有导入路径：统一从共享实现读取 token */
export { getAuthToken };

/**
 * SSE 错误元信息
 *
 * 建连前的业务性错误以标准 JSON 包络返回（如 409 已结束 / 已超时），
 * 错误信封中的 `code` 与 HTTP 状态码是比中文文案更可靠的判定依据，
 * 调用方据此区分「超时自动关闭」等场景，避免依赖 message 子串匹配。
 */
export interface InterviewSseErrorInfo extends Error {
  /** HTTP 状态码（建连前错误才有） */
  httpStatus?: number;
  /** 业务错误码（后端信封 code 字段） */
  code?: number;
}

/** SSE 回调集合 */
export interface InterviewSseCallbacks {
  onInit?: (msg: InterviewSseInitMessage) => void;
  /** 逐题反馈生成完成（主体考察阶段，先于下一题到达） */
  onFeedback?: (data: Extract<InterviewSseMessage, { type: "feedback" }>["data"]) => void;
  /** 反问收尾：面试官告别语（先于评价报告生成到达，流继续保持） */
  onClosing?: (data: Extract<InterviewSseMessage, { type: "closing" }>["data"]) => void;
  onQuestion?: (data: InterviewSseQuestionMessage["data"]) => void;
  onFinished?: (data: InterviewSseFinishedMessage["data"]) => void;
  /** 失败回调；建连前错误携带 httpStatus / code 元信息，供调用方分类处理 */
  onError?: (error: InterviewSseErrorInfo) => void;
}

/** SSE 调用选项 */
export interface SubmitAnswerSseOptions extends InterviewSseCallbacks {
  /** 超时时间（毫秒），默认 8 分钟 */
  timeout?: number;
}

/** 默认超时：8 分钟（反问收尾需等待评价报告生成，后端单次生成上限 4 分钟 + 1 次重试） */
const DEFAULT_TIMEOUT = 8 * 60 * 1000;

/** 解析单个 SSE 帧：合并多行 data: 字段并 JSON.parse */
export const parseSseFrame = (frame: string): InterviewSseMessage | null =>
  parseGenericSseFrame<InterviewSseMessage>(frame, "interview SSE");

/** 把建连前的 JSON 错误包络转换为带元信息的 Error */
const buildErrorInfo = async (response: Response, fallbackMessage: string) => {
  const error = new Error(fallbackMessage) as InterviewSseErrorInfo;
  error.httpStatus = response.status;
  try {
    const json = await response.json();
    if (json?.message) {
      error.message = json.message;
    }
    if (typeof json?.code === "number") {
      error.code = json.code;
    }
  } catch {
    // 保留默认错误信息与状态码
  }
  return error;
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
  const {
    onInit,
    onFeedback,
    onClosing,
    onQuestion,
    onFinished,
    onError,
    timeout = DEFAULT_TIMEOUT,
  } = options;

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
      const error = await buildErrorInfo(response, `提交回答失败（HTTP ${response.status}）`);
      cleanup();
      onError?.(error);
      return;
    }

    if (!response.body) {
      const error = new Error(`提交回答失败（HTTP ${response.status}）`) as InterviewSseErrorInfo;
      error.httpStatus = response.status;
      cleanup();
      onError?.(error);
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
        } else if (message.type === "feedback") {
          // 反馈帧之后还有 question/finished 帧，不终止流
          onFeedback?.(message.data);
        } else if (message.type === "closing") {
          // 告别语帧之后还有 finished 帧（报告生成完成后），不终止流
          onClosing?.(message.data);
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
