<script setup lang="ts">
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { useRouter } from "vue-router";

import GSAPTransition from "@/components/common/GSAPTransition.vue";
import { getPreset } from "@/utils/transitions";

const router = useRouter();
const topLevelPreset = getPreset("fade");
</script>

<template>
  <a-config-provider :locale="zhCN">
    <GSAPTransition :preset="topLevelPreset" mode="out-in">
      <router-view v-slot="{ Component }">
        <component :is="Component" :key="router.currentRoute.value.path" />
      </router-view>
    </GSAPTransition>
  </a-config-provider>
</template>
