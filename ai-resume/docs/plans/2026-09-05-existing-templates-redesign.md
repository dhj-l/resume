# 既有 5 个简历模板美化重设计（2026-09-05）

## 背景

上一轮新增 classic / fresh / sidebar-dark 后共 8 个模板。用户反馈既有 5 个（default / double-column / simple / modern / minimal）偏丑或单调，要求美化或重写。目标：每个模板都有清晰的市场化视觉身份，且 8 个模板互不相同。

## 各模板设计方向

| 模板 | 改动幅度 | 设计方向 |
| --- | --- | --- |
| default 默认通用 | **重写** | 移除旧式"个人简历/Personal resume"装饰抬头；改为左对齐大字姓名 + 图标联系方式 + 右侧圆角方形头像 + 主色渐变分隔线；标题 gray-900 粗体 + 底部深色线 + primary 蓝图标，职位文字 primary-600 |
| double-column 双栏专业 | **重构侧栏** | 侧栏顶部 indigo 渐变色块承载 BasicInfo（白字、圆形头像），下方浅灰底；侧栏小节标题靛蓝细线；右栏标题 indigo 底线 + 图标 |
| simple 简约求职版 | **重写抬头 + 瘦身** | 移除紫色装饰抬头；标题由"紫底色带"改为紫色左竖条 + 图标（去掉大块背景色）；姓名改深色、头像圆角矩形，联系方式带紫色图标 |
| modern 现代风格 | 精修 | hero 改对角渐变 from-primary-700 → to-primary-500；标题左竖条 4px + 图标；联系方式/意向条目加白/蓝图标；时间灰度提亮 |
| minimal 极致简约 | 精修 | 姓名 font-semibold（原 font-light 太弱）；标题加细灰底线增强结构；联系方式加极淡灰图标；整体保持无彩色 |

## 实施要点

- 图标体系复用上一轮加入的可选字段（detailIcons / itemIcons / titleIcon），本轮为 5 个旧模板全部填充（minimal 除外——标题不加图标保持极简气质）。
- .vue 布局改动仅 3 个文件：default-template.vue（头部重写）、simple-template.vue（去抬头）、double-column-template.vue（侧栏色块重构）、modern-template.vue（渐变微调）。
- 模板 label 与 value 不变，老简历 `type` 字段无需迁移。
- 标题图标映射沿用：Target / GraduationCap / Briefcase / FolderKanban / School / Building2 / Award / UserRound / Wrench。

## 验证

同上一轮：lint + build + 临时 Playwright 脚本对 5 个模板逐一渲染截图目视检查 + editor 相关 E2E 回归。
