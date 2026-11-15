import type { Component } from "vue";

import { Banknote, CalendarClock, MapPin, Target } from "lucide-vue-next";

import type { templateType } from "./type";

interface JobIntentionStyles {
  container: string;
  title: string;
  contentWrapper: string;
  item: string;
  label: string;
  value: string;
  empty: string;
  /** 模块标题图标（可选，仅部分模板使用） */
  titleIcon?: Component;
  titleIconClass?: string;
  /** 意向条目图标（与 contentArray 顺序对齐：期望职位/意向城市/期望薪资/入职时间） */
  itemIcons?: Component[];
  itemIconClass?: string;
}

export const getJobIntentionStyles = (type: templateType): JobIntentionStyles => {
  const commonStyles = {
    container:
      "resume-section w-full border border-transparent rounded cursor-pointer transition-all duration-200",
    title: "text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3",
    contentWrapper: "flex flex-wrap gap-4 sm:gap-8 text-gray-700", // Removed text-sm
    item: "",
    label: "font-medium",
    value: "break-words",
    empty: "text-gray-400 italic",
  };

  switch (type) {
    case "double-column":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title:
          "flex items-center gap-2 text-base font-bold text-slate-800 border-b-2 border-indigo-500 pb-2 mb-4",
        titleIcon: Target,
        titleIconClass: "w-4 h-4 text-indigo-500 shrink-0",
        contentWrapper: "grid grid-cols-2 gap-x-6 gap-y-2 text-gray-700",
        item: "inline-flex items-start gap-1.5",
        label: "text-gray-400 shrink-0",
        value: "font-medium text-gray-700",
        itemIcons: [Target, MapPin, Banknote, CalendarClock],
        itemIconClass: "w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5",
      };
    case "simple":
      return {
        ...commonStyles,
        title:
          "flex items-center gap-2 text-base font-bold text-[#5b21b6] pl-3 border-l-4 border-[#7c3aed] mb-4",
        titleIcon: Target,
        titleIconClass: "w-4 h-4 text-[#7c3aed] shrink-0",
        container: `${commonStyles.container}`,
        contentWrapper: "flex flex-wrap gap-x-8 gap-y-2 text-gray-600",
        item: "inline-flex items-center gap-1.5",
        label: "font-medium text-[#7c3aed]",
        value: "text-gray-800",
        itemIcons: [Target, MapPin, Banknote, CalendarClock],
        itemIconClass: "w-3.5 h-3.5 text-[#7c3aed] shrink-0",
      };
    case "modern":
      return {
        ...commonStyles,
        title: "hidden",
        container: `${commonStyles.container}`,
        contentWrapper: "grid grid-cols-2 gap-x-6 gap-y-2 text-white/80",
        item: "inline-flex items-start gap-1.5",
        label: "text-white/60 shrink-0",
        value: "font-medium text-white",
        itemIcons: [Target, MapPin, Banknote, CalendarClock],
        itemIconClass: "w-3.5 h-3.5 text-white/70 shrink-0 mt-0.5",
      };
    case "elegant":
      return {
        ...commonStyles,
        title:
          "text-xs tracking-[0.2em] uppercase font-semibold text-[#8a8780] mb-4 flex items-center gap-3",
        container: `${commonStyles.container}`,
        contentWrapper: "flex flex-wrap gap-x-8 gap-y-2 pl-0",
        label: "text-[#c9a96e] text-xs tracking-[0.15em] uppercase font-medium",
        value: "font-medium text-[#2d3436] tracking-wide",
      };
    case "minimal":
      return {
        ...commonStyles,
        title: "hidden",
        container: `${commonStyles.container}`,
        contentWrapper: "flex flex-wrap gap-x-6 gap-y-1.5 text-[#666]",
        item: "inline-flex items-start gap-1.5",
        label: "text-[#999] text-xs uppercase tracking-wider shrink-0",
        value: "text-[#333] font-medium",
        itemIcons: [Target, MapPin, Banknote, CalendarClock],
        itemIconClass: "w-3.5 h-3.5 text-gray-300 shrink-0 mt-0.5",
      };
    case "luxury":
      return {
        ...commonStyles,
        title: "text-xs tracking-[0.2em] uppercase font-semibold text-[#c9a050] mb-3",
        container: `${commonStyles.container}`,
        contentWrapper: "flex flex-col gap-2 text-white/80",
        label: "text-white/50 text-xs",
        value: "font-medium text-white text-sm",
      };
    case "classic":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title:
          "flex items-center gap-2 text-base font-bold text-[#1f4e79] border-b-2 border-[#1f4e79] pb-2 mb-4",
        titleIcon: Target,
        titleIconClass: "w-4 h-4 text-[#1f4e79] shrink-0",
        contentWrapper: "flex flex-wrap gap-x-8 gap-y-1.5 text-gray-700",
        item: "inline-flex items-center gap-1.5",
        label: "text-gray-400",
        value: "font-medium text-gray-700",
        itemIcons: [Target, MapPin, Banknote, CalendarClock],
        itemIconClass: "w-3.5 h-3.5 text-[#1f4e79] shrink-0",
      };
    case "fresh":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title: "hidden",
        contentWrapper: "grid grid-cols-2 gap-x-6 gap-y-2",
        item: "inline-flex items-start gap-1.5",
        label: "text-gray-400 shrink-0",
        value: "font-medium text-gray-700",
        itemIcons: [Target, MapPin, Banknote, CalendarClock],
        itemIconClass: "w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5",
      };
    case "sidebar-dark":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title:
          "flex items-center gap-2 text-base font-bold text-[#1f2d3d] border-b border-gray-200 pb-2 mb-3.5",
        titleIcon: Target,
        titleIconClass: "w-4 h-4 text-[#1f2d3d] shrink-0",
        contentWrapper: "grid grid-cols-2 gap-x-6 gap-y-1.5 text-gray-700",
        item: "inline-flex items-start gap-1.5",
        label: "text-gray-400 shrink-0",
        value: "font-medium text-gray-700",
        itemIcons: [Target, MapPin, Banknote, CalendarClock],
        itemIconClass: "w-3.5 h-3.5 text-[#1f2d3d]/60 shrink-0 mt-0.5",
      };
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        title:
          "flex items-center gap-2 text-base font-bold text-gray-900 border-b-2 border-gray-900 pb-2 mb-4",
        titleIcon: Target,
        titleIconClass: "w-4 h-4 text-primary-500 shrink-0",
        contentWrapper: "flex flex-wrap gap-x-8 gap-y-1.5 text-gray-700",
        item: "inline-flex items-center gap-1.5",
        label: "text-gray-400",
        value: "font-medium text-gray-700",
        itemIcons: [Target, MapPin, Banknote, CalendarClock],
        itemIconClass: "w-3.5 h-3.5 text-primary-500 shrink-0",
      };
  }
};
