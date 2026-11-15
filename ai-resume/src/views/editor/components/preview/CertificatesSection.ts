import type { Component } from "vue";

import { Award } from "lucide-vue-next";

import type { templateType } from "./type";

interface CertificatesStyles {
  container: string;
  title: string;
  list: string;
  listItem: string;
  empty: string;
  /** 模块标题图标（可选，仅部分模板使用） */
  titleIcon?: Component;
  titleIconClass?: string;
}

export const getCertificatesStyles = (type: templateType): CertificatesStyles => {
  const commonStyles = {
    container:
      "resume-section w-full border border-transparent rounded cursor-pointer transition-all duration-200",
    title: "text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3",
    list: "list-disc list-inside text-gray-700 space-y-1", // Removed text-sm
    listItem: "",
    empty: "text-gray-400 italic",
  };

  switch (type) {
    case "double-column":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title:
          "flex items-center gap-2 text-sm font-bold text-indigo-700 tracking-wide border-b border-indigo-200 pb-2 mb-3",
        titleIcon: Award,
        titleIconClass: "w-3.5 h-3.5 text-indigo-500 shrink-0",
        list: "space-y-1.5 text-slate-600 text-sm",
        listItem: "flex items-start gap-2",
      };
    case "simple":
      return {
        ...commonStyles,
        title:
          "flex items-center gap-2 text-base font-bold text-[#5b21b6] pl-3 border-l-4 border-[#7c3aed] mb-4",
        titleIcon: Award,
        titleIconClass: "w-4 h-4 text-[#7c3aed] shrink-0",
        container: `${commonStyles.container}`,
        list: "space-y-2 text-gray-700",
        listItem: "flex items-center gap-2",
      };
    case "modern":
      return {
        ...commonStyles,
        title:
          "flex items-center gap-2 text-base font-bold text-gray-900 pl-3 border-l-4 border-primary-500 mb-4",
        titleIcon: Award,
        titleIconClass: "w-4 h-4 text-primary-600 shrink-0",
        container: `${commonStyles.container}`,
        list: "space-y-2 text-gray-700",
        listItem: "flex items-center gap-2 pl-4 border-l-2 border-primary-200 py-1",
      };
    case "elegant":
      return {
        ...commonStyles,
        title:
          "text-xs tracking-[0.2em] uppercase font-semibold text-[#8a8780] mb-5 flex items-center gap-3",
        container: `${commonStyles.container}`,
        list: "space-y-2.5 text-[#555]",
        listItem: "flex items-center gap-3 pl-4 py-1.5 text-sm",
      };
    case "minimal":
      return {
        ...commonStyles,
        title:
          "text-[13px] font-medium text-gray-900 tracking-[0.25em] uppercase border-b border-gray-200 pb-2 mb-4",
        container: `${commonStyles.container}`,
        list: "space-y-1.5 text-gray-600 text-sm",
        listItem: "flex items-center gap-2",
      };
    case "luxury":
      return {
        ...commonStyles,
        title: "text-xs tracking-[0.2em] uppercase font-semibold text-[#c9a050] mb-3",
        container: `${commonStyles.container}`,
        list: "space-y-1.5 text-white/70 text-sm",
        listItem: "flex items-center gap-2",
      };
    case "classic":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title:
          "flex items-center gap-2 text-base font-bold text-[#1f4e79] border-b-2 border-[#1f4e79] pb-2 mb-4",
        titleIcon: Award,
        titleIconClass: "w-4 h-4 text-[#1f4e79] shrink-0",
        list: "space-y-1.5 text-gray-700",
        listItem: "flex items-center gap-2",
      };
    case "fresh":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title: "flex items-center gap-2 text-base font-bold text-teal-800 mb-3.5",
        titleIcon: Award,
        titleIconClass: "w-5 h-5 p-[3px] bg-teal-500 text-white rounded-md shrink-0",
        list: "space-y-2 text-gray-700",
        listItem: "flex items-center gap-2 pl-4 border-l-2 border-teal-200 py-0.5",
      };
    case "sidebar-dark":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title:
          "flex items-center gap-2 text-sm font-bold text-white tracking-wider border-b border-white/15 pb-2 mb-3",
        titleIcon: Award,
        titleIconClass: "w-3.5 h-3.5 text-[#6ea8dd] shrink-0",
        list: "space-y-1.5 text-white/90",
        listItem: "flex items-start gap-2",
      };
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title:
          "flex items-center gap-2 text-base font-bold text-gray-900 border-b-2 border-gray-900 pb-2 mb-4",
        titleIcon: Award,
        titleIconClass: "w-4 h-4 text-primary-500 shrink-0",
        list: "space-y-1.5 text-gray-700",
        listItem: "flex items-center gap-2",
      };
  }
};
