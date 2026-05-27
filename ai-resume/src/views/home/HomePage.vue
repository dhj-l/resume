<template>
  <div class="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
    <NavBar />

    <main class="flex-grow relative overflow-hidden">
      <router-view v-slot="{ Component }">
        <GSAPTransition :preset="childPreset" mode="out-in">
          <component :is="Component" :key="route.path" />
        </GSAPTransition>
      </router-view>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { useRoute } from "vue-router";

import Footer from "@/components/layout/Footer.vue";
import NavBar from "@/components/layout/NavBar.vue";
import GSAPTransition from "@/components/common/GSAPTransition.vue";
import { resolvePresetFromMeta } from "@/utils/transitions";

const route = useRoute();

const childPreset = computed(() =>
  resolvePresetFromMeta(route.meta as Record<string, unknown>, true),
);
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
