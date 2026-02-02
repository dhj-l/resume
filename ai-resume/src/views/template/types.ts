// 模板数据接口
export interface ResumeTemplate {
  id: string;
  name: string;
  previewImage: string; // 模板预览图URL
  category: string; // 适用岗位类型
  usedCount: number; // 使用人数
  createdAt: string; // 创建时间，格式YYYY-MM-DD
  description?: string; // 模板描述（详情页用）
  tags?: string[]; // 标签数组
}

// 页面props（如果从父组件接收数据）
export interface TemplateListProps {
  templates: ResumeTemplate[];
  loading?: boolean;
}
