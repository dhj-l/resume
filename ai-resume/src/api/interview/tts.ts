/**
 * 模拟面试问题语音流式客户端（SSE，GET /interview/sessions/:id/tts/stream）
 *
 * 与 answers/stream 相同的原生 fetch + ReadableStream 实现，不走 axios 实例
 * 与响应拦截器。帧格式：`meta`（采样率）→ `chunk`（base64 PCM16）×N →
 * `done`；合成中途失败发 `error` 帧后连接关闭。
 *
 * 注意：建连前错误（会话不存在、round 无问题、MiMo 建连失败等）是标准
 * JSON 错误包络而非 SSE，需按响应 Content-Type 区分处理。
 */

import { getAuthToken, parseSseFrame } from "./sse";

/** TTS 流式事件帧 */
export type TtsStreamEvent =
  | { type: "meta"; sampleRate: number; channels: number }
  | { type: "chunk"; data: string }
  | { type: "done" }
  | { type: "error"; message: string };

/** 流式回调集合 */
export interface TtsStreamCallbacks {
  onMeta?: (meta: { sampleRate: number; channels: number }) => void;
  /** 每帧音频数据（base64 编码的 PCM16 小端原始字节） */
  onChunk?: (base64Pcm: string) => void;
  onDone?: () => void;
  onError?: (error: Error) => void;
}

/** 交互句柄：cancel() 主动中断（取消上游请求与本地消费） */
export interface TtsStreamHandle {
  cancel: () => void;
}

/** 默认超时：120 秒（含合成时间；400 字问题音频约 1 分钟） */
const DEFAULT_TIMEOUT = 120 * 1000;

/**
 * 调用问题语音流式接口
 *
 * @param id 会话 ID
 * @param round 问题轮次（从 1 开始）
 * @param callbacks 事件回调
 * @param timeout 超时时间（毫秒），默认 120 秒
 * @returns 交互句柄，可随时取消
 */
export const getQuestionTtsStreamAPI = (
  id: string,
  round: number,
  callbacks: TtsStreamCallbacks = {},
  timeout: number = DEFAULT_TIMEOUT,
): TtsStreamHandle => {
  const { onMeta, onChunk, onDone, onError } = callbacks;

  const controller = new AbortController();
  let timedOut = false;
  const timer = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeout);

  const cleanup = () => {
    window.clearTimeout(timer);
  };

  void (async () => {
    const token = getAuthToken();
    if (!token) {
      cleanup();
      onError?.(new Error("未检测到登录状态，请重新登录"));
      return;
    }

    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const url = `${baseURL}/interview/sessions/${id}/tts/stream?round=${encodeURIComponent(round)}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "text/event-stream",
        },
        signal: controller.signal,
      });

      // 建连前错误是标准 JSON 响应而非 SSE
      const contentType = response.headers.get("Content-Type") ?? "";
      if (!contentType.includes("text/event-stream")) {
        let errMsg = `语音获取失败（HTTP ${response.status}）`;
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
        onError?.(new Error(`语音获取失败（HTTP ${response.status}）`));
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
          separatorIndex = buffer.indexOf("\n\n");

          const message = parseSseFrame(frame);
          if (!message) continue;

          const event = message as unknown as TtsStreamEvent;
          if (event.type === "meta") {
            onMeta?.({ sampleRate: event.sampleRate, channels: event.channels });
          } else if (event.type === "chunk") {
            onChunk?.(event.data);
          } else if (event.type === "done") {
            cleanup();
            onDone?.();
            return;
          } else if (event.type === "error") {
            cleanup();
            onError?.(new Error(event.message || "语音合成失败，请稍后重试"));
            return;
          }
        }
      }

      // 流自然结束但未收到 done 帧 -> 视为断线
      cleanup();
      onError?.(new Error("语音连接已断开，请稍后重试"));
    } catch (err) {
      cleanup();
      if (timedOut) {
        onError?.(new Error("语音合成超时，请稍后重试"));
      } else if (err instanceof DOMException && err.name === "AbortError") {
        // 主动取消不回调
      } else {
        onError?.(err instanceof Error ? err : new Error("网络异常，请检查网络设置"));
      }
    }
  })();

  return {
    cancel: () => controller.abort(),
  };
};

/**
 * 问题语音流式接口的配套类型：与 useTtsPlayer 保持纯类型耦合
 */
export interface TtsStreamMetadata {
  sampleRate: number;
  channels: number;
}
