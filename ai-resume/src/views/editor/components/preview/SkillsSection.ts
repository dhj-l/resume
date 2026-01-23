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
      "resume-section w-full hover:bg-blue-50 hover:border-blue-300 border border-transparent rounded cursor-pointer transition-all duration-200",
    title: "text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3",
    listWrapper: "flex flex-wrap gap-2",
    item: "px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm",
    empty: "text-gray-400 italic",
  };

  switch (type) {
    case "double-column":
      return {
        ...commonStyles,
        container: `${commonStyles.container} p-0 mb-0`,
        title: "text-lg font-bold text-gray-800 mb-3", // 移除下划线
        listWrapper: "flex flex-wrap gap-2",
        item: "px-2 py-1 bg-white border border-gray-200 text-gray-600 rounded text-xs", // 更精致的标签样式
      };
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container} p-4 mb-4`,
      };
  }
};
