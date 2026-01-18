<template>
  <div class="module-tabs h-full flex flex-col">
    <a-tabs v-model:activeKey="activeKey" class="flex-1" :tabBarStyle="{ padding: '0 16px' }">
      <a-tab-pane key="basic" tab="基本信息">
        <div class="p-4 h-full overflow-y-auto">
          <BasicInfoForm :data="resumeData.basicInfo" />
        </div>
      </a-tab-pane>
      
      <a-tab-pane key="intention" tab="求职意向">
        <div class="p-4 h-full overflow-y-auto">
           <!-- 暂未实现完整表单，使用占位 -->
           <div class="text-gray-500 text-center py-8">求职意向编辑表单（待实现）</div>
        </div>
      </a-tab-pane>
      
      <a-tab-pane key="education" tab="教育背景">
        <div class="p-4 h-full overflow-y-auto">
          <EducationForm :data="resumeData.educationBackground" />
        </div>
      </a-tab-pane>
      
      <a-tab-pane key="work" tab="工作经验">
        <div class="p-4 h-full overflow-y-auto">
          <div class="text-gray-500 text-center py-8">工作经验编辑表单（待实现）</div>
        </div>
      </a-tab-pane>
      
      <a-tab-pane key="project" tab="项目经历">
        <div class="p-4 h-full overflow-y-auto">
          <div class="text-gray-500 text-center py-8">项目经历编辑表单（待实现）</div>
        </div>
      </a-tab-pane>
      
      <a-tab-pane key="skills" tab="技能特长">
        <div class="p-4 h-full overflow-y-auto">
          <div class="text-gray-500 text-center py-8">技能特长编辑表单（待实现）</div>
        </div>
      </a-tab-pane>
      
       <a-tab-pane key="certificates" tab="荣誉证书">
        <div class="p-4 h-full overflow-y-auto">
          <div class="text-gray-500 text-center py-8">荣誉证书编辑表单（待实现）</div>
        </div>
      </a-tab-pane>

      <a-tab-pane key="self" tab="自我评价">
        <div class="p-4 h-full overflow-y-auto">
          <div class="text-gray-500 text-center py-8">自我评价编辑表单（待实现）</div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ResumeData } from '@/stores/type';
import BasicInfoForm from '../forms/BasicInfoForm.vue';
import EducationForm from '../forms/EducationForm.vue';

interface Props {
  resumeData: ResumeData;
}

const props = defineProps<Props>();
const activeKey = ref('basic');
</script>

<style scoped>
:deep(.ant-tabs-content) {
  height: 100%;
}
</style>
