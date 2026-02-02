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
    content: "text-gray-700 leading-relaxed whitespace-pre-wrap", // Removed text-sm
    empty: "text-gray-400 italic",
  };

  switch (type) {
    case "double-column":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`, // Removed p-0 mb-0
        title: "text-lg font-bold text-gray-800 mb-3", // 移除下划线
        content: "text-gray-600 leading-relaxed", // Removed text-sm
      };
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container}`, // Removed p-4 mb-4
      };
  }
};
