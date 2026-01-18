<script setup lang="ts">
import { ref } from 'vue';
import { Tabs, TabPane } from 'ant-design-vue';
import type { ResumeData } from '@/stores/type';
import BasicInfoForm from './BasicInfoForm.vue';
import EducationForm from './EducationForm.vue';

defineProps<{
  resumeData: ResumeData;
}>();

const activeKey = ref('basic');
</script>

<template>
  <div class="h-full flex flex-col bg-gray-50">
    <Tabs v-model:activeKey="activeKey" class="bg-white px-4 border-b border-gray-200">
      <TabPane key="basic" tab="基本信息" />
      <TabPane key="intention" tab="求职意向" />
      <TabPane key="education" tab="教育背景" />
      <TabPane key="work" tab="工作经验" />
      <TabPane key="project" tab="项目经历" />
      <TabPane key="skills" tab="技能特长" />
      <TabPane key="others" tab="其他模块" />
    </Tabs>
    
    <div class="flex-1 overflow-y-auto p-6">
      <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 min-h-full">
        <BasicInfoForm v-if="activeKey === 'basic'" :data="resumeData.basicInfo" />
        <EducationForm v-else-if="activeKey === 'education'" :data="resumeData.educationBackground" />
        
        <!-- 其他模块占位 -->
        <div v-else class="text-center py-12 text-gray-400">
          <p>{{ activeKey }} 模块表单开发中...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.ant-tabs-nav) {
  margin-bottom: 0;
}
</style>
