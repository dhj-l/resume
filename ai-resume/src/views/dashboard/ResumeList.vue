<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">My Resumes</h2>
      <el-button type="primary" @click="$router.push('/dashboard/templates')">Create New Resume</el-button>
    </div>
    
    <div v-if="resumeStore.isLoading" class="text-center py-10">
      <el-icon class="is-loading text-2xl"><Loading /></el-icon>
    </div>

    <div v-else-if="resumeStore.resumeList.length === 0" class="text-center py-20 bg-white rounded shadow">
      <p class="text-gray-500 text-lg mb-4">You haven't created any resumes yet.</p>
      <el-button type="primary" @click="$router.push('/dashboard/templates')">Get Started</el-button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="resume in resumeStore.resumeList" :key="resume.id" class="bg-white p-4 rounded shadow hover:shadow-lg transition">
        <div class="h-40 bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-400">
          Preview
        </div>
        <h3 class="font-bold text-lg mb-2">{{ resume.title }}</h3>
        <p class="text-sm text-gray-500 mb-4">Last updated: {{ resume.updatedAt }}</p>
        <div class="flex justify-between">
          <el-button size="small">Edit</el-button>
          <el-button size="small" type="danger" plain>Delete</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useResumeStore } from '@/stores/resume'
import { Loading } from '@element-plus/icons-vue'

const resumeStore = useResumeStore()

onMounted(() => {
  resumeStore.fetchResumes()
})
</script>
