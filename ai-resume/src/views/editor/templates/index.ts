import DefaultTemplate from "./template-list/default-template/default-template.vue";
import DoubleColumnTemplate from "./template-list/double-column-template/double-column-template.vue";
import SimpleTemplate from "./template-list/simple-template/simple-template.vue";
import type { TemplateItem } from "./type";
// import BlueTemplate from "./template-list/blue-template/blue-template.vue";

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
  {
    label: "简约求职版",
    value: "simple",
    component: SimpleTemplate,
  },
];
