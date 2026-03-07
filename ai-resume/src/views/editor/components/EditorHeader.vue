<script setup lang="ts">
import {
  LeftOutlined,
  SaveOutlined,
  FilePdfOutlined,
  SettingOutlined,
  DownOutlined,
  UploadOutlined,
  SkinOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
import {
  Button,
  Dropdown,
  Menu,
  MenuItem,
  Popover,
  Space,
  message,
  Input,
} from "ant-design-vue";
import { templateList } from "../templates";
import { useResumeStore } from "@/stores/resumeStore";
import { storeToRefs } from "pinia";
import { computed, ref, nextTick, onMounted, onUnmounted } from "vue";
import type { templateType } from "./preview/type";
import GlobalStyleSettings from "./GlobalStyleSettings.vue";
import PublishTemplateModal from "./PublishTemplateModal.vue";
import {
  extractEffectiveCssForElement,
  getDomCover,
  getDomHtml,
  getElement,
} from "@/utils/dom";
import { downloadResumeAPI } from "@/api/resume/resume";
import { downloadPdf } from "@/utils/download";
import { uploadImage } from "@/utils/upload";

const { resumeData } = storeToRefs(useResumeStore());
const { setCurrentTemplate, saveResume, setResumeDataString } =
  useResumeStore();
interface Props {
  resumeTitle?: string;
}

const resumeTitle = computed(() => {
  return props.resumeTitle || "未命名简历";
});

const pdfName = computed(() => {
  const { basicInfo, jobIntention } = resumeData.value;
  return basicInfo.name + "-" + jobIntention?.jobIntention;
});
const props = withDefaults(defineProps<Props>(), {
  resumeTitle: "未命名简历",
});

const emit = defineEmits<{
  "update:resumeTitle": [value: string];
}>();

const currentTemplateLabel = computed(() => {
  const template = templateList.find(
    (item) => item.value === resumeData.value.type,
  );
  return template?.label || "默认通用模板";
});
const router = useRouter();
const exportLoading = ref(false);
const publishModalRef = ref();

const isEditingTitle = ref(false);
const editingTitleValue = ref("");
const titleInputRef = ref<InstanceType<typeof Input> | null>(null);

const handleOpenPublishModal = () => {
  publishModalRef.value?.open();
};

// TODO: 处理返回点击
const handleBack = () => {
  router.back();
};

const handleSave = async () => {
  await autoSave(true);
  message.success("草稿保存成功");
};

/**
 * 是否更新封面
 * @param isUpdateCover 是否更新封面
 */
const autoSave = async (isUpdateCover: boolean = false) => {
  //如果是更新封面，或者没有封面，才需要更新封面
  if (isUpdateCover || !resumeData.value.cover) {
    const element = getElement(".resume-preview-wrapper");
    if (!element) return;

    const elementHeight = (element as HTMLElement).offsetHeight;
    const COVER_HEIGHT_THRESHOLD = 1200;

    const coverFile = await getDomCover(
      element as HTMLElement,
      elementHeight > COVER_HEIGHT_THRESHOLD
        ? COVER_HEIGHT_THRESHOLD
        : undefined,
    );

    const url = await uploadImage(coverFile);
    if (url) {
      setResumeDataString("cover", url);
    } else {
      message.error("封面上传失败");
    }
  }
  await saveResume();
};

// TODO: 处理导出PDF
const handleExport = async () => {
  const element = getElement(".resume-preview-wrapper");
  if (!element) return;

  exportLoading.value = true;
  try {
    const html = getDomHtml(element);
    const css = extractEffectiveCssForElement(element);
    const exportCss =
      css +
      `
      @page {
        size: A4;
        margin: 0;
      }

      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      html, body {
        width: 210mm;
        height: 297mm;
        margin: 0;
        padding: 0;
      }

      .resume-page {
        width: 210mm !important;
        min-height: 297mm !important;
        height: auto !important;
        margin-bottom: 0 !important;
        box-shadow: none !important;
        page-break-after: always;
        page-break-inside: avoid;
      }

      .resume-page:last-child {
        page-break-after: auto;
      }

      .resume-section {
        page-break-inside: avoid;
      }
    `;
    const res: any = await downloadResumeAPI({
      html,
      css: exportCss,
    });
    // 调用下载函数
    downloadPdf(res, pdfName.value);
    message.success("导出成功");
  } catch (error) {
    console.error("Export failed:", error);
    message.error("导出失败");
  } finally {
    exportLoading.value = false;
  }
};

// TODO: 处理模板切换
const handleTemplateChange = (key: templateType) => {
  setCurrentTemplate(key);
};

// TODO: 处理主题切换
const handleThemeChange = () => {
  console.log("Theme toggle clicked");
};

const validateTitle = (title: string): string => {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    return "未命名简历";
  }
  return trimmedTitle;
};

