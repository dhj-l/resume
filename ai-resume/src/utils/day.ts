import dayjs from "dayjs";

/**
 *
 * @param date 日期字符串
 * @param format 日期格式 默认 "YYYY-MM-DD"
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: string, format = "YYYY-MM-DD") => {
  return dayjs(date).format(format);
};
