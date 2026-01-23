import type { templateType } from "./type";

interface SelfEvaluationStyles {
  container: string;
  title: string;
  content: string;
  empty: string;
}

export const getSelfEvaluationStyles = (
  type: templateType,
): SelfEvaluationStyles => {
  const commonStyles = {
    container:
      "resume-section w-full hover:bg-blue-50 hover:border-blue-300 border border-transparent rounded cursor-pointer transition-all duration-200",
    title: "text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3",
    content: "text-sm text-gray-700 leading-relaxed whitespace-pre-wrap",
    empty: "text-gray-400 italic",
  };

  switch (type) {
    case "double-column":
      return {
        ...commonStyles,
        container: `${commonStyles.container} p-0 mb-0`,
        title: "text-lg font-bold text-gray-800 mb-3", // 移除下划线
        content: "text-sm text-gray-600 leading-relaxed", // 字体颜色微调
      };
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container} p-4 mb-4`,
      };
  }
};
