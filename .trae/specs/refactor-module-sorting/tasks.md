# Tasks

- [x] Task 1: 修改 ResumeData 接口添加 moduleOrderConfig 字段
  - [x] SubTask 1.1: 在 `src/stores/type.ts` 中定义 `ModuleOrderConfig` 接口，包含 moduleKey 和 globalSort
  - [x] SubTask 1.2: 在 `ResumeData` 接口中添加 `moduleOrderConfig?: ModuleOrderConfig[]` 字段

- [x] Task 2: 重构 resumeStore.ts 排序逻辑
  - [x] SubTask 2.1: 移除 `sortedModuleOrder` 计算属性
  - [x] SubTask 2.2: 创建 `FIXED_MODULES` 常量数组，包含 `basicInfo` 和 `jobIntention`
  - [x] SubTask 2.3: 创建 `isFixedModule` 辅助函数，判断模块是否为固定模块
  - [x] SubTask 2.4: 创建 `initializeModuleOrder` 函数，根据后端配置或默认值初始化排序
  - [x] SubTask 2.5: 完善 `swapModuleOrder` 函数，增加固定模块保护逻辑

- [x] Task 3: 修改 getResumeDetail 函数
  - [x] SubTask 3.1: 在获取数据后调用 `initializeModuleOrder` 函数初始化模块排序

- [x] Task 4: 更新组件使用排序后的模块列表
  - [x] SubTask 4.1: 修改 `ModuleTabs.vue`，确保使用已排序的 `moduleOrder`
  - [x] SubTask 4.2: 修改 `default-template.vue`，确保使用已排序的 `moduleOrder`
  - [x] SubTask 4.3: 检查其他模板组件，确保使用已排序的 `moduleOrder`

- [x] Task 5: 更新 mockData 添加 moduleOrderConfig
  - [x] SubTask 5.1: 在 `mockData.ts` 中添加 `moduleOrderConfig` 字段用于测试

- [x] Task 6: 测试验证
  - [x] SubTask 6.1: 验证固定模块（basicInfo、jobIntention）始终在最前面
  - [x] SubTask 6.2: 验证非固定模块可以正常交换位置
  - [x] SubTask 6.3: 验证尝试交换固定模块时操作被拒绝
  - [x] SubTask 6.4: 运行类型检查确保无错误

# Task Dependencies

- [Task 2] 依赖 [Task 1]
- [Task 3] 依赖 [Task 2]
- [Task 4] 依赖 [Task 2]
- [Task 5] 依赖 [Task 1]
- [Task 6] 依赖 [Task 1, Task 2, Task 3, Task 4, Task 5]
