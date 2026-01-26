<script setup lang="ts">
import { Input, Button } from "ant-design-vue";
import {
  DeleteOutlined,
  PlusOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons-vue";
import { h } from "vue";

const props = defineProps<{
  data: string[];
}>();

const handleAdd = () => {
  props.data.push("");
};

const handleDelete = (index: number) => {
  props.data.splice(index, 1);
};

const handleMove = (index: number, direction: "up" | "down") => {
  console.log(index, direction, "移动");
};
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="(cert, index) in data"
      :key="index"
      class="group relative bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
    >
      <div class="flex gap-4 items-center">
        <!-- 主体内容 -->
        <div class="flex-1">
          <Input
            v-model:value="data[index]"
            placeholder="请输入证书名称，例如：英语六级"
            class="w-full"
          />
        </div>

        <!-- 右侧操作按钮 -->
        <div class="flex gap-2">
          <Button
            type="text"
            size="small"
            :icon="h(ArrowDownOutlined)"
            @click="handleMove(index, 'down')"
            :disabled="index === data.length - 1"
          />
          <Button
            type="text"
            danger
            size="small"
            :icon="h(DeleteOutlined)"
            @click="handleDelete(index)"
          />
        </div>
      </div>
    </div>

    <Button type="dashed" block @click="handleAdd" class="mt-4">
      <template #icon><PlusOutlined /></template>
      添加证书
    </Button>
  </div>
</template>
