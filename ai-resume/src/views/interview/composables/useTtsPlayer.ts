/**
 * 模拟面试问题语音播放 composable（流式版）
 *
 * - 走新流式接口 `GET /interview/sessions/:id/tts/stream`（SSE），
 *   meta → chunk（base64 PCM16）×N → done，Web Audio 增量解码调度，
 *   首帧到达即开始发声，无需等待整题合成完成
 * - 整段 PCM 按 `sessionId:round` 缓存在内存，喇叭重播直接命中缓存（免上游请求）
 * - 流式失败时自动降级到旧的完整 wav 接口（blob + <audio>），行为不回退
 * - 单例播放：播新题先停旧音频，播放中再点同一题即停止
 */
import { ref } from "vue";

import { message } from "ant-design-vue";

import { getQuestionTtsAPI } from "@/api/interview/interview";
import { getQuestionTtsStreamAPI, type TtsStreamHandle } from "@/api/interview/tts";

import { PcmStreamPlayer } from "./pcmStreamPlayer";

/** 自动播放开关的 localStorage 键 */
const AUTOPLAY_STORAGE_KEY = "interview-tts-autoplay";

/** 内存 PCM 缓存条目上限，超出后按插入序淘汰最早的条目 */
const MAX_CACHE_SIZE = 64;

/** 缓存的整段音频：原始 PCM16 小端字节 + 采样率 */
interface CachedAudio {
  sampleRate: number;
  pcm: Uint8Array;
}

/** 读取初始自动播放开关（默认开启） */
const readAutoPlayEnabled = (): boolean => {
  try {
    const stored = localStorage.getItem(AUTOPLAY_STORAGE_KEY);
    return stored === null ? true : stored === "true";
  } catch {
    return true;
  }
};

/** base64 → 字节（PCM16 原始数据） */
const base64ToBytes = (base64: string): Uint8Array => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

/** 字节 → Int16 采样（必须按小端读取，与 PCM16 协议一致） */
const bytesToInt16 = (bytes: Uint8Array): Int16Array => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const int16 = new Int16Array(bytes.byteLength >> 1);
  for (let i = 0; i < int16.length; i++) {
    int16[i] = view.getInt16(i * 2, true);
  }
  return int16;
};

/** 拼接字节数组 */
const concatBytes = (chunks: Uint8Array[]): Uint8Array => {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
};

