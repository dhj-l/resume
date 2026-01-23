import type { TemplateItem } from "./type";
import DefaultTemplate from "./template-list/default-template/default-template.vue";
import DoubleColumnTemplate from "./template-list/double-column-template/double-column-template.vue";

export const templateList: TemplateItem[] = [
  {
    label: "默认通用模板",
    value: "default",
    component: DefaultTemplate,
  },
  {
    label: "双栏专业模板",
    value: "double-column",
    component: DoubleColumnTemplate,
  },
];
