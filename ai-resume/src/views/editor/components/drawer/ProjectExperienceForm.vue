<script setup lang="ts">
import { FormItem, Input, Button, Checkbox, DatePicker } from "ant-design-vue";
import {
  DeleteOutlined,
  PlusOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons-vue";
import type { ProjectExperience } from "@/stores/type";
import { h, ref } from "vue";
import BasicEditor from "@/components/basic-editor/basic-editor.vue";

const props = defineProps<{
  data: ProjectExperience[];
}>();
const lastEndTime = ref("");
const handleAdd = () => {
  props.data.push({
    title: "",
    description: "",
    content: "",
    startTime: "",
    endTime: "",
  });
};

const handleDelete = (index: number) => {
  props.data.splice(index, 1);
};

const handleMove = (index: number, direction: "up" | "down") => {
  console.log(index, direction, "移动");
};

const handleTillNowChange = (index: number, checked: boolean) => {
  if (checked) {
    lastEndTime.value = props.data[index]!.endTime as string;
    props.data[index]!.endTime = "至今";
  } else {
    props.data[index]!.endTime = lastEndTime.value;
  }
};
</script>

<template>
  <div class="space-y-6">
    <div
      v-for="(project, index) in data"
      :key="index"
      class="group relative bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
    >
      <div class="flex gap-4">
        <!-- 主体内容 -->
        <div class="flex-1 space-y-4">
          <!-- 第一行：基础信息 -->
          <div class="flex flex-wrap gap-4 items-start">
            <FormItem label="项目名称" class="!mb-0">
              <Input
                v-model:value="project.title"
                placeholder="请输入项目名称"
                style="width: 180px"
              />
            </FormItem>

            <FormItem label="项目角色" class="!mb-0">
              <Input
                v-model:value="project.description"
                placeholder="请输入项目角色"
                style="width: 180px"
              />
            </FormItem>

            <FormItem label="项目时间" class="!mb-0">
              <div class="flex items-center gap-2">
                <DatePicker
                  v-model:value="project.startTime"
                  picker="month"
                  value-format="YYYY-MM"
                  placeholder="开始时间"
                  style="width: 110px"
                />
                <span class="text-gray-400">-</span>
                <DatePicker
                  v-if="project.endTime !== '至今'"
                  v-model:value="project.endTime"
                  picker="month"
                  value-format="YYYY-MM"
                  placeholder="结束时间"
                  style="width: 110px"
                />
                <span v-else class="text-gray-500 text-sm px-2">至今</span>
                <Checkbox
                  :checked="project.endTime === '至今'"
                  @change="
                    (e: any) => handleTillNowChange(index, e.target.checked)
                  "
                  class="ml-2"
                  >至今</Checkbox
                >
              </div>
            </FormItem>
          </div>

          <!-- 第二行：富文本编辑器占位 -->
          <div class="rich-text-container">
            <div
              class="border border-gray-300 rounded min-h-[150px] bg-gray-50 text-gray-400 flex flex-col items-center justify-center space-y-2"
            >
              <BasicEditor class="w-full" v-model="project.content" />
            </div>
          </div>
        </div>

        <!-- 右侧操作按钮 -->
        <div class="flex flex-col gap-2 pt-1">
          <Button
            type="primary"
            size="small"
            :icon="h(ArrowDownOutlined)"
            @click="handleMove(index, 'down')"
            :disabled="index === data.length - 1"
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

    <Button type="dashed" block @click="handleAdd" class="mt-4">
      <template #icon><PlusOutlined /></template>
      添加项目经历
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
