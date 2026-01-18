<script setup lang="ts">
import { Form, FormItem, Input, Row, Col, Upload } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import type { BasicInfo } from '@/stores/type';

defineProps<{
  data: BasicInfo;
}>();

// TODO: 处理表单变化
const handleChange = () => {
  console.log('Form changed');
};
</script>

<template>
  <Form layout="vertical">
    <Row :gutter="24">
      <Col :span="24" class="mb-6 flex justify-center">
        <Upload
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
        >
          <img v-if="data.avatar" :src="data.avatar" alt="avatar" class="w-full h-full object-cover rounded" />
          <div v-else>
            <PlusOutlined />
            <div class="ant-upload-text">上传头像</div>
          </div>
        </Upload>
      </Col>
      
      <Col :span="12">
        <FormItem label="姓名">
          <Input v-model:value="data.name" @change="handleChange" placeholder="请输入姓名" />
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem label="性别">
          <Input v-model:value="data.gender" @change="handleChange" placeholder="请输入性别" />
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem label="手机号">
          <Input v-model:value="data.phone" @change="handleChange" placeholder="请输入手机号" />
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem label="邮箱">
          <Input v-model:value="data.email" @change="handleChange" placeholder="请输入邮箱" />
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem label="工作年限">
          <Input v-model:value="data.workYear" @change="handleChange" placeholder="例如：3年" />
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem label="政治面貌">
          <Input v-model:value="data.politicalStatus" @change="handleChange" placeholder="例如：中共党员" />
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
