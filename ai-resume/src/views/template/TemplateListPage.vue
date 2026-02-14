<template>
  <a-layout class="min-h-screen">
    <a-layout-content class="bg-white">
      <!-- Header Section -->
      <div
        class="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-[80px] mt-20 py-12 text-center"
      >
        <h1 class="text-[32px] font-[600] text-[#1a1a1a] mb-3">专业简历模板</h1>
        <p class="text-[#8c8c8c] text-[16px]">
          选择适合您的模板，快速创建专业简历
        </p>

        <!-- Extension Points: Search, Filter, Sort placeholders -->
        <!-- <div class="mt-8 flex justify-center gap-4"> ... </div> -->
      </div>

      <!-- Template Grid -->
      <div class="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-[80px] pb-24">
        <!-- Loading State -->
        <div
          v-if="loading"
          class="flex justify-center items-center min-h-[400px]"
        >
          <a-spin size="large" tip="正在加载模板..." />
        </div>

        <div
          v-else-if="templates.length > 0"
          class="grid grid-cols-1 min-[900px]:grid-cols-2 min-[1200px]:grid-cols-3 gap-x-8 gap-y-[32px]"
        >
          <TemplateCard
            v-for="template in templates"
            :key="template._id"
            :template="template"
            @click="handleTemplateClick"
          />
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="flex items-center justify-center py-24 min-h-[400px]"
        >
          <a-empty :image="simpleImage">
            <template #image>
              <FileOutlined class="text-6xl text-gray-300" />
            </template>
            <template #description>
              <div class="flex flex-col gap-2 mt-4">
                <span class="text-lg font-medium text-[#1a1a1a]"
                  >暂无可用模板</span
                >
                <span class="text-[#8c8c8c]"
                  >我们正在努力准备更多精美模板，敬请期待</span
                >
              </div>
            </template>
            <a-button type="primary" class="mt-6" @click="$router.push('/')"
              >返回首页</a-button
            >
          </a-empty>
        </div>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { FileOutlined } from "@ant-design/icons-vue";
import { Empty } from "ant-design-vue";
import TemplateCard from "./components/TemplateCard.vue";
import { getTemplateListAPI } from "@/api/templates/templates";
import type { Template } from "@/api/templates/type";

const router = useRouter();
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

const templates = ref<Template[]>([]);
const loading = ref(false);

const fetchTemplates = async () => {
  try {
    loading.value = true;
    const { data } = await getTemplateListAPI({
      page: 1,
      pageSize: 10,
    });
    templates.value = data.list;
  } finally {
    loading.value = false;
  }
};

const handleTemplateClick = (id: string) => {
  router.push(`/templates/${id}`);
};

onMounted(() => {
  fetchTemplates();
});
</script>

<style scoped>
/* Ant Design Override for Breadcrumb links if specific styles needed beyond Tailwind */
:deep(.ant-breadcrumb) {
  font-size: 14px;
}
</style>
