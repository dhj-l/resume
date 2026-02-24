# 模块排序逻辑重构 Spec

## Why
当前实现存在三个主要问题：数据未在组件中正确应用、冗余的排序逻辑、以及缺少固定模块的排序规则。需要重构以确保数据正确流转、移除冗余代码并实现正确的排序约束。

## What Changes
- 修改编辑器视图组件，使用 `sortedModuleOrder` 替代 `moduleOrder`
- 移除 `sortedModuleOrder` 计算属性，改为在数据获取后直接对 `moduleOrder` 进行排序
- 实现固定模块排序规则：`basicInfo` 和 `jobIntention` 必须保持在最前面且不可交换
- 完善 `swapModuleOrder` 函数，增加固定模块保护逻辑
- 在 `ResumeData` 中添加 `moduleOrderConfig` 字段用于存储后端返回的模块排序配置

## Impact
- Affected specs: 模块排序功能
- Affected code:
  - `src/stores/type.ts` - ResumeData 接口添加 moduleOrderConfig 字段
  - `src/stores/resumeStore.ts` - 重构排序逻辑，移除 sortedModuleOrder 计算属性
  - `src/views/editor/components/drawer/ModuleTabs.vue` - 使用排序后的模块列表
  - `src/views/editor/templates/template-list/default-template/default-template.vue` - 使用排序后的模块列表

## ADDED Requirements

### Requirement: 固定模块排序约束
系统 SHALL 确保以下模块位置固定且不可变更：
- `basicInfo` 必须保持在第一位（globalSort = 0）
- `jobIntention` 必须保持在第二位（globalSort = 1）
- 这两个模块不允许参与位置交换操作

#### Scenario: 尝试交换固定模块
- **WHEN** 用户尝试交换 `basicInfo` 或 `jobIntention` 模块的位置
- **THEN** 系统应拒绝该操作，保持原有顺序不变

#### Scenario: 交换非固定模块
- **WHEN** 用户交换两个非固定模块的位置（如 `educationBackground` 和 `projectExperience`）
- **THEN** 系统应成功交换这两个模块的 globalSort 值

### Requirement: 后端数据驱动的模块排序
系统 SHALL 在获取简历详情后，根据后端返回的模块排序配置初始化模块顺序。

#### Scenario: 从后端获取排序配置
- **WHEN** 调用 `getResumeDetail` API 获取简历数据
- **THEN** 系统应使用后端返回的 `moduleOrderConfig` 更新模块排序
- **AND** 如果后端未返回排序配置，使用默认排序

### Requirement: 组件使用排序后的模块列表
系统 SHALL 确保所有渲染模块的组件使用正确排序后的模块列表。

#### Scenario: 模块标签页渲染
- **WHEN** `ModuleTabs.vue` 渲染模块标签页
- **THEN** 应按 globalSort 排序显示模块标签

#### Scenario: 简历预览渲染
- **WHEN** 模板组件渲染简历内容
- **THEN** 应按 globalSort 排序渲染各模块

## MODIFIED Requirements

### Requirement: 模块排序初始化
系统 SHALL 在以下情况下初始化模块排序：
1. Store 初始化时使用 `DEFAULT_MODULE_ORDER`
2. 获取简历详情后，使用后端返回的 `moduleOrderConfig` 更新排序

### Requirement: 模块位置交换功能
`swapModuleOrder` 函数 SHALL：
1. 检查两个模块是否为固定模块（`basicInfo`、`jobIntention`）
2. 如果任一模块为固定模块，拒绝交换操作
3. 否则，互换两个模块的 globalSort 值

## REMOVED Requirements

### Requirement: sortedModuleOrder 计算属性
**Reason**: 排序应在数据获取时完成，而非通过计算属性实时计算。计算属性增加了不必要的响应式开销。
**Migration**: 在 `getResumeDetail` 函数中，获取数据后直接对 `moduleOrder` 进行排序初始化。
