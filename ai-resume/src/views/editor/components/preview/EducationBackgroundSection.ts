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
        container: `${commonStyles.container}`, // Removed p-0 mb-0
        // 双栏模式下标题样式保持一致
      };
    case "simple":
      return {
        ...commonStyles,
        title:
          "text-lg font-bold text-[#6D28D9] pl-3 border-l-[3px] border-[#6D28D9] mb-4 bg-[#F5F3FF] py-1.5 px-4 rounded-r-md",
        container: `${commonStyles.container}`,
        schoolName: "font-bold text-[#6D28D9] break-words",
        detailsWrapper: "flex gap-4 text-gray-600",
      };
    case "modern":
      return {
        ...commonStyles,
        title: "text-base font-bold text-gray-800 pl-3 border-l-[3px] border-primary-500 mb-4",
        container: `${commonStyles.container}`,
        itemWrapper:
          "pl-4 border-l-2 border-primary-200 py-2 outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-gray-300",
        schoolName: "font-bold text-gray-800",
        timeRange: "text-gray-500 shrink-0",
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
        title: "font-light text-[#111] tracking-[0.2em] uppercase mb-6",
        container: `${commonStyles.container}`,
        itemWrapper:
          "pb-5 border-b border-[#e5e5e5] last:border-b-0 last:pb-0 outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-gray-300",
        headerWrapper: "flex items-baseline justify-between gap-4 mb-1",
        schoolName: "font-semibold text-[#111]",
        timeRange: "text-[#999] tracking-wide shrink-0",
        detailsWrapper: "flex gap-4 text-[#666]",
        courses: "mt-1 text-[#999]",
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
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container}`, // Removed p-4 mb-4
      };
  }
};
