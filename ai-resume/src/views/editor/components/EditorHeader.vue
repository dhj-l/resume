<script setup lang="ts">
import {
  LeftOutlined,
  SaveOutlined,
  FilePdfOutlined,
  SettingOutlined,
  DownOutlined,
  UploadOutlined,
  SkinOutlined,
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
} from "ant-design-vue";
import { templateList } from "../templates";
import { useResumeStore } from "@/stores/resumeStore";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
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
const pdfName = computed(() => {
  const { basicInfo, jobIntention } = resumeData.value;
  return basicInfo.name + "-" + jobIntention?.jobIntention;
});
const props = withDefaults(defineProps<Props>(), {
  resumeTitle: "未命名简历",
});
const currentTemplateLabel = computed(() => {
  const template = templateList.find(
    (item) => item.value === resumeData.value.type,
  );
  return template?.label || "默认通用模板";
});
const router = useRouter();
const exportLoading = ref(false);
const publishModalRef = ref();

const handleOpenPublishModal = () => {
  publishModalRef.value?.open();
};

// TODO: 处理返回点击
const handleBack = () => {
  console.log("Back clicked");
  router.back();
};

const handleSave = async () => {
  const element = getElement(".resume-preview-wrapper");
  if (!element) return;

  const elementHeight = (element as HTMLElement).offsetHeight;
  const COVER_HEIGHT_THRESHOLD = 1200;

  const coverFile = await getDomCover(
    element as HTMLElement,
    elementHeight > COVER_HEIGHT_THRESHOLD ? COVER_HEIGHT_THRESHOLD : undefined,
  );

  const url = await uploadImage(coverFile);
  if (!url) return;
  setResumeDataString("cover", url);
  await saveResume();
  message.success("草稿保存成功");
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
        <span class="font-medium text-gray-800">{{ resumeTitle }}</span>
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
/* 自定义样式补充 */
</style>
