# AI 简历前端：API_DOCS 覆盖度审计与缺口规划 Spec

## Why
当前前端项目已实现部分核心链路（登录/注册、模板浏览、基于模板创建简历、编辑器、我的简历、PDF 下载），但与 `src/API_DOCS.md` 描述的接口/能力存在缺口。需要先做一次覆盖度审计，并产出可执行的代办清单，指导后续逐步补齐功能。

## What Changes
- 新增一份“接口/能力覆盖度审计”与“待办规划”产物（见 `tasks.md`）。
- 将 `API_DOCS.md` 中的接口按模块拆分，逐项标注前端实现状态（已实现/部分实现/未实现/不计划）。
- 将缺口落到可交付的前端工作项：API 封装、类型、Pinia 状态、路由/页面、交互与权限控制、验证方式。

## Impact
- Affected specs: 前端功能规划、接口对接策略、后续迭代路线图
- Affected code: 无（本变更仅产出规划文档；实际实现不在本 Spec 阶段）

## ADDED Requirements
### Requirement: 接口覆盖度审计
系统 SHALL 对照 `src/API_DOCS.md` 中的所有模块与接口，在 `tasks.md` 输出覆盖度结论与缺口清单。

#### Scenario: 输出审计结论
- **WHEN** 审计完成
- **THEN** `tasks.md` 必须包含：
  - 按模块（User/Resume/Template/Upload/Share/History）分组的接口条目
  - 每个条目包含：接口路径与方法、当前前端对应文件位置或缺失点、实现状态、优先级建议

### Requirement: 代办规划清单
系统 SHALL 输出一份可执行的代办清单（以“任务 + 子任务”形式），并包含依赖关系与验证方式。

#### Scenario: 生成可执行代办
- **WHEN** 代办清单生成
- **THEN** 每个任务至少包含：
  - 需要新增/修改的 API 封装与类型定义位置
  - 需要新增/修改的页面/路由/组件位置
  - 需要新增/修改的 Pinia store（如有）
  - 最小验证方式（手测路径 / 类型检查 / 单元测试建议）

## MODIFIED Requirements
无

## REMOVED Requirements
无

