import type { Component } from "vue";

import { Briefcase } from "lucide-vue-next";

import type { templateType } from "./type";

interface WorkExperienceStyles {
  container: string;
  title: string;
  listWrapper: string;
  itemWrapper: string;
  headerWrapper: string;
  companyName: string;
  timeRange: string;
  position: string;
  description: string;
  empty: string;
  /** 模块标题图标（可选，仅部分模板使用） */
  titleIcon?: Component;
  titleIconClass?: string;
}

export const getWorkExperienceStyles = (type: templateType): WorkExperienceStyles => {
  const commonStyles = {
    container:
      "resume-section w-full border border-transparent rounded cursor-pointer transition-all duration-200",
    title: "text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3",
    listWrapper: "space-y-4",
    itemWrapper:
      "outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-gray-300",
    headerWrapper: "flex flex-wrap justify-between items-baseline gap-2 mb-1",
    companyName: "font-bold text-gray-800 break-words",
    timeRange: "text-gray-600 shrink-0", // Removed text-sm
    position: "font-medium text-gray-700 mb-1", // Removed text-sm
    description: "text-gray-600 whitespace-pre-wrap",
    empty: "text-gray-400 italic",
  };

  switch (type) {
    case "double-column":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title:
          "flex items-center gap-2 text-base font-bold text-slate-800 border-b-2 border-indigo-500 pb-2 mb-4",
        titleIcon: Briefcase,
        titleIconClass: "w-4 h-4 text-indigo-500 shrink-0",
        companyName: "font-bold text-slate-800 break-words",
        position: "text-gray-600 font-medium mb-1",
        timeRange: "text-gray-400 shrink-0",
      };
    case "simple":
      return {
        ...commonStyles,
        title:
          "flex items-center gap-2 text-base font-bold text-[#5b21b6] pl-3 border-l-4 border-[#7c3aed] mb-4",
        titleIcon: Briefcase,
        titleIconClass: "w-4 h-4 text-[#7c3aed] shrink-0",
        container: `${commonStyles.container}`,
        companyName: "font-bold text-[#4c1d95] break-words",
        position: "text-gray-600 font-medium mb-1",
        timeRange: "text-gray-400 shrink-0",
      };
    case "modern":
      return {
        ...commonStyles,
        title:
          "flex items-center gap-2 text-base font-bold text-gray-900 pl-3 border-l-4 border-primary-500 mb-4",
        titleIcon: Briefcase,
        titleIconClass: "w-4 h-4 text-primary-600 shrink-0",
        container: `${commonStyles.container}`,
        itemWrapper:
          "pl-4 border-l-2 border-primary-200 py-2 outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-gray-300",
        companyName: "font-bold text-gray-900",
        position: "text-primary-600 font-medium mb-1",
        timeRange: "text-gray-400 shrink-0",
        description: "text-gray-600 whitespace-pre-wrap mt-1",
      };
    case "elegant":
      return {
        ...commonStyles,
        title:
          "text-xs tracking-[0.2em] uppercase font-semibold text-[#8a8780] mb-5 flex items-center gap-3",
        container: `${commonStyles.container}`,
        itemWrapper:
          "relative pl-4 border-l-2 border-[#c9a96e]/30 pb-5 last:pb-0 outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-gray-300",
        headerWrapper: "flex flex-col gap-1 mb-2",
        companyName: "font-semibold text-[#1a1a2e] text-base tracking-wide",
        position: "font-medium text-[#5a5a7a] text-sm",
        timeRange: "text-[#9a9aa0] tracking-[0.1em] text-xs uppercase",
        description: "text-[#555] leading-[1.7] mt-2",
      };
    case "minimal":
      return {
        ...commonStyles,
        title:
          "text-[13px] font-medium text-gray-900 tracking-[0.25em] uppercase border-b border-gray-200 pb-2 mb-4",
        container: `${commonStyles.container}`,
        itemWrapper:
          "pb-5 border-b border-[#e5e5e5] last:border-b-0 last:pb-0 outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-gray-300",
        headerWrapper: "flex items-baseline justify-between gap-4 mb-1",
        companyName: "font-semibold text-gray-900",
        position: "font-medium text-gray-500",
        timeRange: "text-gray-400 tracking-wide shrink-0",
        description: "text-gray-600 leading-relaxed mt-2",
      };
    case "luxury":
      return {
        ...commonStyles,
        title:
          "font-semibold text-[#c9a050] tracking-[0.2em] uppercase border-b-2 border-[#c9a050]/40 pb-2 mb-5",
        container: `${commonStyles.container}`,
        itemWrapper:
          "pb-5 mb-1 last:pb-0 last:mb-0 outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-gray-300",
        headerWrapper: "flex items-baseline justify-between gap-4 mb-1",
        companyName: "font-semibold text-[#1a1a1a]",
        position: "font-medium text-[#555]",
        timeRange: "text-[#999] tracking-wide shrink-0",
        description: "text-[#555] leading-relaxed mt-2",
      };
    case "classic":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title:
          "flex items-center gap-2 text-base font-bold text-[#1f4e79] border-b-2 border-[#1f4e79] pb-2 mb-4",
        titleIcon: Briefcase,
        titleIconClass: "w-4 h-4 text-[#1f4e79] shrink-0",
        companyName: "font-bold text-[#1a3a5c] break-words",
        position: "text-gray-600 font-medium mb-1",
        timeRange: "text-gray-500 shrink-0",
      };
    case "fresh":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title: "flex items-center gap-2 text-base font-bold text-teal-800 mb-3.5",
        titleIcon: Briefcase,
        titleIconClass: "w-5 h-5 p-[3px] bg-teal-500 text-white rounded-md shrink-0",
        itemWrapper:
          "pl-4 border-l-2 border-teal-200 py-1.5 outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-gray-300",
        position: "text-teal-700 font-medium mb-1",
        timeRange: "text-gray-400 shrink-0",
        description: "text-gray-600 whitespace-pre-wrap mt-1",
      };
    case "sidebar-dark":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title:
          "flex items-center gap-2 text-base font-bold text-[#1f2d3d] border-b border-gray-200 pb-2 mb-3.5",
        titleIcon: Briefcase,
        titleIconClass: "w-4 h-4 text-[#1f2d3d] shrink-0",
        itemWrapper:
          "pb-4 border-b border-gray-100 last:border-b-0 last:pb-0 outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-gray-300",
        companyName: "font-bold text-[#1f2d3d]",
        position: "text-gray-500 font-medium mb-1",
        timeRange: "text-gray-400 shrink-0",
        description: "text-gray-600 whitespace-pre-wrap mt-1",
      };
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title:
          "flex items-center gap-2 text-base font-bold text-gray-900 border-b-2 border-gray-900 pb-2 mb-4",
        titleIcon: Briefcase,
        titleIconClass: "w-4 h-4 text-primary-500 shrink-0",
        companyName: "font-bold text-gray-900 break-words",
        position: "text-primary-600 font-medium mb-1",
        timeRange: "text-gray-400 shrink-0",
      };
  }
};
