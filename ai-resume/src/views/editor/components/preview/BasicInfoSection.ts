import type { templateType } from "./type";

interface BasicInfoStyles {
  container: string;
  contentWrapper: string;
  avatar: string;
  infoWrapper: string;
  name: string;
  detailsWrapper: string;
  detailItem: string;
}

export const getBasicInfoStyles = (type: templateType): BasicInfoStyles => {
  const commonStyles = {
    container:
      "resume-section w-full hover:bg-blue-50 hover:border-blue-300 border border-transparent rounded cursor-pointer transition-all duration-200",
  };

  switch (type) {
    case "double-column":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`, // Removed p-0 mb-0
        contentWrapper: "flex flex-col items-center gap-4 text-center", // Removed text-center if it conflicts? No, alignment is fine.
        avatar:
          "w-32 h-32 rounded-full object-cover bg-gray-200 shrink-0 border-4 border-white shadow-sm",
        infoWrapper: "w-full min-w-0 flex flex-col items-center",
        name: "text-2xl font-bold text-gray-900 mb-4 break-words",
        detailsWrapper: "flex flex-col gap-2 text-gray-600 w-full ", // Removed text-sm
        detailItem: "flex items-center justify-start gap-2",
      };
    case "simple":
      return {
        ...commonStyles,
        container: `${commonStyles.container}`,
        contentWrapper:
          "flex flex-row-reverse items-center justify-between gap-8",
        avatar: "w-32 h-40 rounded object-cover bg-gray-200 shrink-0 shadow-sm",
        infoWrapper: "flex-1 min-w-0",
        name: "text-3xl font-bold text-gray-900 mb-6 tracking-wide",
        detailsWrapper: "grid grid-cols-2 gap-x-8 gap-y-3 text-gray-600",
        detailItem: "flex items-center gap-2",
      };
    case "default":
    default:
      return {
        ...commonStyles,
        container: `${commonStyles.container}`, // Removed p-6
        contentWrapper: "flex items-start gap-6",
        avatar: "w-24 h-24 rounded object-cover bg-gray-200 shrink-0",
        infoWrapper: "flex-1 min-w-0",
        name: "text-2xl font-bold text-gray-900 mb-2 break-words",
        detailsWrapper: "flex flex-wrap gap-x-8 gap-y-2 text-gray-600", // Removed text-sm
        detailItem: "flex items-center gap-2",
      };
  }
};
