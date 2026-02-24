# Tasks

- [x] Task 1: 创建排序类型定义和工具函数
  - [x] SubTask 1.1: 在 `src/stores/type.ts` 中为需要排序的接口添加 `globalSort` 和 `localSort` 可选字段
  - [x] SubTask 1.2: 创建 `src/utils/sorting.ts` 文件，实现排序工具函数
  - [x] SubTask 1.3: 实现通用的 `sortByGlobalAndLocal` 函数，支持 globalSort 和 localSort 双重排序
  - [x] SubTask 1.4: 实现排序配置类型 `SortableSection` 和配置对象

- [x] Task 2: 在 resumeStore 中集成排序逻辑
  - [x] SubTask 2.1: 创建 `applySortingToResumeData` 函数，对简历各模块应用排序
  - [x] SubTask 2.2: 修改 `getResumeDetail` 函数，在获取数据后应用排序
  - [x] SubTask 2.3: 修改 `createResume` 函数，在创建后应用排序
  - [x] SubTask 2.4: 修改 `saveResume` 函数，在保存后应用排序

- [x] Task 3: 添加错误处理和边界情况
  - [x] SubTask 3.1: 处理排序字段缺失的情况（使用默认值 0）
  - [x] SubTask 3.2: 处理空数组的情况
  - [x] SubTask 3.3: 处理 null 或 undefined 数据的情况

- [x] Task 4: 测试验证
  - [x] SubTask 4.1: 验证正确排序顺序（globalSort 和 localSort 值唯一时）
  - [x] SubTask 4.2: 验证相同 globalSort 值时的 localSort 排序
  - [x] SubTask 4.3: 验证缺失 localSort 值时的处理
  - [x] SubTask 4.4: 验证空数组的处理
  - [x] SubTask 4.5: 验证 UI 正确反映排序后的顺序

# Task Dependencies

- [Task 2] 依赖 [Task 1]
- [Task 3] 依赖 [Task 1]
- [Task 4] 依赖 [Task 1, Task 2, Task 3]
