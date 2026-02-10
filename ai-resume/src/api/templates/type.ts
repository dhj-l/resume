export interface Template {
  /** 模板ID */
  _id: string;
  /** 模板名称 */
  name: string;
  /** 预览图片URL */
  previewImage: string;
  /** 模板分类 */
  category: string;
  /** 使用次数 */
  usedCount: number;
  /** 关联的简历ID */
  resume: string;
  /** 关联的简历ID */
  resumeId: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}
export interface TemplateListResponse {
  total: number;
  list: Template[];
  page: number;
  pageSize: number;
}

export interface TemplateListParams {
  name?: string;
  page?: number;
  pageSize?: number;
}
