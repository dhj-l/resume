import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useResumeStore = defineStore('resume', () => {
  const resumeList = ref<any[]>([]) // Replace 'any' with Resume type
  const isLoading = ref(false)

  async function fetchResumes() {
    isLoading.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      resumeList.value = [] // Mock data
    } finally {
      isLoading.value = false
    }
  }

  return { resumeList, isLoading, fetchResumes }
})
