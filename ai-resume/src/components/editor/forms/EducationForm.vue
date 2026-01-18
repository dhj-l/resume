<template>
  <div class="education-form">
    <div v-for="(item, index) in data" :key="index" class="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50 relative">
      <div class="absolute right-2 top-2">
        <a-button type="text" danger size="small" @click="handleRemove(index)">
          删除
        </a-button>
      </div>
      
      <a-form layout="vertical" :model="item">
        <div class="grid grid-cols-2 gap-4">
          <a-form-item label="学校名称">
            <a-input v-model:value="item.schoolName" placeholder="请输入学校名称" />
          </a-form-item>
          <a-form-item label="学历层次">
            <a-input v-model:value="item.degree" placeholder="例如：本科" />
          </a-form-item>
          <a-form-item label="专业">
            <a-input v-model:value="item.major" placeholder="请输入专业" />
          </a-form-item>
          <a-form-item label="专业成绩">
             <a-input v-model:value="item.majorScore" placeholder="例如：GPA 3.8/4.0" />
          </a-form-item>
          <a-form-item label="入学时间">
            <a-input v-model:value="item.enrollmentTime" placeholder="2016-09" />
          </a-form-item>
          <a-form-item label="毕业时间">
            <a-input v-model:value="item.graduationTime" placeholder="2020-06" />
          </a-form-item>
          <a-form-item label="主修课程" class="col-span-2">
            <a-select
              v-model:value="item.majorCourses"
              mode="tags"
              style="width: 100%"
              placeholder="输入课程并回车添加"
            ></a-select>
          </a-form-item>
        </div>
      </a-form>
    </div>

    <a-button type="dashed" block @click="handleAdd">
      + 添加教育背景
    </a-button>
  </div>
</template>

<script setup lang="ts">
import type { EducationBackground } from '@/stores/type';

interface Props {
  data: EducationBackground[];
}

const props = defineProps<Props>();

const handleAdd = () => {
  // TODO: 添加新项
  console.log('Add education clicked');
};

const handleRemove = (index: number) => {
  // TODO: 删除项
  console.log('Remove education clicked', index);
};
</script>
