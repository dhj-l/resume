import type { Component } from "vue";

import { Briefcase, Cake, Flag, Mail, Phone, UserRound } from "lucide-vue-next";

import type { templateType } from "./type";

interface BasicInfoStyles {
  container: string;
  contentWrapper: string;
  avatar: string;
  infoWrapper: string;
  name: string;
  detailsWrapper: string;
  detailItem: string;
  /** 联系方式图标（与 contentArray 顺序对齐：年龄/工作年限/性别/电话/邮箱/政治面貌） */
  detailIcons?: Component[];
  detailIconClass?: string;
}

export const getBasicInfoStyles = (type: templateType): BasicInfoStyles => {
  const commonStyles = {
    container:
      "resume-section w-full border border-transparent rounded cursor-pointer transition-all duration-200",
  };

  switch (type) {
    case "double-column":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        contentWrapper: "flex flex-col items-center gap-4 text-center pt-7 pb-8",
        avatar: "w-28 h-28 rounded-full object-cover bg-indigo-50 shrink-0 ring-4 ring-white/30",
        infoWrapper: "w-full min-w-0 flex flex-col items-center",
        name: "text-2xl font-bold text-white mb-2 tracking-wide break-words",
        detailsWrapper: "flex flex-col gap-2 text-indigo-100 w-full",
        detailItem: "flex items-center justify-center gap-2",
        detailIcons: [Cake, Briefcase, UserRound, Phone, Mail, Flag],
        detailIconClass: "w-3.5 h-3.5 text-indigo-200 shrink-0",
      };
    case "simple":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        contentWrapper: "flex flex-row-reverse items-center justify-between gap-8",
        avatar:
          "w-28 h-36 rounded-lg object-cover bg-gray-100 shrink-0 ring-1 ring-gray-200 shadow-sm",
        infoWrapper: "flex-1 min-w-0",
        name: "text-3xl font-bold text-gray-900 mb-5 tracking-wide break-words",
        detailsWrapper: "grid grid-cols-2 gap-x-8 gap-y-2.5 text-gray-600",
        detailItem: "flex items-center gap-2",
        detailIcons: [Cake, Briefcase, UserRound, Phone, Mail, Flag],
        detailIconClass: "w-3.5 h-3.5 text-[#7c3aed] shrink-0",
      };
    case "modern":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        contentWrapper: "flex items-start gap-6",
        avatar: "w-20 h-20 rounded-full object-cover bg-white/20 shrink-0 ring-2 ring-white/50",
        infoWrapper: "flex-1 min-w-0",
        name: "text-2xl font-bold text-white mb-1.5 break-words tracking-wide",
        detailsWrapper: "flex flex-wrap gap-x-6 gap-y-1.5 text-white/80",
        detailItem: "flex items-center gap-2",
        detailIcons: [Cake, Briefcase, UserRound, Phone, Mail, Flag],
        detailIconClass: "w-3.5 h-3.5 text-white/70 shrink-0",
      };
    case "elegant":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        contentWrapper: "flex items-start gap-8",
        avatar:
          "w-24 h-24 rounded-full object-cover bg-white/10 shrink-0 ring-[3px] ring-[#c9a96e]/70 shadow-lg shadow-[#c9a96e]/20",
        infoWrapper: "flex-1 min-w-0",
        name: "text-3xl font-semibold text-white mb-3 break-words tracking-[0.05em]",
        detailsWrapper: "flex flex-wrap gap-x-6 gap-y-2 text-white/80",
        detailItem: "inline-flex items-center gap-2 text-sm",
      };
    case "minimal":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        contentWrapper: "flex items-center gap-8",
        avatar: "w-20 h-20 rounded-full object-cover bg-gray-100 shrink-0",
        infoWrapper: "flex-1 min-w-0",
        name: "text-2xl font-semibold text-gray-900 mb-1.5 tracking-tight break-words",
        detailsWrapper: "flex flex-wrap gap-x-5 gap-y-1 text-gray-500",
        detailItem: "inline-flex items-center gap-1.5",
        detailIcons: [Cake, Briefcase, UserRound, Phone, Mail, Flag],
        detailIconClass: "w-3.5 h-3.5 text-gray-400 shrink-0",
      };
    case "luxury":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        contentWrapper: "flex flex-col items-center gap-4 text-center",
        avatar:
          "w-24 h-24 rounded-full object-cover bg-white/10 shrink-0 ring-[3px] ring-[#c9a050]",
        infoWrapper: "w-full min-w-0 flex flex-col items-center",
        name: "font-semibold text-white mb-3 break-words tracking-wide",
        detailsWrapper: "flex flex-col gap-2 text-white/70 w-full",
        detailItem: "flex items-center justify-center gap-1.5",
      };
    case "classic":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        contentWrapper: "flex flex-col items-center gap-3 text-center",
        avatar: "w-24 h-24 rounded-full object-cover bg-gray-100 shrink-0 ring-4 ring-[#1f4e79]/10",
        infoWrapper: "w-full min-w-0 flex flex-col items-center",
        name: "text-3xl font-bold text-[#1f4e79] mb-1.5 tracking-[0.2em] break-words",
        detailsWrapper: "flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-gray-600",
        detailItem: "inline-flex items-center gap-1.5",
        detailIcons: [Cake, Briefcase, UserRound, Phone, Mail, Flag],
        detailIconClass: "w-3.5 h-3.5 text-[#1f4e79] shrink-0",
      };
    case "fresh":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        contentWrapper: "flex items-center gap-5",
        avatar:
          "w-20 h-20 rounded-full object-cover bg-teal-100/60 shrink-0 ring-4 ring-white shadow-sm",
        infoWrapper: "flex-1 min-w-0",
        name: "text-2xl font-bold text-teal-800 mb-1.5 break-words",
        detailsWrapper: "flex flex-wrap gap-x-4 gap-y-1.5",
        detailItem:
          "inline-flex items-center gap-1.5 bg-white/80 rounded-full px-3 py-0.5 text-gray-600 shadow-sm",
        detailIcons: [Cake, Briefcase, UserRound, Phone, Mail, Flag],
        detailIconClass: "w-3.5 h-3.5 text-teal-600 shrink-0",
      };
    case "sidebar-dark":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        contentWrapper: "flex flex-col items-center gap-4 text-center",
        avatar: "w-28 h-28 rounded-full object-cover bg-white/10 shrink-0 ring-4 ring-white/15",
        infoWrapper: "w-full min-w-0 flex flex-col items-center",
        name: "text-2xl font-bold text-white mb-2 tracking-wide break-words",
        detailsWrapper: "flex flex-col gap-2 text-white/75 w-full",
        detailItem: "flex items-center justify-center gap-2",
        detailIcons: [Cake, Briefcase, UserRound, Phone, Mail, Flag],
        detailIconClass: "w-3.5 h-3.5 text-[#6ea8dd] shrink-0",
      };
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        contentWrapper: "flex items-center justify-between gap-6",
        avatar: "w-24 h-24 rounded-xl object-cover bg-gray-100 shrink-0 ring-1 ring-gray-200",
        infoWrapper: "flex-1 min-w-0",
        name: "text-3xl font-bold text-gray-900 mb-3 tracking-tight break-words",
        detailsWrapper: "flex flex-wrap gap-x-5 gap-y-1.5 text-gray-600",
        detailItem: "inline-flex items-center gap-1.5",
        detailIcons: [Cake, Briefcase, UserRound, Phone, Mail, Flag],
        detailIconClass: "w-3.5 h-3.5 text-primary-500 shrink-0",
      };
  }
};
