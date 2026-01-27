<script setup lang="ts">
import {
  FormItem,
  Input,
  Button,
  Select,
  Checkbox,
  DatePicker,
} from "ant-design-vue";
import {
  DeleteOutlined,
  PlusOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons-vue";
import type { EducationBackground } from "@/stores/type";
import { h, ref } from "vue";
import BasicEditor from "@/components/basic-editor/basic-editor.vue";

const props = defineProps<{
  data: EducationBackground[];
}>();

const degreeOptions = [
  { label: "初中", value: "初中" },
  { label: "高中", value: "高中" },
  { label: "大专", value: "大专" },
  { label: "本科", value: "本科" },
  { label: "硕士", value: "硕士" },
  { label: "博士", value: "博士" },
];
const lastEndTime = ref("");

// TODO: 添加教育经历
const handleAdd = () => {
  console.log("Add education");
};

// TODO: 删除教育经历
const handleDelete = (index: number) => {
  console.log("Delete education", index);
};

// TODO: 移动教育经历
const handleMove = (index: number, direction: "up" | "down") => {
  console.log("Move education", index, direction);
};

const handleTillNowChange = (index: number, checked: boolean) => {
  if (checked) {
    lastEndTime.value = props.data[index]!.graduationTime as string;
    props.data[index]!.graduationTime = "至今";
  } else {
    props.data[index]!.graduationTime = lastEndTime.value;
  }
};
</script>

<template>
  <div class="space-y-6">
    <div
      v-for="(edu, index) in data"
      :key="index"
      class="group relative bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
    >
      <div class="flex gap-4">
        <!-- 主体内容 -->
        <div class="flex-1 space-y-4">
          <!-- 第一行：基础信息 -->
          <div class="flex flex-wrap gap-4 items-start">
            <FormItem label="学校名称" class="!mb-0">
              <Input
                v-model:value="edu.schoolName"
                placeholder="请输入学校名称"
                style="width: 180px"
              />
            </FormItem>

            <FormItem label="所学专业" class="!mb-0">
              <Input
                v-model:value="edu.major"
                placeholder="请输入专业"
                style="width: 180px"
              />
            </FormItem>

            <FormItem label="就读时间" class="!mb-0">
              <div class="flex items-center gap-2">
                <DatePicker
                  v-model:value="edu.enrollmentTime"
                  picker="month"
                  value-format="YYYY-MM"
                  placeholder="入学时间"
                  style="width: 110px"
                />
                <span class="text-gray-400">-</span>
                <DatePicker
                  v-if="edu.graduationTime !== '至今'"
                  v-model:value="edu.graduationTime"
                  picker="month"
                  value-format="YYYY-MM"
                  placeholder="毕业时间"
                  style="width: 110px"
                />
                <span v-else class="text-gray-500 text-sm px-2">至今</span>
                <Checkbox
                  :checked="edu.graduationTime === '至今'"
                  @change="
                    (e: any) => handleTillNowChange(index, e.target.checked)
                  "
                  class="ml-2"
                  >至今</Checkbox
                >
              </div>
            </FormItem>

            <FormItem label="学历" class="!mb-0">
              <Select
                v-model:value="edu.degree"
                :options="degreeOptions"
                placeholder="请选择"
                style="width: 100px"
              />
            </FormItem>
          </div>

          <!-- 第二行：富文本编辑器占位 -->
          <div class="rich-text-container">
            <div
              class="border border-gray-300 rounded min-h-[150px] bg-gray-50 text-gray-400 flex flex-col items-center justify-center space-y-2"
            >
              <BasicEditor class="w-full" v-model="edu.content" />
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
      添加教育经历
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
