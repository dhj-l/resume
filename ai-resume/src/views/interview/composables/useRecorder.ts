/**
 * 麦克风录音 composable（句子级分句模式）
 *
 * 使用 AudioContext 采集 PCM16 单声道音频，基于块 RMS 能量做静音检测（VAD）：
 * 每检测到一次停顿（连续静音 600ms）即把累积语音封装为 WAV 并通过 onSentence
 * 回调推出，由调用方立即送识别，实现句子级伪实时——说完一句约 1~2 秒后
 * 该句识别文字回流，录音与识别并行。
 *
 * 不使用 MediaRecorder：其产物（webm/opus、mp4）因浏览器而异，
 * 上游识别服务对其支持未验证；自采 PCM 封装 WAV 跨浏览器行为一致。
 */
import { onScopeDispose, ref, type Ref } from "vue";

/** WAV 文件头长度（字节） */
const WAV_HEADER_BYTES = 44;
/** 期望采集采样率（Hz）；浏览器不支持时回退设备采样率，WAV 头按实际值写入 */
const RECORD_SAMPLE_RATE = 16000;
/** 每块采样数：16kHz 下约 128ms，兼顾分句粒度与回调开销 */
const PROCESSOR_BUFFER_SIZE = 2048;
/** 静音判定阈值：块 RMS 低于该值视为静音（0~1，安静室内可用） */
const SILENCE_RMS_THRESHOLD = 0.01;
/** 连续静音达到该时长即切句（毫秒）：偏小以更快出字，偏大以避免句内停顿误切 */
const SILENCE_CUT_MS = 350;
/** 单句最短语音时长（秒）：停顿处不足该值不切句，语音并入下一句 */
const MIN_SENTENCE_SECONDS = 1;
/**
 * 挂起缓冲强制送出时长（毫秒）：短句切句后持续静音达到该值，
 * 视为已经说完，将挂起的短句立即送识别，避免句尾短词被无限期扣留
 */
const PENDING_FLUSH_MS = 1000;
/** 单句最长语音时长（秒）：持续说话不停顿时强制切句，避免单段音频过大 */
const MAX_SENTENCE_SECONDS = 15;
/** 停止录音时尾句最短语音时长（秒）：低于则丢弃（视为杂音） */
const MIN_TAIL_SECONDS = 0.15;

export interface UseRecorderOptions {
  /** 每凑好一句语音（WAV Blob）回调一次 */
  onSentence: (blob: Blob) => void;
}

export interface UseRecorderReturn {
  /** 是否录音中 */
  isRecording: Ref<boolean>;
  /** 录音已持续秒数（展示用） */
  elapsedSeconds: Ref<number>;
  /** 开始录音：请求麦克风权限并开始采集，失败抛可读 Error */
  start: () => Promise<void>;
  /** 停止录音：未结算的尾句（满足最短时长）经 onSentence 推出 */
  stop: () => void;
}

/** 将 Float32 采样（-1~1）转为 Int16 */
const floatToInt16 = (input: Float32Array): Int16Array => {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i] ?? 0));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return output;
};

/** 计算一块采样的 RMS 能量（0~1） */
const computeRms = (input: Float32Array): number => {
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    sum += (input[i] ?? 0) ** 2;
  }
  return Math.sqrt(sum / input.length);
};

/** 把 getUserMedia 的异常转换为用户可读的错误信息 */
const resolveMicError = (err: unknown): string => {
  if (err instanceof DOMException) {
    if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
      return "麦克风权限被拒绝，请在浏览器地址栏允许麦克风访问后重试";
    }
    if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
      return "未检测到可用麦克风，请检查设备连接";
    }
    if (err.name === "NotReadableError" || err.name === "TrackStartError") {
      return "麦克风被其他应用占用，请关闭占用后重试";
    }
  }
  return "无法访问麦克风，请检查浏览器设置";
};

/** 将 PCM16 分片封装为标准 WAV（RIFF/PCM，44 字节头） */
const encodeWav = (chunks: Int16Array[], sampleRate: number): Blob => {
  const totalSamples = chunks.reduce((n, c) => n + c.length, 0);
  const dataLength = totalSamples * 2;
  const buffer = new ArrayBuffer(WAV_HEADER_BYTES + dataLength);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // fmt 块长度
  view.setUint16(20, 1, true); // audioFormat：PCM
  view.setUint16(22, 1, true); // 单声道
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byteRate = sampleRate * 2 字节
  view.setUint16(32, 2, true); // blockAlign
  view.setUint16(34, 16, true); // bitsPerSample
  writeString(36, "data");
  view.setUint32(40, dataLength, true);

  let offset = WAV_HEADER_BYTES;
  for (const chunk of chunks) {
    for (let i = 0; i < chunk.length; i++, offset += 2) {
      view.setInt16(offset, chunk[i] ?? 0, true);
    }
  }
  return new Blob([buffer], { type: "audio/wav" });
};

