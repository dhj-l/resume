<template>
  <div class="resume-preview-container flex justify-center py-8 bg-[#f5f5f5] min-h-screen overflow-y-auto">
    <!-- A4 Paper Simulation -->
    <div class="resume-paper bg-white shadow-lg box-border flex flex-col" :style="paperStyle">
      <BasicInfoSection :data="resumeData.basicInfo" />
      
      <JobIntentionSection 
        v-if="resumeData.jobIntention" 
        :data="resumeData.jobIntention" 
        class="mt-6"
      />
      
      <EducationBackgroundSection 
        :data="resumeData.educationBackground" 
        class="mt-6"
      />
      
      <WorkExperienceSection 
        v-if="resumeData.workExperience" 
        :data="resumeData.workExperience" 
        class="mt-6"
      />
      
      <ProjectExperienceSection 
        v-if="resumeData.projectExperience" 
        :data="resumeData.projectExperience" 
        class="mt-6"
      />
      
      <SkillsSection 
        v-if="resumeData.skills && resumeData.skills.length" 
        :data="resumeData.skills" 
        class="mt-6"
      />
      
      <CertificatesSection 
        v-if="resumeData.certificates && resumeData.certificates.length" 
        :data="resumeData.certificates" 
        class="mt-6"
      />
      
      <SelfEvaluationSection 
        v-if="resumeData.selfEvaluation" 
        :data="resumeData.selfEvaluation" 
        class="mt-6"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ResumeData } from '@/stores/type';
import BasicInfoSection from './BasicInfoSection.vue';
import JobIntentionSection from './JobIntentionSection.vue';
import EducationBackgroundSection from './EducationBackgroundSection.vue';
import WorkExperienceSection from './WorkExperienceSection.vue';
import ProjectExperienceSection from './ProjectExperienceSection.vue';
import SkillsSection from './SkillsSection.vue';
import CertificatesSection from './CertificatesSection.vue';
import SelfEvaluationSection from './SelfEvaluationSection.vue';

interface Props {
  resumeData: ResumeData;
}

const props = defineProps<Props>();

// 模拟 A4 纸张样式和全局样式配置
const paperStyle = computed(() => {
  const { globalStyle } = props.resumeData;
  return {
    width: '210mm',
    minHeight: '297mm',
    padding: globalStyle.pageMargin || '32px',
    fontSize: globalStyle.fontSize || '14px',
    lineHeight: globalStyle.lineHeight || '1.5',
    color: '#333' // 默认文字颜色
  };
});
</script>

<style scoped>
.resume-paper {
  /* 确保打印时也是 A4 尺寸 */
  print-color-adjust: exact;
}

@media print {
  .resume-preview-container {
    background: white;
    padding: 0;
  }
  .resume-paper {
    box-shadow: none;
    margin: 0;
    width: 100%;
  }
}
</style>
