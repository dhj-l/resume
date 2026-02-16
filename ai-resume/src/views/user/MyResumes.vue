<template>
  <a-layout class="min-h-screen">
    <a-layout-content class="bg-white">
      <div class="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-[80px] mt-10 py-6">
        <div class="flex items-start justify-between gap-6">
          <div>
            <h1 class="text-[32px] font-[600] text-[#1a1a1a] mb-3">我的简历</h1>
            <p class="text-[#8c8c8c] text-[16px]">
              管理你创建的简历，支持编辑与删除操作
            </p>
          </div>
        </div>
      </div>

      <div class="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-[80px] pb-12">
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
          <ResumeCard
            v-for="item in resumes"
            :key="item._id"
            :resume="item"
            :edit-loading="
              actionLoadingId === item._id && actionType === 'edit'
            "
            :delete-loading="
              actionLoadingId === item._id && actionType === 'delete'
            "
            :copy-loading="
              actionLoadingId === item._id && actionType === 'copy'
            "
            @edit="handleEdit"
            @delete="(payload) => handleDelete(payload.id, payload.title)"
            @copy="handleCopy"
          />
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
                <span class="text-lg font-medium text-[#1a1a1a]">暂无简历</span>
                <span class="text-[#8c8c8c]"
                  >去模板市场创建一份你的第一份简历吧</span
                >
              </div>
            </template>
            <a-button
              type="primary"
              class="mt-6"
              @click="router.push('/templates')"
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
import { FileOutlined } from "@ant-design/icons-vue";
import { Empty, Modal, message } from "ant-design-vue";
import {
  getUserResumesAPI,
  deleteResumeAPI,
  copyResumeAPI,
} from "@/api/resume/resume";
import type { UserResumeListItem } from "@/api/resume/type";
import ResumeCard from "@/views/user/components/ResumeCard.vue";

const router = useRouter();
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

const resumes = ref<UserResumeListItem[]>([]);
const loading = ref(false);
const actionLoadingId = ref<string>("");
const actionType = ref<"edit" | "delete" | "copy" | "">("");

const fetchResumes = async (options?: { showLoading?: boolean }) => {
  const showLoading = options?.showLoading ?? true;
  if (showLoading) loading.value = true;
  try {
    const { data } = await getUserResumesAPI();
    resumes.value = data;
  } finally {
    if (showLoading) loading.value = false;
  }
};

const handleEdit = async (id: string) => {
  actionLoadingId.value = id;
  actionType.value = "edit";
  try {
    await router.push({
      path: "/editor",
      query: {
        id,
      },
    });
  } finally {
    actionLoadingId.value = "";
    actionType.value = "";
  }
};

const handleCopy = async (id: string) => {
  if (actionLoadingId.value) return;
  actionLoadingId.value = id;
  actionType.value = "copy";
  try {
    await copyResumeAPI(id);
    message.success("复制成功");
    await fetchResumes({ showLoading: false });
  } catch (error) {
    message.error("复制失败，请稍后重试");
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
        await fetchResumes({ showLoading: false });
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
