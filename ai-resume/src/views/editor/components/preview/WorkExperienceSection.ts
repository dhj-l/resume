import type { templateType } from "./type";

interface WorkExperienceStyles {
  container: string;
  title: string;
  listWrapper: string;
  itemWrapper: string;
  headerWrapper: string;
  companyName: string;
  timeRange: string;
  position: string;
  description: string;
  empty: string;
}

export const getWorkExperienceStyles = (type: templateType): WorkExperienceStyles => {
  const commonStyles = {
    container:
      "resume-section w-full hover:bg-blue-50 hover:border-blue-300 border border-transparent rounded cursor-pointer transition-all duration-200",
    title: "text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3",
    listWrapper: "space-y-4",
    itemWrapper: "",
    headerWrapper: "flex flex-wrap justify-between items-baseline gap-2 mb-1",
    companyName: "font-bold text-gray-800 break-words",
    timeRange: "text-gray-600 shrink-0", // Removed text-sm
    position: "font-medium text-gray-700 mb-1", // Removed text-sm
    description: "text-gray-600 whitespace-pre-wrap",
    empty: "text-gray-400 italic",
  };

  switch (type) {
    case "double-column":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`, // Removed p-0 mb-0
      };
    case "simple":
      return {
        ...commonStyles,
        title:
          "text-lg font-bold text-[#6D28D9] pl-3 border-l-[3px] border-[#6D28D9] mb-4 bg-[#F5F3FF] py-1.5 px-4 rounded-r-md",
        container: `${commonStyles.container}`,
        companyName: "font-bold text-[#6D28D9] break-words",
        position: "font-medium text-gray-700 mb-1",
        timeRange: "text-gray-500 shrink-0",
      };
    case "modern":
      return {
        ...commonStyles,
        title: "text-base font-bold text-gray-800 pl-3 border-l-[3px] border-primary-500 mb-4",
        container: `${commonStyles.container}`,
        itemWrapper: "pl-4 border-l-2 border-primary-200 py-2",
        companyName: "font-bold text-gray-800",
        position: "text-primary-600 font-medium mb-1",
        timeRange: "text-gray-500 shrink-0",
        description: "text-gray-600 whitespace-pre-wrap mt-1",
      };
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container}`, // Removed p-4 mb-4
      };
  }
};
