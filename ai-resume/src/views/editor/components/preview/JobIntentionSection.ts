import type { templateType } from "./type";

interface JobIntentionStyles {
  container: string;
  title: string;
  contentWrapper: string;
  item: string;
  label: string;
  value: string;
  empty: string;
}

export const getJobIntentionStyles = (type: templateType): JobIntentionStyles => {
  const commonStyles = {
    container:
      "resume-section w-full hover:bg-blue-50 hover:border-blue-300 border border-transparent rounded cursor-pointer transition-all duration-200",
    title: "text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3",
    contentWrapper: "flex flex-wrap gap-4 sm:gap-8 text-sm text-gray-700",
    item: "",
    label: "font-medium",
    value: "break-words",
    empty: "text-gray-400 italic",
  };

  switch (type) {
    case "double-column":
      return {
        ...commonStyles,
        container: `${commonStyles.container} p-0 mb-0`,
        // 双栏模式下可能需要调整间距
        contentWrapper: "flex flex-wrap gap-4 text-sm text-gray-700",
      };
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container} p-4 mb-4`,
      };
  }
};
