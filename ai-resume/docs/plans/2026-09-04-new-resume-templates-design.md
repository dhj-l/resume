# 新增简历模板设计（2026-09-04）

## 背景

现有启用模板 5 个（default / double-column / simple / modern / minimal），用户反馈数量偏少、样式与市场主流简历模板有差距。目标：新增符合市场审美的模板，并补齐联系方式/模块标题图标（使用已安装的 lucide-vue-next，不引入新依赖）。

## 方案概览

新增 3 个模板，覆盖三类主流市场风格：

| value | label | 风格定位 | 主色 |
| --- | --- | --- | --- |
| `classic` | 经典商务模板 | 单栏稳重，居中抬头，社招/正式场合 | 深蓝 `#1f4e79` |
| `fresh` | 清新活力模板 | 顶部浅色 hero + 圆角胶囊信息，应届生友好 | 青绿 teal |
| `sidebar-dark` | 墨蓝侧栏模板 | 左侧深墨蓝侧栏 + 右侧白底主栏（市场最主流高端双栏） | 墨蓝 `#1f2d3d` |

三套模板的模块标题样式互不相同：classic 用深蓝加粗 + 底部双线；fresh 用 teal 色块图标 + 无边框；sidebar-dark 右栏用墨蓝图标 + 灰色细分隔线、侧栏用白色标题 + 半透明分隔线。

## 架构（完全沿用现有模式）

- `templates/template-list/<name>-template/<name>-template.vue`：布局文件，组合 BasicInfoSection / JobIntentionSection 与 useActiveModules 内容模块，带分页标记线（usePageMarkers）与悬停编辑外框。
- `components/preview/*Section.ts`：每个模板在每个 section 的 `getXxxStyles` 中新增 case，返回 Tailwind 类串。
- `components/preview/type.ts`：`templateType` 联合类型增加 `"classic" | "fresh" | "sidebar-dark"`（`stores/type.ts` 的简历 `type` 字段直接复用该类型，无需另改）。
- `templates/index.ts`：追加注册 3 个模板，下拉选择器（EditorHeader）数据驱动自动生效。

## 图标方案（lucide-vue-next）

所有图标均为可选字段，未提供时现有模板渲染完全不变：

- `BasicInfoSection`：样式接口新增 `detailIcons?: Component[]`（与 contentArray 顺序对齐：年龄 Cake、工作年限 Briefcase、性别 UserRound、电话 Phone、邮箱 Mail、政治面貌 Flag）+ `detailIconClass`。
- `JobIntentionSection`：新增 `itemIcons?: Component[]`（期望职位 Target、意向城市 MapPin、期望薪资 Banknote、入职时间 CalendarClock）+ `itemIconClass`。
- 全部 10 个 section：接口新增 `titleIcon?: Component` + `titleIconClass?`，在 `<h3>` 内通过 `<component :is>` 渲染（GraduationCap / Briefcase / FolderKanban / School / Building2 / Award / UserRound / Target 等）。

## 数据流与兼容性

- 模板选择存于简历数据 `type` 字段，老数据不含新值时走各 section `default` 分支，不受影响。
- 图标为样式对象内组件引用（非 v-html），经 `<component :is>` 渲染，安全且可被 vue-tsc 检查。

## 验证

- `pnpm lint:check`、`pnpm build`（vue-tsc 类型检查）通过。
- 启动 dev server，逐个切换 3 个新模板目视检查：双栏分栏、分页标记线、图标对齐、深色侧栏文字对比度。
- 现有 5 个模板回归：图标字段缺省不改变原渲染。
