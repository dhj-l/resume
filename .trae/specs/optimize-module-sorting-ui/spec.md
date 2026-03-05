# 模块排序功能优化 Spec

## Why

当前模块排序功能已实现基本交互，但存在两个需要优化的问题：1) UI 使用上下方向箭头不够直观，应改为左右方向更符合排序语义；2) 排序数据仅在本地 `moduleOrder` 中生效，未同步到 `resumeData.moduleOrderConfig`，导致无法持久化保存。

## What Changes

- 将排序按钮从上下方向箭头改为左右方向箭头
- 调整按钮布局为：左箭头 | label | 右箭头
- 为按钮添加适当的颜色样式
- 实现排序数据同步到 `resumeData.moduleOrderConfig`

## Impact

- Affected specs: module-tabs-sorting-ui
- Affected code:
  - `ModuleTabs.vue` - UI 交互优化
  - `resumeStore.ts` - 数据同步逻辑

## ADDED Requirements

### Requirement: UI 交互优化

系统应将排序按钮从上下方向改为左右方向，并优化布局和样式。

#### Scenario: 按钮方向更新

- **WHEN** 用户查看非固定模块的标签页
- **THEN** 应显示左箭头和右箭头按钮（而非上下箭头）
- **AND** 左箭头按钮位于 label 左侧
- **AND** 右箭头按钮位于 label 右侧

#### Scenario: 按钮样式

- **WHEN** 用户悬停在排序按钮上
- **THEN** 按钮应显示适当的颜色（如主题蓝色）
- **AND** 禁用状态的按钮应显示灰色

### Requirement: 数据持久化

系统应在模块排序变更时同步更新 `resumeData.moduleOrderConfig`。

#### Scenario: 排序数据同步

- **WHEN** 用户执行模块排序操作
- **THEN** 系统应更新 `moduleOrder` 的 `globalSort` 值
- **AND** 系统应同步更新 `resumeData.moduleOrderConfig` 数组
- **AND** 数据格式应符合 `ModuleOrderConfig` 接口定义

#### Scenario: 数据格式正确

- **WHEN** 排序操作完成
- **THEN** `resumeData.moduleOrderConfig` 应包含所有模块的排序配置
- **AND** 每个配置项应包含 `moduleKey` 和 `globalSort` 字段

## MODIFIED Requirements

### Requirement: 排序按钮布局

原布局：label | 上箭头 | 下箭头
新布局：左箭头 | label | 右箭头
