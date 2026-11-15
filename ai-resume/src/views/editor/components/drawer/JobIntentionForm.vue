<script setup lang="ts">
import { inject, type Ref } from "vue";

import { Form, FormItem, Input, Row, Col, Select } from "ant-design-vue";

import { useResumeStore } from "@/stores/resumeStore";
import type { JobIntention } from "@/stores/type";

defineProps<{
  data: JobIntention;
}>();

const { setJobIntention } = useResumeStore();

const drawerContentRef = inject<Ref<HTMLDivElement>>("drawerContentRef");
const getPopupContainer = (trigger: HTMLElement) =>
  (drawerContentRef?.value ?? trigger.parentNode) as HTMLElement;

// 处理表单变化
const update = (key: keyof JobIntention, value: any) => {
  setJobIntention({ [key]: value });
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
  <Form v-if="data" layout="vertical">
    <Row :gutter="24">
      <Col :span="6">
        <FormItem label="求职意向">
          <Input
            :value="data.jobIntention"
            placeholder="请输入求职意向，例如：前端开发工程师"
            @update:value="(val) => update('jobIntention', val)"
          />
        </FormItem>
      </Col>
      <Col :span="6">
        <FormItem label="意向城市">
          <Input
            :value="data.intentionCity"
            placeholder="请输入意向城市，例如：北京"
            @update:value="(val) => update('intentionCity', val)"
          />
        </FormItem>
      </Col>
      <Col :span="6">
        <FormItem label="期望薪资">
          <Input
            :value="data.expectationSalary"
            placeholder="例如：20k-25k"
            @update:value="(val) => update('expectationSalary', val)"
          />
        </FormItem>
      </Col>
      <Col :span="6">
        <FormItem label="入职时间">
          <Select
            :value="data.entryTime"
            placeholder="请选择入职时间"
            :options="entryTimeOptions"
            placement="topLeft"
            :get-popup-container="getPopupContainer"
            @update:value="(val) => update('entryTime', val)"
          />
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>
