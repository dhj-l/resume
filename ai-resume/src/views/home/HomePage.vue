<template>
  <div class="min-h-screen bg-white font-sans text-slate-900">
    <NavBar />

    <main>
      <HeroSection />
      <FeatureShowcase class="reveal" />
      <TemplateGallery class="reveal" />
      <DataTrust class="reveal" />
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import NavBar from "@/components/layout/NavBar.vue";
import Footer from "@/components/layout/Footer.vue";
import HeroSection from "@/components/home/HeroSection.vue";
import FeatureShowcase from "@/components/home/FeatureShowcase.vue";
import TemplateGallery from "@/components/home/TemplateGallery.vue";
import DataTrust from "@/components/home/DataTrust.vue";

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
    }
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
