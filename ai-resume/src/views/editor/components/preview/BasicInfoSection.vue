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
</script>

<template>
  <div :class="styles.container" @click="handleClick">
    <div :class="styles.contentWrapper">
      <img :src="data.avatar" alt="avatar" :class="styles.avatar" />
      <div :class="styles.infoWrapper">
        <h1 :class="styles.name">
          {{ data.name }}
        </h1>
        <div :class="styles.detailsWrapper">
          <div :class="styles.detailItem" v-if="data.workYear">
            <span>工作年限：{{ data.workYear }}</span>
          </div>
          <div :class="styles.detailItem" v-if="data.gender">
            <span>性别：{{ data.gender }}</span>
          </div>
          <div :class="styles.detailItem" v-if="data.phone">
            <span>电话：{{ data.phone }}</span>
          </div>
          <div :class="styles.detailItem" v-if="data.email">
            <span>邮箱：{{ data.email }}</span>
          </div>
          <div :class="styles.detailItem" v-if="data.politicalStatus">
            <span>政治面貌：{{ data.politicalStatus }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
