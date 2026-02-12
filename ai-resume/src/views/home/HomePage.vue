<template>
  <div class="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
    <NavBar />

    <main class="flex-grow">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/layout/NavBar.vue";
import Footer from "@/components/layout/Footer.vue";
</script>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.reveal.active {
  opacity: 1;
  transform: translateY(0);
}
</style>
