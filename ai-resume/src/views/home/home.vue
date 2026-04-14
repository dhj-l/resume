<template>
  <div>
    <HeroSection />
    <FeatureShowcase class="reveal" />
    <TemplateGallery class="reveal" />
    <DataTrust class="reveal" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import DataTrust from "@/components/home/DataTrust.vue";
import FeatureShowcase from "@/components/home/FeatureShowcase.vue";
import HeroSection from "@/components/home/HeroSection.vue";
import TemplateGallery from "@/components/home/TemplateGallery.vue";

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px",
    },
  );

  document.querySelectorAll(".reveal").forEach((el) => {
    observer.observe(el);
  });
});
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
