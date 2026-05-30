import type { templateType } from "./type";

interface BasicInfoStyles {
  container: string;
  contentWrapper: string;
  avatar: string;
  infoWrapper: string;
  name: string;
  detailsWrapper: string;
  detailItem: string;
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
        container: `${commonStyles.container}`, // Removed p-0 mb-0
        contentWrapper: "flex flex-col items-center gap-4 text-center", // Removed text-center if it conflicts? No, alignment is fine.
        avatar:
          "w-32 h-32 rounded-full object-cover bg-gray-200 shrink-0 border-4 border-white shadow-sm",
        infoWrapper: "w-full min-w-0 flex flex-col items-center",
        name: "text-2xl font-bold text-gray-900 mb-4 break-words",
        detailsWrapper: "flex flex-col gap-2 text-gray-600 w-full ", // Removed text-sm
        detailItem: "flex items-center justify-start gap-2",
      };
    case "simple":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        contentWrapper: "flex flex-row-reverse items-center justify-between gap-8",
        avatar: "w-32 h-40 rounded object-cover bg-gray-200 shrink-0 shadow-sm",
        infoWrapper: "flex-1 min-w-0",
        name: "text-3xl font-bold text-[#6D28D9] mb-6 tracking-wide",
        detailsWrapper: "grid grid-cols-2 gap-x-8 gap-y-3 text-gray-600",
        detailItem: "flex items-center gap-2",
      };
    case "modern":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        contentWrapper: "flex items-start gap-6",
        avatar: "w-20 h-20 rounded-full object-cover bg-white/20 shrink-0 ring-2 ring-white/50",
        infoWrapper: "flex-1 min-w-0",
        name: "text-2xl font-bold text-white mb-1 break-words tracking-wide",
        detailsWrapper: "flex flex-wrap gap-x-6 gap-y-1 text-white/80",
        detailItem: "flex items-center gap-2",
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
        avatar: "w-24 h-24 rounded-full object-cover bg-gray-100 shrink-0",
        infoWrapper: "flex-1 min-w-0",
        name: "font-light text-[#111] mb-1 break-words tracking-tight",
        detailsWrapper: "flex flex-wrap gap-x-4 gap-y-0.5 text-[#666]",
        detailItem: "inline-flex items-center gap-1",
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
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container}`, // Removed p-6
        contentWrapper: "flex items-start gap-6",
        avatar: "w-24 h-24 rounded object-cover bg-gray-200 shrink-0",
        infoWrapper: "flex-1 min-w-0",
        name: "text-2xl font-bold text-gray-900 mb-2 break-words",
        detailsWrapper: "flex flex-wrap gap-x-8 gap-y-2 text-gray-600", // Removed text-sm
        detailItem: "flex items-center gap-2",
      };
  }
};
