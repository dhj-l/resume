<template>
  <a-layout class="min-h-screen">
    <a-layout-content class="bg-white">
      <div class="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-[80px] mt-10 py-6">
        <div class="flex items-start justify-between gap-6">
          <div>
            <h1 class="text-[32px] font-[600] text-[#1a1a1a] mb-3">生成记录</h1>
            <p class="text-[#8c8c8c] text-[16px]">查看你的 AI 简历生成历史记录</p>
          </div>
        </div>
      </div>

      <div class="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-[80px] pb-12">
        <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
          <a-spin size="large" tip="正在加载记录..." />
        </div>

        <template v-else-if="records.length > 0">
          <div
            class="grid grid-cols-1 min-[900px]:grid-cols-2 min-[1200px]:grid-cols-3 gap-x-8 gap-y-[32px]"
          >
            <GenerationRecordCard
              v-for="item in records"
              :key="item._id"
              :record="item"
              @view="handleView"
            />
          </div>
          <div class="flex justify-center mt-8">
            <a-pagination
              v-model:current="page"
              v-model:page-size="pageSize"
              :total="total"
              :show-size-changer="false"
              :show-quick-jumper="true"
              :show-total="(total: number) => `共 ${total} 条`"
              @change="handlePageChange"
            />
          </div>
        </template>

        <div v-else class="flex items-center justify-center py-24 min-h-[400px]">
          <a-empty :image="simpleImage">
            <template #image>
              <FileOutlined class="text-6xl text-gray-300" />
            </template>
            <template #description>
              <div class="flex flex-col gap-2 mt-4">
                <span class="text-lg font-medium text-[#1a1a1a]">暂无生成记录</span>
                <span class="text-[#8c8c8c]">去模板市场开始生成你的第一份 AI 简历吧</span>
              </div>
            </template>
            <a-button type="primary" class="mt-6" @click="router.push('/templates')"
              >去选模板</a-button
            >
          </a-empty>
        </div>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

import { FileOutlined } from "@ant-design/icons-vue";
import { Empty } from "ant-design-vue";
import { useRouter } from "vue-router";

import { getGenerationRecordsAPI } from "@/api/resume-ai/resume-ai";
import type { GenerationRecord } from "@/api/resume-ai/type";
import GenerationRecordCard from "@/views/user/components/GenerationRecordCard.vue";

const router = useRouter();
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

const records = ref<GenerationRecord[]>([]);
const total = ref(0);
const loading = ref(false);
const page = ref(1);
const pageSize = ref(6);

const fetchRecords = async () => {
  loading.value = true;
  try {
    const { data } = await getGenerationRecordsAPI({
      page: page.value,
      pageSize: pageSize.value,
    });
    records.value = data.list;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
};

const handlePageChange = () => {
  fetchRecords();
};

const handleView = (id: string) => {
  router.push({ path: "/editor", query: { id } });
};

onMounted(() => {
  fetchRecords();
});
</script>
