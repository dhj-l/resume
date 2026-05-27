import type { templateType } from "./type";

interface CertificatesStyles {
  container: string;
  title: string;
  list: string;
  listItem: string;
  empty: string;
}

export const getCertificatesStyles = (type: templateType): CertificatesStyles => {
  const commonStyles = {
    container:
      "resume-section w-full border border-transparent rounded cursor-pointer transition-all duration-200",
    title: "text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3",
    list: "list-disc list-inside text-gray-700 space-y-1", // Removed text-sm
    listItem: "",
    empty: "text-gray-400 italic",
  };

  switch (type) {
    case "double-column":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`, // Removed p-0 mb-0
        title: "text-lg font-bold text-gray-800 mb-3", // 移除下划线，更简洁
        list: "text-gray-600 space-y-2", // Removed text-sm
        listItem: "bg-white p-2 rounded shadow-sm", // 卡片式展示
      };
    case "simple":
      return {
        ...commonStyles,
        title:
          "text-lg font-bold text-[#6D28D9] pl-3 border-l-[3px] border-[#6D28D9] mb-4 bg-[#F5F3FF] py-1.5 px-4 rounded-r-md",
        container: `${commonStyles.container}`,
        list: "space-y-2 text-gray-700",
        listItem: "flex items-center gap-2",
      };
    case "modern":
      return {
        ...commonStyles,
        title: "text-base font-bold text-gray-800 pl-3 border-l-[3px] border-primary-500 mb-4",
        container: `${commonStyles.container}`,
        list: "space-y-2 text-gray-700",
        listItem: "flex items-center gap-2 pl-4 border-l-2 border-primary-200 py-1",
      };
    case "elegant":
      return {
        ...commonStyles,
        title: "text-xs tracking-[0.15em] uppercase font-semibold text-[#8a8780] mb-4",
        container: `${commonStyles.container}`,
        list: "space-y-2 text-[#555]",
        listItem: "flex items-center gap-2 pl-4 border-l-2 border-[#c9a96e]/40 py-1 text-sm",
      };
    case "minimal":
      return {
        ...commonStyles,
        title: "text-base font-light text-[#111] tracking-[0.2em] uppercase mb-4",
        container: `${commonStyles.container}`,
        list: "space-y-1.5 text-[#555] text-sm",
        listItem: "flex items-center gap-2",
      };
    case "luxury":
      return {
        ...commonStyles,
        title: "text-xs tracking-[0.2em] uppercase font-semibold text-[#c9a050] mb-3",
        container: `${commonStyles.container}`,
        list: "space-y-1.5 text-white/70 text-sm",
        listItem: "flex items-center gap-2",
      };
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container}`, // Removed p-4 mb-4
      };
  }
};
