<script setup lang="ts">
/**
 * 对话气泡头像
 *
 * 面试官（AI，渐变底 + 机器人图标）与候选人（姓名首字母，浅灰底）两种形态，
 * 原先在消息列表与「AI 正在思考」占位处各写一份样式类串，集中到此避免漂移。
 */
import { RobotOutlined } from "@ant-design/icons-vue";

withDefaults(
  defineProps<{
    /** 消息角色：interviewer=AI 面试官 / candidate=用户 */
    role: "interviewer" | "candidate";
    /** 候选人头像展示的首字母（role=candidate 时使用） */
    initial?: string;
  }>(),
  { initial: "U" },
);
</script>

<template>
  <div
    class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full shadow-sm"
    :class="
      role === 'candidate'
        ? 'border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-500'
        : 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white'
    "
  >
    <span v-if="role === 'candidate'">{{ initial }}</span>
    <RobotOutlined v-else />
  </div>
</template>