const startEditingTitle = () => {
  editingTitleValue.value = resumeTitle.value;
  isEditingTitle.value = true;
};

const handleTransitionAfterEnter = () => {
  nextTick(() => {
    (titleInputRef.value as any)?.focus();
  });
};

const saveTitle = () => {
  const validatedTitle = validateTitle(editingTitleValue.value);
  if (validatedTitle !== resumeTitle.value) {
    emit("update:resumeTitle", validatedTitle);
  }
  isEditingTitle.value = false;
};

const cancelEditingTitle = () => {
  editingTitleValue.value = resumeTitle.value;
  isEditingTitle.value = false;
};

const handleTitleBlur = () => {
  saveTitle();
};

const handleTitleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    saveTitle();
  } else if (e.key === "Escape") {
    cancelEditingTitle();
  }
};

let timer: number | null = null;
onMounted(() => {
  timer = setInterval(() => {
    autoSave();
  }, 12000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<template>
  <header
    class="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50 shadow-sm"
  >
    <!-- 左侧：返回和标题 -->
    <div class="flex items-center space-x-4">
      <Button
        type="text"
        @click="handleBack"
        class="!flex !items-center !justify-center"
      >
        <template #icon><LeftOutlined /></template>
      </Button>
      <div class="flex flex-col">
        <span class="text-xs text-gray-500">简历编辑</span>
        <div class="relative">
          <Transition
            name="title-fade"
            mode="out-in"
            @after-enter="handleTransitionAfterEnter"
          >
            <div
              v-if="!isEditingTitle"
              @click="startEditingTitle"
              class="font-medium text-gray-800 truncate w-[220px] cursor-pointer hover:text-blue-600 transition-colors duration-200 flex items-center group"
            >
              <span class="truncate">{{ resumeTitle }}</span>
              <EditOutlined
                class="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs"
              />
            </div>
            <Input
              v-else
              v-model:value="editingTitleValue"
              class="w-[220px]"
              placeholder="输入简历标题"
              @blur="handleTitleBlur"
              @keydown="handleTitleKeydown"
              :maxlength="50"
              show-count
              :autofocus="true"
              ref="titleInputRef"
            />
          </Transition>
        </div>
      </div>
    </div>

    <!-- 中间：工具栏 -->
    <div class="flex items-center space-x-4">
      <Dropdown>
        <template #overlay>
          <Menu @click="({ key }) => handleTemplateChange(key as templateType)">
            <MenuItem
              v-for="item in templateList"
              :key="item.value"
              :title="item.label"
              >{{ item.label }}</MenuItem
            >
          </Menu>
        </template>
        <Button>
          当前模板: {{ currentTemplateLabel }}
          <DownOutlined />
        </Button>
      </Dropdown>

      <Button @click="handleThemeChange">
        <template #icon><SkinOutlined /></template>
        主题切换
      </Button>
    </div>

    <!-- 右侧：操作按钮 -->
    <Space>
      <Button @click="handleSave">
        <template #icon><SaveOutlined /></template>
        保存草稿
      </Button>
      <Button @click="handleOpenPublishModal">
        <template #icon><UploadOutlined /></template>
        发布为模板
      </Button>
      <Button type="primary" @click="handleExport" :loading="exportLoading">
        <template #icon><FilePdfOutlined /></template>
        导出PDF
      </Button>
      <Popover trigger="click" placement="bottomRight">
        <template #content>
          <GlobalStyleSettings />
        </template>
        <Button>
          <template #icon><SettingOutlined /></template>
          全局设置
        </Button>
      </Popover>
    </Space>

    <!-- Publish Template Modal -->
    <PublishTemplateModal
      ref="publishModalRef"
      :resumeTitle="props.resumeTitle"
    />
  </header>
</template>

<style scoped>
.title-fade-enter-active,
.title-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.title-fade-enter-from,
.title-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.title-fade-enter-to,
.title-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
