# Tasks

- [x] Task 1: 创建通用排序字段接口
  - [x] SubTask 1.1: 创建 `SortableModule` 接口，包含 `content?: string` 和 `globalSort?: number` 字段

- [x] Task 2: 修改简单字符串字段为对象类型
  - [x] SubTask 2.1: 将 `skills` 字段从 `string` 改为 `SortableModule` 类型
  - [x] SubTask 2.2: 将 `certificates` 字段从 `string` 改为 `SortableModule` 类型
  - [x] SubTask 2.3: 将 `selfEvaluation` 字段从 `string` 改为 `SortableModule` 类型

- [x] Task 3: 为数组类型模块添加排序字段
  - [x] SubTask 3.1: 为 `InternshipExperience` 接口添加 `globalSort` 和 `localSort` 字段
  - [x] SubTask 3.2: 为 `ProjectExperience` 接口添加 `globalSort` 和 `localSort` 字段
  - [x] SubTask 3.3: 为 `CampusExperience` 接口添加 `globalSort` 和 `localSort` 字段
  - [x] SubTask 3.4: 为 `WorkExperience` 接口添加 `globalSort` 和 `localSort` 字段
  - [x] SubTask 3.5: 为 `EducationBackground` 接口添加 `globalSort` 和 `localSort` 字段

- [x] Task 4: 为单对象类型模块添加排序字段
  - [x] SubTask 4.1: 为 `BasicInfo` 接口添加 `globalSort` 字段
  - [x] SubTask 4.2: 为 `JobIntention` 接口添加 `globalSort` 字段

- [x] Task 5: 添加类型注释
  - [x] SubTask 5.1: 为 `globalSort` 字段添加 JSDoc 注释，说明其用途
  - [x] SubTask 5.2: 为 `localSort` 字段添加 JSDoc 注释，说明其用途

- [x] Task 6: 验证类型修改
  - [x] SubTask 6.1: 运行 TypeScript 类型检查确保无编译错误

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 2, Task 3, Task 4]
- [Task 6] depends on [Task 5]
