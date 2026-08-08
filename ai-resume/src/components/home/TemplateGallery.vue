<template>
  <section class="py-24 bg-slate-50">
    <div class="container mx-auto px-4">
      <div class="mx-auto mb-14 max-w-2xl text-center">
        <span
          class="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold tracking-wide text-slate-600"
        >
          <LayoutTemplate class="h-3.5 w-3.5 text-primary-600" />
          简历模板
        </span>
        <h2 class="mt-5 text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
          挑一个喜欢的模板，马上开始
        </h2>
        <p class="mt-4 text-base text-slate-600 lg:text-lg">
          每套模板都经过排版优化，兼顾 A4 打印与在线投递。
        </p>
        <router-link
          to="/templates"
          class="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
        >
          查看全部模板
          <ArrowRight
            class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </router-link>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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

import { ArrowRight, LayoutTemplate } from "lucide-vue-next";
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
