<template>
  <div class="resume-section job-intention p-4 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border border-transparent hover:border-blue-200 rounded-sm" @click="handleClick">
    <div class="flex items-center gap-4 text-sm">
      <div class="font-bold text-gray-700 min-w-[80px]">求职意向</div>
      <div class="flex gap-8">
        <div>
          <span class="text-gray-500 mr-2">期望职位：</span>
          <span class="text-gray-900">{{ data.jobIntention }}</span>
        </div>
        <div>
          <span class="text-gray-500 mr-2">意向城市：</span>
          <span class="text-gray-900">{{ data.intentionCity }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { JobIntention } from '@/stores/type';

interface Props {
  data: JobIntention;
}

const props = defineProps<Props>();

const handleClick = () => {
  // TODO: 处理点击
  console.log('Job Intention section clicked');
};
</script>
