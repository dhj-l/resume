import type { templateType } from "./type";

interface SelfEvaluationStyles {
  container: string;
  title: string;
  content: string;
  empty: string;
}

export const getSelfEvaluationStyles = (type: templateType): SelfEvaluationStyles => {
  const commonStyles = {
    container:
      "resume-section w-full border border-transparent rounded cursor-pointer transition-all duration-200",
    title: "text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3",
    content: "text-gray-700 whitespace-pre-wrap",
    empty: "text-gray-400 italic",
  };

  switch (type) {
    case "double-column":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`, // Removed p-0 mb-0
        title: "text-lg font-bold text-gray-800 mb-3", // 移除下划线
        content: "text-gray-600",
      };
    case "simple":
      return {
        ...commonStyles,
        title:
          "text-lg font-bold text-[#6D28D9] pl-3 border-l-[3px] border-[#6D28D9] mb-4 bg-[#F5F3FF] py-1.5 px-4 rounded-r-md",
        container: `${commonStyles.container}`,
        content: "text-gray-600 whitespace-pre-wrap leading-relaxed",
      };
    case "modern":
      return {
        ...commonStyles,
        title: "text-base font-bold text-gray-800 pl-3 border-l-[3px] border-primary-500 mb-4",
        container: `${commonStyles.container}`,
        content: "text-gray-600 whitespace-pre-wrap leading-relaxed",
      };
    case "elegant":
      return {
        ...commonStyles,
        title: "text-xs tracking-[0.15em] uppercase font-semibold text-[#8a8780] mb-4",
        container: `${commonStyles.container}`,
        content:
          "text-[#4a4a6a] whitespace-pre-wrap leading-relaxed italic border-l-[3px] border-[#c9a96e]/40 pl-5 py-2",
      };
    case "minimal":
      return {
        ...commonStyles,
        title: "font-light text-[#111] tracking-[0.2em] uppercase mb-4",
        container: `${commonStyles.container}`,
        content: "text-[#555] whitespace-pre-wrap leading-relaxed",
      };
    case "luxury":
      return {
        ...commonStyles,
        title: "tracking-[0.2em] uppercase font-semibold text-[#c9a050] mb-3",
        container: `${commonStyles.container}`,
        content:
          "text-white/60 whitespace-pre-wrap leading-relaxed italic border-l-2 border-[#c9a050]/30 pl-3",
      };
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container}`, // Removed p-4 mb-4
      };
  }
};
