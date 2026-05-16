<script setup lang="ts">
import { h, ref } from "vue";

import {
  DeleteOutlined,
  PlusOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons-vue";
import { FormItem, Input, Button, Checkbox, DatePicker } from "ant-design-vue";

import AiPolishButton from "@/components/ai-polish-button/AiPolishButton.vue";
import BasicEditor from "@/components/basic-editor/basic-editor.vue";
import { useResumeStore } from "@/stores/resumeStore";
import type { InternshipExperience } from "@/stores/type";

const props = defineProps<{
  data: InternshipExperience[];
}>();

const {
  addInternshipExperience,
  removeInternshipExperience,
  updateInternshipExperience,
  moveInternshipExperience,
} = useResumeStore();

const handleAdd = () => {
  addInternshipExperience();
};

const lastEndTime = ref("");

const handleDelete = (index: number) => {
  removeInternshipExperience(index);
};

const handleMove = (index: number, direction: "up" | "down") => {
  moveInternshipExperience(index, direction);
};

const update = (index: number, key: keyof InternshipExperience, value: any) => {
  updateInternshipExperience(index, { [key]: value });
};

const handleTillNowChange = (index: number, checked: boolean) => {
  if (checked) {
    lastEndTime.value = props.data[index]!.endTime as string;
    update(index, "endTime", "至今");
  } else {
    update(index, "endTime", lastEndTime.value);
  }
};
</script>

<template>
  <div class="space-y-6">
    <div
      v-for="(internship, index) in data"
      :key="index"
      class="group relative bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
    >
      <div class="flex gap-4">
        <!-- 主体内容 -->
        <div class="flex-1 space-y-4">
          <!-- 第一行：基础信息 -->
          <div class="flex flex-wrap gap-4 items-start">
            <FormItem label="公司名称" class="!mb-0">
              <Input
                :value="internship.companyName"
                placeholder="请输入公司名称"
                style="width: 180px"
                @update:value="(val) => update(index, 'companyName', val)"
              />
            </FormItem>

            <FormItem label="职位名称" class="!mb-0">
              <Input
                :value="internship.position"
                placeholder="请输入职位"
                style="width: 180px"
                @update:value="(val) => update(index, 'position', val)"
              />
            </FormItem>

            <FormItem label="在职时间" class="!mb-0">
              <div class="flex items-center gap-2">
                <DatePicker
                  :value="internship.startTime"
                  picker="month"
                  value-format="YYYY-MM"
                  placeholder="入职时间"
                  style="width: 110px"
                  @update:value="(val) => update(index, 'startTime', val)"
                />
                <span class="text-gray-400">-</span>
                <DatePicker
                  v-if="internship.endTime !== '至今'"
                  :value="internship.endTime"
                  picker="month"
                  value-format="YYYY-MM"
                  placeholder="离职时间"
                  style="width: 110px"
                  @update:value="(val) => update(index, 'endTime', val)"
                />
                <span v-else class="text-gray-500 text-sm px-2">至今</span>
                <Checkbox
                  :checked="internship.endTime === '至今'"
                  class="ml-2"
                  @change="(e: any) => handleTillNowChange(index, e.target.checked)"
                  >至今</Checkbox
                >
              </div>
            </FormItem>
          </div>

          <!-- 第二行：富文本编辑器占位 -->
          <div class="rich-text-container">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-gray-400">详细描述</span>
              <AiPolishButton
                module-key="internshipExperience"
                content-field="description"
                :index="index"
              />
            </div>
            <div
              class="border border-gray-300 rounded min-h-[150px] bg-gray-50 text-gray-400 flex flex-col items-center justify-center space-y-2"
            >
              <BasicEditor
                class="w-full"
                :model-value="internship.description"
                @update:model-value="(val) => update(index, 'description', val)"
              />
            </div>
          </div>
        </div>

        <!-- 右侧操作按钮 -->
        <div class="flex flex-col gap-2 pt-1">
          <Button
            type="primary"
            size="small"
            :icon="h(ArrowUpOutlined)"
            :disabled="index === 0"
            @click="handleMove(index, 'up')"
          >
            上移
          </Button>
          <Button
            type="primary"
            size="small"
            :icon="h(ArrowDownOutlined)"
            :disabled="index === data.length - 1"
            @click="handleMove(index, 'down')"
          >
            下移
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            :icon="h(DeleteOutlined)"
            @click="handleDelete(index)"
          >
            删除
          </Button>
        </div>
      </div>
    </div>

    <Button type="dashed" block class="mt-4" @click="handleAdd">
      <template #icon><PlusOutlined /></template>
      添加实习经历
    </Button>
  </div>
</template>

<style scoped>
/* 优化 FormItem 样式，使其更紧凑 */
:deep(.ant-form-item) {
  margin-bottom: 0;
}
:deep(.ant-form-item-label) {
  padding-bottom: 0;
  margin-right: 8px;
}
:deep(.ant-form-item-control-input) {
  min-height: auto;
}
</style>
