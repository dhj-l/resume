# Tasks

- [x] Task 1: 移除 type.ts 中的 moduleOrderConfig 相关定义
  - [x] SubTask 1.1: 删除 `ModuleOrderConfig` 接口定义
  - [x] SubTask 1.2: 删除 `ResumeData` 接口中的 `moduleOrderConfig` 字段

- [x] Task 2: 移除 mockData.ts 中的 moduleOrderConfig 数据
  - [x] SubTask 2.1: 删除 `mockData.ts` 中的 `moduleOrderConfig` 属性及其数据

- [x] Task 3: 修改 resumeStore.ts 中的相关逻辑
  - [x] SubTask 3.1: 移除 `swapModuleOrder` 函数中同步到 `moduleOrderConfig` 的代码
  - [x] SubTask 3.2: 修改 `initializeModuleOrder` 函数，移除参数和 config 相关逻辑
  - [x] SubTask 3.3: 修改 `getResumeDetail` 函数调用，移除 `moduleOrderConfig` 参数传递

- [x] Task 4: 验证
  - [x] SubTask 4.1: 运行 TypeScript 类型检查确保无错误
  - [x] SubTask 4.2: 确认代码编译通过

# Task Dependencies

- [Task 3] 依赖 [Task 1]
- [Task 4] 依赖 [Task 1, Task 2, Task 3]
