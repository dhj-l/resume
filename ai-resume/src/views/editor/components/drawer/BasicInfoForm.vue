<script setup lang="ts">
import { computed, inject, type Ref } from "vue";

import { PlusOutlined } from "@ant-design/icons-vue";
import { Form, FormItem, Input, Row, Col, Upload, Select } from "ant-design-vue";

import { useResumeStore } from "@/stores/resumeStore";
import type { BasicInfo } from "@/stores/type";
import { uploadImage } from "@/utils/upload";

const props = defineProps<{
  data: BasicInfo;
}>();

const { setBasicInfo } = useResumeStore();

const drawerContentRef = inject<Ref<HTMLDivElement>>("drawerContentRef");
const getPopupContainer = (trigger: HTMLElement) => drawerContentRef?.value ?? trigger.parentNode;

// 处理表单变化
const update = (key: keyof BasicInfo, value: any) => {
  setBasicInfo({ [key]: value });
};

const genderOptions = [
  { label: "不填", value: "" },
  { label: "男", value: "男" },
  { label: "女", value: "女" },
];

const workYearOptions = [
  { label: "不填", value: "" },
  { label: "应届生", value: "应届生" },
  { label: "1年", value: "1年" },
  { label: "2年", value: "2年" },
  { label: "3年", value: "3年" },
  { label: "4年", value: "4年" },
  { label: "5年", value: "5年" },
  { label: "5-10年", value: "5-10年" },
  { label: "10年以上", value: "10年以上" },
];
const fullAvatar = computed(() => {
  return import.meta.env.VITE_DEFAULT_AVATAR + props.data.avatar;
});
const uploadHandle = async (file: File) => {
  const url = await uploadImage(file);
  update("avatar", url);
};
</script>

<template>
  <Form layout="vertical">
    <Row :gutter="24">
      <!-- 左侧表单区域 -->
      <Col :span="18">
        <Row :gutter="24">
          <Col :span="8">
            <FormItem label="姓名">
              <Input
                :value="data.name"
                placeholder="请输入姓名"
                @update:value="(val) => update('name', val)"
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="性别">
              <Select
                :value="data.gender"
                placeholder="请选择性别"
                :options="genderOptions"
                placement="topLeft"
                :get-popup-container="getPopupContainer"
                @update:value="(val) => update('gender', val)"
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="工作年限">
              <Select
                :value="data.workYear"
                placeholder="请选择工作年限"
                :options="workYearOptions"
                placement="topLeft"
                :get-popup-container="getPopupContainer"
                @update:value="(val) => update('workYear', val)"
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="年龄">
              <Input
                :value="data.age"
                placeholder="请输入年龄"
                @update:value="(val) => update('age', Number(val))"
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="手机号">
              <Input
                :value="data.phone"
                placeholder="请输入手机号"
                @update:value="(val) => update('phone', val)"
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="邮箱">
              <Input
                :value="data.email"
                placeholder="请输入邮箱"
                @update:value="(val) => update('email', val)"
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="政治面貌">
              <Input
                :value="data.politicalStatus"
                placeholder="例如：中共党员"
                @update:value="(val) => update('politicalStatus', val)"
              />
            </FormItem>
          </Col>
        </Row>
      </Col>

      <!-- 右侧头像区域 -->
      <Col :span="6">
        <FormItem label="简历照片">
          <div class="flex justify-center">
            <Upload
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              :before-upload="uploadHandle"
            >
              <img
                v-if="data.avatar"
                :src="fullAvatar"
                alt="avatar"
                class="w-full h-full object-cover rounded"
              />
              <div v-else>
                <PlusOutlined />
                <div class="ant-upload-text">上传头像</div>
              </div>
            </Upload>
          </div>
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>

<style scoped>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
</style>
