import type { Component } from "vue";

import { GraduationCap } from "lucide-vue-next";

import type { templateType } from "./type";

interface EducationBackgroundStyles {
  container: string;
  title: string;
  listWrapper: string;
  itemWrapper: string;
  contentWrapper: string;
  headerWrapper: string;
  schoolName: string;
  timeRange: string;
  detailsWrapper: string;
  courses: string;
  empty: string;
  /** 模块标题图标（可选，仅部分模板使用） */
  titleIcon?: Component;
  titleIconClass?: string;
}

export const getEducationBackgroundStyles = (type: templateType): EducationBackgroundStyles => {
  const commonStyles = {
    container:
      "resume-section w-full border border-transparent rounded cursor-pointer transition-all duration-200",
    title: "text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3",
    listWrapper: "space-y-4",
    itemWrapper:
      "flex justify-between items-start outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-gray-300",
    contentWrapper: "flex-1 min-w-0",
    headerWrapper: "flex flex-wrap justify-between items-baseline gap-2 mb-1",
    schoolName: "font-bold text-gray-800 break-words",
    timeRange: "text-gray-600 shrink-0", // Removed text-sm
    detailsWrapper: "flex gap-4 text-gray-700", // Removed text-sm
    courses: "mt-1 text-gray-500", // Removed text-xs
    empty: "text-gray-400 italic",
  };

  switch (type) {
    case "double-column":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title:
          "flex items-center gap-2 text-base font-bold text-slate-800 border-b-2 border-indigo-500 pb-2 mb-4",
        titleIcon: GraduationCap,
        titleIconClass: "w-4 h-4 text-indigo-500 shrink-0",
        schoolName: "font-bold text-slate-800 break-words",
        timeRange: "text-gray-400 shrink-0",
        detailsWrapper: "flex gap-4 text-gray-600",
      };
    case "simple":
      return {
        ...commonStyles,
        title:
          "flex items-center gap-2 text-base font-bold text-[#5b21b6] pl-3 border-l-4 border-[#7c3aed] mb-4",
        titleIcon: GraduationCap,
        titleIconClass: "w-4 h-4 text-[#7c3aed] shrink-0",
        container: `${commonStyles.container}`,
        schoolName: "font-bold text-[#4c1d95] break-words",
        timeRange: "text-gray-400 shrink-0",
        detailsWrapper: "flex gap-4 text-gray-600",
      };
    case "modern":
      return {
        ...commonStyles,
        title:
          "flex items-center gap-2 text-base font-bold text-gray-900 pl-3 border-l-4 border-primary-500 mb-4",
        titleIcon: GraduationCap,
        titleIconClass: "w-4 h-4 text-primary-600 shrink-0",
        container: `${commonStyles.container}`,
        itemWrapper:
          "pl-4 border-l-2 border-primary-200 py-2 outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-gray-300",
        schoolName: "font-bold text-gray-900",
        timeRange: "text-gray-400 shrink-0",
        detailsWrapper: "flex gap-4 text-gray-600",
        courses: "mt-1 text-gray-500",
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
        schoolName: "font-semibold text-[#1a1a2e] text-base tracking-wide",
        timeRange: "text-[#9a9aa0] tracking-[0.1em] text-xs uppercase",
        detailsWrapper: "flex gap-4 text-[#5a5a7a] text-sm",
        courses: "mt-2 text-[#8a8780] text-sm italic",
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
        schoolName: "font-semibold text-gray-900",
        timeRange: "text-gray-400 tracking-wide shrink-0",
        detailsWrapper: "flex gap-4 text-gray-600",
        courses: "mt-1 text-gray-400",
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
        schoolName: "font-semibold text-[#1a1a1a]",
        timeRange: "text-[#999] tracking-wide shrink-0",
        detailsWrapper: "flex gap-4 text-[#666]",
        courses: "mt-1 text-[#999]",
      };
    case "classic":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title:
          "flex items-center gap-2 text-base font-bold text-[#1f4e79] border-b-2 border-[#1f4e79] pb-2 mb-4",
        titleIcon: GraduationCap,
        titleIconClass: "w-4 h-4 text-[#1f4e79] shrink-0",
        schoolName: "font-bold text-[#1a3a5c] break-words",
        timeRange: "text-gray-500 shrink-0",
        detailsWrapper: "flex gap-4 text-gray-600",
      };
    case "fresh":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title: "flex items-center gap-2 text-base font-bold text-teal-800 mb-3.5",
        titleIcon: GraduationCap,
        titleIconClass: "w-5 h-5 p-[3px] bg-teal-500 text-white rounded-md shrink-0",
        itemWrapper:
          "pl-4 border-l-2 border-teal-200 py-1.5 outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-gray-300",
        timeRange: "text-gray-400 shrink-0",
        detailsWrapper: "flex gap-4 text-gray-600",
      };
    case "sidebar-dark":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title:
          "flex items-center gap-2 text-base font-bold text-[#1f2d3d] border-b border-gray-200 pb-2 mb-3.5",
        titleIcon: GraduationCap,
        titleIconClass: "w-4 h-4 text-[#1f2d3d] shrink-0",
        itemWrapper:
          "pb-4 border-b border-gray-100 last:border-b-0 last:pb-0 outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-gray-300",
        schoolName: "font-bold text-[#1f2d3d]",
        timeRange: "text-gray-400 shrink-0",
        detailsWrapper: "flex gap-4 text-gray-600",
      };
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title:
          "flex items-center gap-2 text-base font-bold text-gray-900 border-b-2 border-gray-900 pb-2 mb-4",
        titleIcon: GraduationCap,
        titleIconClass: "w-4 h-4 text-primary-500 shrink-0",
        schoolName: "font-bold text-gray-900 break-words",
        timeRange: "text-gray-400 shrink-0",
        detailsWrapper: "flex gap-4 text-gray-600",
      };
  }
};
