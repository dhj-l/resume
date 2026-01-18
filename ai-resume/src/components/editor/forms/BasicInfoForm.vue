<template>
  <a-form layout="vertical" :model="data">
    <div class="grid grid-cols-2 gap-4">
      <a-form-item label="姓名">
        <a-input v-model:value="data.name" placeholder="请输入姓名" @change="handleChange" />
      </a-form-item>
      <a-form-item label="性别">
        <a-select v-model:value="data.gender" @change="handleChange">
          <a-select-option value="男">男</a-select-option>
          <a-select-option value="女">女</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="手机号">
        <a-input v-model:value="data.phone" placeholder="请输入手机号" @change="handleChange" />
      </a-form-item>
      <a-form-item label="邮箱">
        <a-input v-model:value="data.email" placeholder="请输入邮箱" @change="handleChange" />
      </a-form-item>
      <a-form-item label="工作年限">
        <a-input v-model:value="data.workYear" placeholder="例如：3年" @change="handleChange" />
      </a-form-item>
      <a-form-item label="政治面貌">
        <a-input v-model:value="data.politicalStatus" placeholder="例如：中共党员" @change="handleChange" />
      </a-form-item>
      <a-form-item label="头像URL" class="col-span-2">
        <a-input v-model:value="data.avatar" placeholder="请输入头像链接" @change="handleChange" />
      </a-form-item>
    </div>
  </a-form>
</template>

<script setup lang="ts">
import type { BasicInfo } from '@/stores/type';

interface Props {
  data: BasicInfo;
}

const props = defineProps<Props>();

const handleChange = () => {
  // TODO: 处理表单变化
  console.log('Basic Info form changed');
};
</script>
