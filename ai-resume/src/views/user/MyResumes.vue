<template>
  <a-layout class="min-h-screen">
    <a-layout-content class="bg-white">
      <div
        class="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-[80px] mt-20 py-12"
      >
        <div class="flex items-start justify-between gap-6">
          <div>
            <h1 class="text-[32px] font-[600] text-[#1a1a1a] mb-3">
              我的简历
            </h1>
            <p class="text-[#8c8c8c] text-[16px]">
              管理你创建的简历，支持编辑与删除操作
            </p>
          </div>
        </div>
      </div>

      <div class="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-[80px] pb-24">
        <div
          v-if="loading"
          class="flex justify-center items-center min-h-[400px]"
        >
          <a-spin size="large" tip="正在加载简历..." />
        </div>

        <div
          v-else-if="resumes.length > 0"
          class="grid grid-cols-1 min-[900px]:grid-cols-2 min-[1200px]:grid-cols-3 gap-x-8 gap-y-[32px]"
        >
          <div
            v-for="item in resumes"
            :key="item._id"
            class="group border border-[#f0f0f0] rounded-xl bg-white overflow-hidden transition-shadow hover:shadow-md"
          >
            <div class="p-6 flex flex-col gap-4">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <FileTextOutlined class="text-[#8c8c8c]" />
                    <h3
                      class="text-[18px] font-[600] text-[#1a1a1a] truncate"
                      :title="item.title"
                    >
                      {{ item.title || "未命名简历" }}
                    </h3>
                  </div>
                  <div class="mt-2 text-[13px] text-[#8c8c8c]">
                    <span>更新时间：</span>
                    <span>{{ formatTime(item) }}</span>
                  </div>
                </div>

                <a-tag v-if="item.isTemplate" color="blue">模板</a-tag>
              </div>

              <div class="flex items-center justify-end gap-2 pt-2">
                <a-button
                  type="primary"
                  :loading="actionLoadingId === item._id && actionType === 'edit'"
                  @click="handleEdit(item._id)"
                >
                  <template #icon><EditOutlined /></template>
                  编辑
                </a-button>
                <a-button
                  danger
                  :loading="
                    actionLoadingId === item._id && actionType === 'delete'
                  "
                  @click="handleDelete(item._id, item.title)"
                >
                  <template #icon><DeleteOutlined /></template>
                  删除
                </a-button>
              </div>
            </div>
          </div>
        </div>

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
                  >暂无简历</span
                >
                <span class="text-[#8c8c8c]"
                  >去模板市场创建一份你的第一份简历吧</span
                >
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
import { useRouter } from "vue-router";
import {
  DeleteOutlined,
  EditOutlined,
  FileOutlined,
  FileTextOutlined,
} from "@ant-design/icons-vue";
import { Empty, Modal, message } from "ant-design-vue";
import { getUserResumesAPI, deleteResumeAPI } from "@/api/resume/resume";
import type { UserResumeListItem } from "@/api/resume/type";
import { formatDate } from "@/utils/day";
import { useResumeStore } from "@/stores/resumeStore";

const router = useRouter();
const resumeStore = useResumeStore();
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

const resumes = ref<UserResumeListItem[]>([]);
const loading = ref(false);
const actionLoadingId = ref<string>("");
const actionType = ref<"edit" | "delete" | "">("");

const fetchResumes = async () => {
  loading.value = true;
  try {
    const { data } = await getUserResumesAPI();
    resumes.value = data;
  } finally {
    loading.value = false;
  }
};

const formatTime = (item: UserResumeListItem) => {
  const t = item.updatedAt ?? item.createdAt;
  return t ? formatDate(t, "YYYY-MM-DD HH:mm") : "-";
};

const handleEdit = async (id: string) => {
  actionLoadingId.value = id;
  actionType.value = "edit";
  try {
    await resumeStore.getResumeDetail(id);
    router.push("/editor");
  } finally {
    actionLoadingId.value = "";
    actionType.value = "";
  }
};

const handleDelete = (id: string, title: string) => {
  Modal.confirm({
    title: "确认删除该简历？",
    content: title ? `「${title}」删除后无法恢复` : "删除后无法恢复",
    okText: "删除",
    okType: "danger",
    cancelText: "取消",
    onOk: async () => {
      actionLoadingId.value = id;
      actionType.value = "delete";
      try {
        await deleteResumeAPI(id);
        resumes.value = resumes.value.filter((r) => r._id !== id);
        message.success("删除成功");
      } finally {
        actionLoadingId.value = "";
        actionType.value = "";
      }
    },
  });
};

onMounted(() => {
  fetchResumes();
});
</script>
