# Tasks

- [x] Task 1: 创建从 resumeData 提取 globalSort 的辅助函数
  - [x] SubTask 1.1: 创建 `getGlobalSortFromResumeData` 函数，接收 moduleKey 参数
  - [x] SubTask 1.2: 实现对象类型处理逻辑：返回 `对象.globalSort`
  - [x] SubTask 1.3: 实现数组类型处理逻辑：返回 `数组[0].globalSort`
  - [x] SubTask 1.4: 实现空对象处理逻辑：返回最大值（排至最后）
  - [x] SubTask 1.5: 实现空数组处理逻辑：返回最大值（排至最后）
  - [x] SubTask 1.6: 实现 null/undefined 处理逻辑：返回最大值（排至最后）
  - [x] SubTask 1.7: 添加类型安全检查和错误处理

- [x] Task 2: 创建同步 moduleOrder 与 resumeData 的函数
  - [x] SubTask 2.1: 创建 `syncModuleOrderWithResumeData` 函数
  - [x] SubTask 2.2: 遍历 `moduleOrder.value` 中的所有模块
  - [x] SubTask 2.3: 对每个模块调用 `getGlobalSortFromResumeData` 获取最新的 globalSort 值
  - [x] SubTask 2.4: 更新 `moduleOrder.value` 中每个模块的 `globalSort` 字段
  - [x] SubTask 2.5: 对 `moduleOrder.value` 进行排序（按 globalSort 升序）

- [x] Task 3: 修改 initializeModuleOrder 函数
  - [x] SubTask 3.1: 修改 `initializeModuleOrder` 函数，调用 `syncModuleOrderWithResumeData`
  - [x] SubTask 3.2: 确保在 `getResumeDetail` 函数中正确调用更新后的 `initializeModuleOrder`

- [x] Task 4: 修改 swapModuleOrder 函数
  - [x] SubTask 4.1: 在 `swapModuleOrder` 函数中，调用 `changeGlobalSort` 后调用 `syncModuleOrderWithResumeData`
  - [x] SubTask 4.2: 确保 `moduleOrder` 与 `resumeData` 保持同步
  - [x] SubTask 4.3: 移除不必要的 console.log 语句

- [x] Task 5: 添加 resumeData 变化监听
  - [x] SubTask 5.1: 使用 `watch` 监听 `resumeData` 的变化
  - [x] SubTask 5.2: 当 `resumeData` 变化时，调用 `syncModuleOrderWithResumeData`
  - [x] SubTask 5.3: 添加防抖逻辑，避免频繁更新

- [x] Task 6: 验证排序功能的正确性
  - [x] SubTask 6.1: 测试对象类型模块的排序（如 basicInfo、jobIntention）
  - [x] SubTask 6.2: 测试数组类型模块的排序（如 workExperience、educationBackground）
  - [x] SubTask 6.3: 测试空对象和空数组的排序（应排至最后）
  - [x] SubTask 6.4: 测试 null/undefined 值的处理（应排至最后）
  - [x] SubTask 6.5: 测试 swapModuleOrder 功能的正确性
  - [x] SubTask 6.6: 测试 resumeData 变化后的自动更新

# Task Dependencies
- Task 2 depends on Task 1（需要先有提取 globalSort 的函数）
- Task 3 depends on Task 2（需要先有同步函数）
- Task 4 depends on Task 2（需要先有同步函数）
- Task 5 depends on Task 2（需要先有同步函数）
