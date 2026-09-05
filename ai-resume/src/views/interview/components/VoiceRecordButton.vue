<script setup lang="ts">
import { computed } from "vue";

import { Button, Tooltip, message } from "ant-design-vue";
import { Loader2, Mic, Square } from "lucide-vue-next";

import { useRecorder } from "../composables/useRecorder";
import { useSttQueue } from "../composables/useSttQueue";

const props = withDefaults(
  defineProps<{
    /** 外部禁用（面试结束 / AI 输出中 / 提交中）；录音进行中时仍可点击停止 */
    disabled?: boolean;
  }>(),
  { disabled: false },
);

const emit = defineEmits<{
  /** 某句识别文本增量（按说话顺序追加） */
  (e: "delta", text: string): void;
  /** 某句识别失败 */
  (e: "error", error: Error): void;
}>();

/** 录音最短有效时长（秒）：低于该值视为误触，不发起识别 */
const MIN_RECORD_SECONDS = 1;

const queue = useSttQueue({
  onDelta: (text) => emit("delta", text),
  onError: (error) => emit("error", error),
});

const { isRecording, elapsedSeconds, start, stop } = useRecorder({
  onSentence: (blob) => queue.enqueue(blob),
});

/** 停止录音后仍有句子在排队/识别 */
const transcribing = computed(() => queue.pendingCount.value > 0);

const elapsedDisplay = computed(() => {
  const mm = String(Math.floor(elapsedSeconds.value / 60)).padStart(2, "0");
  const ss = String(elapsedSeconds.value % 60).padStart(2, "0");
  return `${mm}:${ss}`;
});

const tooltipText = computed(() => {
  if (isRecording.value) return "点击结束录音";
  if (transcribing.value) return "语音识别中…";
  return "语音输入";
});

const handleClick = async () => {
  // 录音中再次点击：结束录音，尾句送识别
  if (isRecording.value) {
    if (elapsedSeconds.value < MIN_RECORD_SECONDS) {
      stop();
      message.warning("录音时间太短，请说完一句话后再结束");
      return;
    }
    stop();
    return;
  }

  if (props.disabled) return;
  try {
    await start();
  } catch (err) {
    message.error(err instanceof Error ? err.message : "无法启动录音，请重试");
  }
};

/** 清空识别队列并中止在途请求（发送回答时调用，之后可继续语音输入） */
const cancelAll = () => queue.cancelAll();

defineExpose({ cancelAll });
</script>

<template>
  <Tooltip :title="tooltipText">
    <Button
      shape="circle"
      class="voice-btn"
      :class="{ 'voice-btn--recording': isRecording }"
      :disabled="disabled && !isRecording"
      @click="handleClick"
    >
      <template #icon>
        <Loader2 v-if="transcribing" class="h-4 w-4 animate-spin" />
        <Square v-else-if="isRecording" class="h-4 w-4" />
        <Mic v-else class="h-4 w-4" />
      </template>
      <span v-if="isRecording" class="ml-2 text-xs tabular-nums">{{ elapsedDisplay }}</span>
    </Button>
  </Tooltip>
</template>

<style scoped>
/* antd 按钮是 inline-block + text-align:center，而 Tailwind preflight 把 svg 设为
   display:block，图标因此靠左；这里改为 flex 布局强制水平垂直居中。
   提高特异性（双类），避免被运行时注入的 antd 样式覆盖。 */
.voice-btn.ant-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 录音时按钮被拉宽，50% 圆角会渲染成椭圆；改用胶囊圆角保持两端半圆 */
.voice-btn.ant-btn.voice-btn--recording {
  width: auto;
  border-radius: 9999px;
  padding: 0 12px;
  color: #ef4444;
  border-color: #fca5a5;
  background-color: #fef2f2;
}

.voice-btn.ant-btn.voice-btn--recording:not(:disabled):hover {
  color: #dc2626;
  border-color: #f87171;
  background-color: #fee2e2;
}
</style>
