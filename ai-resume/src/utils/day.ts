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

/**
 * 相对时间格式化（侧边栏记录列表用）：1 小时内显示“n 分钟前”，当天显示“n 小时前”，
 * 昨天显示“昨天”，一周内显示“n 天前”，更早显示具体日期
 */
export const formatRelativeTime = (date: string) => {
  const target = dayjs(date);
  if (!target.isValid()) return "";
  const now = dayjs();
  const diffMinutes = now.diff(target, "minute");
  if (diffMinutes < 1) return "刚刚";
  if (diffMinutes < 60) return `${diffMinutes} 分钟前`;
  if (target.isSame(now, "day")) return `${now.diff(target, "hour")} 小时前`;
  if (target.isSame(now.subtract(1, "day"), "day")) return "昨天";
  const diffDays = now.diff(target, "day");
  if (diffDays < 7) return `${diffDays} 天前`;
  if (target.isSame(now, "year")) return target.format("M月D日");
  return target.format("YYYY年M月D日");
};
