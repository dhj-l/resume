/**
 * 语音转文字（STT）SSE 客户端
 *
 * 使用原生 fetch + ReadableStream 实现，不走 axios 实例与响应拦截器
 * （multipart 上传 + SSE 流式响应）。帧格式：每帧 `data: {...}\n\n`：
 *   - { type: "delta", text }    识别文本增量
 *   - { type: "done", text }     完整转写文本
 *   - { type: "error", message } 识别失败
 * 业务性错误（400 格式不支持 / 402 余额不足等）在建连前返回标准 JSON
 * 错误包络而非 SSE，按响应 Content-Type 区分处理。
 * 接口契约见后端仓库 docs/api/speech-to-text.md。
 */

import { getAuthToken } from "../interview/sse";

/** STT SSE 帧类型 */
type SttSseFrame =
  | { type: "delta"; text: string }
  | { type: "done"; text: string }
  | { type: "error"; message: string };

/** STT SSE 回调集合 */
export interface SttTranscribeCallbacks {
  /** 收到识别文本增量 */
  onDelta?: (text: string) => void;
  /** 识别完成，text 为完整转写文本 */
  onDone?: (text: string) => void;
  onError?: (error: Error) => void;
}

/** STT 调用选项 */
export interface TranscribeOptions extends SttTranscribeCallbacks {
  /** 超时时间（毫秒），默认 90 秒（后端识别超时 60 秒，留网络余量） */
  timeout?: number;
  /** 外部取消信号（页面卸载时 abort） */
  signal?: AbortSignal;
}

/** 默认超时：90 秒 */
const DEFAULT_TIMEOUT = 90 * 1000;

/** 解析单个 SSE 帧：合并多行 data: 字段并 JSON.parse */
const parseSttFrame = (frame: string): SttSseFrame | null => {
  const dataLines = frame
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim());

  if (dataLines.length === 0) return null;

  try {
    return JSON.parse(dataLines.join("\n")) as SttSseFrame;
  } catch (e) {
    console.warn("Failed to parse STT SSE frame", frame, e);
    return null;
  }
};

/**
 * 调用语音转文字端点（POST /ai/stt/stream）
 *
 * @param audio 录音 Blob（建议 audio/wav，见 useRecorder）
 * @param options 回调、超时与取消控制
 */
export const transcribeAudioStream = async (
  audio: Blob,
  options: TranscribeOptions = {},
): Promise<void> => {
  const { onDelta, onDone, onError, timeout = DEFAULT_TIMEOUT, signal } = options;

  const token = getAuthToken();
  if (!token) {
    onError?.(new Error("未检测到登录状态，请重新登录"));
    return;
  }

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const url = `${baseURL}/ai/stt/stream`;

  const controller = new AbortController();
  const onExternalAbort = () => controller.abort();
  signal?.addEventListener("abort", onExternalAbort);

  let timedOut = false;
  const timer = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeout);

  const cleanup = () => {
    window.clearTimeout(timer);
    signal?.removeEventListener("abort", onExternalAbort);
  };

  const formData = new FormData();
  formData.append("audio", audio, "answer.wav");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/event-stream",
      },
      body: formData,
      signal: controller.signal,
    });

    // 业务性错误在建连前返回标准 JSON 错误包络而非 SSE
    const contentType = response.headers.get("Content-Type") ?? "";
    if (!contentType.includes("text/event-stream")) {
      let errMsg = `语音识别失败（HTTP ${response.status}）`;
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
      onError?.(new Error(`语音识别失败（HTTP ${response.status}）`));
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    let reading = true;
    while (reading) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // 按 \n\n 分帧，保留跨 chunk 的半帧于 buffer
      let separatorIndex = buffer.indexOf("\n\n");
      while (separatorIndex !== -1) {
        const frame = buffer.slice(0, separatorIndex);
        buffer = buffer.slice(separatorIndex + 2);
        separatorIndex = buffer.indexOf("\n\n");

        const message = parseSttFrame(frame);
        if (!message) continue;

        if (message.type === "delta") {
          onDelta?.(message.text);
        } else if (message.type === "done") {
          onDone?.(message.text);
          reading = false;
          break;
        } else if (message.type === "error") {
          onError?.(new Error(message.message || "语音识别失败，请稍后重试"));
          reading = false;
          break;
        }
      }
    }

    // 流结束但既无 done 也无 error 帧 -> 视为连接异常中断
    cleanup();
  } catch (err) {
    cleanup();
    if (timedOut) {
      onError?.(new Error("语音识别超时，请稍后重试"));
    } else if (signal?.aborted) {
      // 页面卸载等外部取消：静默返回，不视为错误
      return;
    } else if (err instanceof DOMException && err.name === "AbortError") {
      onError?.(new Error("语音识别已取消"));
    } else {
      onError?.(err instanceof Error ? err : new Error("网络异常，请检查网络设置"));
    }
  }
};
