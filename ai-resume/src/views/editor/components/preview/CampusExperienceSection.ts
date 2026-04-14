import type { templateType } from "./type";

interface CampusExperienceStyles {
  container: string;
  title: string;
  listWrapper: string;
  itemWrapper: string;
  headerWrapper: string;
  projectName: string;
  timeRange: string;
  role: string;
  description: string;
  empty: string;
}

export const getCampusExperienceStyles = (type: templateType): CampusExperienceStyles => {
  const commonStyles = {
    container:
      "resume-section w-full hover:bg-blue-50 hover:border-blue-300 border border-transparent rounded cursor-pointer transition-all duration-200",
    title: "text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3",
    listWrapper: "space-y-4",
    itemWrapper: "",
    headerWrapper: "flex flex-wrap justify-between items-baseline gap-2 mb-1",
    projectName: "font-bold text-gray-800 break-words",
    timeRange: "text-gray-600 shrink-0",
    role: "text-gray-700 mb-1 font-medium",
    description: "text-gray-600 whitespace-pre-wrap",
    empty: "text-gray-400 italic",
  };

  switch (type) {
    case "double-column":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
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
        container: `${commonStyles.container}`,
      };
  }
};
