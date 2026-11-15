/**
 * SSE 客户端共用基础工具
 *
 * 各业务 SSE 客户端（模拟面试提交回答 / 问题语音 / 语音识别 / AI 生成简历）
 * 都使用原生 fetch + ReadableStream，不走 axios 实例与响应拦截器，但
 * 「读取登录 token」与「解析 `data:` 帧」这两件事完全一致，集中在此处实现：
 *
 * - 帧格式：每帧 `data: {...}\n\n`，单帧可含多行 data:（合并后 JSON.parse）
 * - token 读取方式与 src/http/request.ts 的 axios 请求拦截器保持一致
 *   （localStorage 中 `auth` 的 `token` 字段）
 */

/** localStorage 中持久化的 auth store 键，与 src/http/request.ts 保持一致 */
const AUTH_STORAGE_KEY = "auth";

/** 从 localStorage 读取 auth token，与 src/http/request.ts 保持一致 */
export const getAuthToken = (): string | null => {
  try {
    const authStoreStr = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!authStoreStr) return null;
    const authStore = JSON.parse(authStoreStr);
    return authStore?.token ?? null;
  } catch (e) {
    console.warn("Failed to retrieve auth token", e);
    return null;
  }
};

/**
 * 解析单个 SSE 帧：合并多行 data: 字段并 JSON.parse
 *
 * @param frame 以 `\n\n` 切分出的单帧文本（不含结尾空行）
 * @param label 解析失败时日志中的协议名，便于定位来源
 * @returns 解析成功返回业务帧对象；无 data: 行或 JSON 非法时返回 null（调用方跳过该帧）
 */
export const parseSseFrame = <T>(frame: string, label = "SSE"): T | null => {
  const dataLines = frame
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim());

  if (dataLines.length === 0) return null;

  const jsonStr = dataLines.join("\n");
  try {
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.warn(`Failed to parse ${label} frame`, jsonStr, e);
    return null;
  }
};
