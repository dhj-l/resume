<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  Modal,
  Form,
  FormItem,
  Input,
  Select,
  SelectOption,
  message,
} from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import { getDomCover, getElement } from "@/utils/dom";
import { uploadImage } from "@/utils/upload";
import { createTemplateAPI } from "@/api/templates/templates";
import { useResumeStore } from "@/stores/resumeStore";
import { storeToRefs } from "pinia";

const props = defineProps<{
  resumeTitle?: string;
}>();

const { resumeData } = storeToRefs(useResumeStore());
const { saveResume } = useResumeStore();

const isVisible = ref(false);
const confirmLoading = ref(false);
const formRef = ref();

const categoryOptions = [
  "技术",
  "产品",
  "设计",
  "运营",
  "市场",
  "人事",
  "行政",
  "财务",
  "通用",
];

const formState = reactive({
  name: "",
  category: "技术",
});

const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
  category: [
    { required: true, message: "请选择适用岗位类型", trigger: "change" },
  ],
};

const open = () => {
  formState.name = props.resumeTitle || "";
  isVisible.value = true;
};

const handleOk = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;

    // 获取当前简历封面
    const element = getElement(".resume-preview-wrapper");
    if (!element) {
      message.error("无法获取简历预览内容");
      return;
    }

    // 获取当前简历封面数据
    const coverFile = await getDomCover(element as HTMLElement);
    // 上传图片
    const previewImage = await uploadImage(coverFile);

    if (!previewImage) {
      message.error("封面上传失败");
      return;
    }

    // 保存当前简历以确保数据最新
    await saveResume();

    if (!resumeData.value._id) {
      message.error("请先保存简历");
      return;
    }

    // 调用创建模板接口
    await createTemplateAPI({
      name: formState.name,
      previewImage,
      category: formState.category,
      resumeId: resumeData.value._id,
    });

    message.success("模板发布成功");
    isVisible.value = false;
  } catch (error) {
    console.error("Publish failed:", error);
    message.error("发布失败，请重试");
  } finally {
    confirmLoading.value = false;
  }
};

const handleCancel = () => {
  isVisible.value = false;
};

defineExpose({
  open,
});
</script>

<template>
  <Modal
    v-model:visible="isVisible"
    title="发布为模板"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
  >
    <Form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <FormItem label="模板名称" name="name">
        <Input v-model:value="formState.name" placeholder="请输入模板名称" />
      </FormItem>
      <FormItem label="适用岗位" name="category">
        <Select v-model:value="formState.category">
          <SelectOption
            v-for="category in categoryOptions"
            :key="category"
            :value="category"
          >
            {{ category }}
          </SelectOption>
        </Select>
      </FormItem>
    </Form>
  </Modal>
</template>
