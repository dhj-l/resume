# 模块标签页排序交互功能 Spec

## Why
用户需要在简历编辑器的模块标签页中直接调整模块顺序，通过可视化交互方式（按钮或拖拽）实现模块位置的调整，提升用户体验和操作效率。

## What Changes
- 在 `ModuleTabs.vue` 中添加排序交互机制
- 提供两种可选实现方式：按钮方式或拖拽方式
- 确保排序操作流畅、稳定，并正确更新模块显示顺序和数据状态
- 固定模块（basicInfo、jobIntention）不显示排序控件或禁用排序操作

## Impact
- Affected specs: 模块排序功能
- Affected code:
  - `src/views/editor/components/drawer/ModuleTabs.vue` - 添加排序交互 UI
  - `src/stores/resumeStore.ts` - 确保 `swapModuleOrder` 函数可用

## ADDED Requirements

### Requirement: 模块排序交互机制
系统 SHALL 在模块标签页中提供排序交互机制，允许用户调整非固定模块的顺序。

#### Scenario: 按钮方式排序
- **WHEN** 用户选择按钮排序方式
- **THEN** 每个非固定模块标签应显示"向前移动"和"向后移动"按钮
- **AND** 点击按钮后，模块应与相邻模块交换位置
- **AND** 固定模块不显示排序按钮

#### Scenario: 拖拽方式排序
- **WHEN** 用户选择拖拽排序方式
- **THEN** 用户可以通过拖拽标签来调整模块顺序
- **AND** 固定模块不可拖拽
- **AND** 拖拽完成后模块顺序应正确更新

### Requirement: 固定模块保护
系统 SHALL 确保固定模块（basicInfo、jobIntention）不参与排序操作。

#### Scenario: 固定模块不显示排序控件
- **WHEN** 渲染模块标签页时
- **THEN** `basicInfo` 和 `jobIntention` 模块不应显示排序按钮或拖拽手柄

#### Scenario: 尝试移动固定模块
- **WHEN** 用户尝试移动固定模块
- **THEN** 操作应被阻止或忽略
- **AND** 模块顺序保持不变

### Requirement: 排序状态同步
系统 SHALL 在排序操作完成后正确更新模块的显示顺序和数据状态。

#### Scenario: 排序后数据同步
- **WHEN** 用户完成排序操作
- **THEN** `moduleOrder` 中的 `globalSort` 值应正确更新
- **AND** UI 应立即反映新的排序顺序

## MODIFIED Requirements

### Requirement: swapModuleOrder 函数
`swapModuleOrder` 函数 SHALL 被正确实现并在排序交互中使用。

#### Scenario: 函数可用性
- **WHEN** 组件需要交换模块位置
- **THEN** `swapModuleOrder` 函数应可从 store 中获取并调用
