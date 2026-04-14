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
      "resume-section w-full hover:bg-blue-50 hover:border-blue-300 border border-transparent rounded cursor-pointer transition-all duration-200",
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
        title: "inline-block text-lg font-bold text-white bg-[#8B5CF6] px-4 py-1 mb-4 shadow-sm",
        container: `${commonStyles.container}`,
      };
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container}`, // Removed p-4 mb-4
      };
  }
};
