<script setup lang="ts">
import {
  Form,
  FormItem,
  Input,
  Row,
  Col,
  Upload,
  Select,
} from "ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import type { BasicInfo } from "@/stores/type";

defineProps<{
  data: BasicInfo;
}>();

// TODO: 处理表单变化
const handleChange = () => {
  console.log("Form changed");
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
                v-model:value="data.name"
                @change="handleChange"
                placeholder="请输入姓名"
              />
            </FormItem>
          </Col>
          <Col :span="8" v-if="data.gender">
            <FormItem label="性别">
              <Select
                v-model:value="data.gender"
                @change="handleChange"
                placeholder="请选择性别"
                :options="genderOptions"
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="工作年限">
              <Select
                v-model:value="data.workYear"
                @change="handleChange"
                placeholder="请选择工作年限"
                :options="workYearOptions"
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="年龄">
              <Input
                v-model:value.number="data.age"
                @change="handleChange"
                placeholder="请输入年龄"
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="手机号">
              <Input
                v-model:value="data.phone"
                @change="handleChange"
                placeholder="请输入手机号"
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="邮箱">
              <Input
                v-model:value="data.email"
                @change="handleChange"
                placeholder="请输入邮箱"
              />
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="政治面貌">
              <Input
                v-model:value="data.politicalStatus"
                @change="handleChange"
                placeholder="例如：中共党员"
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
            >
              <img
                v-if="data.avatar"
                :src="data.avatar"
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
