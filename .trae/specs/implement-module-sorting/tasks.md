# Tasks

- [x] Task 1: 移除之前的数据项排序代码
  - [x] SubTask 1.1: 删除 `src/utils/sorting.ts` 文件
  - [x] SubTask 1.2: 移除 `src/stores/type.ts` 中的 SortableItem 接口
  - [x] SubTask 1.3: 移除各接口（EducationBackground、WorkExperience 等）对 SortableItem 的继承
  - [x] SubTask 1.4: 移除 resumeStore.ts 中对 applySortingToResumeData 的导入和调用

- [x] Task 2: 修改 ModuleItem 接口添加 globalSort 字段
  - [x] SubTask 2.1: 在 `src/stores/type.ts` 中为 ModuleItem 接口添加 `globalSort?: number` 字段

- [x] Task 3: 重构 moduleOrder 初始化逻辑
  - [x] SubTask 3.1: 为每个模块配置添加 globalSort 字段，使用默认值
  - [x] SubTask 3.2: 创建计算属性 `sortedModuleOrder`，按 globalSort 排序模块列表

- [x] Task 4: 实现模块位置交换功能
  - [x] SubTask 4.1: 创建 `swapModuleOrder` 函数，接收两个模块的 moduleKey
  - [x] SubTask 4.2: 实现互换两个模块 globalSort 值的逻辑
  - [x] SubTask 4.3: 确保交换后模块列表正确排序

- [x] Task 5: 测试验证
  - [x] SubTask 5.1: 验证模块列表按 globalSort 正确排序
  - [x] SubTask 5.2: 验证交换两个模块位置后顺序正确
  - [x] SubTask 5.3: 验证 UI 正确反映排序后的模块顺序

# Task Dependencies

- [Task 2] 依赖 [Task 1]
- [Task 3] 依赖 [Task 2]
- [Task 4] 依赖 [Task 2, Task 3]
- [Task 5] 依赖 [Task 1, Task 2, Task 3, Task 4]
