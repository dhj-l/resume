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
    contentWrapper: "flex flex-wrap gap-4 sm:gap-8 text-gray-700", // Removed text-sm
    item: "",
    label: "font-medium",
    value: "break-words",
    empty: "text-gray-400 italic",
  };

  switch (type) {
    case "double-column":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`, // Removed p-0 mb-0
        // 双栏模式下可能需要调整间距
        contentWrapper: "flex flex-wrap gap-4 text-gray-700", // Removed text-sm
      };
    case "simple":
      return {
        ...commonStyles,
        title:
          "text-lg font-bold text-[#6D28D9] pl-3 border-l-[3px] border-[#6D28D9] mb-4 bg-[#F5F3FF] py-1.5 px-4 rounded-r-md",
        container: `${commonStyles.container}`,
        contentWrapper: "flex flex-wrap gap-4 sm:gap-8 text-gray-600",
        label: "font-medium text-[#6D28D9]",
        value: "break-words text-gray-800",
      };
    case "modern":
      return {
        ...commonStyles,
        title: "text-base font-bold text-gray-800 pl-3 border-l-[3px] border-primary-500 mb-4",
        container: `${commonStyles.container}`,
        contentWrapper: "grid grid-cols-2 gap-x-6 gap-y-2 text-gray-700",
        label: "text-gray-500",
        value: "font-medium text-gray-800",
      };
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container}`, // Removed p-4 mb-4
      };
  }
};
