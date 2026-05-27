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
      "resume-section w-full border border-transparent rounded cursor-pointer transition-all duration-200",
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
        title: "text-base font-bold text-white/80 pl-3 border-l-[3px] border-white/40 mb-4",
        container: `${commonStyles.container}`,
        contentWrapper: "grid grid-cols-2 gap-x-6 gap-y-2 text-white/80",
        label: "text-white/60",
        value: "font-medium text-white",
      };
    case "elegant":
      return {
        ...commonStyles,
        title: "text-xs tracking-[0.15em] uppercase font-semibold text-[#8a8780] mb-3",
        container: `${commonStyles.container}`,
        contentWrapper: "flex flex-wrap gap-x-6 gap-y-2",
        label: "text-[#c9a96e] text-xs tracking-wider uppercase",
        value: "font-medium text-[#2d3436]",
      };
    case "minimal":
      return {
        ...commonStyles,
        title: "hidden",
        container: `${commonStyles.container}`,
        contentWrapper: "flex flex-wrap gap-x-6 gap-y-1 text-[#666]",
        label: "text-[#999] text-xs uppercase tracking-wider",
        value: "text-[#333] font-medium",
      };
    case "luxury":
      return {
        ...commonStyles,
        title: "text-xs tracking-[0.2em] uppercase font-semibold text-[#c9a050] mb-3",
        container: `${commonStyles.container}`,
        contentWrapper: "flex flex-col gap-2 text-white/80",
        label: "text-white/50 text-xs",
        value: "font-medium text-white text-sm",
      };
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container}`, // Removed p-4 mb-4
      };
  }
};
