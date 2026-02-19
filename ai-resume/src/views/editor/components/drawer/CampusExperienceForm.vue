<script setup lang="ts">
import { FormItem, Input, Button, Checkbox, DatePicker } from "ant-design-vue";
import {
  DeleteOutlined,
  PlusOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons-vue";
import type { CampusExperience } from "@/stores/type";
import { h, ref } from "vue";
import BasicEditor from "@/components/basic-editor/basic-editor.vue";
import { useResumeStore } from "@/stores/resumeStore";

const props = defineProps<{
  data: CampusExperience[];
}>();

const {
  addCampusExperience,
  removeCampusExperience,
  updateCampusExperience,
  moveCampusExperience,
} = useResumeStore();

const lastEndTime = ref("");
const handleAdd = () => {
  addCampusExperience();
};

const handleDelete = (index: number) => {
  removeCampusExperience(index);
};

const handleMove = (index: number, direction: "up" | "down") => {
  moveCampusExperience(index, direction);
};

const update = (index: number, key: keyof CampusExperience, value: any) => {
  updateCampusExperience(index, { [key]: value });
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
      v-for="(experience, index) in data"
      :key="index"
      class="group relative bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
    >
      <div class="flex gap-4">
        <!-- 主体内容 -->
        <div class="flex-1 space-y-4">
          <!-- 第一行：基础信息 -->
          <div class="flex flex-wrap gap-4 items-start">
            <FormItem label="经历名称" class="!mb-0">
              <Input
                :value="experience.title"
                @update:value="(val) => update(index, 'title', val)"
                placeholder="请输入经历名称"
                style="width: 180px"
              />
            </FormItem>

            <FormItem label="经历描述" class="!mb-0">
              <Input
                :value="experience.description"
                @update:value="(val) => update(index, 'description', val)"
                placeholder="请输入经历描述"
                style="width: 180px"
              />
            </FormItem>

            <FormItem label="经历时间" class="!mb-0">
              <div class="flex items-center gap-2">
                <DatePicker
                  :value="experience.startTime"
                  @update:value="(val) => update(index, 'startTime', val)"
                  picker="month"
                  value-format="YYYY-MM"
                  placeholder="开始时间"
                  style="width: 110px"
                />
                <span class="text-gray-400">-</span>
                <DatePicker
                  v-if="experience.endTime !== '至今'"
                  :value="experience.endTime"
                  @update:value="(val) => update(index, 'endTime', val)"
                  picker="month"
                  value-format="YYYY-MM"
                  placeholder="结束时间"
                  style="width: 110px"
                />
                <span v-else class="text-gray-500 text-sm px-2">至今</span>
                <Checkbox
                  :checked="experience.endTime === '至今'"
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
              <BasicEditor
                class="w-full"
                :modelValue="experience.content"
                @update:modelValue="(val) => update(index, 'content', val)"
              />
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
      添加校园经历
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
