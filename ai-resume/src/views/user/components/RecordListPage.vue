<template>
  <a-layout class="min-h-screen">
    <a-layout-content class="bg-white">
      <div class="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-[80px] mt-10 py-6">
        <div class="flex items-start justify-between gap-6">
          <div>
            <h1 class="text-[32px] font-[600] text-[#1a1a1a] mb-3">{{ title }}</h1>
            <p class="text-[#8c8c8c] text-[16px]">{{ subtitle }}</p>
          </div>
        </div>
      </div>

      <div class="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-[80px] pb-12">
        <div class="flex flex-wrap items-center gap-3 mb-8">
          <a-input-search
            v-model:value="keyword"
            :placeholder="searchPlaceholder || '搜索关键词'"
            allow-clear
            class="w-full max-w-[320px]"
            @search="handleSearch"
          />
          <a-select
            v-model:value="status"
            :options="statusOptions"
            placeholder="全部状态"
            allow-clear
            class="w-[140px]"
            @change="handleStatusChange"
          />
          <a-button @click="handleReset">重置</a-button>
        </div>

        <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
          <a-spin size="large" tip="正在加载记录..." />
        </div>

        <template v-else-if="records.length > 0">
          <div
            class="grid grid-cols-1 min-[900px]:grid-cols-2 min-[1200px]:grid-cols-3 gap-x-8 gap-y-[32px]"
          >
            <template v-for="item in records" :key="item._id">
              <slot
                name="card"
                :item="item as T"
                :remove="handleDelete"
                :deleting="deletingId === item._id"
              />
            </template>
          </div>
          <div class="flex justify-center mt-8">
            <a-pagination
              v-model:current="page"
              v-model:page-size="pageSize"
              :total="total"
              :show-size-changer="false"
              :show-quick-jumper="true"
              :show-total="(total: number) => `共 ${total} 条`"
              @change="loadRecords"
            />
          </div>
        </template>

        <div v-else class="flex items-center justify-center py-24 min-h-[400px]">
          <a-empty :image="simpleImage">
            <template #image>
              <component :is="emptyIcon" v-if="emptyIcon" class="text-6xl text-gray-300" />
            </template>
            <template #description>
              <div class="flex flex-col gap-2 mt-4">
                <span class="text-lg font-medium text-[#1a1a1a]">{{ emptyTitle }}</span>
                <span v-if="emptyDescription" class="text-[#8c8c8c]">{{ emptyDescription }}</span>
              </div>
            </template>
            <a-button v-if="emptyActionPath" type="primary" class="mt-6" @click="handleEmptyAction">
              {{ emptyActionText || "去看看" }}
            </a-button>
          </a-empty>
        </div>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts" generic="T extends { _id: string }">
import { onMounted, ref, type Component } from "vue";

import { Empty, Modal, message } from "ant-design-vue";
import { useRouter } from "vue-router";

import type { RecordQueryParams } from "@/api/resume-ai/type";

interface StatusOption {
  label: string;
  value: string;
}

interface Props {
  title: string;
  subtitle: string;
  searchPlaceholder?: string;
  statusOptions: StatusOption[];
  fetchRecords: (params: RecordQueryParams) => Promise<{
    data: { list: T[]; total: number; page: number; pageSize: number; totalPages: number };
  }>;
  deleteRecord?: (id: string) => Promise<unknown>;
  emptyIcon?: Component;
  emptyTitle: string;
  emptyDescription?: string;
  emptyActionText?: string;
  emptyActionPath?: string;
}

const props = defineProps<Props>();

defineSlots<{
  card(props: { item: T; remove: (item: T) => void; deleting: boolean }): void;
}>();

const router = useRouter();
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

const records = ref<T[]>([]);
const total = ref(0);
const loading = ref(false);
const page = ref(1);
const pageSize = ref(6);
const keyword = ref("");
const status = ref<string | undefined>(undefined);
const deletingId = ref<string | null>(null);

const loadRecords = async () => {
  loading.value = true;
  try {
    const { data } = await props.fetchRecords({
      page: page.value,
      pageSize: pageSize.value,
      status: status.value || undefined,
      keyword: keyword.value.trim() || undefined,
    });
    records.value = data.list;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  page.value = 1;
  loadRecords();
};

const handleStatusChange = () => {
  page.value = 1;
  loadRecords();
};

const handleReset = () => {
  keyword.value = "";
  status.value = undefined;
  page.value = 1;
  loadRecords();
};

const handleDelete = (item: T) => {
  const deleteRecord = props.deleteRecord;
  if (!deleteRecord) return;
  Modal.confirm({
    title: "删除记录",
    content: "删除后无法恢复，确定删除该条记录吗？",
    okText: "删除",
    okType: "danger",
    cancelText: "取消",
    onOk: async () => {
      deletingId.value = item._id;
      try {
        await deleteRecord(item._id);
        message.success("删除成功");
        if (records.value.length === 1 && page.value > 1) {
          page.value -= 1;
        }
        await loadRecords();
      } catch {
        message.error("删除失败");
      } finally {
        deletingId.value = null;
      }
    },
  });
};

const handleEmptyAction = () => {
  if (props.emptyActionPath) {
    router.push(props.emptyActionPath);
  }
};

onMounted(() => {
  loadRecords();
});
</script>
