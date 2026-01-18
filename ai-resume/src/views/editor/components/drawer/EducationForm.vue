<script setup lang="ts">
import { Form, FormItem, Input, Row, Col, Button, DatePicker, Card, Space } from 'ant-design-vue';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import type { EducationBackground } from '@/stores/type';

defineProps<{
  data: EducationBackground[];
}>();

// TODO: 添加教育经历
const handleAdd = () => {
  console.log('Add education');
};

// TODO: 删除教育经历
const handleDelete = (index: number) => {
  console.log('Delete education', index);
};
</script>

<template>
  <div class="space-y-6">
    <div v-for="(edu, index) in data" :key="index">
      <Card :title="`教育经历 ${index + 1}`" size="small" :bordered="true">
        <template #extra>
          <Button type="text" danger @click="handleDelete(index)">
            <template #icon><DeleteOutlined /></template>
            删除
          </Button>
        </template>
        
        <Form layout="vertical">
          <Row :gutter="16">
            <Col :span="12">
              <FormItem label="学校名称">
                <Input v-model:value="edu.schoolName" placeholder="请输入学校名称" />
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem label="学历">
                <Input v-model:value="edu.degree" placeholder="例如：本科" />
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem label="专业">
                <Input v-model:value="edu.major" placeholder="请输入专业" />
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem label="成绩排名">
                <Input v-model:value="edu.majorScore" placeholder="例如：Top 10%" />
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem label="入学时间">
                <Input v-model:value="edu.enrollmentTime" placeholder="YYYY-MM" />
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem label="毕业时间">
                <Input v-model:value="edu.graduationTime" placeholder="YYYY-MM" />
              </FormItem>
            </Col>
            <Col :span="24">
              <FormItem label="主修课程">
                <!-- 静态展示，实际应为标签输入组件 -->
                <Input :value="edu.majorCourses?.join('、')" placeholder="课程之间用顿号分隔" />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>

    <Button type="dashed" block @click="handleAdd" class="mt-4">
      <template #icon><PlusOutlined /></template>
      添加教育经历
    </Button>
  </div>
</template>
