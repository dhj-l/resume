import type { Component } from "vue";

import { Wrench } from "lucide-vue-next";

import type { templateType } from "./type";

interface SkillsStyles {
  container: string;
  title: string;
  listWrapper: string;
  item: string;
  empty: string;
  /** 模块标题图标（可选，仅部分模板使用） */
  titleIcon?: Component;
  titleIconClass?: string;
}

export const getSkillsStyles = (type: templateType): SkillsStyles => {
  const commonStyles = {
    container:
      "resume-section w-full border border-transparent rounded cursor-pointer transition-all duration-200",
    title: "text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3",
    listWrapper: "flex flex-wrap gap-2",
    item: "px-3 py-1 bg-gray-100 text-gray-700 rounded", // Removed text-sm
    empty: "text-gray-400 italic",
  };

  switch (type) {
    case "double-column":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title:
          "flex items-center gap-2 text-sm font-bold text-indigo-700 tracking-wide border-b border-indigo-200 pb-2 mb-3",
        titleIcon: Wrench,
        titleIconClass: "w-3.5 h-3.5 text-indigo-500 shrink-0",
        listWrapper: "flex flex-wrap gap-2",
        item: "px-2.5 py-1 bg-white border border-indigo-100 text-slate-600 rounded-md",
      };
    case "simple":
      return {
        ...commonStyles,
        title:
          "flex items-center gap-2 text-base font-bold text-[#5b21b6] pl-3 border-l-4 border-[#7c3aed] mb-4",
        titleIcon: Wrench,
        titleIconClass: "w-4 h-4 text-[#7c3aed] shrink-0",
        container: `${commonStyles.container}`,
        listWrapper: "flex flex-wrap gap-2",
        item: "px-3 py-1 bg-[#F5F3FF] text-[#6D28D9] rounded-full font-medium",
      };
    case "modern":
      return {
        ...commonStyles,
        title:
          "flex items-center gap-2 text-base font-bold text-gray-900 pl-3 border-l-4 border-primary-500 mb-4",
        titleIcon: Wrench,
        titleIconClass: "w-4 h-4 text-primary-600 shrink-0",
        container: `${commonStyles.container}`,
        listWrapper: "flex flex-wrap gap-2",
        item: "px-3 py-1 bg-primary-50 text-primary-700 rounded-full font-medium",
      };
    case "elegant":
      return {
        ...commonStyles,
        title:
          "text-xs tracking-[0.2em] uppercase font-semibold text-[#8a8780] mb-5 flex items-center gap-3",
        container: `${commonStyles.container}`,
        listWrapper: "flex flex-wrap gap-2.5",
        item: "px-4 py-1.5 bg-gradient-to-r from-[#f8f4ee] to-[#f5f0e8] text-[#5a4a3a] rounded-sm border border-[#e8e0d4] text-sm tracking-wide hover:border-[#c9a96e]/50 transition-colors duration-200",
      };
    case "minimal":
      return {
        ...commonStyles,
        title:
          "text-[13px] font-medium text-gray-900 tracking-[0.25em] uppercase border-b border-gray-200 pb-2 mb-4",
        container: `${commonStyles.container}`,
        listWrapper: "flex flex-wrap gap-2",
        item: "px-3 py-1 bg-gray-50 text-gray-600 rounded border border-gray-200",
      };
    case "luxury":
      return {
        ...commonStyles,
        title: "tracking-[0.2em] uppercase font-semibold text-[#c9a050] mb-3",
        container: `${commonStyles.container}`,
        listWrapper: "flex flex-wrap gap-1.5 text-white/80",
        item: "px-2.5 py-1 bg-white/10 text-white/90 rounded border border-white/10",
      };
    case "classic":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title:
          "flex items-center gap-2 text-base font-bold text-[#1f4e79] border-b-2 border-[#1f4e79] pb-2 mb-4",
        titleIcon: Wrench,
        titleIconClass: "w-4 h-4 text-[#1f4e79] shrink-0",
        item: "px-3 py-1 border border-[#1f4e79]/30 text-[#1f4e79] rounded-sm font-medium",
      };
    case "fresh":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title: "flex items-center gap-2 text-base font-bold text-teal-800 mb-3.5",
        titleIcon: Wrench,
        titleIconClass: "w-5 h-5 p-[3px] bg-teal-500 text-white rounded-md shrink-0",
        item: "px-3 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-full font-medium",
      };
    case "sidebar-dark":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title:
          "flex items-center gap-2 text-sm font-bold text-white tracking-wider border-b border-white/15 pb-2 mb-3",
        titleIcon: Wrench,
        titleIconClass: "w-3.5 h-3.5 text-[#6ea8dd] shrink-0",
        listWrapper: "flex flex-wrap gap-1.5 text-white/90",
        item: "px-2.5 py-1 bg-white/10 text-white/90 rounded border border-white/15",
      };
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title:
          "flex items-center gap-2 text-base font-bold text-gray-900 border-b-2 border-gray-900 pb-2 mb-4",
        titleIcon: Wrench,
        titleIconClass: "w-4 h-4 text-primary-500 shrink-0",
        item: "px-3 py-1 bg-gray-100 text-gray-700 rounded-md font-medium",
      };
  }
};
