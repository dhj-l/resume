# 移除 moduleOrderConfig 并简化 globalSort 更新 Spec

## Why

当前实现使用 `moduleOrderConfig` 数组来存储模块排序信息，但这增加了数据结构的复杂性。实际上每个模块的 `globalSort` 可以直接存储在 `resumeData` 的对应模块数据中，简化数据流和持久化逻辑。

## What Changes

- 移除 `type.ts` 中的 `ModuleOrderConfig` 接口定义
- 移除 `ResumeData` 接口中的 `moduleOrderConfig` 字段
- 移除 `mockData.ts` 中的 `moduleOrderConfig` 数据
- 移除 `resumeStore.ts` 中所有 `moduleOrderConfig` 相关代码
- 修改 `swapModuleOrder` 函数，不再同步到 `moduleOrderConfig`
- 修改 `initializeModuleOrder` 函数，不再依赖 `moduleOrderConfig`

## Impact

- Affected specs: optimize-module-sorting-ui
- Affected code:
  - `type.ts` - 移除接口定义
  - `mockData.ts` - 移除模拟数据
  - `resumeStore.ts` - 移除相关逻辑

## REMOVED Requirements

### Requirement: moduleOrderConfig 数据结构

**Reason**: 简化数据结构，`globalSort` 已在 `moduleOrder` 中管理，无需额外同步
**Migration**: 移除所有 `moduleOrderConfig` 相关代码，`globalSort` 更新仅在 `moduleOrder` 中进行

## MODIFIED Requirements

### Requirement: globalSort 更新逻辑

更新 `globalSort` 时，仅更新 `moduleOrder` 中的值，不再同步到 `resumeData.moduleOrderConfig`

### Requirement: 模块初始化逻辑

`initializeModuleOrder` 函数不再需要参数，仅执行排序操作
