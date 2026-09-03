import { ref } from "vue";

import { defineStore } from "pinia";

import { getSessionDetailAPI, getSessionListAPI } from "@/api/interview/interview";
import type { InterviewSession, InterviewSessionSummary } from "@/api/interview/type";

const SIDEBAR_COLLAPSED_KEY = "interview-sidebar-collapsed";

export const useInterviewStore = defineStore("interview", () => {
  /** 面试会话记录列表（侧边栏展示） */
  const sessionList = ref<InterviewSessionSummary[]>([]);
  const listLoading = ref(false);
  /** 列表是否已成功加载过（避免重复请求） */
  const listLoaded = ref(false);

  /** 侧边栏折叠状态（桌面端，持久化到 localStorage） */
  const sidebarCollapsed = ref(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1");

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value;
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, sidebarCollapsed.value ? "1" : "0");
  };

  const fetchSessionList = async (force = false) => {
    if (listLoading.value || (listLoaded.value && !force)) return;
    listLoading.value = true;
    try {
      const { data } = await getSessionListAPI({ page: 1, pageSize: 50 });
      sessionList.value = data.list;
      listLoaded.value = true;
    } finally {
      listLoading.value = false;
    }
  };

  /** 会话在页面内发生变化（新建 / 收尾 / 放弃）后，同步侧边栏列表项 */
  const upsertSession = (summary: InterviewSessionSummary) => {
    const index = sessionList.value.findIndex((item) => item._id === summary._id);
    if (index >= 0) {
      sessionList.value[index] = { ...sessionList.value[index], ...summary };
    } else {
      sessionList.value.unshift(summary);
    }
  };

  /**
   * 加载会话详情（含对话历史），失败时抛出异常由调用方提示
   */
  const loadSession = async (id: string): Promise<InterviewSession> => {
    const { data } = await getSessionDetailAPI(id);
    return data;
  };

  return {
    sessionList,
    listLoading,
    listLoaded,
    sidebarCollapsed,
    toggleSidebar,
    fetchSessionList,
    upsertSession,
    loadSession,
  };
});
