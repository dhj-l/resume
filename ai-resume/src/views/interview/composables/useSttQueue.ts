/**
 * 语音识别串行队列
 *
 * 分句录音产生的每句 WAV 依次入队，同一时刻仅允许一个在途识别请求，
 * 保证各句识别文本按说话顺序追加；发送回答或页面卸载时可整体取消，
 * 取消后仍可继续入队新的句子。
 */
import { onScopeDispose, ref, type Ref } from "vue";

import { transcribeAudioStream } from "@/api/ai/stt";

export interface UseSttQueueCallbacks {
  /** 某句识别文本增量 */
  onDelta?: (text: string) => void;
  /** 某句识别失败（不影响队列中后续句子） */
  onError?: (error: Error) => void;
}

export interface UseSttQueueReturn {
  /** 排队或在途的识别任务数（0 表示全部完成） */
  pendingCount: Ref<number>;
  /** 入队一句音频 */
  enqueue: (blob: Blob) => void;
  /** 清空队列并中止在途请求（发送回答时调用） */
  cancelAll: () => void;
}

export const useSttQueue = (callbacks: UseSttQueueCallbacks): UseSttQueueReturn => {
  const pendingCount = ref(0);
  const queue: Blob[] = [];
  let running = false;
  let currentController: AbortController | null = null;

  const updatePending = () => {
    pendingCount.value = queue.length + (running ? 1 : 0);
  };

  const pump = async (): Promise<void> => {
    if (running) return;
    running = true;
    updatePending();
    while (queue.length > 0) {
      const blob = queue.shift();
      if (!blob) break;
      currentController = new AbortController();
      await transcribeAudioStream(blob, {
        signal: currentController.signal,
        onDelta: (text) => callbacks.onDelta?.(text),
        onError: (error) => callbacks.onError?.(error),
      });
      currentController = null;
      updatePending();
    }
    running = false;
    updatePending();
  };

  const enqueue = (blob: Blob): void => {
    queue.push(blob);
    updatePending();
    void pump();
  };

  const cancelAll = (): void => {
    queue.length = 0;
    updatePending();
    // 在途请求被 abort 后 transcribeAudioStream 静默返回，pump 自然退出
    currentController?.abort();
    currentController = null;
  };

  onScopeDispose(() => cancelAll());

  return { pendingCount, enqueue, cancelAll };
};