export const useRecorder = (options: UseRecorderOptions): UseRecorderReturn => {
  const isRecording = ref(false);
  const elapsedSeconds = ref(0);

  let audioContext: AudioContext | null = null;
  let mediaStream: MediaStream | null = null;
  let sourceNode: MediaStreamAudioSourceNode | null = null;
  let processorNode: ScriptProcessorNode | null = null;
  let elapsedTimer: number | null = null;

  /** 当前累积句的 PCM16 分片 */
  let bufferChunks: Int16Array[] = [];
  /** 当前累积句的有声时长（毫秒） */
  let voicedMs = 0;
  /** 是否处于语音段（检测到过声音且未遇切句停顿） */
  let speaking = false;
  /** 连续静音累计（毫秒） */
  let silenceMs = 0;

  /** 结算当前累积句：有声时长达标则封装 WAV 回调，不达标则并入下一句 */
  const flushSentence = (minVoicedMs: number) => {
    speaking = false;
    silenceMs = 0;
    if (voicedMs < minVoicedMs) return;
    const sampleRate = audioContext?.sampleRate;
    const chunks = bufferChunks;
    bufferChunks = [];
    voicedMs = 0;
    if (!sampleRate || chunks.length === 0) return;
    options.onSentence(encodeWav(chunks, sampleRate));
  };

  const releaseResources = () => {
    if (elapsedTimer !== null) {
      window.clearInterval(elapsedTimer);
      elapsedTimer = null;
    }
    if (processorNode) {
      processorNode.onaudioprocess = null;
      processorNode.disconnect();
      processorNode = null;
    }
    sourceNode?.disconnect();
    sourceNode = null;
    mediaStream?.getTracks().forEach((track) => track.stop());
    mediaStream = null;
    audioContext?.close().catch(() => undefined);
    audioContext = null;
    isRecording.value = false;
  };

  const start = async (): Promise<void> => {
    if (isRecording.value) return;

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      throw Object.assign(new Error(resolveMicError(err)), { cause: err });
    }

    try {
      const context = new AudioContext({ sampleRate: RECORD_SAMPLE_RATE });
      const source = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(PROCESSOR_BUFFER_SIZE, 1, 1);

      bufferChunks = [];
      voicedMs = 0;
      speaking = false;
      silenceMs = 0;

      processor.onaudioprocess = (event) => {
        const input = event.inputBuffer.getChannelData(0);
        const chunkMs = (input.length / context.sampleRate) * 1000;
        const voiced = computeRms(input) > SILENCE_RMS_THRESHOLD;

        // 有声块或语音段内的尾部静音都进缓冲；从未开口则不空转累积
        if (speaking || voiced) {
          bufferChunks.push(floatToInt16(input));
        }
        if (voiced) {
          speaking = true;
          silenceMs = 0;
          voicedMs += chunkMs;
        } else if (speaking) {
          silenceMs += chunkMs;
          if (silenceMs >= SILENCE_CUT_MS) {
            flushSentence(MIN_SENTENCE_SECONDS * 1000);
          }
        } else if (bufferChunks.length > 0) {
          // 短句挂起中：持续静音说明已说完，强制送出挂起的短句
          silenceMs += chunkMs;
          if (silenceMs >= PENDING_FLUSH_MS) {
            flushSentence(0);
          }
        }
        // 持续说话不停顿：超长强制切句
        if (speaking && voicedMs >= MAX_SENTENCE_SECONDS * 1000) {
          flushSentence(MIN_SENTENCE_SECONDS * 1000);
        }
      };

      // ScriptProcessor 必须连到 destination 才会持续回调；经零增益节点输出避免回声
      const silentGain = context.createGain();
      silentGain.gain.value = 0;
      source.connect(processor);
      processor.connect(silentGain);
      silentGain.connect(context.destination);

      audioContext = context;
      mediaStream = stream;
      sourceNode = source;
      processorNode = processor;
      elapsedSeconds.value = 0;
      isRecording.value = true;
      elapsedTimer = window.setInterval(() => {
        elapsedSeconds.value += 1;
      }, 1000);
    } catch (err) {
      stream.getTracks().forEach((track) => track.stop());
      console.error("Failed to start recording", err);
      throw Object.assign(new Error("无法启动录音，请重试"), { cause: err });
    }
  };

  const stop = (): void => {
    if (!isRecording.value) return;
    const sampleRate = audioContext?.sampleRate ?? RECORD_SAMPLE_RATE;
    const tailChunks = bufferChunks;
    const tailVoicedMs = voicedMs;
    releaseResources();
    // 停止即视为说完：尾句阈值放宽，低于杂音阈值的丢弃
    if (tailVoicedMs >= MIN_TAIL_SECONDS * 1000 && tailChunks.length > 0) {
      options.onSentence(encodeWav(tailChunks, sampleRate));
    }
    bufferChunks = [];
    voicedMs = 0;
    speaking = false;
    silenceMs = 0;
  };

  // 组件卸载时若仍在录音，直接释放（丢弃未停止的录音）
  onScopeDispose(() => {
    if (isRecording.value) {
      releaseResources();
    }
  });

  return { isRecording, elapsedSeconds, start, stop };
};
