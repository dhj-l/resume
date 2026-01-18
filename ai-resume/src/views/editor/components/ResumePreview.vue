<script setup lang="ts">
import type { ResumeData } from "@/stores/type";
import BasicInfoSection from "./preview/BasicInfoSection.vue";
import JobIntentionSection from "./preview/JobIntentionSection.vue";
import EducationBackgroundSection from "./preview/EducationBackgroundSection.vue";
import WorkExperienceSection from "./preview/WorkExperienceSection.vue";
import ProjectExperienceSection from "./preview/ProjectExperienceSection.vue";
import SkillsSection from "./preview/SkillsSection.vue";
import CertificatesSection from "./preview/CertificatesSection.vue";
import SelfEvaluationSection from "./preview/SelfEvaluationSection.vue";

defineProps<{
  resumeData: ResumeData;
}>();
</script>

<template>
  <div
    class="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-lg mx-auto p-8 box-border"
  >
    <BasicInfoSection :data="resumeData.basicInfo" />
    <JobIntentionSection :data="resumeData.jobIntention" />
    <EducationBackgroundSection :data="resumeData.educationBackground" />
    <WorkExperienceSection :data="resumeData.workExperience" />
    <ProjectExperienceSection :data="resumeData.projectExperience" />
    <SkillsSection :data="resumeData.skills" />
    <CertificatesSection :data="resumeData.certificates" />
    <SelfEvaluationSection :data="resumeData.selfEvaluation" />
  </div>
</template>

<style scoped>
/* A4纸张比例模拟 */
.resume-preview {
  aspect-ratio: 210/297;
}
</style>
