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
    list: "list-disc list-inside text-sm text-gray-700 space-y-1",
    listItem: "",
    empty: "text-gray-400 italic",
  };

  switch (type) {
    case "double-column":
      return {
        ...commonStyles,
        container: `${commonStyles.container} p-0 mb-0`,
        title: "text-lg font-bold text-gray-800 mb-3", // 移除下划线，更简洁
        list: "text-sm text-gray-600 space-y-2", // 移除默认列表样式，自定义间距
        listItem: "bg-white p-2 rounded shadow-sm", // 卡片式展示
      };
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container} p-4 mb-4`,
      };
  }
};
