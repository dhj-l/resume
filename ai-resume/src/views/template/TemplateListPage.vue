<template>
  <a-layout class="min-h-screen bg-[#f5f5f7]">
    <a-layout-content>
      <!-- Breadcrumb -->
      <div class="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-[80px] pt-6 pb-2">
        <a-breadcrumb separator=">">
          <a-breadcrumb-item>
            <router-link
              to="/"
              class="text-[#8c8c8c] hover:text-[#1677ff] transition-colors"
              >首页</router-link
            >
          </a-breadcrumb-item>
          <a-breadcrumb-item class="text-[#8c8c8c]">模板列表</a-breadcrumb-item>
        </a-breadcrumb>
      </div>

      <!-- Header Section -->
      <div
        class="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-[80px] py-12 text-center"
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
        <div
          v-if="templates.length > 0"
          class="grid grid-cols-1 min-[900px]:grid-cols-2 min-[1200px]:grid-cols-3 gap-x-8 gap-y-[32px]"
        >
          <TemplateCard
            v-for="template in templates"
            :key="template.id"
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

        <!-- Pagination Placeholder -->
        <!-- <div class="mt-12 flex justify-center"> ... </div> -->
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { FileOutlined } from "@ant-design/icons-vue";
import { Empty } from "ant-design-vue";
import TemplateCard from "./components/TemplateCard.vue";
import type { ResumeTemplate } from "./types";

const router = useRouter();
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

// Mock Data
const templates = ref<ResumeTemplate[]>([
  {
    id: "1",
    name: "简约专业版",
    previewImage: "https://placehold.co/800x500/EBF4FF/1677FF?text=Minimal+Pro",
    category: "通用",
    usedCount: 1234,
    createdAt: "2023-08-15",
  },
  {
    id: "2",
    name: "科技蓝风格",
    previewImage: "https://placehold.co/800x500/F0F9FF/0EA5E9?text=Tech+Blue",
    category: "技术岗",
    usedCount: 3456,
    createdAt: "2023-09-01",
  },
  {
    id: "3",
    name: "创意设计风",
    previewImage:
      "https://placehold.co/800x500/FFF1F2/E11D48?text=Creative+Design",
    category: "设计岗",
    usedCount: 2100,
    createdAt: "2023-09-10",
  },
  {
    id: "4",
    name: "商务精英版",
    previewImage:
      "https://placehold.co/800x500/F8FAFC/475569?text=Business+Elite",
    category: "运营岗",
    usedCount: 4500,
    createdAt: "2023-08-20",
  },
  {
    id: "5",
    name: "极简黑白",
    previewImage: "https://placehold.co/800x500/F3F4F6/111827?text=Clean+BW",
    category: "产品岗",
    usedCount: 1800,
    createdAt: "2023-10-01",
  },
  {
    id: "6",
    name: "学术研究版",
    previewImage: "https://placehold.co/800x500/ECFDF5/059669?text=Academic",
    category: "科研岗",
    usedCount: 980,
    createdAt: "2023-09-25",
  },
]);

const handleTemplateClick = (id: string) => {
  router.push(`/templates/${id}`);
};
</script>

<style scoped>
/* Ant Design Override for Breadcrumb links if specific styles needed beyond Tailwind */
:deep(.ant-breadcrumb) {
  font-size: 14px;
}
</style>
