# 模块排序功能增强 Spec

## Why
当前 `moduleOrder` 的排序逻辑仅依赖自身的 `globalSort` 字段，与 `resumeData` 中的 `globalSort` 存在同步问题。需要实现基于 `resumeData` 的动态排序功能，确保数据一致性，并处理各种边界情况（空对象、空数组、null/undefined 值）。

## What Changes
- 修改 `moduleOrder` 的初始化和更新逻辑，使其基于 `resumeData` 中的 `globalSort` 字段
- 实现从 `resumeData` 提取 `globalSort` 值的辅助函数，处理对象和数组两种数据类型
- 添加特殊情况处理：空对象和空数组排至最后
- 确保 `moduleOrder` 能根据 `resumeData` 的变化自动更新
- 处理各种边界情况：null值、undefined值和异常数据格式

## Impact
- Affected specs: 模块排序逻辑、数据同步机制
- Affected code: `src/stores/resumeStore.ts` 中的 `moduleOrder` 初始化、`initializeModuleOrder` 函数、`swapModuleOrder` 函数

## ADDED Requirements
### Requirement: 基于 resumeData 的动态排序
系统 SHALL 提供从 `resumeData` 中提取 `globalSort` 值的功能，并根据该值动态更新 `moduleOrder`。

#### Scenario: 提取 globalSort 值
- **WHEN** 从 `resumeData` 中提取模块的 `globalSort` 值
- **THEN** 系统应：
  - 若对应字段值为对象，取值为 `对象.globalSort`
  - 若对应字段值为数组，取值为 `数组[0].globalSort`
  - 若对象为空，返回最大值（排至最后）
  - 若数组为空，返回最大值（排至最后）
  - 若值为 null 或 undefined，返回最大值（排至最后）

#### Scenario: moduleOrder 自动更新
- **WHEN** `resumeData` 中的 `globalSort` 字段发生变化
- **THEN** `moduleOrder` 应自动更新以反映新的排序

### Requirement: 边界情况处理
系统 SHALL 正确处理各种边界情况，确保排序逻辑的稳定性。

#### Scenario: 处理空对象
- **WHEN** 模块字段为空对象（如 `skills: {}`）
- **THEN** 该模块应排至最后

#### Scenario: 处理空数组
- **WHEN** 模块字段为空数组（如 `workExperience: []`）
- **THEN** 该模块应排至最后

#### Scenario: 处理 null/undefined 值
- **WHEN** 模块字段为 null 或 undefined
- **THEN** 该模块应排至最后

#### Scenario: 处理异常数据格式
- **WHEN** 数据格式不符合预期（如缺少 `globalSort` 字段）
- **THEN** 系统应提供默认值并继续执行

## MODIFIED Requirements
### Requirement: moduleOrder 初始化
`moduleOrder` 的初始化 SHALL 基于 `resumeData` 中的 `globalSort` 值，而非仅依赖 `DEFAULT_MODULE_ORDER`。

### Requirement: initializeModuleOrder 函数
`initializeModuleOrder` 函数 SHALL 从 `resumeData` 中提取 `globalSort` 值并更新 `moduleOrder`。

### Requirement: swapModuleOrder 函数
`swapModuleOrder` 函数 SHALL 正确更新 `resumeData` 中的 `globalSort` 字段，并确保 `moduleOrder` 同步更新。

## REMOVED Requirements
无
