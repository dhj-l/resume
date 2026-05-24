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
      "resume-section w-full hover:bg-blue-50 hover:border-blue-300 border border-transparent rounded cursor-pointer transition-all duration-200",
    title: "text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3",
    listWrapper: "space-y-4",
    itemWrapper: "flex justify-between items-start",
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
        itemWrapper: "pl-4 border-l-2 border-primary-200 py-2",
        schoolName: "font-bold text-gray-800",
        timeRange: "text-gray-500 shrink-0",
        detailsWrapper: "flex gap-4 text-gray-600",
        courses: "mt-1 text-gray-500",
      };
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container}`, // Removed p-4 mb-4
      };
  }
};
