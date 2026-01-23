import type { TemplateItem } from "./type";
import DefaultTemplate from "./template-list/default-template/default-template.vue";
export const templateList: TemplateItem[] = [
  {
    label: "默认通用模板",
    value: "default",
    component: DefaultTemplate,
  },
];
