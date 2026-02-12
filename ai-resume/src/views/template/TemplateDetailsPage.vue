<template>
  <div class="container mx-auto max-w-6xl px-4 pt-28 pb-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div
        class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"
      ></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500 mb-4">{{ error }}</p>
      <button
        @click="router.push('/templates')"
        class="text-primary-600 hover:underline"
      >
        返回列表
      </button>
    </div>

    <!-- Content -->
    <div
      v-else-if="template"
      class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
    >
      <!-- Left: Preview -->
      <div
        class="lg:col-span-5 lg:col-start-2 bg-slate-50 rounded-xl overflow-hidden shadow-md border border-slate-200 group"
      >
        <div class="relative overflow-hidden bg-slate-100 aspect-[210/297] p-4">
          <img
            :src="getFullImageUrl(template.previewImage)"
            :alt="template.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02] shadow-sm rounded"
          />
        </div>
      </div>
      const fullImageUrl = (url: string): string => { return
      import.meta.env.VITE_DEFAULT_AVATAR + url; };const fullImageUrl = (url:
      string): string => { return import.meta.env.VITE_DEFAULT_AVATAR + url;
      };const fullImageUrl = (url: string): string => { return
      import.meta.env.VITE_DEFAULT_AVATAR + url; };const fullImageUrl = (url:
      string): string => { return import.meta.env.VITE_DEFAULT_AVATAR + url; };
      <!-- Right: Info -->
      <div class="lg:col-span-5 flex flex-col">
        <div class="mb-6">
          <div class="flex items-center gap-3 mb-3">
            <span
              class="inline-flex items-center px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
            >
              {{ template.category }}
            </span>
            <span class="text-slate-400 text-xs">
              ID: {{ template._id.slice(-6) }}
            </span>
          </div>

          <h1 class="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
            {{ template.name }}
          </h1>

          <div class="flex items-center gap-5 text-slate-500 text-sm">
            <div class="flex items-center gap-1.5">
              <Calendar class="w-4 h-4" />
              <span>{{ formatDate(template.createdAt) }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <Users class="w-4 h-4" />
              <span>{{ template.usedCount }} 使用</span>
            </div>
          </div>
        </div>

        <!-- Author Info -->
        <div
          class="flex items-center gap-3 mb-6 p-3 bg-slate-50/50 rounded-lg border border-slate-100"
        >
          <div
            class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-lg"
          >
            {{ template.user.username.charAt(0).toUpperCase() }}
          </div>
          <div>
            <p class="text-sm font-medium text-slate-900">
              {{ template.user.username }}
            </p>
            <p class="text-xs text-slate-500">{{ template.user.email }}</p>
          </div>
        </div>

        <!-- Description -->
        <div
          class="prose prose-slate prose-sm mb-8 text-slate-600 leading-relaxed"
        >
          <p>
            这是一款专业的{{
              template.category
            }}简历模板，设计简洁大方，重点突出。
            适合各类求职场景，帮助您在众多候选人中脱颖而出。
          </p>
        </div>

        <!-- Actions -->
        <div class="mt-auto flex flex-col gap-3">
          <button
            @click="handleUseTemplate"
            class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md shadow-primary-600/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-sm"
          >
            <Edit3 class="w-4 h-4" />
            <span>立即使用该模板</span>
          </button>

          <button
            @click="router.push('/templates')"
            class="w-full bg-white hover:bg-slate-50 text-slate-600 font-medium py-3 px-6 rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            返回列表
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getTemplateByIdAPI } from "@/api/templates/templates";
import type { TemplateDetails } from "@/api/templates/type";
import { Calendar, Users, Edit3 } from "lucide-vue-next";
import { getFullImageUrl } from "@/utils/image";
import { formatDate } from "@/utils/day";

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const error = ref("");
const template = ref<TemplateDetails | null>(null);

const fetchTemplate = async () => {
  try {
    loading.value = true;
    error.value = "";
    const id = route.params.id as string;
    if (!id) throw new Error("Template ID is missing");

    const { data } = await getTemplateByIdAPI(id);
    template.value = data;
  } catch (err) {
    error.value = "获取模板详情失败，请稍后重试";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleUseTemplate = () => {
  if (!template.value) return;
  // TODO: Implement actual use template logic, e.g., redirect to editor
  // For now, we'll redirect to editor with query param
  router.push({
    path: "/editor",
    query: { templateId: template.value._id },
  });
};

onMounted(() => {
  fetchTemplate();
});
</script>
