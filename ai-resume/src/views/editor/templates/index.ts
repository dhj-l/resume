import DefaultTemplate from "./template-list/default-template/default-template.vue";
import DoubleColumnTemplate from "./template-list/double-column-template/double-column-template.vue";
// ElegantTemplate / LuxuryTemplate 暂未启用
import MinimalTemplate from "./template-list/minimal-template/minimal-template.vue";
import ModernTemplate from "./template-list/modern-template/modern-template.vue";
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
  {
    label: "现代风格模板",
    value: "modern",
    component: ModernTemplate,
  },
  // {
  //   label: "雅致杂志风",
  //   value: "elegant",
  //   component: ElegantTemplate,
  // },
  {
    label: "极致简约",
    value: "minimal",
    component: MinimalTemplate,
  },
  // {
  //   label: "奢华黑金",
  //   value: "luxury",
  //   component: LuxuryTemplate,
  // },
];
