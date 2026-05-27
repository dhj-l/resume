# Tasks
- [x] Task 1: 新增 ResumeCard 组件
  - [x] 在 `src/views/user/components/ResumeCard.vue` 创建组件骨架（Vue3 + TS + script setup）
  - [x] 以 `UserResumeListItem` 作为 `resume` prop 类型并实现 emits
  - [x] 参考 `TemplateCard` 实现封面展示与 hover 交互风格
  - [x] 提供编辑/删除按钮并支持传入 loading

- [x] Task 2: MyResumes 列表替换为 ResumeCard
  - [x] 将 `MyResumes.vue` 中 `v-for` 的内联卡片替换为 `<ResumeCard />`
  - [x] 将现有 `handleEdit/handleDelete` 作为事件回调接入
  - [x] 将现有 loading 判断转换为传入 ResumeCard 的 `editLoading/deleteLoading`

- [x] Task 3: 验证与回归
  - [x] 本地运行构建或类型检查，确保无 TS/模板错误
  - [x] 手动验证：列表态/空态、封面展示、模板标签、编辑/删除按钮 loading 与行为

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 1, Task 2
