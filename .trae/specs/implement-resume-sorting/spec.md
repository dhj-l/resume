# 简历数据排序功能规范

## Why
后端为简历各模块添加了 `globalSort` 和 `localSort` 字段，需要在前端实现相应的排序逻辑，确保简历数据按照后端指定的顺序正确展示，同时为未来扩展提供灵活的架构。

## What Changes
- 为 `EducationBackground`、`WorkExperience`、`CampusExperience`、`ProjectExperience`、`InternshipExperience` 接口添加 `globalSort` 和 `localSort` 可选字段
- 创建可复用的排序工具函数，支持全局排序和局部排序逻辑
- 在 `resumeStore.ts` 中应用排序逻辑到数据获取流程
- 设计配置系统，便于未来添加新的可排序模块

## Impact
- Affected specs: 简历数据类型定义、数据存储逻辑
- Affected code: 
  - `src/stores/type.ts` - 类型定义
  - `src/stores/resumeStore.ts` - 数据处理逻辑
  - 新增 `src/utils/sorting.ts` - 排序工具函数

## ADDED Requirements

### Requirement: 排序类型定义
系统应提供完整的排序字段类型定义。

#### Scenario: 类型定义完整性
- **WHEN** 定义接口类型时
- **THEN** 所有需要排序的模块接口应包含 `globalSort?: number` 和 `localSort?: number` 字段

### Requirement: 可复用排序工具函数
系统应提供可复用的排序工具函数。

#### Scenario: 全局排序
- **WHEN** 调用排序函数处理数组数据
- **THEN** 数组应按 `globalSort` 升序排列
- **AND** 相同 `globalSort` 值的项应按 `localSort` 升序排列

#### Scenario: 缺失排序字段处理
- **WHEN** 数据项缺少 `globalSort` 或 `localSort` 字段
- **THEN** 缺失字段应被视为默认值 0
- **AND** 排序不应抛出错误

#### Scenario: 空数组处理
- **WHEN** 传入空数组
- **THEN** 应返回空数组
- **AND** 不应抛出错误

### Requirement: 数据不可变性
排序操作应保持数据不可变。

#### Scenario: 原数据不被修改
- **WHEN** 执行排序操作
- **THEN** 原始数组不应被修改
- **AND** 应返回新的排序后数组

### Requirement: 配置化排序架构
系统应支持配置化的排序架构。

#### Scenario: 添加新排序模块
- **WHEN** 需要为新模块添加排序支持
- **THEN** 只需在配置中添加模块信息
- **AND** 无需修改核心排序逻辑

### Requirement: 时间复杂度
排序实现应高效。

#### Scenario: 性能要求
- **WHEN** 排序 n 个元素
- **THEN** 时间复杂度应为 O(n log n)

## MODIFIED Requirements

### Requirement: ResumeData 数据处理
简历数据获取后应自动应用排序逻辑。

#### Scenario: 获取简历详情后排序
- **WHEN** 调用 `getResumeDetail` 获取简历数据
- **THEN** 各模块数据应按排序字段正确排列
- **AND** UI 应正确反映排序后的顺序

#### Scenario: 创建简历后排序
- **WHEN** 调用 `createResume` 创建简历
- **THEN** 返回的数据应按排序字段正确排列

#### Scenario: 保存简历后排序
- **WHEN** 调用 `saveResume` 保存简历
- **THEN** 返回的数据应按排序字段正确排列
