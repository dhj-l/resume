<template>
  <section class="py-24 bg-slate-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between mb-12">
        <h2 class="text-3xl font-bold text-slate-900">专业简历模板</h2>
        <router-link
          to="/templates"
          class="text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1 group"
        >
          查看全部
          <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </router-link>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <TemplateCard
          v-for="template in templates"
          :key="template._id"
          :template="template"
          @click="handleClick"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import { ArrowRight } from "lucide-vue-next";
import { useRouter } from "vue-router";

import { getTemplateListAPI } from "@/api/templates/templates";
import type { Template } from "@/api/templates/type";
import TemplateCard from "@/views/template/components/TemplateCard.vue";

const router = useRouter();
const page = ref(1);
const pageSize = ref(6);
const templates = ref<Template[]>([]);
const getTemplateList = async () => {
  const { data } = await getTemplateListAPI({
    page: page.value,
    pageSize: pageSize.value,
  });
  templates.value = data.list || [];
};
const handleClick = (id: string) => {
  router.push(`/templates/${id}`);
};
onMounted(() => {
  getTemplateList();
});
</script>
