import type { Template } from "@/api/templates/type";

// 页面props（如果从父组件接收数据）
export interface TemplateListProps {
  templates: Template[];
  loading?: boolean;
}
