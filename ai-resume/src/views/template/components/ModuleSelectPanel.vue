<template>
  <div class="space-y-3">
    <div class="mb-2 font-medium text-slate-700">选择要生成的模块</div>
    <a-checkbox-group v-model:value="selected" class="grid grid-cols-2 gap-x-4 gap-y-2">
      <a-checkbox
        v-for="[key, label] in moduleOptions"
        :key="key"
        :value="key"
        :disabled="isFixedModule(key)"
      >
        {{ label }}
      </a-checkbox>
    </a-checkbox-group>
    <p class="text-xs text-slate-400 leading-relaxed">
      基础信息与求职意向为固定模块，不可取消。取消其他勾选可节省 Token 消耗并加快生成速度，
      至少需要选择一个模块。
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { SSE_MODULE_LABEL_MAP } from "@/api/resume-ai/type";
import { FIXED_MODULES, isFixedModule } from "@/views/editor/hooks/useActiveModules";

const props = defineProps<{
  modelValue: string[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void;
}>();

const moduleOptions = Object.entries(SSE_MODULE_LABEL_MAP);

const selected = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", [...new Set([...FIXED_MODULES, ...value])]),
});
</script>
