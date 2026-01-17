<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md">
      <div class="p-6">
        <h1 class="text-2xl font-bold text-blue-600">AI Resume</h1>
      </div>
      <nav class="mt-6">
        <router-link to="/dashboard" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-50 hover:text-blue-600">
          My Resumes
        </router-link>
        <router-link to="/dashboard/templates" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-50 hover:text-blue-600">
          Templates
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="flex justify-between items-center py-4 px-6 bg-white shadow-sm">
        <h2 class="text-xl font-semibold text-gray-800">Dashboard</h2>
        <div class="flex items-center">
          <button @click="logout" class="text-sm text-gray-600 hover:text-gray-900">Logout</button>
        </div>
      </header>
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function logout() {
  authStore.logout()
  router.push('/auth/login')
}
</script>
