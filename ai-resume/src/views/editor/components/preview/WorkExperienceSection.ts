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
}

export const getWorkExperienceStyles = (type: templateType): WorkExperienceStyles => {
  const commonStyles = {
    container:
      "resume-section w-full border border-transparent rounded cursor-pointer transition-all duration-200",
    title: "text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3",
    listWrapper: "space-y-4",
    itemWrapper: "",
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
        container: `${commonStyles.container}`, // Removed p-0 mb-0
      };
    case "simple":
      return {
        ...commonStyles,
        title:
          "text-lg font-bold text-[#6D28D9] pl-3 border-l-[3px] border-[#6D28D9] mb-4 bg-[#F5F3FF] py-1.5 px-4 rounded-r-md",
        container: `${commonStyles.container}`,
        companyName: "font-bold text-[#6D28D9] break-words",
        position: "font-medium text-gray-700 mb-1",
        timeRange: "text-gray-500 shrink-0",
      };
    case "modern":
      return {
        ...commonStyles,
        title: "text-base font-bold text-gray-800 pl-3 border-l-[3px] border-primary-500 mb-4",
        container: `${commonStyles.container}`,
        itemWrapper: "pl-4 border-l-2 border-primary-200 py-2",
        companyName: "font-bold text-gray-800",
        position: "text-primary-600 font-medium mb-1",
        timeRange: "text-gray-500 shrink-0",
        description: "text-gray-600 whitespace-pre-wrap mt-1",
      };
    case "elegant":
      return {
        ...commonStyles,
        title: "text-xs tracking-[0.15em] uppercase font-semibold text-[#8a8780] mb-4",
        container: `${commonStyles.container}`,
        itemWrapper: "relative pl-4 border-l-2 border-[#ede8df] pb-4 last:border-l-0 last:pb-0",
        headerWrapper: "flex flex-col gap-0.5 mb-1",
        companyName: "font-semibold text-[#1a1a2e]",
        position: "font-medium text-[#5a5a7a]",
        timeRange: "text-[#9a9aa0] tracking-wide",
        description: "text-[#555] leading-relaxed mt-1",
      };
    case "minimal":
      return {
        ...commonStyles,
        title: "font-light text-[#111] tracking-[0.2em] uppercase mb-6",
        container: `${commonStyles.container}`,
        itemWrapper: "pb-5 border-b border-[#e5e5e5] last:border-b-0 last:pb-0",
        headerWrapper: "flex items-baseline justify-between gap-4 mb-1",
        companyName: "font-semibold text-[#111]",
        position: "font-medium text-[#555]",
        timeRange: "text-[#999] tracking-wide shrink-0",
        description: "text-[#555] leading-relaxed mt-2",
      };
    case "luxury":
      return {
        ...commonStyles,
        title:
          "font-semibold text-[#c9a050] tracking-[0.2em] uppercase border-b-2 border-[#c9a050]/40 pb-2 mb-5",
        container: `${commonStyles.container}`,
        itemWrapper: "pb-5 mb-1 last:pb-0 last:mb-0",
        headerWrapper: "flex items-baseline justify-between gap-4 mb-1",
        companyName: "font-semibold text-[#1a1a1a]",
        position: "font-medium text-[#555]",
        timeRange: "text-[#999] tracking-wide shrink-0",
        description: "text-[#555] leading-relaxed mt-2",
      };
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container}`, // Removed p-4 mb-4
      };
  }
};
