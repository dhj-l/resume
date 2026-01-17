<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Choose a Template</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="i in 6" :key="i" class="bg-white rounded-lg shadow overflow-hidden group cursor-pointer border border-transparent hover:border-blue-500 transition">
        <div class="h-64 bg-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-gray-100 transition">
          Template Preview {{ i }}
        </div>
        <div class="p-4">
          <h3 class="font-bold text-lg">Professional Template {{ i }}</h3>
          <div class="mt-4 opacity-0 group-hover:opacity-100 transition flex gap-2">
            <el-button type="primary" class="w-full">Use Template</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
