<template>
  <a-layout-header class="editor-header flex items-center justify-between px-4 bg-white border-b border-gray-200 h-16 fixed w-full z-50">
    <!-- 左侧区域 -->
    <div class="left-section flex items-center space-x-4">
      <a-button type="text" @click="handleBack">
        <template #icon>
          <LeftOutlined />
        </template>
      </a-button>
      <div class="flex flex-col">
        <span class="text-sm text-gray-500">简历编辑</span>
        <span class="text-base font-medium">{{ resumeTitle }}</span>
      </div>
    </div>

    <!-- 中间区域 -->
    <div class="center-section flex items-center space-x-4">
      <a-select
        v-model:value="currentTemplate"
        style="width: 200px"
        @change="handleTemplateChange"
      >
        <a-select-option value="default">默认简约模板</a-select-option>
        <a-select-option value="modern">现代商务模板</a-select-option>
      </a-select>
      
      <a-space>
        <span>深色模式</span>
        <a-switch v-model:checked="isDarkMode" @change="toggleTheme" />
      </a-space>
    </div>

    <!-- 右侧区域 -->
    <div class="right-section flex items-center space-x-3">
      <a-button @click="saveDraft">保存草稿</a-button>
      <a-button type="primary" @click="exportPDF">导出 PDF</a-button>
      <a-button @click="openGlobalSettings">
        <template #icon>
          <SettingOutlined />
        </template>
        全局设置
      </a-button>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { LeftOutlined, SettingOutlined } from '@ant-design/icons-vue';

// 接收 props
interface Props {
  resumeTitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  resumeTitle: '未命名简历'
});

// 状态定义
const currentTemplate = ref('default');
const isDarkMode = ref(false);

// 事件处理占位函数
const handleBack = () => {
  // TODO: 处理返回逻辑
  console.log('Back button clicked');
};

const handleTemplateChange = (value: string) => {
  // TODO: 处理模板切换
  console.log('Template changed to:', value);
};

const toggleTheme = (checked: boolean) => {
  // TODO: 处理主题切换
  console.log('Theme toggled:', checked);
};

const saveDraft = () => {
  // TODO: 保存草稿
  console.log('Save draft clicked');
};

const exportPDF = () => {
  // TODO: 导出PDF
  console.log('Export PDF clicked');
};

const openGlobalSettings = () => {
  // TODO: 打开全局设置
  console.log('Global settings clicked');
};
</script>

<style scoped>
.editor-header {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}
</style>
