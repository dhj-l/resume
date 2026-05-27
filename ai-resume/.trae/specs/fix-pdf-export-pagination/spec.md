# PDF导出页面内容一致性修复 Spec

## Why
简历编辑器中网页显示与PDF导出效果存在不一致问题：网页显示为单页时PDF导出为两页，或网页显示两页时PDF第一页留白与网页不一致。这严重影响用户体验和简历的专业性。

## What Changes
- 修复前端分页逻辑，确保网页预览与PDF导出的分页点完全一致
- 统一页面尺寸计算方式，消除网页渲染与PDF渲染的差异
- 优化CSS样式提取逻辑，确保所有必要样式正确传递给PDF生成器
- 添加调试日志便于问题追踪

## Impact
- Affected specs: 简历编辑器预览功能、PDF导出功能
- Affected code: 
  - `src/views/editor/hooks/usePagination.ts`
  - `src/views/editor/components/EditorHeader.vue`
  - `src/utils/dom.ts`
  - `src/views/editor/templates/template-list/default-template/default-template.vue`
  - `src/views/editor/templates/template-list/simple-template/simple-template.vue`
  - `src/views/editor/templates/template-list/double-column-template/double-column-template.vue`

## ADDED Requirements

### Requirement: 统一的分页计算逻辑
系统 SHALL 使用与PDF生成环境一致的分页计算逻辑，确保网页预览的分页点与PDF导出完全一致。

#### Scenario: 单页简历导出
- **WHEN** 用户编辑简历内容，网页预览显示为单页
- **THEN** PDF导出结果也应为单页，内容布局与网页预览完全一致

#### Scenario: 多页简历导出
- **WHEN** 用户编辑简历内容，网页预览显示为两页
- **THEN** PDF导出结果也应为两页，每页内容分布与网页预览完全一致

### Requirement: 精确的页面高度计算
系统 SHALL 使用精确的A4纸张高度计算，考虑所有影响布局的因素。

#### Scenario: 页面高度计算
- **WHEN** 系统计算分页点时
- **THEN** 应使用与后端PDF生成一致的页面高度（A4: 210mm x 297mm）
- **AND** 正确计算页面边距、模块间距等影响分页的因素

### Requirement: CSS样式一致性
系统 SHALL 确保网页渲染和PDF渲染使用一致的CSS样式。

#### Scenario: 样式提取
- **WHEN** 导出PDF时
- **THEN** 系统应正确提取所有影响布局的CSS样式
- **AND** 过滤掉可能导致布局差异的样式（如shadow相关）

### Requirement: 特殊模板头部处理
系统 SHALL 正确处理simple-template等包含特殊头部区域的模板的分页计算。

#### Scenario: 带头部模板的分页
- **WHEN** 使用simple-template模板且内容需要分页
- **THEN** 第一页的头部区域高度应正确计入分页计算
- **AND** 后续页面不应重复显示头部区域

## MODIFIED Requirements

### Requirement: 分页Hook优化
`usePagination.ts` 需要优化以支持更精确的分页计算：
- 使用动态计算的页面高度而非固定值
- 正确处理不同模板的特殊布局需求
- 添加调试日志输出

### Requirement: 导出CSS优化
`EditorHeader.vue` 中的导出CSS需要优化：
- 添加更完整的页面尺寸控制样式
- 确保分页行为与网页预览一致
- 处理可能的边距和留白问题

## Root Cause Analysis

经过代码分析，发现以下潜在问题：

### 1. 页面高度计算不一致
- `usePagination.ts` 使用固定值 `PAGE_HEIGHT = 1123`（基于96 DPI）
- 实际PDF生成可能使用不同的DPI或渲染环境
- 网页使用 `min-h-[297mm]` 但内容可能超出

### 2. CSS样式提取不完整
- `extractEffectiveCssForElement` 可能遗漏某些关键样式
- Tailwind CSS的动态类名可能无法正确提取
- 某些CSS属性在PDF渲染时表现不同

### 3. 模板特殊处理缺失
- `simple-template` 第一页有特殊头部，但计算层和展示层处理不一致
- 头部高度未正确计入分页计算

### 4. 导出时额外CSS可能影响布局
```css
.resume-page { margin-bottom: 0 !important; box-shadow: none !important; }
```
移除了margin-bottom可能导致内容分布变化
