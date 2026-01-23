<script setup lang="ts">
import {
  LeftOutlined,
  SaveOutlined,
  FilePdfOutlined,
  SettingOutlined,
  DownOutlined,
  SkinOutlined,
} from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
import { Button, Dropdown, Menu, MenuItem, Space } from "ant-design-vue";
import { templateList } from "../templates";
import { useResumeStore } from "@/stores/resumeStore";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import type { templateType } from "./preview/type";

const { currentTemplate } = storeToRefs(useResumeStore());
const { setCurrentTemplate } = useResumeStore();
interface Props {
  resumeTitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  resumeTitle: "未命名简历",
});
const currentTemplateLabel = computed(() => {
  const template = templateList.find(
    (item) => item.value === currentTemplate.value,
  );
  return template?.label || "默认通用模板";
});
const router = useRouter();

// TODO: 处理返回点击
const handleBack = () => {
  console.log("Back clicked");
  router.back();
};

// TODO: 处理保存草稿
const handleSave = () => {
  console.log("Save clicked");
};

// TODO: 处理导出PDF
const handleExport = () => {
  console.log("Export PDF clicked");
};

// TODO: 处理全局样式设置
const handleGlobalStyle = () => {
  console.log("Global style settings clicked");
};

// TODO: 处理模板切换
const handleTemplateChange = (key: templateType) => {
  setCurrentTemplate(key);
};

// TODO: 处理主题切换
const handleThemeChange = () => {
  console.log("Theme toggle clicked");
};
</script>

<template>
  <header
    class="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50 shadow-sm"
  >
    <!-- 左侧：返回和标题 -->
    <div class="flex items-center space-x-4">
      <Button
        type="text"
        @click="handleBack"
        class="!flex !items-center !justify-center"
      >
        <template #icon><LeftOutlined /></template>
      </Button>
      <div class="flex flex-col">
        <span class="text-xs text-gray-500">简历编辑</span>
        <span class="font-medium text-gray-800">{{ resumeTitle }}</span>
      </div>
    </div>

    <!-- 中间：工具栏 -->
    <div class="flex items-center space-x-4">
      <Dropdown>
        <template #overlay>
          <Menu @click="({ key }) => handleTemplateChange(key as templateType)">
            <MenuItem
              v-for="item in templateList"
              :key="item.value"
              :title="item.label"
              >{{ item.label }}</MenuItem
            >
          </Menu>
        </template>
        <Button>
          当前模板: {{ currentTemplateLabel }}
          <DownOutlined />
        </Button>
      </Dropdown>

      <Button @click="handleThemeChange">
        <template #icon><SkinOutlined /></template>
        主题切换
      </Button>
    </div>

    <!-- 右侧：操作按钮 -->
    <Space>
      <Button @click="handleSave">
        <template #icon><SaveOutlined /></template>
        保存草稿
      </Button>
      <Button type="primary" @click="handleExport">
        <template #icon><FilePdfOutlined /></template>
        导出PDF
      </Button>
      <Button @click="handleGlobalStyle">
        <template #icon><SettingOutlined /></template>
        全局设置
      </Button>
    </Space>
  </header>
</template>

<style scoped>
/* 自定义样式补充 */
</style>
