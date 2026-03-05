# 类型定义排序字段规范化 Spec

## Why

当前 `type.ts` 中的类型定义与 API 规范不一致，`skills`、`certificates`、`selfEvaluation` 字段为简单字符串类型，而 API 规范要求为包含 `content` 和 `globalSort` 的对象类型。同时，数组类型的模块项缺少必要的排序字段，无法支持模块排序功能。

## What Changes

* 将 `skills` 字段从 `string` 类型改为对象类型 `{ content: string; globalSort: number }`

* 将 `certificates` 字段从 `string` 类型改为对象类型 `{ content: string; globalSort: number }`

* 将 `selfEvaluation` 字段从 `string` 类型改为对象类型 `{ content: string; globalSort: number }`

* 为 `InternshipExperience` 接口添加 `globalSort` 和 `localSort` 字段

* 为 `ProjectExperience` 接口添加 `globalSort` 和 `localSort` 字段

* 为 `CampusExperience` 接口添加 `globalSort` 和 `localSort` 字段

* 为 `WorkExperience` 接口添加 `globalSort` 和 `localSort` 字段

* 为 `EducationBackground` 接口添加 `globalSort` 和 `localSort` 字段

## Impact

* Affected specs: 类型系统、模块排序功能

* Affected code: `type.ts`、所有引用这些类型的组件和 store

## ADDED Requirements

### Requirement: 技能特长类型规范化

系统 SHALL 将 `skills` 字段定义为包含 `content` 和 `globalSort` 的对象类型。

#### Scenario: 类型定义

* **WHEN** 定义 `ResumeData` 接口时

* **THEN** `skills` 字段应为 `{ content?: string; globalSort?: number }` 类型

### Requirement: 荣誉证书类型规范化

系统 SHALL 将 `certificates` 字段定义为包含 `content` 和 `globalSort` 的对象类型。

#### Scenario: 类型定义

* **WHEN** 定义 `ResumeData` 接口时

* **THEN** `certificates` 字段应为 `{ content?: string; globalSort?: number }` 类型

### Requirement: 自我评价类型规范化

系统 SHALL 将 `selfEvaluation` 字段定义为包含 `content` 和 `globalSort` 的对象类型。

#### Scenario: 类型定义

* **WHEN** 定义 `ResumeData` 接口时

* **THEN** `selfEvaluation` 字段应为 `{ content?: string; globalSort?: number }` 类型

### Requirement: 数组模块项排序字段

系统 SHALL 为所有数组类型的模块项接口添加 `globalSort` 和 `localSort` 字段。

#### Scenario: 教育背景数组项

* **WHEN** 定义 `EducationBackground` 接口时

* **THEN** 应包含 `globalSort?: number` 和 `localSort?: number` 字段

#### Scenario: 工作经验数组项

* **WHEN** 定义 `WorkExperience` 接口时

* **THEN** 应包含 `globalSort?: number` 和 `localSort?: number` 字段

#### Scenario: 校园经历数组项

* **WHEN** 定义 `CampusExperience` 接口时

* **THEN** 应包含 `globalSort?: number` 和 `localSort?: number` 字段

#### Scenario: 项目经历数组项

* **WHEN** 定义 `ProjectExperience` 接口时

* **THEN** 应包含 `globalSort?: number` 和 `localSort?: number` 字段

#### Scenario: 实习经历数组项

* **WHEN** 定义 `InternshipExperience` 接口时

* **THEN** 应包含 `globalSort?: number` 和 `localSort?: number` 字段

### Requirement: 单对象模块排序字段

系统 SHALL 为单对象类型的模块接口添加 `globalSort` 字段。

##
