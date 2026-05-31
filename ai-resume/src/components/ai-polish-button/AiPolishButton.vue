<script setup lang="ts">
import { inject, ref, type Ref } from "vue";

import { Button, Popover, Input, message } from "ant-design-vue";
import { Sparkles } from "lucide-vue-next";

import { polishContentAPI } from "@/api/resume-ai/resume-ai";
import { useResumeStore } from "@/stores/resumeStore";
import type { ResumeData } from "@/stores/type";

interface Props {
  moduleKey: string;
  contentField: string;
  index?: number;
}

const props = defineProps<Props>();

const { updateModuleContent } = useResumeStore();

const drawerContentRef = inject<Ref<HTMLDivElement>>("drawerContentRef")!;
const getPopupContainer = (trigger: HTMLElement) =>
  (drawerContentRef.value ?? (trigger.parentNode as HTMLElement) ?? document.body) as HTMLElement;

const open = ref(false);
const description = ref("");
const loading = ref(false);

const handleConfirm = async () => {
  const store = useResumeStore();
  loading.value = true;
  try {
    const res = await polishContentAPI({
      resumeId: store.resumeData._id,
      key: props.moduleKey,
      index: props.index,
      description: description.value || undefined,
    });
    updateModuleContent(
      props.moduleKey as keyof ResumeData,
      props.contentField,
      res.data.afterContent,
      props.index,
    );
    message.success("AI润色完成");
    open.value = false;
  } catch {
    // Error already handled by http interceptor
  } finally {
    loading.value = false;
  }
};

const handleOpenChange = (visible: boolean) => {
  open.value = visible;
  if (!visible) {
    description.value = "";
  }
};
</script>

<template>
  <Popover
    :open="open"
    trigger="click"
    placement="topLeft"
    :get-popup-container="getPopupContainer"
    :overlay-inner-style="{ width: '320px' }"
    @update:open="handleOpenChange"
  >
    <template #content>
      <div class="space-y-5">
        <p class="text-sm font-medium text-gray-700">AI 润色</p>
        <Input.TextArea
          v-model:value="description"
          :rows="3"
          placeholder="请输入润色要求（可选），例如：让表达更专业、突出数据成果"
          :maxlength="200"
          show-count
        />
        <div class="flex justify-end gap-2">
          <Button size="small" class="whitespace-nowrap" @click="open = false">取消</Button>
          <Button
            type="primary"
            size="small"
            class="inline-flex items-center whitespace-nowrap"
            :loading="loading"
            @click="handleConfirm"
          >
            <template #icon>
              <Sparkles class="w-3.5 h-3.5 mr-1 shrink-0" />
            </template>
            确认润色
          </Button>
        </div>
      </div>
    </template>

    <Button size="small" type="link" class="!px-3 !h-12 whitespace-nowrap inline-flex items-center">
      <template #icon>
        <Sparkles class="w-4 h-4 text-purple-500 mr-1" />
      </template>
      <span class="text-purple-500 text-[15px]">AI润色</span>
    </Button>
  </Popover>
</template>
