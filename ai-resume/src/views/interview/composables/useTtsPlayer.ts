/**
 * 模拟面试问题语音播放 composable
 *
 * - 按 `sessionId:round` 缓存音频 objectURL，喇叭重播直接命中缓存
 * - 收到新问题后可调用 autoPlay 自动朗读（可开关，默认开启并持久化）
 * - 单例 Audio 播放：播新题先停旧音频，播放中再点同一题即停止
 */
import { ref } from "vue";

import { message } from "ant-design-vue";

import { getQuestionTtsAPI } from "@/api/interview/interview";

/** 自动播放开关的 localStorage 键 */
const AUTOPLAY_STORAGE_KEY = "interview-tts-autoplay";

/** objectURL 缓存上限，超出后按插入序淘汰最早的条目 */
const MAX_CACHE_SIZE = 60;

/** 读取初始自动播放开关（默认开启） */
const readAutoPlayEnabled = (): boolean => {
  try {
    const stored = localStorage.getItem(AUTOPLAY_STORAGE_KEY);
    return stored === null ? true : stored === "true";
  } catch {
    return true;
  }
};

export const useTtsPlayer = () => {
  /** 自动朗读开关（持久化到 localStorage，跨会话生效） */
  const autoPlayEnabled = ref(readAutoPlayEnabled());

  /** 正在加载音频的 key（sessionId:round） */
  const loadingKey = ref<string | null>(null);
  /** 正在播放的 key */
  const playingKey = ref<string | null>(null);

  /** 单例播放器与 objectURL 缓存（组件外共享的普通变量，随页面卸载释放） */
  let audioEl: HTMLAudioElement | null = null;
  const urlCache = new Map<string, string>();

  const buildKey = (sessionId: string, round: number) => `${sessionId}:${round}`;

  const stop = () => {
    if (audioEl) {
      audioEl.pause();
    }
    playingKey.value = null;
  };

  const startPlaying = (key: string, url: string) => {
    if (!audioEl) {
      audioEl = new Audio();
      audioEl.addEventListener("ended", () => {
        playingKey.value = null;
      });
    }
    audioEl.src = url;
    playingKey.value = key;
    audioEl.play().catch((err) => {
      // 浏览器自动播放策略拒绝等情况：静默降级为未播放态
      console.warn("TTS playback failed", err);
      if (playingKey.value === key) {
        playingKey.value = null;
      }
    });
  };

  const cacheUrl = (key: string, url: string) => {
    urlCache.set(key, url);
    if (urlCache.size > MAX_CACHE_SIZE) {
      const oldest = urlCache.keys().next().value;
      if (oldest !== undefined) {
        const stale = urlCache.get(oldest);
        if (stale) URL.revokeObjectURL(stale);
        urlCache.delete(oldest);
      }
    }
  };

  /** 请求音频并播放；失败时按调用方要求静默或提示 */
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

    // 命中缓存直接播放
    const cached = urlCache.get(key);
    if (cached) {
      startPlaying(key, cached);
      return;
    }

    loadingKey.value = key;
    try {
      // 拦截器对 Blob 响应直接透传，类型上仍是 AxiosResponse，与既有 blob 接口一致
      const res = await getQuestionTtsAPI(sessionId, round);
      const blob = res as unknown as Blob;
      const url = URL.createObjectURL(blob);
      cacheUrl(key, url);
      // 加载期间可能已被停止或切走：仅当仍在加载同一题时才播放
      if (loadingKey.value === key) {
        loadingKey.value = null;
        startPlaying(key, url);
      }
    } catch (err) {
      console.warn("TTS fetch failed", err);
      if (!options.silent) {
        message.error("语音获取失败，请稍后重试");
      }
    } finally {
      if (loadingKey.value === key) {
        loadingKey.value = null;
      }
    }
  };

  /** 手动点击喇叭：播放 / 停止 / 重播，失败时提示 */
  const play = (sessionId: string, round: number) => {
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

  /** 切换会话 / 组件卸载时停止播放（缓存保留，切回可秒播） */
  const dispose = () => {
    stop();
    loadingKey.value = null;
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
