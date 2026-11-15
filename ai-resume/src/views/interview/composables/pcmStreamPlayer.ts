/**
 * PCM16 增量播放引擎（Web Audio API）
 *
 * 把流式到达的 PCM16 小端字节按帧转成 AudioBuffer，用
 * AudioBufferSourceNode.start(nextStartTime) 链式调度，实现边收边播、
 * 帧间无缝衔接；支持停止（同步杀已调度节点）与释放（关闭 AudioContext）。
 *
 * 采样率：AudioBuffer 以数据自身采样率创建，浏览器输出时自动重采样，
 * 与 AudioContext 硬件采样率无关（meta.sampleRate 为准）。
 *
 * 自动播放策略：AudioContext 惰性创建，若被浏览器挂起（无用户手势），
 * 已调度音频等待 resume；调用方可按现有策略静默降级为手动点击播放。
 */
export class PcmStreamPlayer {
  private context: AudioContext | null = null;
  private sampleRate = 0;
  private channels = 1;
  /** 下一帧应开始的上下文时间（链式调度的唯一锚点） */
  private nextStartTime = 0;
  private activeSources: AudioBufferSourceNode[] = [];

  /** 音频数据是否已开始调度（含等待 resume 的挂起态） */
  get started(): boolean {
    return this.hasScheduled || this.nextStartTime > 0;
  }

  private get hasScheduled(): boolean {
    return this.activeSources.length > 0;
  }

  /**
   * 在用户手势内预创建 AudioContext（同步执行）
   *
   * 浏览器自动播放策略下，用户激活窗口内创建的上下文通常直接进入
   * running 态；调用方应在点击处理器同步调用本方法，随后 start() 复用。
   */
  precreate(): void {
    if (!this.context) {
      this.context = new AudioContext();
    }
  }

  /**
   * 初始化/恢复播放并设置音频参数（同步执行，不阻塞帧数据到达）
   * @param sampleRate PCM16 采样率（Hz），来自 meta 事件
   * @param channels 声道数
   */
  start(sampleRate: number, channels: number): void {
    if (!this.context) {
      this.context = new AudioContext();
    }
    this.sampleRate = sampleRate;
    this.channels = channels;
    if (this.context.state === "suspended") {
      void this.context.resume();
    }
    // 首次启动从当前时间 + 50ms 开始；切题重启时重置锚点
    this.nextStartTime = Math.max(this.context.currentTime + 0.05, this.nextStartTime);
  }

  /**
   * 追加一段 PCM16 并调度播放
   * @param int16 本帧的 PCM16 采样（小端已解码）
   */
  append(int16: Int16Array): void {
    if (!this.context || int16.length === 0) return;

    // 调度锚点只前进、不回拨：音频到达快于播放是常态（先缓冲再播）。
    // 任何"对齐当前时刻"的回拨都会让新片段与已调度的旧片段从同一时刻
    // 起播，叠成多路同时发声（曾导致完全听不清的 bug）。
    // 仅当调度整体落后于当前时刻（上下文挂起/标签页节流后恢复）时，
    // 清空旧调度并重排，避免恢复瞬间把积压片段一次性同时播出。
    if (this.nextStartTime < this.context.currentTime) {
      this.stop();
    }
    if (this.nextStartTime === 0) {
      this.nextStartTime = this.context.currentTime + 0.05;
    }

    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      const sample = int16[i] ?? 0;
      float32[i] = sample / 32768;
    }

    const buffer = this.context.createBuffer(this.channels, float32.length, this.sampleRate);
    buffer.copyToChannel(float32, 0);

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.context.destination);
    source.start(this.nextStartTime);
    this.nextStartTime += buffer.duration;
    this.activeSources.push(source);

    source.onended = () => {
      const index = this.activeSources.indexOf(source);
      if (index !== -1) {
        this.activeSources.splice(index, 1);
      }
    };
  }

  /** 已调度但尚未播完的剩余时长（毫秒）；供 done 收尾判断 */
  bufferedMs(): number {
    if (!this.context) return 0;
    return Math.max(0, (this.nextStartTime - this.context.currentTime) * 1000);
  }

  /** 立即停止：杀掉所有已调度节点并重置锚点 */
  stop(): void {
    for (const source of this.activeSources) {
      try {
        source.stop();
      } catch {
        // 已停止的节点（自然播完）忽略
      }
    }
    this.activeSources = [];
    this.nextStartTime = 0;
  }

  /** 停止并释放 AudioContext（页面卸载时调用） */
  async dispose(): Promise<void> {
    this.stop();
    if (this.context) {
      const context = this.context;
      this.context = null;
      await context.close().catch(() => {
        // 上下文已关闭时忽略
      });
    }
  }
}
