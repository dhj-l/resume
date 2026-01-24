<script setup lang="ts">
import { Form, FormItem, Input, Row, Col, Select } from "ant-design-vue";
import type { JobIntention } from "@/stores/type";

defineProps<{
  data: JobIntention;
}>();

// TODO: 处理表单变化
const handleChange = () => {
  console.log("Form changed");
};

const entryTimeOptions = [
  { label: "不填", value: "" },
  { label: "随时入职", value: "随时入职" },
  { label: "一周内", value: "一周内" },
  { label: "两周内", value: "两周内" },
  { label: "一个月内", value: "一个月内" },
  { label: "面议", value: "面议" },
];
</script>

<template>
  <Form layout="vertical">
    <Row :gutter="24">
      <Col :span="6">
        <FormItem label="求职意向">
          <Input
            v-model:value="data.jobIntention"
            @change="handleChange"
            placeholder="请输入求职意向，例如：前端开发工程师"
          />
        </FormItem>
      </Col>
      <Col :span="6">
        <FormItem label="意向城市">
          <Input
            v-model:value="data.intentionCity"
            @change="handleChange"
            placeholder="请输入意向城市，例如：北京"
          />
        </FormItem>
      </Col>
      <Col :span="6">
        <FormItem label="期望薪资">
          <Input
            v-model:value="data.expectationSalary"
            @change="handleChange"
            placeholder="例如：20k-25k"
          />
        </FormItem>
      </Col>
      <Col :span="6">
        <FormItem label="入职时间">
          <Select
            v-model:value="data.entryTime"
            @change="handleChange"
            placeholder="请选择入职时间"
            :options="entryTimeOptions"
          />
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>
