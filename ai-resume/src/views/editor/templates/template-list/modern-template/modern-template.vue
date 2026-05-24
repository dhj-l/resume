<template>
  <div class="relative mx-auto w-full max-w-[210mm]">
    <div
      ref="contentRef"
      class="w-full bg-white shadow-lg box-border overflow-hidden"
      :style="{
        fontSize: globalFontSize,
        lineHeight: globalLineHeight,
      }"
    >
      <!-- Hero Header: 渐变背景 + 基本信息 + 求职意向 -->
      <div
        v-if="resumeData.basicInfo"
        class="bg-primary-600 text-white px-8 py-6 resume-section border border-transparent cursor-pointer"
        @click="handleBasicInfoClick"
      >
        <div class="flex items-start gap-6">
          <img
            :src="fullAvatar"
            alt="avatar"
            class="w-20 h-20 rounded-full object-cover ring-2 ring-white/50 shrink-0 bg-white/20"
          />
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl font-bold tracking-wide mb-2">
              {{ resumeData.basicInfo.name }}
            </h1>
            <div class="flex flex-wrap gap-x-6 gap-y-1 text-white/80">
              <span v-if="resumeData.basicInfo.phone" class="flex items-center gap-1">
                <Phone class="w-3.5 h-3.5" />{{ resumeData.basicInfo.phone }}
              </span>
              <span v-if="resumeData.basicInfo.email" class="flex items-center gap-1">
                <Mail class="w-3.5 h-3.5" />{{ resumeData.basicInfo.email }}
              </span>
              <span v-if="resumeData.basicInfo.age" class="flex items-center gap-1">
                {{ resumeData.basicInfo.age }} 岁
              </span>
              <span v-if="resumeData.basicInfo.gender">{{ resumeData.basicInfo.gender }}</span>
              <span v-if="resumeData.basicInfo.workYear">{{ resumeData.basicInfo.workYear }}</span>
              <span v-if="resumeData.basicInfo.politicalStatus">
                {{ resumeData.basicInfo.politicalStatus }}
              </span>
            </div>
          </div>
          <!-- 求职意向 -->
          <div
            v-if="hasJobIntention"
            class="shrink-0 text-right"
            @click.stop="handleJobIntentionClick"
          >
            <div class="space-y-1 text-sm">
              <div
                v-if="resumeData.jobIntention?.jobIntention"
                class="flex items-center gap-2 justify-end"
              >
                <Briefcase class="w-3.5 h-3.5 text-white/60" />
                <span class="text-white/60">期望职位</span>
                <span class="font-medium">{{ resumeData.jobIntention.jobIntention }}</span>
              </div>
              <div
                v-if="resumeData.jobIntention?.intentionCity"
                class="flex items-center gap-2 justify-end"
              >
                <MapPin class="w-3.5 h-3.5 text-white/60" />
                <span class="text-white/60">意向城市</span>
                <span class="font-medium">{{ resumeData.jobIntention.intentionCity }}</span>
              </div>
              <div
                v-if="resumeData.jobIntention?.expectationSalary"
                class="flex items-center gap-2 justify-end"
              >
                <DollarSign class="w-3.5 h-3.5 text-white/60" />
                <span class="text-white/60">期望薪资</span>
                <span class="font-medium">{{ resumeData.jobIntention.expectationSalary }}</span>
              </div>
              <div
                v-if="resumeData.jobIntention?.entryTime"
                class="flex items-center gap-2 justify-end"
              >
                <Clock class="w-3.5 h-3.5 text-white/60" />
                <span class="text-white/60">入职时间</span>
                <span class="font-medium">{{ resumeData.jobIntention.entryTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 内容模块区 -->
      <div :style="{ padding: globalPageMargin }">
        <template v-for="item in contentModules" :key="item.moduleKey">
          <div :style="{ marginBottom: globalModuleMargin }">
            <component
              :is="item.component"
              :data="resumeData[item.moduleKey]"
              :label="item.label"
              :template-type="currentTemplateType"
            />
          </div>
        </template>
      </div>
    </div>

    <!-- 分页标记线 -->
    <div
      v-for="marker in markers"
      :key="marker.pageNum"
      data-page-marker
      class="absolute left-0 w-full pointer-events-none"
      :style="{ top: `${marker.top}px` }"
    >
      <div class="border-t-[3px] border-dashed border-red-400 relative">
        <span
          class="absolute right-0 -top-3.5 bg-red-500 text-white text-xs px-2.5 py-0.5 rounded shadow-sm"
        >
          第{{ marker.pageNum }}页
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from "vue";

import { Briefcase, Clock, DollarSign, Mail, MapPin, Phone } from "lucide-vue-next";
import { storeToRefs } from "pinia";

import { useResumeStore } from "@/stores/resumeStore";
import type { ResumeData } from "@/stores/type";
import { useActiveModules } from "@/views/editor/hooks/useActiveModules";
import { usePageMarkers } from "@/views/editor/hooks/usePageMarkers";

const {
  moduleOrder,
  currentTemplateType,
  globalPageMargin,
  globalFontSize,
  globalLineHeight,
  globalModuleMargin,
} = storeToRefs(useResumeStore());
const resumeData = ref(inject<ResumeData>("resumeData")!);

const { setCurrentModel, setIsExpanded } = useResumeStore();

const { activeModules } = useActiveModules(moduleOrder, resumeData);

const contentModules = computed(() => {
  return activeModules.value.filter(
    (item) => item.moduleKey !== "basicInfo" && item.moduleKey !== "jobIntention",
  );
});

const hasJobIntention = computed(() => {
  const { jobIntention } = resumeData.value;
  return (
    jobIntention?.jobIntention ||
    jobIntention?.intentionCity ||
    jobIntention?.expectationSalary ||
    jobIntention?.entryTime
  );
});

const fullAvatar = computed(() => {
  return import.meta.env.VITE_DEFAULT_AVATAR + resumeData.value.basicInfo?.avatar;
});

const handleBasicInfoClick = () => {
  setCurrentModel("basicInfo");
  setIsExpanded(true);
};

const handleJobIntentionClick = () => {
  setCurrentModel("jobIntention");
  setIsExpanded(true);
};

// 分页标记线
const contentRef = ref<HTMLElement | null>(null);
const { markers } = usePageMarkers(contentRef);
</script>
