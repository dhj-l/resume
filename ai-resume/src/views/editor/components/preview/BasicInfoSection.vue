<script setup lang="ts">
import { useResumeStore } from "@/stores/resumeStore";
import type { BasicInfo } from "@/stores/type";
import type { templateType } from "./type";
import { getBasicInfoStyles } from "./BasicInfoSection";
import { computed } from "vue";

const props = defineProps<{
  data: BasicInfo;
  /**
   * 当前模板的类型
   */
  templateType: templateType;
}>();
const { setCurrentModel, setIsExpanded } = useResumeStore();

const styles = computed(() => getBasicInfoStyles(props.templateType));

const handleClick = () => {
  setCurrentModel("basicInfo");
  setIsExpanded(true);
};
const contentArray = computed(() => {
  const { data } = props;
  return [
    {
      label: "年龄",
      value: data.age ? `${data.age} 岁` : "",
    },
    {
      label: "工作年限",
      value: data.workYear,
    },
    {
      label: "性别",
      value: data.gender,
    },
    {
      label: "电话",
      value: data.phone,
    },
    {
      label: "邮箱",
      value: data.email,
    },
    {
      label: "政治面貌",
      value: data.politicalStatus,
    },
  ];
});
const fullAvatar = computed(() => {
  return import.meta.env.VITE_DEFAULT_AVATAR + props.data.avatar;
});
</script>

<template>
  <!-- 
    v-if="data": 确保仅在有基本信息数据时渲染组件
    数据来源: props.data (BasicInfo 对象)
  -->
  <div v-if="data" :class="styles.container" @click="handleClick">
    <div :class="styles.contentWrapper">
      <img :src="fullAvatar" alt="avatar" :class="styles.avatar" />
      <div :class="styles.infoWrapper">
        <h1 :class="styles.name">
          {{ data.name }}
        </h1>
        <div :class="styles.detailsWrapper">
          <template v-for="item in contentArray" :key="item.label">
            <div :class="styles.detailItem" v-if="item.value">
              <span>{{ item.label }}：{{ item.value }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
