<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white shadow">
      <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div class="text-xl font-bold">AI Resume</div>
        <div>
          <router-link to="/auth/login" class="text-gray-600 hover:text-gray-900 mr-4">Login</router-link>
          <router-link to="/auth/register" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Get Started</router-link>
        </div>
      </nav>
    </header>
    <main class="flex-grow">
      <router-view />
    </main>
    <footer class="bg-gray-800 text-white py-8">
      <div class="container mx-auto px-4 text-center">
        &copy; 2024 AI Resume. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
</script>
