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

export const getEducationBackgroundStyles = (
  type: templateType,
): EducationBackgroundStyles => {
  const commonStyles = {
    container:
      "resume-section w-full hover:bg-blue-50 hover:border-blue-300 border border-transparent rounded cursor-pointer transition-all duration-200",
    title: "text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3",
    listWrapper: "space-y-4",
    itemWrapper: "flex justify-between items-start",
    contentWrapper: "flex-1 min-w-0",
    headerWrapper: "flex flex-wrap justify-between items-baseline gap-2 mb-1",
    schoolName: "font-bold text-gray-800 break-words",
    timeRange: "text-sm text-gray-600 shrink-0",
    detailsWrapper: "flex gap-4 text-sm text-gray-700",
    courses: "mt-1 text-xs text-gray-500",
    empty: "text-gray-400 italic",
  };

  switch (type) {
    case "double-column":
      return {
        ...commonStyles,
        container: `${commonStyles.container} p-0 mb-0`,
        // 双栏模式下标题样式保持一致
      };
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container} p-4 mb-4`,
      };
  }
};
