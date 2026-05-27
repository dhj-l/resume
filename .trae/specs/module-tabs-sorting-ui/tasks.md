# Tasks

- [x] Task 1: 实现 swapModuleOrder 函数
  - [x] SubTask 1.1: 取消 resumeStore.ts 中 swapModuleOrder 函数的注释
  - [x] SubTask 1.2: 确保函数正确实现固定模块保护逻辑
  - [x] SubTask 1.3: 确保函数正确交换两个模块的 globalSort 值

- [x] Task 2: 在 ModuleTabs.vue 中添加排序交互 UI
  - [x] SubTask 2.1: 添加 moveModuleUp 和 moveModuleDown 方法
  - [x] SubTask 2.2: 为每个 TabPane 添加排序按钮（向前/向后移动）
  - [x] SubTask 2.3: 固定模块不显示排序按钮
  - [x] SubTask 2.4: 添加相应的样式

- [x] Task 3: 实现排序逻辑
  - [x] SubTask 3.1: 实现 moveModuleUp 方法，调用 swapModuleOrder 与前一个非固定模块交换
  - [x] SubTask 3.2: 实现 moveModuleDown 方法，调用 swapModuleOrder 与后一个非固定模块交换
  - [x] SubTask 3.3: 处理边界情况（第一个/最后一个可移动模块）

- [x] Task 4: 测试验证
  - [x] SubTask 4.1: 验证固定模块不显示排序按钮
  - [x] SubTask 4.2: 验证非固定模块可以正常移动
  - [x] SubTask 4.3: 验证移动后数据正确更新
  - [x] SubTask 4.4: 运行类型检查确保无错误

# Task Dependencies

- [Task 2] 依赖 [Task 1]
- [Task 3] 依赖 [Task 1]
- [Task 4] 依赖 [Task 1, Task 2, Task 3]
