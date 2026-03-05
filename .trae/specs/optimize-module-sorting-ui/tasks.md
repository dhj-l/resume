# Tasks

- [x] Task 1: UI 交互优化 - 更改按钮方向和布局
  - [x] SubTask 1.1: 将 `UpOutlined` 和 `DownOutlined` 图标替换为 `LeftOutlined` 和 `RightOutlined`
  - [x] SubTask 1.2: 调整按钮布局为：左箭头按钮 | label 文本 | 右箭头按钮
  - [x] SubTask 1.3: 更新按钮样式，添加适当的颜色（主题蓝色悬停效果）
  - [x] SubTask 1.4: 更新对应的方法名和逻辑（moveModuleUp 改为 moveModuleLeft，moveModuleDown 改为 moveModuleRight）

- [x] Task 2: 数据持久化实现
  - [x] SubTask 2.1: 在 `resumeStore.ts` 中添加 `syncModuleOrderToResumeData` 方法
  - [x] SubTask 2.2: 在 `swapModuleOrder` 函数中调用同步方法，将排序数据写入 `resumeData.moduleOrderConfig`
  - [x] SubTask 2.3: 确保数据格式符合 `ModuleOrderConfig` 接口定义

- [x] Task 3: 测试验证
  - [x] SubTask 3.1: 验证按钮方向和布局正确显示
  - [x] SubTask 3.2: 验证按钮颜色样式正确应用
  - [x] SubTask 3.3: 验证排序操作后数据正确同步到 `resumeData.moduleOrderConfig`
  - [x] SubTask 3.4: 运行类型检查确保无 TypeScript 错误

# Task Dependencies

- [Task 2] 依赖 [Task 1]
- [Task 3] 依赖 [Task 1, Task 2]
