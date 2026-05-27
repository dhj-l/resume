import type { templateType } from "./type";

interface SkillsStyles {
  container: string;
  title: string;
  listWrapper: string;
  item: string;
  empty: string;
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
        container: `${commonStyles.container}`, // Removed p-0 mb-0
        title: "text-lg font-bold text-gray-800 mb-3", // 移除下划线
        listWrapper: "flex flex-wrap gap-2",
        item: "px-2 py-1 bg-white border border-gray-200 text-gray-600 rounded", // Removed text-xs
      };
    case "simple":
      return {
        ...commonStyles,
        title:
          "text-lg font-bold text-[#6D28D9] pl-3 border-l-[3px] border-[#6D28D9] mb-4 bg-[#F5F3FF] py-1.5 px-4 rounded-r-md",
        container: `${commonStyles.container}`,
        listWrapper: "flex flex-wrap gap-2",
        item: "px-3 py-1 bg-[#F5F3FF] text-[#6D28D9] rounded-full font-medium",
      };
    case "modern":
      return {
        ...commonStyles,
        title: "text-base font-bold text-gray-800 pl-3 border-l-[3px] border-primary-500 mb-4",
        container: `${commonStyles.container}`,
        listWrapper: "flex flex-wrap gap-2",
        item: "px-3 py-1 bg-primary-50 text-primary-700 rounded-full font-medium",
      };
    case "elegant":
      return {
        ...commonStyles,
        title: "text-xs tracking-[0.15em] uppercase font-semibold text-[#8a8780] mb-4",
        container: `${commonStyles.container}`,
        listWrapper: "flex flex-wrap gap-2",
        item: "px-3 py-1.5 bg-[#f5f0e8] text-[#5a4a3a] rounded-sm border border-[#e8e0d4] text-sm tracking-wide",
      };
    case "minimal":
      return {
        ...commonStyles,
        title: "text-base font-light text-[#111] tracking-[0.2em] uppercase mb-4",
        container: `${commonStyles.container}`,
        listWrapper: "flex flex-wrap gap-2",
        item: "px-3 py-1 bg-gray-50 text-[#555] rounded text-xs border border-[#e5e5e5]",
      };
    case "luxury":
      return {
        ...commonStyles,
        title: "text-xs tracking-[0.2em] uppercase font-semibold text-[#c9a050] mb-3",
        container: `${commonStyles.container}`,
        listWrapper: "flex flex-wrap gap-1.5 text-white/80",
        item: "px-2.5 py-1 bg-white/10 text-white/90 rounded text-xs border border-white/10",
      };
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container}`, // Removed p-4 mb-4
      };
  }
};
