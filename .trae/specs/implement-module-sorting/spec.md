# 模块排序功能规范

## Why

用户需要能够在简历编辑器中调整模块的显示顺序，例如将"校园经历"模块移动到"项目经历"模块前面。实现方式是通过互换两个模块的 `globalSort` 属性值来控制模块的排序顺序。

## What Changes

- 为 `ModuleItem` 接口添加 `globalSort` 字段
- 修改 `moduleOrder` 初始化逻辑，从后端数据获取模块排序值
- 实现 `swapModuleOrder` 函数，通过互换 `globalSort` 值来调整模块顺序
- **BREAKING**: 移除之前实现的数据项排序相关代码（sortByGlobalAndLocal、applySortingToResumeData、SortableItem 接口等）

## Impact

- Affected specs: 模块排序逻辑
- Affected code:
  - `src/stores/type.ts` - ModuleItem 接口，移除 SortableItem
  - `src/stores/resumeStore.ts` - 模块排序逻辑，移除 applySortingToResumeData 调用
  - `src/utils/sorting.ts` - 删除整个文件

## ADDED Requirements

### Requirement: 模块排序字段

系统应为每个模块提供 `globalSort` 字段用于排序。

#### Scenario: 模块配置包含排序字段

- **WHEN** 初始化模块配置时
- **THEN** 每个模块应包含 `globalSort` 字段
- **AND** `globalSort` 值应从后端数据获取或使用默认值

### Requirement: 模块位置交换功能

系统应提供模块位置交换功能。

#### Scenario: 交换两个模块位置

- **WHEN** 用户将模块 A 移动到模块 B 前面
- **THEN** 模块 A 和模块 B 的 `globalSort` 值应互换
- **AND** 模块列表应按 `globalSort` 升序排列

#### Scenario: 模块排序不可变性

- **WHEN** 执行模块交换操作
- **THEN** 原始数据不应被直接修改
- **AND** 应返回新的排序结果

### Requirement: 模块列表动态排序

模块列表应根据 `globalSort` 动态排序。

#### Scenario: 模块列表自动排序

- **WHEN** 获取简历数据后
- **THEN** 模块列表应按 `globalSort` 升序排列
- **AND** UI 应正确反映排序后的模块顺序

## MODIFIED Requirements

### Requirement: ModuleItem 接口

ModuleItem 接口应包含排序字段。

#### Scenario: 接口定义

- **WHEN** 定义 ModuleItem 接口时
- **THEN** 应包含 `globalSort?: number` 字段

## REMOVED Requirements

### Requirement: 数据项排序功能

**Reason**: 用户确认不需要数据项排序功能，只需模块排序功能
**Migration**: 移除 SortableItem 接口、sortByGlobalAndLocal 函数、applySortingToResumeData 函数及相关调用