export const useTtsPlayer = () => {
  /** 自动朗读开关（持久化到 localStorage，跨会话生效） */
  const autoPlayEnabled = ref(readAutoPlayEnabled());

  /** 正在加载音频的 key（sessionId:round） */
  const loadingKey = ref<string | null>(null);
  /** 正在播放的 key */
  const playingKey = ref<string | null>(null);

  /** 增量播放引擎（组件外共享，随页面卸载释放） */
  const engine = new PcmStreamPlayer();
  /** 整段 PCM 内存缓存（重播免上游请求） */
  const pcmCache = new Map<string, CachedAudio>();
  /** 当前流式请求句柄 */
  let streamHandle: TtsStreamHandle | null = null;
  /** 兜底旧接口的 <audio> 与临时 URL */
  let legacyAudioEl: HTMLAudioElement | null = null;
  let legacyUrl: string | null = null;
  /** done 收尾检测定时器 */
  let finishTimer: number | null = null;
  /** 任务令牌：切题/停止后旧任务的回调全部失效 */
  let playToken = 0;

  const buildKey = (sessionId: string, round: number) => `${sessionId}:${round}`;

  const clearFinishTimer = () => {
    if (finishTimer !== null) {
      window.clearTimeout(finishTimer);
      finishTimer = null;
    }
  };

  /** 停止当前播放（含上游请求与兜底音频），并使旧任务回调失效 */
  const stop = () => {
    playToken += 1;
    streamHandle?.cancel();
    streamHandle = null;
    engine.stop();
    if (legacyAudioEl) {
      legacyAudioEl.pause();
    }
    clearFinishTimer();
    playingKey.value = null;
  };

  /** done 后等待剩余音频播完再清除播放态 */
  const scheduleFinish = (token: number, key: string) => {
    clearFinishTimer();
    const remainingMs = engine.bufferedMs();
    finishTimer = window.setTimeout(() => {
      if (token === playToken && playingKey.value === key) {
        playingKey.value = null;
      }
    }, remainingMs + 200);
  };

  /** 整段 PCM 开始播放（缓存命中路径：分帧喂入引擎） */
  const startPlayingFromCache = (key: string, cached: CachedAudio, token: number) => {
    engine.stop();
    engine.start(cached.sampleRate, 1);
    playingKey.value = key;
    const FRAME_BYTES = 8192;
    for (let offset = 0; offset < cached.pcm.length; offset += FRAME_BYTES) {
      if (token !== playToken) return;
      const slice = cached.pcm.subarray(offset, Math.min(offset + FRAME_BYTES, cached.pcm.length));
      engine.append(bytesToInt16(slice));
    }
    scheduleFinish(token, key);
  };

  /** 流式失败后的兜底：旧完整 wav 接口（blob + <audio>） */
  const fallbackToLegacy = async (
    sessionId: string,
    round: number,
    key: string,
    token: number,
    options: { silent?: boolean },
  ) => {
    if (token !== playToken) return;
    try {
      const res = await getQuestionTtsAPI(sessionId, round);
      if (token !== playToken) return;
      const blob = res as unknown as Blob;
      if (legacyUrl) URL.revokeObjectURL(legacyUrl);
      legacyUrl = URL.createObjectURL(blob);

      if (!legacyAudioEl) {
        legacyAudioEl = new Audio();
        legacyAudioEl.addEventListener("ended", () => {
          if (legacyUrl) {
            URL.revokeObjectURL(legacyUrl);
            legacyUrl = null;
          }
          if (playingKey.value === key) {
            playingKey.value = null;
          }
        });
      }
      legacyAudioEl.src = legacyUrl;
      loadingKey.value = null;
      playingKey.value = key;
      await legacyAudioEl.play().catch((err) => {
        console.warn("TTS legacy playback failed", err);
        if (playingKey.value === key) {
          playingKey.value = null;
        }
        if (!options.silent) {
          message.error("语音获取失败，请稍后重试");
        }
      });
    } catch (err) {
      console.warn("TTS legacy fetch failed", err);
      if (!options.silent) {
        message.error("语音获取失败，请稍后重试");
      }
    }
  };

  /** 请求流式音频并播放；失败时按调用方要求静默或提示，并降级到旧接口 */
  const fetchAndPlay = async (
    sessionId: string,
    round: number,
    options: { silent?: boolean } = {},
  ) => {
    const key = buildKey(sessionId, round);

    // 点击正在播放的题目：停止
    if (playingKey.value === key) {
      stop();
      return;
    }
    // 播其它题：先停当前
    stop();

    const token = ++playToken;

    // 命中内存缓存直接播放（免上游请求）
    const cached = pcmCache.get(key);
    if (cached) {
      loadingKey.value = null;
      startPlayingFromCache(key, cached, token);
      return;
    }

    loadingKey.value = key;
    const chunks: Uint8Array[] = [];
    let sampleRate = 0;
    /** 该任务是否仍有效（未切题/未停止） */
    const keepAlive = () => token === playToken && loadingKey.value === key;

    streamHandle = getQuestionTtsStreamAPI(sessionId, round, {
      onMeta: (meta) => {
        if (!keepAlive()) return;
        sampleRate = meta.sampleRate;
        engine.start(meta.sampleRate, meta.channels);
        playingKey.value = key;
      },
      onChunk: (base64Pcm) => {
        if (!keepAlive()) return;
        const bytes = base64ToBytes(base64Pcm);
        chunks.push(bytes);
        try {
          engine.append(bytesToInt16(bytes));
        } catch (err) {
          console.warn("TTS audio decode failed", err);
        }
      },
      onDone: () => {
        if (!keepAlive()) return;
        loadingKey.value = null;
        pcmCache.set(key, { sampleRate, pcm: concatBytes(chunks) });
        // 缓存超限：按插入序淘汰最早条目
        while (pcmCache.size > MAX_CACHE_SIZE) {
          const oldest = pcmCache.keys().next().value;
          if (oldest === undefined) break;
          pcmCache.delete(oldest);
        }
        scheduleFinish(token, key);
      },
      onError: (err) => {
        if (!keepAlive()) return;
        loadingKey.value = null;
        console.warn("TTS stream failed", err);
        void fallbackToLegacy(sessionId, round, key, token, options);
      },
    });
  };

  /** 手动点击喇叭：播放 / 停止 / 重播，失败时提示（含旧接口兜底） */
  const play = (sessionId: string, round: number) => {
    // 在用户手势内预创建 AudioContext，尽可能避开自动播放策略限制
    engine.precreate();
    return fetchAndPlay(sessionId, round);
  };

  /** 新问题到达后的自动朗读：开关关闭时不动作，全程静默失败 */
  const autoPlay = (sessionId: string, round: number) => {
    if (!autoPlayEnabled.value) return;
    return fetchAndPlay(sessionId, round, { silent: true });
  };

  /** 切换自动朗读开关并持久化 */
  const toggleAutoPlay = () => {
    autoPlayEnabled.value = !autoPlayEnabled.value;
    // 关闭开关的同时停掉正在播放的语音
    if (!autoPlayEnabled.value) {
      stop();
    }
    try {
      localStorage.setItem(AUTOPLAY_STORAGE_KEY, String(autoPlayEnabled.value));
    } catch {
      // localStorage 不可用时开关仅在本次会话内生效
    }
  };

  /** 切换会话 / 组件卸载时停止播放（内存缓存保留，切回可秒播） */
  const dispose = () => {
    stop();
    loadingKey.value = null;
    void engine.dispose();
  };

  /** 模板辅助：该题音频是否正在加载 */
  const isLoading = (sessionId: string, round: number) =>
    loadingKey.value === buildKey(sessionId, round);

  /** 模板辅助：该题音频是否正在播放 */
  const isPlaying = (sessionId: string, round: number) =>
    playingKey.value === buildKey(sessionId, round);

  return {
    autoPlayEnabled,
    play,
    autoPlay,
    toggleAutoPlay,
    dispose,
    isLoading,
    isPlaying,
  };
};

export type TtsPlayer = ReturnType<typeof useTtsPlayer>;
