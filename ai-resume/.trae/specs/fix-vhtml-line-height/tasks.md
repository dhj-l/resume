# Tasks

- [x] Task 1: 修改 ResumePreview.vue 添加行高绑定
  - [x] SubTask 1.1: 在 `.resume-preview-wrapper` 上添加 `:style="{ lineHeight: globalLineHeight }"` 绑定
  - [x] SubTask 1.2: 从 store 获取 `globalLineHeight` 计算属性

- [x] Task 2: 移除 Section 组件中的 leading-relaxed 类
  - [x] SubTask 2.1: 修改 `ProjectExperienceSection.ts` 移除 `leading-relaxed`
  - [x] SubTask 2.2: 修改 `InternshipExperienceSection.ts` 移除 `leading-relaxed`
  - [x] SubTask 2.3: 修改 `WorkExperienceSection.ts` 移除 `leading-relaxed`
  - [x] SubTask 2.4: 修改 `CampusExperienceSection.ts` 移除 `leading-relaxed`
  - [x] SubTask 2.5: 修改 `SelfEvaluationSection.ts` 移除 `leading-relaxed`

- [x] Task 3: 验证修复效果
  - [x] SubTask 3.1: 运行项目构建确保无错误
  - [x] SubTask 3.2: 确认所有修改正确应用

# Task Dependencies

- Task 3 依赖 Task 1 和 Task 2 完成
